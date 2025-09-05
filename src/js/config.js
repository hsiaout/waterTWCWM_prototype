// 配置常量
export const CONFIG = {
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
	
	// 主題映射配置
	CONTENT_MAP: {
		'PID': { html: './src/page/PID.html', js: '' },
		'list': { html: './src/page/list2.html', js: './src/page/list2.js' },
		'map': { html: './src/page/map.html', js: '' },
		'surround': { html: './src/page/surround.html', js: '' }
	},
	
	// 預設狀態配置
	DEFAULT_STATE: {
		pane1: { width: 50, visible: true },
		pane2: { width: 50, visible: true }
	}
};

// 面板配置
export const PANELS = [
	{
		id: "pane1",
		html: "./src/page/list.html",
		js: "./src/page/list.js",
	},
	{
		id: "pane2",
		html: "./src/page/map.html",
		js: "",
	},
];
