/**
 * ContentManager - 內容載入與主題管理
 * 負責管理頁面內容載入、主題切換和腳本管理
 */
import { CONFIG } from '../config.js';

export class ContentManager {
    constructor() {
        this.loadedScripts = new Set(); // 追蹤已載入的腳本，避免重複載入
        this.initialized = false;
        
        this.log('ContentManager 初始化...');
    }

    /**
     * 調試日誌輸出控制
     * @param {*} message - 要輸出的訊息
     * @param {...*} args - 額外的參數
     */
    log(message, ...args) {
        if (CONFIG.DEBUG_MODE) {
            console.log(message, ...args);
        }
    }

    /**
     * 警告日誌輸出控制
     * @param {*} message - 要輸出的訊息
     * @param {...*} args - 額外的參數
     */
    warn(message, ...args) {
        if (CONFIG.DEBUG_MODE) {
            console.warn(message, ...args);
        }
    }

    // ===== 核心功能函數 =====

    /**
     * 動態載入內容到指定元素
     * @param {Object|string} fileConfig - 檔案配置物件或 HTML 檔案路徑
     * @param {string} targetElementId - 目標元素 ID
     */
    async loadContent(fileConfig, targetElementId) {
        try {
            // 向下相容：字串轉換為物件格式
            if (typeof fileConfig === 'string') {
                fileConfig = { html: fileConfig, js: null };
            }

            const { html: url, js: jsUrl } = fileConfig;
            this.log(`開始載入: ${url} -> ${targetElementId}`);

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
            this.log(`✓ 成功載入 ${url} 到 ${targetElementId}`);

            // 載入對應的 JavaScript 檔案
            if (jsUrl) {
                await this.loadScript(jsUrl, targetElementId);
            }

            // 執行載入內容中的腳本
            this.initializeLoadedContent(targetElementId);

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
    async loadScript(scriptUrl, contextId) {
        try {
            this.log(`載入腳本: ${scriptUrl} (用於 ${contextId})`);

            // 檢查是否已經載入過
            if (this.loadedScripts.has(scriptUrl)) {
                this.log(`腳本 ${scriptUrl} 已存在，跳過重複載入`);
                return;
            }

            // 移除舊版本腳本
            const existingScript = document.querySelector(`script[data-page-script="${scriptUrl}"]`);
            if (existingScript) {
                existingScript.remove();
                this.log(`移除舊腳本: ${scriptUrl}`);
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
            this.loadedScripts.add(scriptUrl);

            this.log(`✓ 成功載入腳本: ${scriptUrl}`);

        } catch (error) {
            console.error(`載入腳本失敗 ${scriptUrl}:`, error);
        }
    }

    /**
     * 初始化載入內容中的腳本
     * @param {string} elementId - 容器元素 ID
     */
    initializeLoadedContent(elementId) {
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

    // ===== 配置管理 =====
    
    /**
     * 獲取主題配置
     * 簡化版本：移除不需要的資料類型映射
     */
    getThemeConfigs() {
        return {
            // Panel 2 主題對應的檔案路徑配置
            panel2Themes: {
                list: {
                    html: './src/page/list2.html',
                    js: './src/page/list2.js'
                },
                map: {
                    html: './src/page/map.html',
                    js: null
                },
                surround: {
                    html: './src/page/surround.html',
                    js: null
                },
                PID: {
                    html: './src/page/PID.html',
                    js: null
                }
            },
            
            // Panel 1 主導航對應的檔案路徑配置
            panel1Themes: {
                // 基礎模板配置 - 所有列表主題都使用同一個 list.html
                templates: {
                    list: {
                        html: './src/page/list.html',
                        js: './src/page/list.js'
                    },
                    map: {
                        html: './src/page/map.html',
                        js: null
                    },
                    PID: {
                        html: './src/page/PID.html',
                        js: null
                    },
                    surround: {
                        html: './src/page/surround.html',
                        js: null
                    }
                }
            }
        };
    }

    // ===== 主題管理 =====

    /**
     * 根據主題名稱獲取主題類型
     * 簡化版本：直接映射主題名稱到類型
     * @param {string} themeName - 主題名稱
     * @returns {string|null} 主題類型
     */
    getThemeTypeByName(themeName) {
        // 簡化的主題映射 - 所有列表相關的都歸為 'list'
        const themeMapping = {
            // 列表類型主題
            '供水': 'list',
            '淨水': 'list',
            '水質': 'list',
            '分區計量': 'list',
            '大表計量': 'list',
            
            // 其他主題類型
            '地圖': 'map',
            '圖譜': 'PID',
            '環景': 'surround',
            '緊急應變圖台': 'map'
        };
        
        return themeMapping[themeName] || null;
    }

    /**
     * 根據主題類型獲取配置
     * 簡化版本：直接從 templates 獲取
     * @param {string} themeType - 主題類型
     * @returns {Object|null} 主題配置
     */
    getThemeConfig(themeType) {
        const configs = this.getThemeConfigs();
        return configs.panel1Themes.templates[themeType] || null;
    }

    // ===== 預載功能 =====

    /**
     * 預載所有主題內容
     * 簡化版本：載入所有主題模板到對應容器
     */
    async preloadAllThemes() {
        this.log('開始預載所有主題內容...');
        
        const configs = this.getThemeConfigs();
        const loadPromises = [];
        
        // 預載 Panel 1 所有主題內容
        Object.entries(configs.panel1Themes.templates).forEach(([themeType, config]) => {
            const contentId = `panel1-${themeType}-content`;
            loadPromises.push(this.loadContent(config, contentId));
        });
        
        // 預載 Panel 2 所有主題內容
        Object.entries(configs.panel2Themes).forEach(([themeType, config]) => {
            const contentId = `panel2-${themeType}-content`;
            loadPromises.push(this.loadContent(config, contentId));
        });
        
        try {
            await Promise.all(loadPromises);
            this.log('✓ 所有主題內容預載完成');
        } catch (error) {
            this.warn('部分內容預載失敗:', error);
        }
    }

    // ===== 初始化 =====

    /**
     * 初始化內容管理器
     */
    async initialize() {
        if (this.initialized) {
            this.log('ContentManager 已經初始化過');
            return;
        }

        this.log('ContentManager 主初始化開始');
        
        // 預載所有內容
        await this.preloadAllThemes();
        
        this.initialized = true;
        this.log('✓ ContentManager 初始化完成');
    }
}
