// 配置常量
export const CONFIG = {
	// 調試模式配置
	DEBUG_MODE: false,  // 是否啟用調試模式 (控制 console.log 顯示)
	
	// 內容管理配置
	ENABLE_CONTENT_MANAGER: true,  // 是否啟用 ContentManager (控制動態內容載入功能)
	
	// 面板尺寸配置
	MIN_WIDTH: 10,
	MAX_WIDTH: 90,
	DEFAULT_WIDTH: 50,
	MAXIMIZE_THRESHOLD: 95,
	
	// 動畫和延遲配置
	TRANSITION_DELAY: 10,
	CONTENT_LOAD_DELAY: 100,
	
	// 存儲配置
	STORAGE_KEY: 'panelLayoutState',
	ENABLE_STORAGE: false,  // 是否啟用 localStorage 儲存面板狀態
	
	// 主題映射配置
	CONTENT_MAP: {
		'PID': { html: './src/page/PID.html', js: '' },
		'list': { html: './src/page/list2.html', js: './src/page/list2.js' },
		'map': { html: './src/page/map.html', js: '' },
		'surround': { html: './src/page/surround.html', js: '' }
	},
	
	// 預設狀態配置
	DEFAULT_STATE: {
		panel1: { width: 60, visible: true },
		panel2: { width: 40, visible: true }
	}
};
