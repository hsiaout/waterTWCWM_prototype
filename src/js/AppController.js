/**
 * AppController - 應用程式主控制器
 * 統一管理所有模組的初始化和協調
 */
import { LayoutManager } from './core/LayoutManager.js';
import { ContentManager } from './core/ContentManager.js';
import { PanelController } from './ui/PanelController.js';

export class AppController {
    constructor() {
        this.layoutManager = null;
        this.contentManager = null;
        this.panelController = null;
        this.initialized = false;
        this.isMobile = false;
        
        console.log('AppController 初始化...');
    }

    /**
     * 偵測是否為手機設備
     */
    detectMobile() {
        // 檢查螢幕寬度
        const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const isMobileWidth = screenWidth <= 768;

        // 檢查 User Agent
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isMobileAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

        // 檢查觸控支援
        const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        // 綜合判斷
        this.isMobile = isMobileWidth || (isMobileAgent && hasTouchSupport);
        
        console.log(`設備偵測: ${this.isMobile ? '手機' : '桌面'} (寬度: ${screenWidth}px)`);
        return this.isMobile;
    }

    /**
     * 應用手機版佈局
     */
    applyMobileLayout() {
        if (!this.isMobile) return;

        console.log('AppController: 應用手機版佈局...');

        // 使用 LayoutManager 的手機版佈局方法
        if (this.layoutManager) {
            this.layoutManager.applyMobileLayout();
        }

        // 更新寬度顯示
        if (this.panelController) {
            this.panelController.updateWidthDisplay();
        }

        console.log('✓ AppController: 手機版佈局已應用');
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
                    console.log(`設備類型變更: ${wasMobile ? '手機' : '桌面'} → ${this.isMobile ? '手機' : '桌面'}`);
                    
                    if (this.isMobile) {
                        this.applyMobileLayout();
                    } else {
                        // 恢復桌面版佈局
                        this.restoreDesktopLayout();
                    }
                }
            }, 250);
        });

        // 監聽螢幕方向變化 (手機專用)
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.detectMobile();
                if (this.isMobile) {
                    this.applyMobileLayout();
                }
            }, 300); // 等待方向變化完成
        });
    }

    /**
     * 恢復桌面版佈局
     */
    restoreDesktopLayout() {
        console.log('AppController: 恢復桌面版佈局...');

        // 使用 LayoutManager 的桌面版佈局方法
        if (this.layoutManager) {
            this.layoutManager.restoreDesktopLayout();
        }

        console.log('✓ AppController: 桌面版佈局已恢復');
    }

    /**
     * 初始化應用程式
     */
    async initialize() {
        if (this.initialized) {
            console.log('AppController 已經初始化過');
            return;
        }

        console.log('AppController 開始初始化所有模組...');

        try {
            // 0. 偵測設備類型
            this.detectMobile();

            // 1. 初始化佈局管理器
            this.layoutManager = new LayoutManager();
            await this.layoutManager.init({ skipContentLoad: true });
            console.log('✓ LayoutManager 初始化完成');

            // 2. 初始化內容管理器
            this.contentManager = new ContentManager();
            await this.contentManager.initialize();
            console.log('✓ ContentManager 初始化完成');

            // 3. 初始化面板控制器
            this.panelController = new PanelController(this.layoutManager, this.contentManager);
            await this.panelController.initialize();
            console.log('✓ PanelController 初始化完成');

            // 4. 設置全域 API
            this.setupGlobalAPI();

            // 5. 如果是手機，應用手機版佈局
            if (this.isMobile) {
                this.applyMobileLayout();
            }

            // 6. 綁定響應式事件
            this.bindResponsiveEvents();

            this.initialized = true;
            console.log(`🎉 AppController 所有模組初始化完成！(${this.isMobile ? '手機' : '桌面'}版)`);

        } catch (error) {
            console.error('❌ AppController 初始化失敗:', error);
            throw error;
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
            applyMobileLayout: () => this.layoutManager?.applyMobileLayout(),
            restoreDesktopLayout: () => this.layoutManager?.restoreDesktopLayout()
        };

        // 設置 ContentManager 相關的全域 API (簡化版本)
        window.LayoutContent = {
            loadContent: (fileConfig, targetElementId) => this.contentManager?.loadContent(fileConfig, targetElementId),
            themeFiles: this.contentManager?.getThemeConfigs().panel2Themes,
            mainNavFiles: this.contentManager?.getThemeConfigs().panel1Themes,
            preloadAllThemes: () => this.contentManager?.preloadAllThemes(),
            getThemeConfig: (themeType) => this.contentManager?.getThemeConfig(themeType),
            getThemeTypeByName: (themeName) => this.contentManager?.getThemeTypeByName(themeName)
        };

        // 設置手機版相關的全域 API
        window.MobileUtils = {
            isMobile: () => this.isMobile,
            detectMobile: () => this.detectMobile(),
            applyMobileLayout: () => this.applyMobileLayout(),
            restoreDesktopLayout: () => this.restoreDesktopLayout()
        };

        console.log('✓ 全域 API 設置完成 (簡化版本 + 手機支援)');
    }

    /**
     * 獲取模組實例（供調試使用）
     */
    getModules() {
        return {
            layoutManager: this.layoutManager,
            contentManager: this.contentManager,
            panelController: this.panelController,
            isMobile: this.isMobile
        };
    }
}

// 建立全域應用程式實例
let appController;

// DOM 載入完成後自動初始化
document.addEventListener('DOMContentLoaded', async () => {
    try {
        appController = new AppController();
        await appController.initialize();
        
        // 暴露到全域供調試使用
        window.appController = appController;
        
    } catch (error) {
        console.error('應用程式初始化失敗:', error);
    }
});

export { appController };
