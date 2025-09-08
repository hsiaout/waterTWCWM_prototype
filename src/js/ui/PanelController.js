/**
 * PanelController - UI 控制與面板管理
 * 負責管理面板顯示、主題切換和用戶互動
 */
import { CONFIG } from '../config.js';

export class PanelController {
    constructor(layoutManager) {
        this.layoutManager = layoutManager;
        this.initialized = false;
        this.isSynced = false;  // 新增：同步狀態
        this.syncCallbacks = [];  // 新增：同步回調函式陣列
        
        this.log('PanelController 初始化...');
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

    // ===== 面板控制 =====

    /**
     * 重置面板佈局為 50:50
     */
    resetPanels() {
        if (this.layoutManager) {
            this.layoutManager.resetLayout();
            this.updateWidthDisplay();
        }
    }

    /**
     * 關閉 Panel 2（輔助面板）
     */
    closePanel2() {
        if (this.layoutManager) {
            this.layoutManager.togglePanel('panel2');
        }
    }

    /**
     * 顯示 Panel 2（輔助面板）
     */
    showPanel2() {
        if (this.layoutManager) {
            this.layoutManager.showPanel2({ useDefaultWidth: false });
        }
    }

    // ===== 主題管理 =====

    /**
     * 統一的主題切換方法（適用於所有面板）
     * @param {string} panelId - 面板 ID ('panel1' 或 'panel2')
     * @param {string} theme - 主題名稱 ('list', 'map', 'PID', 'surround')
     * @param {string} [themeLabel] - 主題標籤（可選，用於 Panel1 的中文顯示名稱）
     */
    switchTheme(panelId, theme, themeLabel = '') {
        // 隱藏指定面板的所有主題容器
        const allThemes = ['list', 'map', 'PID', 'surround'];
        
        allThemes.forEach(themeName => {
            const container = document.getElementById(`${panelId}-${themeName}`);
            if (container) {
                container.style.display = 'none';
            }
        });
        
        // 顯示選中的主題容器
        const targetContainer = document.getElementById(`${panelId}-${theme}`);
        if (targetContainer) {
            targetContainer.style.display = 'flex';
        }
        
        // 更新所有主題選擇器的值
        allThemes.forEach(themeName => {
            const themeSelector = document.getElementById(`${panelId}-theme-selector-${themeName}`);
            if (themeSelector) {
                themeSelector.value = theme;
            }
        });
        
        // 記錄日誌
        const logMessage = themeLabel 
            ? `✓ 切換 ${panelId} 到 ${theme} 主題 (${themeLabel})` 
            : `✓ 切換 ${panelId} 到 ${theme} 主題`;
        this.log(logMessage);
        

	}


	// ===== UI 顯示更新 =====
	/**
     * 更新面板寬度顯示
     */
    
    updateWidthDisplay() {
        if (this.layoutManager) {
            const state = this.layoutManager.getState();
            const panel1WidthSpan = document.getElementById('panel1-width');
            const panel2WidthSpan = document.getElementById('panel2-width');

            if (panel1WidthSpan) panel1WidthSpan.textContent = `${state.panel1.width.toFixed(1)}%`;
            if (panel2WidthSpan) panel2WidthSpan.textContent = `${state.panel2.width.toFixed(1)}%`;

            // 檢查是否為手機版
            const isMobile = window.appController?.getModules()?.isMobile || false;
            
            // 控制輔助面板按鈕顯示
            if (state.panel2.visible || isMobile) {
                document.querySelectorAll(".js-open-panel2-btn").forEach(btn => {
                    btn.style.display = "none";
                });
            } else {
                document.querySelectorAll(".js-open-panel2-btn").forEach(btn => {
                    btn.style.display = "inline-block";
				});
			}
		}
	}

    // ===== 同步功能 =====

    /**
     * 切換同步狀態 (僅狀態和樣式，無實際同步功能)
     * @param {Function} [callback] - 同步狀態變更時的回調函式
     */
    toggleSync(callback) {
        this.isSynced = !this.isSynced;
        
        const syncBtn = document.querySelector('.sync-btn');
        
        if (this.isSynced) {
            // 啟用同步樣式
            syncBtn?.classList.add('is-active');
            this.applyPanelSyncBorder();
            this.log('🔗 同步樣式已啟用');
        } else {
            // 停用同步樣式
            syncBtn?.classList.remove('is-active');
            this.removePanelSyncBorder();
            this.log('🔗 同步樣式已停用');
        }
        
        // 執行回調函式
        if (callback && typeof callback === 'function') {
            callback(this.isSynced);
        }
        
        // 執行所有註冊的回調函式
        this.syncCallbacks.forEach(cb => {
            try {
                cb(this.isSynced);
            } catch (error) {
                console.error('同步回調函式執行錯誤:', error);
            }
        });
        
        return this.isSynced;
    }

    /**
     * 註冊同步狀態變更回調函式
     * @param {Function} callback - 回調函式
     */
    onSyncChange(callback) {
        if (typeof callback === 'function') {
            this.syncCallbacks.push(callback);
        }
    }

    /**
     * 移除同步狀態變更回調函式
     * @param {Function} callback - 要移除的回調函式
     */
    offSyncChange(callback) {
        const index = this.syncCallbacks.indexOf(callback);
        if (index > -1) {
            this.syncCallbacks.splice(index, 1);
        }
    }

    /**
     * 獲取同步狀態
     * @returns {boolean} 當前同步狀態
     */
    getSyncStatus() {
        return this.isSynced;
    }

    /**
     * 應用同步時的面板邊框樣式
     */
    applyPanelSyncBorder() {
        const panel2 = document.getElementById('panel2');
        if (panel2) {
            panel2.classList.add('synced');
        }
    }

    /**
     * 移除同步時的面板邊框樣式
     */
    removePanelSyncBorder() {
        const panel2 = document.getElementById('panel2');
        if (panel2) {
            panel2.classList.remove('synced');
        }
    }

    // ===== 事件綁定 =====

    /**
     * 綁定事件監聽器
     */
    bindEvents() {
        // 綁定同步按鈕點擊事件
        const syncBtn = document.querySelector('.sync-btn');
        if (syncBtn) {
            syncBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleSync();
            });
            this.log('✓ 同步按鈕事件已綁定');
        } else {
            this.log('⚠️ 未找到同步按鈕元素');
        }

        // 監聽狀態變化來更新顯示
        if (this.layoutManager) {
            const originalSetState = this.layoutManager.setState.bind(this.layoutManager);
            this.layoutManager.setState = (newState, options) => {
                const result = originalSetState(newState, options);
                this.updateWidthDisplay();
                return result;
            };
        }
    }

    // ===== 初始化 =====

    /**
     * 初始化控制器
     */
    async initialize() {
        if (this.initialized) {
            this.log('PanelController 已經初始化過');
            return;
        }

        this.log('PanelController 初始化開始');

        // 綁定事件
        this.bindEvents();

        // 初始更新寬度顯示
        this.updateWidthDisplay();

        // 設置默認主題
        this.switchTheme('panel1', 'list');
        if (document.getElementById('panel2').style.display !== 'none') {
            this.switchTheme('panel2', 'map');
        }

        this.initialized = true;
        this.log('✓ PanelController 初始化完成');
    }

    // ===== 公共 API =====

    /**
     * 獲取全域函數，供 HTML 調用
     */
    getGlobalFunctions() {
        return {
            resetPanels: () => this.resetPanels(),
            closePanel2: () => this.closePanel2(),
            showPanel2: () => this.showPanel2(),
            switchTheme: (panelId, theme, themeLabel) => this.switchTheme(panelId, theme, themeLabel),
            // 同步狀態相關的全域函數 (僅狀態切換，無實際同步功能)
            toggleSync: (callback) => this.toggleSync(callback),
            getSyncStatus: () => this.getSyncStatus(),
            onSyncChange: (callback) => this.onSyncChange(callback),
            offSyncChange: (callback) => this.offSyncChange(callback)
        };
    }
}
