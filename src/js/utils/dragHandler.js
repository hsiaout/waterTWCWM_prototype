import { ErrorHandler } from './errorHandler.js';
import { CONFIG } from '../config.js';

// 拖拽處理器
export class DragHandler {
	constructor(layoutManager) {
		this.layoutManager = layoutManager;
		this.isDragging = false;
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

	// 綁定拖拽事件
	bindDragEvents() {
		return ErrorHandler.safeExecute(() => {
			const resizer = ErrorHandler.safeQuerySelector('#resizer');
			if (!resizer) {
				console.error('Resizer element not found, cannot bind drag events');
				return false;
			}
			
			// 滑鼠事件
			resizer.addEventListener('mousedown', this.startDrag.bind(this));
			document.addEventListener('mousemove', this.drag.bind(this));
			document.addEventListener('mouseup', this.endDrag.bind(this));

			// 觸摸事件 (移動端支援)
			resizer.addEventListener('touchstart', this.startDrag.bind(this));
			document.addEventListener('touchmove', this.drag.bind(this));
			document.addEventListener('touchend', this.endDrag.bind(this));
			
			return true;
		}, false, 'Drag events binding');
	}

	// 開始拖拽
	startDrag(e) {
		return ErrorHandler.safeExecute(() => {
			e.preventDefault();
			this.isDragging = true;
			
			const panel1 = ErrorHandler.safeQuerySelector('#panel1');
			const panel2 = ErrorHandler.safeQuerySelector('#panel2');
			const resizer = ErrorHandler.safeQuerySelector('#resizer');
			
			// 移除過渡效果
			if (panel1 && panel2) {
				panel1.classList.add('no-transition');
				panel2.classList.add('no-transition');
			}
			
			if (resizer) {
				resizer.classList.add('dragging');
			}
			
			document.body.style.cursor = 'col-resize';
			document.body.style.userSelect = 'none';
		}, null, 'Start drag operation');
	}

	// 拖拽中
	drag(e) {
		if (!this.isDragging) return;
		
		return ErrorHandler.safeExecute(() => {
			e.preventDefault();
			const panelWrapper = ErrorHandler.safeQuerySelector('#panel-wrapper');
			if (!panelWrapper) return;

			const clientX = e.clientX || (e.touches && e.touches[0].clientX);
			const rect = panelWrapper.getBoundingClientRect();
			const percentage = ((clientX - rect.left) / rect.width) * 100;
			
			// 限制範圍
			const clampedPercentage = Math.max(CONFIG.MIN_WIDTH, Math.min(CONFIG.MAX_WIDTH, percentage));
			
			// 更新狀態
			const newState = {
				panel1: { ...this.layoutManager.stateManager.state.panel1, width: clampedPercentage },
				panel2: { ...this.layoutManager.stateManager.state.panel2, width: 100 - clampedPercentage }
			};
			
			// 拖曳過程中不儲存狀態
			this.layoutManager.setState(newState, { save: false });
		}, null, 'Drag operation');
	}

	// 結束拖拽
	endDrag(e) {
		if (!this.isDragging) return;
		
		return ErrorHandler.safeExecute(() => {
			this.isDragging = false;
			
			const panel1 = ErrorHandler.safeQuerySelector('#panel1');
			const panel2 = ErrorHandler.safeQuerySelector('#panel2');
			const resizer = ErrorHandler.safeQuerySelector('#resizer');
			
			// 恢復過渡效果
			if (panel1 && panel2) {
				panel1.classList.remove('no-transition');
				panel2.classList.remove('no-transition');
			}
			
			if (resizer) {
				resizer.classList.remove('dragging');
			}
			
			document.body.style.cursor = '';
			document.body.style.userSelect = '';
			
			// 結束拖曳時保存最終狀態
			const currentState = this.layoutManager.getState();
			this.layoutManager.setState(currentState, { save: true });
		}, null, 'End drag operation');
	}
}
