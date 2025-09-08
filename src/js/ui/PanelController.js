/**
 * PanelController - UI 控制與面板管理
 * 負責管理面板顯示、主題切換和用戶互動
 */
import { CONFIG } from '../config.js';

export class PanelController {
    constructor(layoutManager) {
        this.layoutManager = layoutManager;
        this.initialized = false;
        
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

    // ===== 事件綁定 =====

    /**
     * 綁定事件監聽器
     */
    bindEvents() {
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
            switchTheme: (panelId, theme, themeLabel) => this.switchTheme(panelId, theme, themeLabel)
        };
    }
}
