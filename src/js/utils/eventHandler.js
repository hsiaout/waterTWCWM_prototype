import { ErrorHandler } from './errorHandler.js';

// 事件處理器
export class EventHandler {
	constructor(layoutManager) {
		this.layoutManager = layoutManager;
	}

	// 綁定所有事件
	bindEvents() {
		this.bindPanelEvents();
		this.bindFilterEvents();
		// this.bindThemeEvents();
		this.bindKeyboardEvents();
		this.bindWindowEvents();
	}

	// 綁定面板控制事件
	bindPanelEvents() {
		document.addEventListener('click', (e) => {
			if (e.target.closest('.toggle-btn')) {
				const target = e.target.closest('.toggle-btn').dataset.target;
				this.layoutManager.togglePanel(target);
			}
			
			if (e.target.closest('.maximize-btn')) {
				const target = e.target.closest('.maximize-btn').dataset.target;
				this.layoutManager.maximizePanel(target);
			}
			
			// 輔助面板按鈕事件
			if (e.target.closest('.auxiliary-btn')) {
				this.layoutManager.showPanel2();
			}
			
			// panel2 隱藏按鈕事件
			if (e.target.closest('.hide-panel2-btn')) {
				this.layoutManager.hidePanel2();
			}
		});
	}

	// 綁定篩選事件
	bindFilterEvents() {
		document.addEventListener('change', (e) => {
			if (e.target.id.includes('filter')) {
				this.applyFilters();
			}
		});

		// 監聽自定義篩選事件
		document.addEventListener('applyFilters', () => {
			this.applyFilters();
		});
	}

	// 綁定主題選擇事件
	bindThemeEvents() {
		document.addEventListener('change', (e) => {
			if (e.target.classList.contains('theme-selector')) {
				const contentType = e.target.value;
				if (contentType) {
					const panelId = e.target.closest('.panel-container').id;
					this.layoutManager.contentLoader.switchContent(panelId, contentType);
				}
			}
		});
	}

	// 綁定鍵盤事件
	bindKeyboardEvents() {
		document.addEventListener('keydown', (e) => {
			if (e.ctrlKey) {
				switch(e.key) {
					case '1':
						e.preventDefault();
						// 切換輔助面板顯示/隱藏
						if (this.layoutManager.stateManager.state.pane2.visible) {
							this.layoutManager.hidePanel2();
						} else {
							this.layoutManager.showPanel2();
						}
						break;
					case '2':
						e.preventDefault();
						this.layoutManager.hidePanel2();
						break;
					case '0':
						e.preventDefault();
						this.layoutManager.showPanel2();
						break;
				}
			}
		});
	}

	// 綁定視窗事件
	bindWindowEvents() {
		window.addEventListener('resize', () => {
			this.layoutManager.applyState();
		});
	}

	// 應用篩選
	applyFilters() {
		// 獲取所有篩選值
		const filters = {
			pane1: {
				station: document.getElementById('station-filter')?.value || '',
				time: document.getElementById('time-filter')?.value || '',
				status: document.getElementById('status-filter')?.value || ''
			},
			pane2: {
				station: document.getElementById('station-filter-2')?.value || '',
				time: document.getElementById('time-filter-2')?.value || '',
				status: document.getElementById('status-filter-2')?.value || ''
			}
		};

		// 觸發自定義事件，讓各個頁面可以監聽並處理篩選
		const filterEvent = new CustomEvent('panelFiltersChanged', {
			detail: filters
		});
		document.dispatchEvent(filterEvent);

		console.log('Applied filters:', filters);
	}
}
