import { ErrorHandler } from './utils/errorHandler.js';
import { CONFIG } from './config.js';

// UI 渲染器
export class UIRenderer {
	// 創建佈局結構
	static createLayout() {
		return ErrorHandler.safeExecute(() => {
			const container = ErrorHandler.safeQuerySelector('#main-layout-container');
			if (!container) {
				throw new Error('Main layout container not found');
			}
			
			container.innerHTML = `
				<div id="panel-wrapper">
					<div id="pane1" class="panel-container" data-panel="pane1">
						<div class="panel-header">
							<div class="panel-title">
								<button class="btn btn-light" type="button" data-bs-toggle="collapse" data-bs-target="#pane1-filter" aria-expanded="false">
									<i class="fas fa-filter me-1"></i>篩選
								</button>
							</div>
							<div class="panel-controls">
								<button class="btn btn-light ms-2 auxiliary-btn" type="button" title="開啟輔助面板" style="display: none;">
									<i class="fas fa-window-restore me-1"></i>輔助面板
								</button>
							</div>
						</div>
						<div id="pane1-filter" class="collapse panel-filter">
							<div class="p-2 border-bottom bg-light">
								<div class="row g-2 align-items-center">
									<label class="col-auto form-label text-sm">站點</label>
									<div class="col-auto">
										<select class="form-select form-select-sm" id="station-filter">
											<option value="">所有站點</option>
											<option value="北區">北區</option>
											<option value="南區">南區</option>
											<option value="東區">東區</option>
											<option value="西區">西區</option>
										</select>
									</div>
									<label class="col-auto form-label text-sm">時間範圍</label>
									<div class="col-auto">
										<select class="form-select form-select-sm" id="time-filter">
											<option value="">所有時間</option>
											<option value="today">今天</option>
											<option value="week">本週</option>
											<option value="month">本月</option>
										</select>
									</div>
									<label class="col-auto form-label text-sm">狀態</label>
									<div class="col-auto">
										<select class="form-select form-select-sm" id="status-filter">
											<option value="">所有狀態</option>
											<option value="normal">正常</option>
											<option value="warning">警告</option>
											<option value="error">錯誤</option>
										</select>
									</div>
								</div>
							</div>
						</div>
						<div class="panel-content" id="pane1-content"></div>
					</div>
					
					<div id="resizer" class="resizer" title="拖拽調整大小">
						<div class="resizer-line"></div>
					</div>
					
					<div id="pane2" class="panel-container" data-panel="pane2">
						<div class="panel-header">
							<div class="panel-title">
								<small class="me-2"><i class="fa-solid fa-star me-1"></i>主題選擇</small>
								<select class="form-select form-select-sm theme-selector" id="theme-selector" style="width: auto;">
									<option value="">主題選擇</option>
									<option value="list">列表</option>
									<option value="map">地圖</option>
									<option value="surround">環景</option>
									<option value="PID">圖譜</option>
								</select>
								<button class="btn btn-light ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#pane2-filter" aria-expanded="false">
									<i class="fas fa-filter me-1"></i>篩選
								</button>
							</div>
							<div class="panel-controls">
								<button class="btn btn-light hide-panel2-btn" type="button" title="隱藏輔助面板">
									<i class="fas fa-chevron-right me-1"></i>隱藏
								</button>
							</div>
						</div>
						<div id="pane2-filter" class="collapse panel-filter">
							<div class="p-2 border-bottom bg-light">
								<div class="row g-2 align-items-center">
									<label class="col-auto form-label text-sm">站點</label>
									<div class="col-auto">
										<select class="form-select form-select-sm" id="station-filter-2">
											<option value="">所有站點</option>
											<option value="北區">北區</option>
											<option value="南區">南區</option>
											<option value="東區">東區</option>
											<option value="西區">西區</option>
										</select>
									</div>
									<label class="col-auto form-label text-sm">時間範圍</label>
									<div class="col-auto">
										<select class="form-select form-select-sm" id="time-filter-2">
											<option value="">所有時間</option>
											<option value="today">今天</option>
											<option value="week">本週</option>
											<option value="month">本月</option>
										</select>
									</div>
									<label class="col-auto form-label text-sm">狀態</label>
									<div class="col-auto">
										<select class="form-select form-select-sm" id="status-filter-2">
											<option value="">所有狀態</option>
											<option value="normal">正常</option>
											<option value="warning">警告</option>
											<option value="error">錯誤</option>
										</select>
									</div>
								</div>
							</div>
						</div>
						<div class="panel-content" id="pane2-content"></div>
					</div>
				</div>
			`;
			
			return true;
		}, false, 'Layout creation');
	}

	// 更新按鈕狀態
	static updateButtons(state) {
		return ErrorHandler.safeExecute(() => {
			// 更新切換按鈕圖示和文字
			const toggle1 = ErrorHandler.safeQuerySelector('[data-target="pane1"].toggle-btn');
			const toggle2 = ErrorHandler.safeQuerySelector('[data-target="pane2"].toggle-btn');
			
			if (toggle1) {
				if (state.pane1.visible) {
					toggle1.innerHTML = '<i class="fas fa-chevron-left me-1"></i>隱藏';
				} else {
					toggle1.innerHTML = '<i class="fas fa-chevron-right me-1"></i>顯示';
				}
			}
			
			if (toggle2) {
				if (state.pane2.visible) {
					toggle2.innerHTML = '<i class="fas fa-chevron-right me-1"></i>隱藏';
				} else {
					toggle2.innerHTML = '<i class="fas fa-chevron-left me-1"></i>顯示';
				}
			}
			
			// 更新最大化按鈕圖示和文字
			const max1 = ErrorHandler.safeQuerySelector('[data-target="pane1"].maximize-btn');
			const max2 = ErrorHandler.safeQuerySelector('[data-target="pane2"].maximize-btn');
			
			if (max1) {
				if (state.pane1.width >= CONFIG.MAXIMIZE_THRESHOLD) {
					max1.innerHTML = '<i class="fas fa-window-restore me-1"></i>輔助面板';
				} else {
					max1.innerHTML = '<i class="fas fa-expand me-1"></i>最大化';
				}
			}
			
			if (max2) {
				if (state.pane2.width >= CONFIG.MAXIMIZE_THRESHOLD) {
					max2.innerHTML = '<i class="fas fa-window-restore me-1"></i>輔助面板';
				} else {
					max2.innerHTML = '<i class="fas fa-expand me-1"></i>最大化';
				}
			}
			
			return true;
		}, false, 'Update buttons operation');
	}

	// 更新輔助面板按鈕
	static updateAuxiliaryButton(state) {
		return ErrorHandler.safeExecute(() => {
			const auxiliaryBtn = ErrorHandler.safeQuerySelector('.auxiliary-btn');
			
			if (auxiliaryBtn) {
				if (state.pane2.visible) {
					auxiliaryBtn.style.display = 'none';
				} else {
					auxiliaryBtn.style.display = 'inline-block';
				}
				return true;
			} else {
				console.warn('Auxiliary button not found');
				return false;
			}
		}, false, 'Update auxiliary button operation');
	}

	// 應用視覺狀態
	static applyVisualState(state) {
		return ErrorHandler.safeExecute(() => {
			const pane1 = ErrorHandler.safeQuerySelector('#pane1');
			const pane2 = ErrorHandler.safeQuerySelector('#pane2');
			const resizer = ErrorHandler.safeQuerySelector('#resizer');

			if (!pane1 || !pane2 || !resizer) {
				console.warn('Required elements not available for state application');
				return false;
			}
			
			// 應用面板寬度和可見性
			if (state.pane1.visible) {
				pane1.style.width = state.pane1.width + '%';
				pane1.classList.remove('panel-hidden');
			} else {
				pane1.classList.add('panel-hidden');
			}
			
			if (state.pane2.visible) {
				pane2.style.width = state.pane2.width + '%';
				pane2.classList.remove('panel-hidden');
			} else {
				pane2.classList.add('panel-hidden');
			}
			
			// 控制分隔線的顯示
			if (!state.pane1.visible || !state.pane2.visible) {
				resizer.classList.add('resizer-hidden');
			} else {
				resizer.classList.remove('resizer-hidden');
			}
			
			return true;
		}, false, 'Apply visual state operation');
	}
}
