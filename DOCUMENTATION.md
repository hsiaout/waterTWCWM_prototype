# 水網監測平台 - 程式碼架構文檔

## 📋 目錄
- [專案概覽](#專案概覽)
- [檔案結構](#檔案結構)
- [核心模組說明](#核心模組說明)
- [主要功能](#主要功能)
- [API 參考](#api-參考)
- [使用指南](#使用指南)
- [故障排除](#故障排除)

---

## 🌐 專案概覽

水網監測平台是一個基於 Web 的即時水質監測系統，採用模組化架構設計，支援多面板佈局、動態內容載入、拖拽調整等功能。

### 🎯 主要特色
- **響應式雙面板佈局** - 支援拖拽調整大小
- **動態內容切換** - 列表、地圖、環景、圖譜等多種視圖
- **狀態持久化** - 自動保存佈局設定到 localStorage
- **模組化架構** - 易於維護和擴展
- **錯誤處理機制** - 完善的錯誤捕獲和恢復
- **鍵盤快捷鍵** - 提升操作效率

### 🛠️ 技術堆疊
- **前端框架**: Bootstrap 5
- **圖標庫**: Font Awesome 6
- **數據表格**: DataTables
- **JavaScript**: ES6+ 模組化
- **樣式**: SCSS/CSS3
- **構建工具**: 原生 ES6 模組

---

## 📁 檔案結構

```
WaterTWCWM_prototype/
├── index.html                    # 主頁面 (LOBBY)
├── page.html                     # 監測平台主頁
├── src/
│   ├── js/                       # JavaScript 模組
│   │   ├── config.js            # 配置常量
│   │   ├── layout.js            # 原始佈局管理器 (備份)
│   │   ├── layout-modular.js    # 模組化入口點
│   │   ├── layoutManager.js     # 主要佈局管理器
│   │   ├── uiRenderer.js        # UI 渲染器
│   │   └── utils/               # 工具模組
│   │       ├── errorHandler.js  # 錯誤處理
│   │       ├── stateManager.js  # 狀態管理
│   │       ├── contentLoader.js # 內容載入
│   │       ├── dragHandler.js   # 拖拽處理
│   │       └── eventHandler.js  # 事件處理
│   ├── page/                     # 頁面內容
│   │   ├── list.html            # 列表頁面
│   │   ├── list.js              # 列表邏輯
│   │   ├── list2.html           # 列表頁面 v2
│   │   ├── list2.js             # 列表邏輯 v2
│   │   ├── map.html             # 地圖頁面
│   │   ├── PID.html             # 圖譜頁面
│   │   └── surround.html        # 環景頁面
│   └── style/                    # 樣式檔案
│       ├── index.scss           # 主頁樣式
│       ├── index.css            # 編譯後的CSS
│       ├── page.scss            # 面板樣式
│       └── page.css             # 編譯後的CSS
└── README_REFACTOR.md           # 重構說明文檔
```

---

## 🧩 核心模組說明

### 1. **config.js** - 配置中心
```javascript
export const CONFIG = {
    MIN_WIDTH: 10,              // 最小面板寬度 (%)
    MAX_WIDTH: 90,              // 最大面板寬度 (%)
    DEFAULT_WIDTH: 50,          // 預設面板寬度 (%)
    MAXIMIZE_THRESHOLD: 95,     // 最大化閾值 (%)
    CONTENT_LOAD_DELAY: 100,    // 內容載入延遲 (ms)
    STORAGE_KEY: 'panelLayoutState', // localStorage 鍵名
    
    // 內容映射配置
    CONTENT_MAP: {
        'list': { html: './src/page/list2.html', js: './src/page/list2.js' },
        'map': { html: './src/page/map.html', js: '' },
        'surround': { html: './src/page/surround.html', js: '' },
        'PID': { html: './src/page/PID.html', js: '' }
    }
};
```

**主要功能:**
- 集中管理所有配置參數
- 定義內容類型與檔案的映射關係
- 設定系統行為參數

### 2. **errorHandler.js** - 錯誤處理工具
```javascript
export class ErrorHandler {
    // 安全的 DOM 查詢
    static safeQuerySelector(selector, context = document)
    
    // 安全的函數執行
    static safeExecute(fn, fallback = null, context = 'Unknown operation')
    
    // 安全的網路請求
    static async safeFetch(url, options = {})
    
    // 錯誤模板生成
    static getErrorTemplate(message)
}
```

**主要功能:**
- 提供安全的 DOM 操作方法
- 統一的錯誤捕獲和處理機制
- 網路請求的錯誤處理包裝
- 標準化的錯誤顯示模板

### 3. **stateManager.js** - 狀態管理器
```javascript
export class StateManager {
    constructor()                    // 初始化狀態
    saveState()                     // 保存到 localStorage
    loadState()                     // 從 localStorage 載入
    validateState(state)            // 驗證狀態結構
    setState(newState)              // 設定新狀態
    getState()                      // 獲取當前狀態
    resetState()                    // 重置為預設狀態
    exportState()                   // 匯出狀態為 JSON
    importState(stateJson)          // 從 JSON 匯入狀態
}
```

**狀態結構:**
```javascript
{
    pane1: { width: 50, visible: true },
    pane2: { width: 50, visible: true }
}
```

### 4. **contentLoader.js** - 內容載入器
```javascript
export class ContentLoader {
    async loadPanelContents()       // 載入初始面板內容
    async switchContent(panelId, contentType) // 切換面板內容
    async loadScript(src)           // 動態載入腳本
    onContentLoaded(panelId, contentType)     // 內容載入完成回調
}
```

**主要功能:**
- 動態載入 HTML 內容
- 智能腳本管理 (避免重複載入)
- 內容切換動畫和過渡效果
- 載入失敗的錯誤處理

### 5. **dragHandler.js** - 拖拽處理器
```javascript
export class DragHandler {
    constructor(layoutManager)      // 綁定佈局管理器
    bindDragEvents()               // 綁定拖拽事件
    startDrag(e)                   // 開始拖拽
    drag(e)                        // 拖拽中
    endDrag(e)                     // 結束拖拽
}
```

**特色功能:**
- 支援滑鼠和觸控拖拽
- 實時寬度限制和約束
- 拖拽時的視覺反饋
- 拖拽結束後的狀態保存

### 6. **eventHandler.js** - 事件處理器
```javascript
export class EventHandler {
    constructor(layoutManager)      // 綁定佈局管理器
    bindEvents()                   // 綁定所有事件
    bindPanelEvents()              // 面板控制事件
    bindFilterEvents()             // 篩選功能事件
    bindThemeEvents()              // 主題切換事件
    bindKeyboardEvents()           // 鍵盤快捷鍵
    bindWindowEvents()             // 視窗事件
    applyFilters()                 // 應用篩選條件
}
```

**鍵盤快捷鍵:**
- `Ctrl + 1`: 切換輔助面板顯示/隱藏
- `Ctrl + 2`: 隱藏輔助面板
- `Ctrl + 0`: 顯示輔助面板

### 7. **uiRenderer.js** - UI 渲染器
```javascript
export class UIRenderer {
    static createLayout()           // 創建佈局結構
    static updateButtons(state)     // 更新按鈕狀態
    static updateAuxiliaryButton(state) // 更新輔助按鈕
    static applyVisualState(state)  // 應用視覺狀態
}
```

**UI 結構:**
```html
<div id="panel-wrapper">
    <div id="pane1" class="panel-container">
        <div class="panel-header">...</div>
        <div class="panel-content">...</div>
    </div>
    <div id="resizer" class="resizer">...</div>
    <div id="pane2" class="panel-container">
        <div class="panel-header">...</div>
        <div class="panel-content">...</div>
    </div>
</div>
```

### 8. **layoutManager.js** - 主要協調器
```javascript
export class LayoutManager {
    constructor()                   // 初始化所有管理器
    async init()                   // 系統初始化
    applyState()                   // 應用當前狀態
    togglePanel(panelId)           // 切換面板顯示
    maximizePanel(panelId)         // 最大化面板
    resetLayout()                  // 重置佈局
    showPanel2()                   // 顯示輔助面板
    hidePanel2()                   // 隱藏輔助面板
    updateAuxiliaryButton()        // 更新輔助按鈕
}
```

---

## ⚡ 主要功能

### 🎛️ 面板管理
- **雙面板佈局**: 主面板 (pane1) 和輔助面板 (pane2)
- **拖拽調整**: 使用中間分隔線調整面板大小
- **面板切換**: 可隱藏/顯示任一面板
- **最大化模式**: 面板可最大化至全螢幕

### 🔄 內容切換
- **動態載入**: 根據選擇載入不同類型的內容
- **主題選擇**: 列表、地圖、環景、圖譜四種視圖
- **腳本管理**: 智能載入對應的 JavaScript 檔案
- **錯誤恢復**: 載入失敗時顯示友好的錯誤訊息

### 🔍 篩選功能
- **多重篩選**: 支援站點、時間範圍、狀態篩選
- **即時更新**: 篩選條件變更時立即生效
- **事件驅動**: 使用自定義事件進行篩選通知

### 💾 狀態持久化
- **自動保存**: 佈局變更時自動保存到 localStorage
- **狀態恢復**: 頁面載入時自動恢復上次的佈局設定
- **狀態驗證**: 載入時驗證狀態的完整性和有效性

---

## 🔌 API 參考

### 全域 API
```javascript
window.LayoutManager = {
    setState: (state) => {...},          // 設定佈局狀態
    getState: () => {...},               // 獲取當前狀態
    resetLayout: () => {...},            // 重置佈局
    togglePanel: (panelId) => {...},     // 切換面板
    maximizePanel: (panelId) => {...},   // 最大化面板
    exportState: () => {...},            // 匯出狀態
    importState: (stateJson) => {...},   // 匯入狀態
    switchContent: (panelId, contentType) => {...}, // 切換內容
    applyFilters: () => {...},           // 應用篩選
    showPanel2: () => {...},             // 顯示輔助面板
    hidePanel2: () => {...}              // 隱藏輔助面板
};
```

### 自定義事件
```javascript
// 內容載入完成
document.addEventListener('contentLoaded', (event) => {
    const { panelId, contentType } = event.detail;
});

// 篩選條件變更
document.addEventListener('panelFiltersChanged', (event) => {
    const filters = event.detail;
});

// 手動觸發篩選
document.dispatchEvent(new CustomEvent('applyFilters'));
```

---

## 📖 使用指南

### 🚀 快速開始

1. **基本載入**
```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="src/style/page.css">
</head>
<body>
    <div id="main-layout-container"></div>
    <script type="module" src="src/js/layout-modular.js"></script>
</body>
</html>
```

2. **自定義配置**
```javascript
// 修改 config.js 中的配置
export const CONFIG = {
    DEFAULT_WIDTH: 60,  // 改變預設寬度
    STORAGE_KEY: 'myApp_layoutState'  // 自定義儲存鍵名
};
```

### 🎨 自定義內容

1. **添加新的內容類型**
```javascript
// 在 config.js 中添加
CONTENT_MAP: {
    'newType': { 
        html: './src/page/newType.html', 
        js: './src/page/newType.js' 
    }
}
```

2. **更新主題選擇器**
```html
<!-- 在 uiRenderer.js 的 HTML 模板中添加 -->
<option value="newType">新類型</option>
```

### 🔧 事件處理

1. **監聽狀態變更**
```javascript
// 自定義狀態變更處理
const originalSetState = window.LayoutManager.setState;
window.LayoutManager.setState = function(newState) {
    console.log('State changing:', newState);
    return originalSetState(newState);
};
```

2. **自定義篩選邏輯**
```javascript
document.addEventListener('panelFiltersChanged', (event) => {
    const { pane1, pane2 } = event.detail;
    // 實現自定義的篩選邏輯
    console.log('Filters:', pane1, pane2);
});
```

---

## 🔧 故障排除

### 常見問題

**Q1: 腳本載入超時錯誤**
```
contentLoader.js:111 Failed to load script: ./src/page/list.js Error: Script load timeout
```
**解決方案:**
- 檢查檔案路徑是否正確
- 確認檔案是否存在
- 檢查網路連接狀態
- 查看瀏覽器 Network 標籤頁的載入狀態

**Q2: 模組載入失敗**
```
layout-modular.js:7 Failed to load modular LayoutManager
```
**解決方案:**
- 確認所有模組檔案存在於正確位置
- 檢查 import/export 語法是否正確
- 使用較新的瀏覽器 (支援 ES6 模組)

**Q3: 狀態無法持久化**
**解決方案:**
- 檢查 localStorage 是否被瀏覽器禁用
- 確認 STORAGE_KEY 配置正確
- 查看瀏覽器的 Storage 標籤頁

**Q4: 拖拽功能異常**
**解決方案:**
- 檢查 CSS 是否正確載入
- 確認 dragHandler.js 正常初始化
- 查看瀏覽器控制台是否有 JavaScript 錯誤

### 調試技巧

1. **啟用詳細日誌**
```javascript
// 在瀏覽器控制台中執行
localStorage.setItem('debug', 'true');
location.reload();
```

2. **檢查狀態**
```javascript
// 查看當前狀態
console.log(window.LayoutManager.getState());

// 匯出狀態用於調試
console.log(window.LayoutManager.exportState());
```

3. **手動重置**
```javascript
// 重置佈局到預設狀態
window.LayoutManager.resetLayout();

// 清除所有儲存的狀態
localStorage.removeItem('panelLayoutState');
```

---

## 📝 開發說明

### 🏗️ 架構原則
- **單一職責**: 每個模組只負責一個特定功能
- **依賴注入**: 通過建構函數傳遞依賴關係
- **事件驅動**: 使用自定義事件進行模組間通訊
- **錯誤隔離**: 各模組的錯誤不影響整體系統運行

### 🔄 擴展指南
1. **添加新功能**: 創建新的工具模組
2. **修改行為**: 修改對應的處理器模組
3. **調整 UI**: 修改 uiRenderer.js 或 CSS 檔案
4. **更改配置**: 修改 config.js 中的設定

### 🧪 測試建議
- 為每個工具類編寫單元測試
- 測試不同瀏覽器的相容性
- 驗證 localStorage 功能
- 測試錯誤恢復機制

---

## 🌐 瀏覽器相容性

### 📊 支援狀況

| 瀏覽器 | 版本要求 | 支援狀態 | 注意事項 |
|--------|----------|----------|----------|
| Chrome | 61+ | ✅ 完全支援 | 推薦使用 |
| Firefox | 60+ | ✅ 完全支援 | 推薦使用 |
| Edge | 79+ | ✅ 完全支援 | 推薦使用 |
| Safari | 11+ | ⚠️ 部分支援 | 需要額外處理 |
| Safari iOS | 11+ | ⚠️ 部分支援 | 觸控事件需調整 |

### 🚨 Safari 相容性問題

**主要問題:**

1. **ES6 模組支援**
   - Safari 11+ 才支援 ES6 模組 (`import`/`export`)
   - 需要檢查 `type="module"` 支援

2. **動態 import() 支援**
   ```javascript
   // 問題代碼 (Safari 11.1+ 才支援)
   const { LayoutManager } = await import('./LayoutManager.js');
   ```

3. **可選鏈操作符 (?.) 支援**
   ```javascript
   // 問題代碼 (Safari 13.1+ 才支援)
   layoutManager?.setState(state)
   ```

4. **Promise.allSettled() 支援**
   ```javascript
   // 問題代碼 (Safari 13+ 才支援)
   await Promise.allSettled(loadPromises);
   ```

5. **Set 和 Map 集合**
   - Safari 7.1+ 才完全支援

### 🛠️ Safari 相容性解決方案

#### 1. **添加 Polyfill 支援**

在 `page.html` 中添加 polyfill：
```html
<!-- 在 <head> 標籤中添加 -->
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6,es2017,es2018,es2019"></script>

<!-- 或使用本地 polyfill -->
<script>
// 可選鏈操作符 polyfill (Safari < 13.1)
if (!('?.')) {
    // 使用 Babel 編譯或避免使用可選鏈
}

// Promise.allSettled polyfill (Safari < 13)
if (!Promise.allSettled) {
    Promise.allSettled = function(promises) {
        return Promise.all(promises.map(p => 
            Promise.resolve(p).then(
                value => ({ status: 'fulfilled', value }),
                reason => ({ status: 'rejected', reason })
            )
        ));
    };
}
</script>
```

#### 2. **創建 Safari 相容版本**

創建 `layout-safari.js` 相容版本：
```javascript
// Safari 相容版本 - 不使用動態 import
document.addEventListener("DOMContentLoaded", function() {
    // 檢查瀏覽器支援
    if (!window.Promise || !window.fetch) {
        console.error('Browser not supported. Please update your browser.');
        return;
    }
    
    // 使用傳統方式載入 (避免動態 import)
    var script = document.createElement('script');
    script.src = './LayoutManager.js';
    script.onload = function() {
        // 初始化邏輯
    };
    document.head.appendChild(script);
});
```

#### 3. **修改可選鏈語法**

將可選鏈改為傳統語法：
```javascript
// 原始代碼 (Safari < 13.1 不支援)
layoutManager?.setState(state)

// Safari 相容版本
layoutManager && layoutManager.setState(state)
```

#### 4. **替換 Promise.allSettled**

```javascript
// 原始代碼
await Promise.allSettled(loadPromises);

// Safari 相容版本
try {
    await Promise.all(loadPromises.map(p => 
        p.catch(error => ({ error }))
    ));
} catch (error) {
    console.warn('Some promises failed:', error);
}
```

#### 5. **觸控事件支援 (iOS Safari)**

```javascript
// 在 dragHandler.js 中添加觸控支援
bindDragEvents() {
    const resizer = document.getElementById('resizer');
    if (resizer) {
        // 滑鼠事件
        resizer.addEventListener('mousedown', this.startDrag.bind(this));
        
        // 觸控事件 (iOS Safari)
        resizer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDrag(e.touches[0]);
        });
        
        document.addEventListener('touchmove', (e) => {
            if (this.isDragging) {
                e.preventDefault();
                this.drag(e.touches[0]);
            }
        });
        
        document.addEventListener('touchend', this.endDrag.bind(this));
    }
}
```

### 🧪 檢測和降級策略

```javascript
// 瀏覽器功能檢測
function checkBrowserSupport() {
    const features = {
        modules: 'noModule' in HTMLScriptElement.prototype,
        dynamicImport: typeof import === 'function',
        optionalChaining: (() => {
            try { eval('({})?.test'); return true; } 
            catch { return false; }
        })(),
        promiseAllSettled: typeof Promise.allSettled === 'function'
    };
    
    console.log('Browser feature support:', features);
    
    // 如果不支援關鍵功能，使用降級版本
    if (!features.modules || !features.dynamicImport) {
        console.warn('Using fallback version for older browsers');
        loadFallbackVersion();
        return false;
    }
    
    return true;
}

function loadFallbackVersion() {
    // 載入傳統版本的腳本
    const script = document.createElement('script');
    script.src = './layout-legacy.js';  // 需要創建傳統版本
    document.head.appendChild(script);
}
```

### 📱 iOS Safari 特殊注意事項

1. **視窗高度問題**
   ```css
   /* 修正 iOS Safari 視窗高度 */
   body {
       min-height: 100vh;
       min-height: -webkit-fill-available;
   }
   
   html {
       height: -webkit-fill-available;
   }
   ```

2. **阻止頁面滾動**
   ```javascript
   // 防止 iOS Safari 的橡皮筋效果
   document.addEventListener('touchmove', function(e) {
       if (e.target.closest('.panel-container')) {
           return; // 允許面板內滾動
       }
       e.preventDefault();
   }, { passive: false });
   ```

### 🔧 快速修復建議

**立即可用的解決方案：**

1. **添加 Polyfill** - 在 HTML 頭部添加上述 polyfill 腳本
2. **避免可選鏈** - 將 `?.` 改為 `&&` 檢查
3. **替換 Promise.allSettled** - 使用上述相容版本
4. **測試 iOS 觸控** - 在實際 iOS 設備上測試拖拽功能

**建議的開發流程：**
1. 優先在現代瀏覽器中開發和測試
2. 定期在 Safari (特別是 iOS) 中測試
3. 遇到問題時使用上述相容性解決方案
4. 考慮為舊版瀏覽器提供降級體驗

---

*本文檔最後更新時間: 2025-09-05*
