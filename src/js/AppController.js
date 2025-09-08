/**
 * AppController - 應用程式主控制器
 * 統一管理所有模組的初始化和協調
 */
import { LayoutManager } from './core/LayoutManager.js';
import { ContentManager } from './core/ContentManager.js';
import { PanelController } from './ui/PanelController.js';
import { CONFIG } from './config.js';

export class AppController {
    constructor() {
        this.layoutManager = null;
        this.contentManager = null;
        this.panelController = null;
        this.initialized = false;
        this.isMobile = false;
        this.debugMode = CONFIG.DEBUG_MODE;
        
        this.log('AppController 初始化...');
    }

    /**
     * 調試日誌輸出控制
     * @param {*} message - 要輸出的訊息
     * @param {...*} args - 額外的參數
     */
    log(message, ...args) {
        if (this.debugMode) {
            console.log(message, ...args);
        }
    }

    /**
     * 設置調試模式
     * @param {boolean} enabled - 是否啟用調試模式
     */
    setDebugMode(enabled) {
        this.debugMode = enabled;
        this.log(`調試模式已${enabled ? '啟用' : '停用'}`);
    }

    /**
     * 獲取當前調試模式狀態
     * @returns {boolean} 調試模式是否啟用
     */
    isDebugMode() {
        return this.debugMode;
    }

    /**
     * 偵測是否為手機設備
     */
	detectMobile() {
        // 檢查螢幕寬度
        const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const isMobileWidth = screenWidth <= 768;

        // 檢查 User Agent
        const userAgent = navigator.userAgent || window.opera || '';
        const isMobileAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

        // 檢查觸控支援
        const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        // 綜合判斷
        this.isMobile = isMobileWidth || (isMobileAgent && hasTouchSupport);
        
        this.log(`設備偵測: ${this.isMobile ? '手機' : '桌面'} (寬度: ${screenWidth}px)`);
        return { isMobile: this.isMobile, screenWidth };
    }

    /**
     * 應用手機版佈局
     */
    setMobileLayout() {
        if (!this.isMobile) return;

        this.log('AppController: 協調手機版佈局...');

        // 委託給 LayoutManager 處理核心佈局邏輯
        if (this.layoutManager) {
			this.layoutManager.setMobileLayout();
        }

        // 更新寬度顯示
        if (this.panelController) {
            this.panelController.updateWidthDisplay();
        }

        this.log('✓ AppController: 手機版佈局協調完成');
    }

    /**
     * 監聽視窗大小變化
     */
    bindResponsiveEvents() {
        let resizeTimer;
        
        window.addEventListener('resize', () => {
            // 防抖處理，避免頻繁觸發
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const wasMobile = this.isMobile;
                this.detectMobile();
                
                // 如果設備類型改變，重新應用佈局
                if (wasMobile !== this.isMobile) {
                    this.log(`設備類型變更: ${wasMobile ? '手機' : '桌面'} → ${this.isMobile ? '手機' : '桌面'}`);
                    
                    if (this.isMobile) {
                        this.setMobileLayout();
                    } else {
                        // 恢復桌面版佈局
                        this.setDesktopLayout();
                    }
                }
            }, 250);
        });

        // 監聽螢幕方向變化 (手機專用)
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.detectMobile();
                if (this.isMobile) {
                    this.setMobileLayout();
                }
            }, 300); // 等待方向變化完成
        });
    }

    /**
     * 恢復桌面版佈局
     */
    setDesktopLayout() {
        this.log('AppController: 協調桌面版佈局...');

        // 委託給 LayoutManager 處理核心佈局邏輯
        if (this.layoutManager) {
            this.layoutManager.setDesktopLayout();
        }

        // 更新寬度顯示
        if (this.panelController) {
            this.panelController.updateWidthDisplay();
        }

        this.log('✓ AppController: 桌面版佈局協調完成');
    }

    /**
     * 初始化應用程式
     */
    async initialize() {
        if (this.initialized) {
            this.log('AppController 已經初始化過');
            return;
        }

        this.log('AppController 開始初始化所有模組...');

        try {
            // 0. 偵測設備類型
            this.detectMobile();

            // 1. 初始化佈局管理器
            this.layoutManager = new LayoutManager();
            await this.layoutManager.init({ skipContentLoad: true });
            this.log('✓ LayoutManager 初始化完成');

            // 2. 初始化內容管理器 (根據配置決定是否啟用)
            if (CONFIG.ENABLE_CONTENT_MANAGER) {
                this.contentManager = new ContentManager();
                await this.contentManager.initialize();
                this.log('✓ ContentManager 初始化完成');
            } else {
                this.log('⚠ ContentManager 已停用 (ENABLE_CONTENT_MANAGER: false)');
            }

            // 3. 初始化面板控制器
            this.panelController = new PanelController(this.layoutManager);
            await this.panelController.initialize();
            this.log('✓ PanelController 初始化完成');

            // 4. 設置全域 API
            this.setupGlobalAPI();

            // 5. 如果是手機，應用手機版佈局
            if (this.isMobile) {
                this.setMobileLayout();
            }

            // 6. 綁定響應式事件
            this.bindResponsiveEvents();

            this.initialized = true;
			this.log(`🎉 AppController 所有模組初始化完成！(${this.isMobile ? '手機' : '桌面'}版)`);
			
			// 🎯 發送初始化完成事件
        	this.dispatchInitializedEvent();

        } catch (error) {
            console.error('❌ AppController 初始化失敗:', error);
            throw error;
        }
	}
	
	/**
	 * 發送初始化完成事件
	 */
	dispatchInitializedEvent() {
		try {
			// 發送自定義事件
			const event = new CustomEvent('appControllerReady', {
				detail: {
					timestamp: Date.now(),
					isMobile: this.isMobile,
					modules: this.getModules()
				}
			});
			
			window.dispatchEvent(event);
			this.log('📡 已發送 appControllerReady 事件');
			
		} catch (error) {
			console.error('❌ 發送初始化事件失敗:', error);
		}
	}

    /**
     * 設置全域 API 供 HTML 調用
     */
    setupGlobalAPI() {
        // 從 PanelController 獲取全域函數
        const globalFunctions = this.panelController.getGlobalFunctions();
        
        // 設置到 window 物件
        Object.assign(window, globalFunctions);

        // 設置 LayoutManager 相關的全域 API
        window.LayoutManager = {
            setState: (state) => this.layoutManager?.setState(state),
            getState: () => this.layoutManager?.getState(),
            resetLayout: () => this.layoutManager?.resetLayout(),
            togglePanel: (panelId) => this.layoutManager?.togglePanel(panelId),
            maximizePanel: (panelId) => this.layoutManager?.maximizePanel(panelId),
            exportState: () => this.layoutManager?.exportState(),
            importState: (stateJson) => this.layoutManager?.importState(stateJson),
            showPanel2: (options) => this.layoutManager?.showPanel2(options),
            hidePanel2: () => this.layoutManager?.hidePanel2(),
            // 統一使用 AppController 的協調版本（包含設備檢查和完整邏輯）
            setMobileLayout: () => this.layoutManager?.setMobileLayout(),
            setDesktopLayout: () => this.layoutManager?.setDesktopLayout()
        };

        // 設置同步狀態相關的全域 API (僅狀態切換，無實際同步功能)
        window.SyncUtils = {
            toggle: (callback) => this.panelController?.toggleSync(callback),
            getStatus: () => this.panelController?.getSyncStatus()
        };

        // 設置 ContentManager 相關的全域 API (根據配置決定是否啟用)
        if (CONFIG.ENABLE_CONTENT_MANAGER && this.contentManager) {
            window.LayoutContent = {
                loadContent: (fileConfig, targetElementId) => this.contentManager.loadContent(fileConfig, targetElementId),
                themeFiles: this.contentManager.getThemeConfigs().panel2Themes,
                mainNavFiles: this.contentManager.getThemeConfigs().panel1Themes,
                preloadAllThemes: () => this.contentManager.preloadAllThemes(),
                getThemeConfig: (themeType) => this.contentManager.getThemeConfig(themeType),
                getThemeTypeByName: (themeName) => this.contentManager.getThemeTypeByName(themeName)
            };
        } else {
            // ContentManager 停用時，提供空的 API 或警告
            window.LayoutContent = {
                loadContent: () => console.warn('ContentManager 已停用，無法載入內容'),
                themeFiles: {},
                mainNavFiles: {},
                preloadAllThemes: () => console.warn('ContentManager 已停用，無法預載主題'),
                getThemeConfig: () => null,
                getThemeTypeByName: () => null
            };
        }

        // 設置手機版相關的全域 API（僅保留偵測功能，佈局功能統一在 LayoutManager 中）
        window.Utils = {
            isMobile: () => this.isMobile,
            detectMobile: () => this.detectMobile()
        };

        // 設置調試模式相關的全域 API
        window.DebugUtils = {
            setDebugMode: (enabled) => this.setDebugMode(enabled),
            isDebugMode: () => this.isDebugMode(),
            toggleDebugMode: () => this.setDebugMode(!this.isDebugMode())
        };

        this.log('✓ 全域 API 設置完成 (簡化版本 + 手機支援 + 調試控制)');
    }

    /**
     * 獲取模組實例（供調試使用）
     */
    getModules() {
        return {
            layoutManager: this.layoutManager,
            contentManager: this.contentManager, // 可能為 null 如果停用
            panelController: this.panelController,
            isMobile: this.isMobile,
            debugMode: this.debugMode,
            contentManagerEnabled: CONFIG.ENABLE_CONTENT_MANAGER
        };
    }
}

// 建立全域應用程式實例
let appControllerInstance = null;

// DOM 載入完成後自動初始化
document.addEventListener('DOMContentLoaded', async () => {
    try {
        appControllerInstance = new AppController();
        await appControllerInstance.initialize();
        
        // 暴露到全域供調試使用
        window.appController = appControllerInstance;
        
    } catch (error) {
        console.error('應用程式初始化失敗:', error);
    }
});

// 導出獲取實例的函數
export const getAppController = () => appControllerInstance;
