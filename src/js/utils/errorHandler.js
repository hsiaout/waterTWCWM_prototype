import { CONFIG } from '../config.js';

// 錯誤處理工具類
export class ErrorHandler {
	/**
	 * 調試日誌輸出控制
	 * @param {*} message - 要輸出的訊息
	 * @param {...*} args - 額外的參數
	 */
	static log(message, ...args) {
		if (CONFIG.DEBUG_MODE) {
			console.log(message, ...args);
		}
	}

	/**
	 * 警告日誌輸出控制
	 * @param {*} message - 要輸出的訊息
	 * @param {...*} args - 額外的參數
	 */
	static warn(message, ...args) {
		if (CONFIG.DEBUG_MODE) {
			console.warn(message, ...args);
		}
	}

	static safeQuerySelector(selector, context = document) {
		try {
			const element = context.querySelector(selector);
			if (!element) {
				this.warn(`Element not found: ${selector}`);
			}
			return element;
		} catch (error) {
			console.error(`Query selector error for "${selector}":`, error);
			return null;
		}
	}

	static safeQuerySelectorAll(selector, context = document) {
		try {
			return context.querySelectorAll(selector);
		} catch (error) {
			console.error(`Query selector all error for "${selector}":`, error);
			return [];
		}
	}

	static safeExecute(fn, fallback = null, context = 'Unknown operation') {
		try {
			return fn();
		} catch (error) {
			console.error(`Error in ${context}:`, error);
			return fallback;
		}
	}

	static async safeFetch(url, options = {}) {
		try {
			const response = await fetch(url, options);
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}
			return response;
		} catch (error) {
			console.error(`Fetch error for ${url}:`, error);
			throw error;
		}
	}

	static getErrorTemplate(message) {
		return `<div class="p-3 text-muted d-flex align-items-center">
			<i class="fas fa-exclamation-triangle me-2 text-warning"></i>
			載入失敗: ${message}
		</div>`;
	}
}
