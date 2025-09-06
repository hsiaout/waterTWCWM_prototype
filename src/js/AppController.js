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
        
        console.log('AppController 初始化...');
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

            this.initialized = true;
            console.log('🎉 AppController 所有模組初始化完成！');

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

        // 設置內容管理相關的全域函數
        window.applyListDataFilter = (themeType, dataType, themeLabel) => {
            if (this.contentManager) {
                this.contentManager.applyListDataFilter(themeType, dataType, themeLabel);
            }
        };

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
            hidePanel2: () => this.layoutManager?.hidePanel2()
        };

        // 設置 ContentManager 相關的全域 API
        window.LayoutContent = {
            loadContent: (fileConfig, targetElementId) => this.contentManager?.loadContent(fileConfig, targetElementId),
            themeFiles: this.contentManager?.getThemeConfigs().panel2Themes,
            mainNavFiles: this.contentManager?.getThemeConfigs().panel1Themes,
            preloadAllThemes: () => this.contentManager?.preloadAllThemes(),
            getThemeConfig: (themeType) => this.contentManager?.getThemeConfig(themeType),
            getDataTypeByLabel: (themeLabel) => this.contentManager?.getDataTypeByLabel(themeLabel),
            getThemeTypeByName: (themeName) => this.contentManager?.getThemeTypeByName(themeName)
        };

        console.log('✓ 全域 API 設置完成');
    }

    /**
     * 獲取模組實例（供調試使用）
     */
    getModules() {
        return {
            layoutManager: this.layoutManager,
            contentManager: this.contentManager,
            panelController: this.panelController
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
