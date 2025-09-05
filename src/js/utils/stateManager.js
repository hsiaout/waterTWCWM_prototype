import { ErrorHandler } from './errorHandler.js';
import { CONFIG } from '../config.js';

// 狀態管理器
export class StateManager {
	constructor() {
		this.state = { ...CONFIG.DEFAULT_STATE };
		this.loadState();
	}

	// 保存當前狀態
	saveState() {
		return ErrorHandler.safeExecute(() => {
			// 如果啟用了 localStorage，則同時保存到 localStorage
			if (CONFIG.ENABLE_STORAGE) {
				const stateToSave = JSON.stringify(this.state);
				localStorage.setItem(CONFIG.STORAGE_KEY, stateToSave);
			}
			
			// 觸發狀態更新事件（如果需要的話）
			this.notifyStateChange();
			
			return true;
		}, false, 'Save state operation');
	}
	
	// 通知狀態更新（可以在這裡添加更多狀態同步邏輯）
	notifyStateChange() {
		// 這裡可以添加其他狀態同步的邏輯
		// 例如：觸發自定義事件、更新其他相關組件等
	}

	// 載入狀態
	loadState() {
		return ErrorHandler.safeExecute(() => {
			// 先設定預設狀態
			this.state = { ...CONFIG.DEFAULT_STATE };
			
			// 如果啟用了 localStorage，嘗試從中載入
			if (CONFIG.ENABLE_STORAGE) {
				const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
				if (saved) {
					try {
						const parsedState = JSON.parse(saved);
						
						// 驗證載入的狀態結構
						if (this.validateState(parsedState)) {
							this.state = parsedState;
							console.log('Layout state loaded from localStorage');
							return true;
						} else {
							console.warn('Invalid state structure, keeping default state');
						}
					} catch (parseError) {
						console.error('Failed to parse saved state:', parseError);
					}
				} else {
					console.log('No saved state found, using default state');
				}
			} else {
				console.log('Storage disabled, using default state');
			}
			
			return true;
		}, false, 'Load state operation');
	}

	// 驗證狀態結構
	validateState(state) {
		return ErrorHandler.safeExecute(() => {
			if (!state || typeof state !== 'object') {
				return false;
			}
			
			const requiredPanes = ['pane1', 'pane2'];
			const requiredProps = ['width', 'visible'];
			
			for (const pane of requiredPanes) {
				if (!state[pane] || typeof state[pane] !== 'object') {
					return false;
				}
				
				for (const prop of requiredProps) {
					if (!(prop in state[pane])) {
						return false;
					}
				}
				
				// 驗證數值範圍
				if (typeof state[pane].width !== 'number' || 
					state[pane].width < 0 || state[pane].width > 100) {
					return false;
				}
				
				if (typeof state[pane].visible !== 'boolean') {
					return false;
				}
			}
			
			return true;
		}, false, 'State validation');
	}

	// 設定狀態
	setState(newState) {
		this.state = { ...this.state, ...newState };
		return this.state;
	}

	// 獲取狀態
	getState() {
		return { ...this.state };
	}

	// 重置狀態
	resetState() {
		this.state = { ...CONFIG.DEFAULT_STATE };
		return this.state;
	}

	// 匯出狀態
	exportState() {
		return JSON.stringify(this.state, null, 2);
	}

	// 匯入狀態
	importState(stateJson) {
		try {
			const state = JSON.parse(stateJson);
			if (this.validateState(state)) {
				this.state = state;
				return true;
			}
			return false;
		} catch (e) {
			console.error('Failed to import state:', e);
			return false;
		}
	}
}
