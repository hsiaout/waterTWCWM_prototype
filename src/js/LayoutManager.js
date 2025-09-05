import { CONFIG } from './config.js';
import { StateManager } from './utils/stateManager.js';
import { ContentLoader } from './utils/contentLoader.js';
import { DragHandler } from './utils/dragHandler.js';
import { EventHandler } from './utils/eventHandler.js';
import { UIRenderer } from './uiRenderer.js';

// 主要佈局管理器
export class LayoutManager {
	constructor() {
		// 初始化所有管理器
		this.stateManager = new StateManager();
		this.contentLoader = new ContentLoader();
		this.dragHandler = new DragHandler(this);
		this.eventHandler = new EventHandler(this);
	}

	// 初始化佈局
	async init(options = { skipContentLoad: false }) {
		// 創建 UI 結構（如果需要）
		UIRenderer.createLayout();
		
		// 如果指定跳過內容載入，則不載入內容
		if (!options.skipContentLoad) {
			await this.contentLoader.loadPanelContents();
		}
		
		// 綁定事件
		this.eventHandler.bindEvents();
		this.dragHandler.bindDragEvents();
		
		// 應用初始狀態
		this.applyState();
		this.updateAuxiliaryButton();
		
		return true;
	}

	// 應用狀態
	applyState() {
		const state = this.stateManager.getState();
		UIRenderer.applyVisualState(state);
		UIRenderer.updateButtons(state);
	}

	// 切換面板顯示/隱藏
	togglePanel(panelId) {
		const currentState = this.stateManager.getState();
		const otherPanelId = panelId === 'panel1' ? 'panel2' : 'panel1';
		
		if (currentState[panelId].visible) {
			// 隱藏面板
			const newState = {
				[panelId]: { ...currentState[panelId], visible: false },
				[otherPanelId]: { ...currentState[otherPanelId], visible: true, width: 100 }
			};
			this.setState(newState);
		} else {
			// 顯示面板
			const newState = {
				[panelId]: { ...currentState[panelId], visible: true, width: CONFIG.DEFAULT_WIDTH },
				[otherPanelId]: { ...currentState[otherPanelId], width: CONFIG.DEFAULT_WIDTH }
			};
			this.setState(newState);
		}
	}

	// 最大化面板
	maximizePanel(panelId) {
		const currentState = this.stateManager.getState();
		const otherPanelId = panelId === 'panel1' ? 'panel2' : 'panel1';
		
		// 如果已經最大化，則恢復
		if (currentState[panelId].width >= CONFIG.MAXIMIZE_THRESHOLD) {
			this.resetLayout();
		} else {
			// 最大化
			const newState = {
				[panelId]: { ...currentState[panelId], visible: true, width: 100 },
				[otherPanelId]: { ...currentState[otherPanelId], visible: false, width: 0 }
			};
			this.setState(newState, { save: true });
		}
	}

	// 重置佈局
	resetLayout() {
		this.stateManager.resetState();
		this.applyState();
		this.stateManager.saveState();
		this.updateAuxiliaryButton();
	}

	// 顯示 panel2（輔助面板）
	showPanel2() {
		const newState = {
			panel1: { width: CONFIG.DEFAULT_WIDTH, visible: true },
			panel2: { width: CONFIG.DEFAULT_WIDTH, visible: true }
		};
		this.setState(newState);
		this.updateAuxiliaryButton();
	}

	// 隱藏 panel2
	hidePanel2() {
		const newState = {
			panel1: { width: 100, visible: true },
			panel2: { width: 0, visible: false }
		};
		this.setState(newState);
		this.updateAuxiliaryButton();
	}

	// 更新輔助面板按鈕
	updateAuxiliaryButton() {
		const state = this.stateManager.getState();
		UIRenderer.updateAuxiliaryButton(state);
	}

	// 公共 API 方法
	setState(newState, options = { save: true }) {
		this.stateManager.setState(newState);
		this.applyState();
		if (options.save) {
			this.stateManager.saveState();
		}
	}

	getState() {
		return this.stateManager.getState();
	}

	exportState() {
		return this.stateManager.exportState();
	}

	importState(stateJson) {
		if (this.stateManager.importState(stateJson)) {
			this.applyState();
			this.stateManager.saveState();
			return true;
		}
		return false;
	}

	switchContent(panelId, contentType) {
		return this.contentLoader.switchContent(panelId, contentType);
	}

	applyFilters() {
		this.eventHandler.applyFilters();
	}
}

// 全域佈局管理器實例
let layoutManager;

// 初始化
document.addEventListener("DOMContentLoaded", async () => {
	layoutManager = new LayoutManager();
	await layoutManager.init();
});

// 匯出公共方法供外部使用
window.LayoutManager = {
	setState: (state) => layoutManager?.setState(state),
	getState: () => layoutManager?.getState(),
	resetLayout: () => layoutManager?.resetLayout(),
	togglePanel: (panelId) => layoutManager?.togglePanel(panelId),
	maximizePanel: (panelId) => layoutManager?.maximizePanel(panelId),
	exportState: () => layoutManager?.exportState(),
	importState: (stateJson) => layoutManager?.importState(stateJson),
	switchContent: (panelId, contentType) => layoutManager?.switchContent(panelId, contentType),
	applyFilters: () => layoutManager?.applyFilters(),
	showPanel2: () => layoutManager?.showPanel2(),
	hidePanel2: () => layoutManager?.hidePanel2()
};
