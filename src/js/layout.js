/**
 * Layout Manager - 處理頁面內容載入和主題切換
 * 負責管理雙面板系統的內容載入、主題切換和腳本管理
 */
(function() {
    'use strict';
    
    console.log('Layout Manager 開始初始化...');
    
    // ===== 私有變數 =====
    const loadedScripts = new Set(); // 追蹤已載入的腳本，避免重複載入

    // ===== 核心功能函數 =====

    /**
     * 動態載入內容到指定元素
     * @param {Object|string} fileConfig - 檔案配置物件或 HTML 檔案路徑
     * @param {string} targetElementId - 目標元素 ID
     */
    async function loadContent(fileConfig, targetElementId) {
        try {
            // 向下相容：字串轉換為物件格式
            if (typeof fileConfig === 'string') {
                fileConfig = { html: fileConfig, js: null };
            }

            const { html: url, js: jsUrl } = fileConfig;
            console.log(`開始載入: ${url} -> ${targetElementId}`);

            // 載入 HTML 內容
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();
            const targetElement = document.getElementById(targetElementId);
            
            if (!targetElement) {
                throw new Error(`目標元素不存在: ${targetElementId}`);
            }

            targetElement.innerHTML = html;
            console.log(`✓ 成功載入 ${url} 到 ${targetElementId}`);

            // 載入對應的 JavaScript 檔案
            if (jsUrl) {
                await loadScript(jsUrl, targetElementId);
            }

            // 執行載入內容中的腳本
            initializeLoadedContent(targetElementId);

        } catch (error) {
            console.error(`載入內容失敗:`, error);
            const targetElement = document.getElementById(targetElementId);
            if (targetElement) {
                targetElement.innerHTML = `
                    <div class="alert alert-danger p-3">
                        <h5>載入失敗</h5>
                        <p>${error.message}</p>
                    </div>
                `;
            }
        }
    }

    /**
     * 動態載入 JavaScript 檔案
     * @param {string} scriptUrl - 腳本檔案路徑
     * @param {string} contextId - 載入上下文 ID
     */
    async function loadScript(scriptUrl, contextId) {
        try {
            console.log(`載入腳本: ${scriptUrl} (用於 ${contextId})`);

            // 檢查是否已經載入過
            if (loadedScripts.has(scriptUrl)) {
                console.log(`腳本 ${scriptUrl} 已存在，跳過重複載入`);
                return;
            }

            // 移除舊版本腳本
            const existingScript = document.querySelector(`script[data-page-script="${scriptUrl}"]`);
            if (existingScript) {
                existingScript.remove();
                console.log(`移除舊腳本: ${scriptUrl}`);
            }

            const response = await fetch(scriptUrl);
            if (!response.ok) {
                throw new Error(`載入腳本失敗: ${response.status}`);
            }

            const scriptContent = await response.text();

            // 創建並執行腳本
            const script = document.createElement('script');
            script.setAttribute('data-page-script', scriptUrl);
            script.setAttribute('data-context', contextId);
            script.textContent = scriptContent;

            document.head.appendChild(script);
            loadedScripts.add(scriptUrl);

            console.log(`✓ 成功載入腳本: ${scriptUrl}`);

        } catch (error) {
            console.error(`載入腳本失敗 ${scriptUrl}:`, error);
        }
    }

    /**
     * 初始化載入內容中的腳本
     * @param {string} elementId - 容器元素 ID
     */
    function initializeLoadedContent(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const scripts = element.querySelectorAll('script');
        scripts.forEach(script => {
            if (script.src) {
                // 外部腳本
                const newScript = document.createElement('script');
                newScript.src = script.src;
                document.head.appendChild(newScript);
            } else if (script.textContent) {
                // 內聯腳本
                try {
                    eval(script.textContent);
                } catch (error) {
                    console.error('執行腳本失敗:', error);
                }
            }
        });
    }

    // ===== 配置物件 =====
    
    /**
     * Panel 2 主題對應的檔案路徑配置
     */
    const themeFiles = {
        list: {
            html: 'src/page/list2.html',
            js: 'src/page/list2.js'
        },
        map: {
            html: 'src/page/map.html',
            js: null
        },
        surround: {
            html: 'src/page/surround.html',
            js: null
        },
        PID: {
            html: 'src/page/PID.html',
            js: null
        }
    };

    /**
     * Panel 1 主導航對應的檔案路徑配置
     */
    const mainNavFiles = {
        // 列表類型主題 - 使用相同的 list.html，只有資料篩選不同
        listThemes: {
            '供水': { dataType: 'water_supply' },
            '淨水': { dataType: 'water_treatment' },
            '水質': { dataType: 'water_quality' },
            '分區計量': { dataType: 'zone_metering' },
            '大表計量': { dataType: 'main_metering' }
        },
        // 其他類型主題 - 使用不同的 HTML 檔案
        otherThemes: {
            '地圖': {
                html: 'src/page/map.html',
                js: null
            },
            '圖譜': {
                html: 'src/page/PID.html',
                js: null
            },
            '環景': {
                html: 'src/page/surround.html',
                js: null
            },
            '緊急應變圖台': {
                html: 'src/page/map.html',
                js: null
            }
        },
        // 基礎模板配置
        templates: {
            list: {
                html: 'src/page/list.html',
                js: 'src/page/list.js'
            }
        }
    };

    // ===== 初始化和事件綁定 =====

    /**
     * 預載所有主題內容
     */
    async function preloadAllThemes() {
        console.log('開始預載所有主題內容...');
        
        const loadPromises = [];
        
        // 預載 Panel 1 - List 主題內容（只載入一次）
        const listContentId = 'panel1-list-content';
        loadPromises.push(loadContent(mainNavFiles.templates.list, listContentId));
        
        // 預載 Panel 1 - 其他主題內容
        Object.entries(mainNavFiles.otherThemes).forEach(([themeName, config]) => {
            const themeType = getThemeTypeByName(themeName);
            if (themeType && themeType !== 'list') {
                const contentId = `panel1-${themeType}-content`;
                loadPromises.push(loadContent(config, contentId));
            }
        });
        
        // 預載 Panel 2 所有主題內容
        Object.entries(themeFiles).forEach(([theme, config]) => {
            const contentId = `panel2-${theme}-content`;
            loadPromises.push(loadContent(config, contentId));
        });
        
        try {
            await Promise.all(loadPromises);
            console.log('✓ 所有主題內容預載完成');
        } catch (error) {
            console.warn('部分內容預載失敗:', error);
        }
    }

    /**
     * 根據主題名稱獲取主題類型
     * @param {string} themeName - 主題名稱
     * @returns {string|null} 主題類型
     */
    function getThemeTypeByName(themeName) {
        // 列表類型主題都對應到 'list'
        if (mainNavFiles.listThemes[themeName]) {
            return 'list';
        }
        
        // 其他主題的對應關係
        const themeMapping = {
            '地圖': 'map',
            '圖譜': 'PID',
            '環景': 'surround',
            '緊急應變圖台': 'map'
        };
        
        return themeMapping[themeName] || null;
    }

    /**
     * 根據主題類型獲取配置
     * @param {string} themeType - 主題類型
     * @returns {Object|null} 主題配置
     */
    function getThemeConfig(themeType) {
        // 列表類型使用統一的 list 模板
        if (themeType === 'list') {
            return mainNavFiles.templates.list;
        }
        
        // 其他主題類型
        const themeMapping = {
            'map': mainNavFiles.otherThemes['地圖'],
            'PID': mainNavFiles.otherThemes['圖譜'],
            'surround': mainNavFiles.otherThemes['環景']
        };
        
        return themeMapping[themeType] || null;
    }

    /**
     * 根據主題標籤獲取資料類型
     * @param {string} themeLabel - 主題標籤
     * @returns {string|null} 資料類型
     */
    function getDataTypeByLabel(themeLabel) {
        return mainNavFiles.listThemes[themeLabel]?.dataType || null;
    }

    /**
     * 主初始化函數
     */
    async function initialize() {
        console.log('Layout Manager 主初始化開始');
        
        // 預載所有內容
        await preloadAllThemes();
        
        console.log('✓ Layout Manager 初始化完成');
    }

    // ===== 全域 API 和函數 =====

    /**
     * Panel 1 主題切換函數（供主導航使用）
     * @param {string} themeType - 主題類型 (list, map, PID, surround)
     * @param {string} themeLabel - 主題標籤（用於識別點擊的選項）
     */
    function switchPanel1Theme(themeType, themeLabel) {
        console.log(`主導航主題切換: ${themeType}, ${themeLabel}`);

        // 隱藏所有 Panel 1 容器
        const panel1Containers = document.querySelectorAll('#panel1 .panel-container');
        panel1Containers.forEach(container => {
            container.style.display = 'none';
        });

        // 顯示對應的容器
        const targetContainer = document.getElementById(`panel1-${themeType}`);
        if (targetContainer) {
            targetContainer.style.display = 'flex';
            console.log(`✓ 顯示容器: panel1-${themeType} (${themeLabel})`);
            
            // 如果是列表類型，設定資料篩選
            if (themeType === 'list') {
                const dataType = getDataTypeByLabel(themeLabel);
                if (dataType) {
                    applyListDataFilter(themeType, dataType, themeLabel);
                }
            }
        } else {
            console.error(`找不到容器: panel1-${themeType}`);
        }
    }

    /**
     * 應用列表資料篩選
     * @param {string} themeType - 主題類型
     * @param {string} dataType - 資料類型
     * @param {string} themeLabel - 主題標籤
     */
    function applyListDataFilter(themeType, dataType, themeLabel) {
        console.log(`✓ 應用資料篩選: ${dataType} (${themeLabel})`);
        
        // 觸發自定義事件，通知 list.js 更新資料
        const filterEvent = new CustomEvent('listDataFilterChange', {
            detail: {
                dataType: dataType,
                themeLabel: themeLabel,
                containerId: `panel1-${themeType}-content`
            }
        });
        
        document.dispatchEvent(filterEvent);
        
        // 也可以直接調用全域函數（如果 list.js 有提供）
        if (window.updateListData && typeof window.updateListData === 'function') {
            window.updateListData(dataType, themeLabel);
        }
    }



    /**
     * 公開的 API 介面
     */
    const LayoutContent = {
        // 核心函數
        loadContent,
        
        // 配置物件
        themeFiles,
        mainNavFiles,

        // 預載功能
        preloadAllThemes,
        getThemeConfig,
        getDataTypeByLabel,
        getThemeTypeByName
    };

    // ===== 模組初始化 =====
    
    // DOM 載入完成後初始化
    document.addEventListener('DOMContentLoaded', initialize);
    
    // 暴露全域 API
    window.LayoutContent = LayoutContent;
    window.switchPanel1Theme = switchPanel1Theme;
    window.applyListDataFilter = applyListDataFilter;

})();
