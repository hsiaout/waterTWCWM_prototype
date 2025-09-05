import { ErrorHandler } from './errorHandler.js';
import { CONFIG, PANELS } from '../config.js';

// 內容載入器
export class ContentLoader {
	constructor() {
		this.loadedScripts = new Set();
	}

	// 載入面板內容
	async loadPanelContents() {
		return ErrorHandler.safeExecute(async () => {
			const loadPromises = PANELS.map(async (panel) => {
				const contentDiv = ErrorHandler.safeQuerySelector(`#${panel.id}-content`);
				if (!contentDiv) {
					console.warn(`Content container not found for panel: ${panel.id}`);
					return;
				}
				
				// 載入 HTML
				if (panel.html) {
					try {
						const response = await ErrorHandler.safeFetch(panel.html);
						const html = await response.text();
						contentDiv.innerHTML = html;
						
						// 載入對應的 JavaScript
						if (panel.js && panel.js.trim() !== "") {
							await this.loadScript(panel.js);
							console.log(`Successfully loaded: ${panel.html} and ${panel.js}`);
						} else {
							console.log(`Successfully loaded: ${panel.html}`);
						}
					} catch (error) {
						console.error(`Failed to load panel content for ${panel.id}:`, error);
						contentDiv.innerHTML = ErrorHandler.getErrorTemplate(error.message);
					}
				}
			});
			
			await Promise.allSettled(loadPromises);
			return true;
		}, false, 'Load panel contents operation');
	}

	// 切換面板內容
	async switchContent(panelId, contentType) {
		return ErrorHandler.safeExecute(async () => {
			const content = CONFIG.CONTENT_MAP[contentType];
			if (!content) {
				console.warn(`Unknown content type: ${contentType}`);
				return false;
			}

			const contentDiv = ErrorHandler.safeQuerySelector(`#${panelId}-content`);
			if (!contentDiv) {
				console.error(`Content container not found for panel: ${panelId}`);
				return false;
			}
			
			try {
				// 載入 HTML
				const response = await ErrorHandler.safeFetch(content.html);
				const html = await response.text();
				contentDiv.innerHTML = html;
				
				// 載入對應的 JavaScript
				if (content.js && content.js.trim() !== "") {
					await this.loadScript(content.js);
					console.log(`Successfully switched to: ${contentType}`);
					// 觸發內容載入完成事件
					this.onContentLoaded(panelId, contentType);
				} else {
					console.log(`Successfully switched to: ${contentType}`);
					this.onContentLoaded(panelId, contentType);
				}
				
				return true;
			} catch (error) {
				console.error(`Failed to switch content to ${contentType}:`, error);
				contentDiv.innerHTML = ErrorHandler.getErrorTemplate(`無法載入 ${contentType} 內容`);
				return false;
			}
		}, false, `Switch content to ${contentType}`);
	}

	// 動態載入腳本
	async loadScript(src) {
		// 如果已經載入過，直接返回
		if (this.loadedScripts.has(src)) {
			console.log(`Script already loaded, skipping: ${src}`);
			return Promise.resolve();
		}

		console.log(`Attempting to load script: ${src}`);

		return new Promise((resolve, reject) => {
			ErrorHandler.safeExecute(() => {
				// 檢查是否已經載入
				if (ErrorHandler.safeQuerySelector(`script[src="${src}"]`)) {
					console.log(`Script already exists in DOM: ${src}`);
					this.loadedScripts.add(src);
					resolve();
					return;
				}
				
				const script = document.createElement('script');
				script.src = src;
				
				let isResolved = false;
				
				script.onload = () => {
					if (!isResolved) {
						isResolved = true;
						console.log(`✅ Script loaded successfully: ${src}`);
						this.loadedScripts.add(src);
						resolve();
					}
				};
				
				script.onerror = (error) => {
					if (!isResolved) {
						isResolved = true;
						console.error(`❌ Failed to load script: ${src}`, error);
						console.error(`Script element:`, script);
						console.error(`Current document base URL:`, document.baseURI);
						reject(new Error(`Script load failed: ${src}`));
					}
				};
				
				// 添加超時處理 - 修正邏輯
				const timeoutId = setTimeout(() => {
					if (!isResolved) {
						isResolved = true;
						console.error(`⏰ Script load timeout: ${src}`);
						console.error(`Script element:`, script);
						console.error(`Script ready state:`, script.readyState);
						reject(new Error(`Script load timeout: ${src}`));
					}
				}, 10000); // 10秒超時
				
				// 清理超時定時器
				const originalOnload = script.onload;
				const originalOnerror = script.onerror;
				
				script.onload = function(e) {
					clearTimeout(timeoutId);
					originalOnload.call(this, e);
				};
				
				script.onerror = function(e) {
					clearTimeout(timeoutId);
					originalOnerror.call(this, e);
				};
				
				console.log(`Adding script to head: ${src}`);
				document.head.appendChild(script);
			}, null, `Load script: ${src}`);
		});
	}

	// 內容載入完成回調
	onContentLoaded(panelId, contentType) {
		return ErrorHandler.safeExecute(() => {
			// 可以在這裡添加特定內容的初始化邏輯
			if (contentType === 'list') {
				// 如果載入的是列表，可以應用當前的篩選設定
				setTimeout(() => {
					const event = new CustomEvent('applyFilters');
					document.dispatchEvent(event);
				}, CONFIG.CONTENT_LOAD_DELAY);
			}
			
			// 觸發自定義事件
			const event = new CustomEvent('contentLoaded', {
				detail: { panelId, contentType }
			});
			document.dispatchEvent(event);
			
			return true;
		}, false, 'Content loaded callback');
	}
}
