import { CONFIG } from '../config.js';
import { StateManager } from '../utils/stateManager.js';
import { DragHandler } from '../utils/dragHandler.js';

// 主要佈局管理器
export class LayoutManager {
	constructor() {
		// 初始化所有管理器
		this.stateManager = new StateManager();
		this.dragHandler = new DragHandler(this);
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

	// 初始化佈局
	async init(options = { skipContentLoad: false }) {
		// page.html 已有完整結構，檢查是否存在
		const existingWrapper = document.querySelector('#panel-wrapper');
		if (!existingWrapper) {
			console.error('未找到 #panel-wrapper，請確保使用 page.html');
			return false;
		}
		
		// 綁定事件
		this.dragHandler.bindDragEvents();
		
		// 應用初始狀態
		this.applyState();
		
		return true;
	}

	// 應用狀態
	applyState() {
		const state = this.stateManager.getState();
		this.applyVisualState(state);
	}

	// 應用視覺狀態（內嵌核心功能）
	applyVisualState(state) {
		const panel1 = document.querySelector('#panel1');
		const panel2 = document.querySelector('#panel2');
		const resizer = document.querySelector('#panel-resizer');

		if (!panel1 || !panel2 || !resizer) {
			this.warn('Required elements not available for state application');
			return false;
		}
		
		// 應用面板寬度和可見性
		if (state.panel1.visible) {
			panel1.style.width = state.panel1.width + '%';
			panel1.classList.remove('panel-hidden');
		} else {
			panel1.classList.add('panel-hidden');
		}
		
		if (state.panel2.visible) {
			panel2.style.width = state.panel2.width + '%';
			panel2.classList.remove('panel-hidden');
		} else {
			panel2.classList.add('panel-hidden');
		}
		
		// 控制分隔線的顯示
		if (!state.panel1.visible || !state.panel2.visible) {
			resizer.parentElement.classList.add('resizer-hidden');
		} else {
			resizer.parentElement.classList.remove('resizer-hidden');
		}
		
		return true;
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
	}

	// 顯示 panel2（輔助面板）
	showPanel2(options) {
		const currentState = this.stateManager.getState();
		let panel2Width;
		
		// 確保 options 存在，並檢查 useDefaultWidth 的值
		const useDefaultWidth = options && options.useDefaultWidth === true;
		this.log('showPanel2 called with options:', options);
		if (useDefaultWidth) {
			panel2Width = CONFIG.DEFAULT_WIDTH;
		} else {
			// 使用儲存的寬度，如果沒有則使用預設值
			panel2Width = currentState.panel2.width || CONFIG.DEFAULT_WIDTH;
		}
		
		const panel1Width = 100 - panel2Width;
		
		const newState = {
			panel1: { ...currentState.panel1, width: panel1Width, visible: true },
			panel2: { ...currentState.panel2, width: panel2Width, visible: true }
		};
		this.setState(newState);
	}

	// 隱藏 panel2
	hidePanel2() {
		const currentState = this.stateManager.getState();
		const newState = {
			panel1: { ...currentState.panel1, width: 100, visible: true },
			panel2: { ...currentState.panel2, width: currentState.panel2.width, visible: false }
		};
		this.setState(newState);
	}

	// 應用手機版佈局
	setMobileLayout() {
		this.log('LayoutManager: 應用手機版佈局...');
		
		// 1. 設置佈局狀態 - Panel2 隱藏，Panel1 全寬
		const currentState = this.stateManager.getState();
		const mobileState = {
			panel1: { ...currentState.panel1, width: 100, visible: true },
			panel2: { ...currentState.panel2, visible: false }
		};
		
		// 不保存到 localStorage，避免影響桌面版
		this.setState(mobileState, { save: false });
		
		// 2. 隱藏所有輔助面板按鈕
		const auxiliaryButtons = document.querySelectorAll('.js-open-panel2-btn');
		auxiliaryButtons.forEach(btn => {
			btn.style.display = 'none';
		});
		
		this.log('✓ LayoutManager: 手機版佈局已應用');
	}

	// 恢復桌面版佈局
	setDesktopLayout() {
		this.log('LayoutManager: 恢復桌面版佈局...');
		
		// 1. 顯示輔助面板按鈕
		const auxiliaryButtons = document.querySelectorAll('.js-open-panel2-btn');
		auxiliaryButtons.forEach(btn => {
			btn.style.display = 'inline-block';
		});
		
		// 3. 恢復之前保存的狀態
		this.applyState();
		
		this.log('✓ LayoutManager: 桌面版佈局已恢復');
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
}

// LayoutManager 現在由 AppController 統一管理，不再自動初始化
