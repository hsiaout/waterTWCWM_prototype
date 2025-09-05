// 測試新的模組化佈局管理器
// 使用這個檔案來測試新的模組化結構

document.addEventListener("DOMContentLoaded", async () => {
	try {
		// 動態載入模組化版本
		const { LayoutManager } = await import('./LayoutManager.js');
		
		// 創建佈局管理器實例
		const layoutManager = new LayoutManager();
		await layoutManager.init();
		
		// 匯出到全域
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
		
		console.log('✅ Modular LayoutManager loaded and initialized successfully!');
		
	} catch (error) {
		console.error('❌ Failed to load modular LayoutManager:', error);
		console.log('Please check that all module files exist and are properly structured.');
	}
});
