// 模擬數據 - 重新結構化為每個傳訊點一行
const sampleData2 = [
    // 水庫監測站01
    { id: '1-1', 監視點: '水庫監測站01', 傳訊點: '今日累積雨量', 瞬間值: 45.5, 單位: 'mm', 傳訊時間: '2025-09-04 14:30:25' },
    { id: '1-2', 監視點: '水庫監測站01', 傳訊點: '濁度', 瞬間值: 12.3, 單位: 'NTU', 傳訊時間: '2025-09-04 14:30:20' },
    { id: '1-3', 監視點: '水庫監測站01', 傳訊點: '流量', 瞬間值: 150.2, 單位: 'm³/s', 傳訊時間: '2025-09-04 14:30:15' },
    { id: '1-4', 監視點: '水庫監測站01', 傳訊點: '導電度', 瞬間值: 320.5, 單位: 'μS/cm', 傳訊時間: '2025-09-04 14:29:58' },
    { id: '1-5', 監視點: '水庫監測站01', 傳訊點: '水位', 瞬間值: 148.5, 單位: 'm', 傳訊時間: '2025-09-04 14:30:10' },
    { id: '1-6', 監視點: '水庫監測站01', 傳訊點: '蓄水率', 瞬間值: 75.2, 單位: '%', 傳訊時間: '2025-09-04 14:30:05' },
    { id: '1-7', 監視點: '水庫監測站01', 傳訊點: '放流量CMS', 瞬間值: 180.5, 單位: 'm³/s', 傳訊時間: '2025-09-04 14:29:45' },

    // 河川監測站02
    { id: '2-1', 監視點: '河川監測站02', 傳訊點: '今日累積雨量', 瞬間值: 23.8, 單位: 'mm', 傳訊時間: '2025-09-04 14:28:15' },
    { id: '2-2', 監視點: '河川監測站02', 傳訊點: '流量', 瞬間值: 98.6, 單位: 'm³/s', 傳訊時間: '2025-09-04 14:28:10' },
    { id: '2-3', 監視點: '河川監測站02', 傳訊點: '酸鹼值', 瞬間值: 7.5, 單位: '', 傳訊時間: '2025-09-04 14:27:55' },
    { id: '2-4', 監視點: '河川監測站02', 傳訊點: 'A孔流量', 瞬間值: 18.4, 單位: 'm³/s', 傳訊時間: '2025-09-04 14:28:05' },
    { id: '2-5', 監視點: '河川監測站02', 傳訊點: 'B孔流量', 瞬間值: 22.9, 單位: 'm³/s', 傳訊時間: '2025-09-04 14:28:00' },
    { id: '2-6', 監視點: '河川監測站02', 傳訊點: '溢洪道CMS', 瞬間值: 15.3, 單位: 'm³/s', 傳訊時間: '2025-09-04 14:27:48' },
    { id: '2-7', 監視點: '河川監測站02', 傳訊點: '河道放水口CMS', 瞬間值: 38.7, 單位: 'm³/s', 傳訊時間: '2025-09-04 14:27:52' },

    // 淨水廠監測站03
    { id: '3-1', 監視點: '淨水廠監測站03', 傳訊點: '濁度', 瞬間值: 15.6, 單位: 'NTU', 傳訊時間: '2025-09-04 14:32:10' },
    { id: '3-2', 監視點: '淨水廠監測站03', 傳訊點: '導電度', 瞬間值: 398.2, 單位: 'μS/cm', 傳訊時間: '2025-09-04 14:32:05' },
    { id: '3-3', 監視點: '淨水廠監測站03', 傳訊點: '酸鹼值', 瞬間值: 6.9, 單位: '', 傳訊時間: '2025-09-04 14:31:58' },
    { id: '3-4', 監視點: '淨水廠監測站03', 傳訊點: '流量', 瞬間值: 205.7, 單位: 'm³/s', 傳訊時間: '2025-09-04 14:32:00' },
    { id: '3-5', 監視點: '淨水廠監測站03', 傳訊點: '發電廠放流量', 瞬間值: 165.2, 單位: 'm³/s', 傳訊時間: '2025-09-04 14:31:45' },
    { id: '3-6', 監視點: '淨水廠監測站03', 傳訊點: '水位', 瞬間值: 185.7, 單位: 'm', 傳訊時間: '2025-09-04 14:31:50' },
    { id: '3-7', 監視點: '淨水廠監測站03', 傳訊點: '蓄水率', 瞬間值: 82.4, 單位: '%', 傳訊時間: '2025-09-04 14:31:55' },
    { id: '3-8', 監視點: '淨水廠監測站03', 傳訊點: '沖刷道CMS', 瞬間值: 8.9, 單位: 'm³/s', 傳訊時間: '2025-09-04 14:31:40' },

    // 供水站監測點04
    { id: '4-1', 監視點: '供水站監測點04', 傳訊點: '今日累積雨量', 瞬間值: 12.4, 單位: 'mm', 傳訊時間: '2025-09-04 14:25:42' },
    { id: '4-2', 監視點: '供水站監測點04', 傳訊點: '濁度', 瞬間值: 5.2, 單位: 'NTU', 傳訊時間: '2025-09-04 14:25:38' },
    { id: '4-3', 監視點: '供水站監測點04', 傳訊點: '流量', 瞬間值: 75.3, 單位: 'm³/s', 傳訊時間: '2025-09-04 14:25:35' },
    { id: '4-4', 監視點: '供水站監測點04', 傳訊點: '導電度', 瞬間值: 245.8, 單位: 'μS/cm', 傳訊時間: '2025-09-04 14:25:30' },
    { id: '4-5', 監視點: '供水站監測點04', 傳訊點: '水位', 瞬間值: 68.2, 單位: 'm', 傳訊時間: '2025-09-04 14:25:25' },
    { id: '4-6', 監視點: '供水站監測點04', 傳訊點: '蓄水率', 瞬間值: 55.3, 單位: '%', 傳訊時間: '2025-09-04 14:25:20' },

    // 環境監測站05
    { id: '5-1', 監視點: '環境監測站05', 傳訊點: '今日累積雨量', 瞬間值: 89.3, 單位: 'mm', 傳訊時間: '2025-09-04 14:35:18' },
    { id: '5-2', 監視點: '環境監測站05', 傳訊點: '濁度', 瞬間值: 18.9, 單位: 'NTU', 傳訊時間: '2025-09-04 14:35:15' },
    { id: '5-3', 監視點: '環境監測站05', 傳訊點: '流量', 瞬間值: 312.4, 單位: 'm³/s', 傳訊時間: '2025-09-04 14:35:10' },
    { id: '5-4', 監視點: '環境監測站05', 傳訊點: '導電度', 瞬間值: 445.7, 單位: 'μS/cm', 傳訊時間: '2025-09-04 14:35:05' },
    { id: '5-5', 監視點: '環境監測站05', 傳訊點: '酸鹼值', 瞬間值: 6.7, 單位: '', 傳訊時間: '2025-09-04 14:35:00' },
    { id: '5-6', 監視點: '環境監測站05', 傳訊點: 'A孔流量', 瞬間值: 48.7, 單位: 'm³/s', 傳訊時間: '2025-09-04 14:34:55' },
    { id: '5-7', 監視點: '環境監測站05', 傳訊點: 'B孔流量', 瞬間值: 55.2, 單位: 'm³/s', 傳訊時間: '2025-09-04 14:34:50' },
    { id: '5-8', 監視點: '環境監測站05', 傳訊點: '放流量CMS', 瞬間值: 285.6, 單位: 'm³/s', 傳訊時間: '2025-09-04 14:34:45' },
    { id: '5-9', 監視點: '環境監測站05', 傳訊點: '溢洪道CMS', 瞬間值: 35.8, 單位: 'm³/s', 傳訊時間: '2025-09-04 14:34:40' },
    { id: '5-10', 監視點: '環境監測站05', 傳訊點: '河道放水口CMS', 瞬間值: 68.9, 單位: 'm³/s', 傳訊時間: '2025-09-04 14:34:35' },
    { id: '5-11', 監視點: '環境監測站05', 傳訊點: '沖刷道CMS', 瞬間值: 12.3, 單位: 'm³/s', 傳訊時間: '2025-09-04 14:34:30' },
    { id: '5-12', 監視點: '環境監測站05', 傳訊點: '發電廠放流量', 瞬間值: 198.7, 單位: 'm³/s', 傳訊時間: '2025-09-04 14:34:25' },
    { id: '5-13', 監視點: '環境監測站05', 傳訊點: '水位', 瞬間值: 225.4, 單位: 'm', 傳訊時間: '2025-09-04 14:34:20' },
    { id: '5-14', 監視點: '環境監測站05', 傳訊點: '蓄水率', 瞬間值: 91.2, 單位: '%', 傳訊時間: '2025-09-04 14:34:15' }
];

// 輔助函數：獲取傳訊狀態
function getTransmissionStatus(timeStr) {
    const date = new Date(timeStr);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes <= 5) {
        return { class: 'text-success', status: '即時', badge: 'bg-success' };
    } else if (diffMinutes <= 15) {
        return { class: 'text-warning', status: '延遲', badge: 'bg-warning' };
    } else {
        return { class: 'text-danger', status: '離線', badge: 'bg-danger' };
    }
}

// 輔助函數：獲取數值顏色
function getValueColor(fieldName, value) {
    const colorMap = {
        '今日累積雨量': 'text-primary',
        '濁度': 'text-info',
        '流量': 'text-success', 
        '導電度': 'text-secondary',
        '酸鹼值': 'text-warning',
        'A孔流量': 'text-info',
        'B孔流量': 'text-info',
        '放流量CMS': 'text-primary',
        '溢洪道CMS': 'text-danger',
        '河道放水口CMS': 'text-primary',
        '沖刷道CMS': 'text-secondary',
        '發電廠放流量': 'text-success',
        '水位': 'text-info',
        '蓄水率': 'text-warning'
    };
    return colorMap[fieldName] || 'text-dark';
}

// 初始化 DataTable
$(document).ready(function() {
    const table = $('#datatable2').DataTable({
        data: sampleData2,
        columns: [
            { 
                title: "監視點", 
                data: "監視點",
                width: "150px",
                className: "text-start"
            },
            {
                title: "傳訊點",
                data: "傳訊點",
                width: "180px",
                className: "text-start",
                render: function(data, type, row) {
                    return `<span class="fw-bold">${data}</span>`;
                }
            },
            {
                title: "瞬間值",
                data: null,
                className: "text-end",
                render: function(data, type, row) {
                    return `
                        <div class="instant-value">
                            <span class="fs-5 flex-grow-1 text-end">${row.瞬間值}</span>
                            <small class="text-start ps-3" style="width: 50px;">${row.單位}</small>
                        </div>
                    `;
                }
            },
            {
                title: "傳訊時間",
                data: "傳訊時間",
                width: "180px",
                className: "text-center",
                render: function(data, type, row) {
                    const date = new Date(data);
                    return `<small class="text-muted">${date.toLocaleDateString()} ${date.toLocaleTimeString()}</small>`;
                }
            },
            {
                title: "操作",
                data: null,
                width: "120px",
                className: "text-center",
                orderable: false,
                render: function(data, type, row) {
                    return `
                        <button class="btn btn-primary view-chart-btn" 
                                data-id="${row.id}" 
                                data-station="${row.監視點}"
                                data-point="${row.傳訊點}">
                            <i class="fas fa-chart-line me-1"></i>
                            查看圖表
                        </button>
                    `;
                }
            }
		],
		scrollX: true,
		fixedColumns: {
			left: 1,
			right: 1
		},
        order: [[3, 'desc']], // 按傳訊時間降序排列
        pageLength: 15,
        lengthMenu: [10, 15, 25, 50, 100],
        responsive: true,
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/zh-HANT.json'
        },
        // dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>' +
        //      '<"row"<"col-sm-12"tr>>' +
        //      '<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
        drawCallback: function(settings) {
            // 重新綁定圖表按鈕事件
            bindChartButtons();
        },
        // 啟用行分組功能
        rowGroup: {
            dataSrc: '監視點',
            startRender: function (rows, group) {
                return `
                    <tr class="group-header">
                        <td colspan="5" class="text-start fw-bold bg-light p-3">
                            <i class="fas fa-map-marker-alt me-2 text-primary"></i>
                            ${group}
                            <span class="badge bg-secondary ms-2">${rows.count()} 個傳訊點</span>
                        </td>
                    </tr>
                `;
            }
        }
    });

    // 綁定圖表按鈕事件
    function bindChartButtons() {
        $('.view-chart-btn').off('click').on('click', function() {
            const stationId = $(this).data('id');
            const stationName = $(this).data('station');
            const transmissionPoint = $(this).data('point');
            
            // 顯示特定傳訊點的圖表
            showChartModal(stationId, stationName, transmissionPoint);
        });
    }

    // 顯示圖表模態框
    function showChartModal(stationId, stationName, transmissionPoint) {
        // 創建模態框HTML
        const modalHtml = `
            <div class="modal fade" id="chartModal" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-chart-line me-2"></i>
                                ${stationName} - ${transmissionPoint} 數據圖表
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row mb-3">
                                <div class="col-12">
                                    <div class="btn-group" role="group">
                                        <input type="radio" class="btn-check" name="timeRange" id="hour-chart" autocomplete="off" checked>
                                        <label class="btn btn-outline-primary btn-sm" for="hour-chart">過去1小時</label>
                                        
                                        <input type="radio" class="btn-check" name="timeRange" id="day-chart" autocomplete="off">
                                        <label class="btn btn-outline-primary btn-sm" for="day-chart">過去24小時</label>
                                        
                                        <input type="radio" class="btn-check" name="timeRange" id="week-chart" autocomplete="off">
                                        <label class="btn btn-outline-primary btn-sm" for="week-chart">過去7天</label>
                                        
                                        <input type="radio" class="btn-check" name="timeRange" id="month-chart" autocomplete="off">
                                        <label class="btn btn-outline-primary btn-sm" for="month-chart">過去30天</label>
                                    </div>
                                </div>
                            </div>
                            <div class="chart-container">
                                <div class="text-center p-4">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">載入中...</span>
                                    </div>
                                    <div class="mt-2">正在載入 ${transmissionPoint} 的歷史數據...</div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
                            <button type="button" class="btn btn-primary">匯出圖表</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 移除舊的模態框
        $('#chartModal').remove();
        
        // 添加新的模態框
        $('body').append(modalHtml);
        
        // 顯示模態框
        const modal = new bootstrap.Modal(document.getElementById('chartModal'));
        modal.show();
        
        // 模擬載入圖表數據
        setTimeout(function() {
            $('.chart-container').html(`
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    <strong>${transmissionPoint}</strong> 的歷史數據圖表
                    <br><small>監測站：${stationName} | 數據ID：${stationId}</small>
                </div>
                <div class="text-center text-muted p-4">
                    <i class="fas fa-chart-line fa-3x mb-3"></i>
                    <p>圖表功能開發中，需要整合 Chart.js 或其他圖表庫</p>
                </div>
            `);
        }, 1500);
        
        console.log(`顯示監測站 ${stationName} 的 ${transmissionPoint} 圖表 (ID: ${stationId})`);
    }

    // 初始化完成後綁定事件
    bindChartButtons();
    
    // 自動刷新數據（每30秒）
    setInterval(function() {
        // 這裡可以實現自動刷新邏輯
        console.log('自動刷新數據...');
        // table.ajax.reload(null, false); // 如果使用 AJAX 數據源
    }, 30000);
});

// 刷新數據功能
function refreshData() {
	if ($.fn.DataTable.isDataTable('#data-table')) {
		$('#data-table').DataTable().ajax.reload();
	}
	console.log('數據已刷新');
}