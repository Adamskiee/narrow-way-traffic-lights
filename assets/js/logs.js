/**
 * Traffic Logs Management System
 * Handles fetching, displaying, and filtering traffic light logs
 */

// ================================================================
// GLOBAL STATE
// ================================================================

let currentPage = 1;
let currentFilters = {
    camera: '',
    mode: '',
    date_from: '',
    date_to: ''
};
let currentStats = {};
let statisticsInterval = null;

// ================================================================
// UTILITY FUNCTIONS
// ================================================================

/**
 * Show error message to user
 * @param {string} message - Error message to display
 */
function showError(message) {
    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
        alertContainer.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
    } else {
        console.error('Error:', message);
        alert('Error: ' + message);
    }
}

/**
 * Show success message to user
 * @param {string} message - Success message to display
 */
function showSuccess(message) {
    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
        alertContainer.innerHTML = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="fas fa-check-circle me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
    }
}

/**
 * Show loading spinner
 */
function showLoading() {
    const tbody = document.getElementById("logs-table-body");
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <div class="mt-2">Loading logs...</div>
                </td>
            </tr>
        `;
    }
}

// ================================================================
// STATISTICS FUNCTIONS
// ================================================================

/**
 * Fetch statistics from server
 */
async function fetchStatistics() {
    try {
        const response = await fetch('../admin/get-logs-stats.php');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch statistics');
        }
        
        currentStats = data.stats;
        updateStatisticsDisplay(data.stats);
        
    } catch (error) {
        console.error('Error fetching statistics:', error);
        // Don't show error for statistics as it's not critical
        updateStatisticsDisplay(null);
    }
}

/**
 * Update statistics display
 * @param {Object} stats - Statistics data
 */
function updateStatisticsDisplay(stats) {
    if (!stats) {
        // Show loading or error state
        document.getElementById('total-logs-count').textContent = '-';
        document.getElementById('auto-mode-count').textContent = '-';
        document.getElementById('manual-mode-count').textContent = '-';
        document.getElementById('today-logs-count').textContent = '-';
        return;
    }
    
    // Update statistics cards
    const totalLogsEl = document.getElementById('total-logs-count');
    const autoModeEl = document.getElementById('auto-mode-count');
    const manualModeEl = document.getElementById('manual-mode-count');
    const todayLogsEl = document.getElementById('today-logs-count');
    
    if (totalLogsEl) {
        totalLogsEl.textContent = formatNumber(stats.total_logs || 0);
        totalLogsEl.title = `Total logs: ${stats.total_logs || 0}`;
    }
    
    if (autoModeEl) {
        autoModeEl.textContent = formatNumber(stats.auto_mode_logs || 0);
        autoModeEl.title = `Auto mode logs: ${stats.auto_mode_logs || 0}`;
    }
    
    if (manualModeEl) {
        manualModeEl.textContent = formatNumber(stats.manual_mode_logs || 0);
        manualModeEl.title = `Manual mode logs: ${stats.manual_mode_logs || 0}`;
    }
    
    if (todayLogsEl) {
        todayLogsEl.textContent = formatNumber(stats.today_logs || 0);
        todayLogsEl.title = `Today's logs: ${stats.today_logs || 0}`;
    }
}

/**
 * Format numbers for display
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// ================================================================
// LOGS FETCHING AND DISPLAY
// ================================================================

/**
 * Fetch traffic logs from server
 * @param {number} page - Page number to fetch
 * @param {Object} filters - Filter parameters
 */
async function fetchLogs(page = 1, filters = {}) {
    try {
        showLoading();
        
        // Build query parameters
        const params = new URLSearchParams({
            page: page,
            limit: 20,
            ...filters
        });
        
        const response = await fetch(`../admin/get-logs-traffic.php?${params}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch logs');
        }
        
        displayLogs(data.logs);
        updatePagination(data.pagination);
        updateFiltersDisplay(data.filters);
        
        // Update global state
        currentPage = page;
        currentFilters = filters;
        
    } catch (error) {
        console.error('Error fetching logs:', error);
        showError('Failed to load logs: ' + error.message);
        
        const tbody = document.getElementById("logs-table-body");
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-4 text-danger">
                        <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
                        <div>Failed to load logs</div>
                        <button class="btn btn-sm btn-outline-primary mt-2" onclick="fetchLogs()">
                            <i class="fas fa-redo me-1"></i>Retry
                        </button>
                    </td>
                </tr>
            `;
        }
    }
}

/**
 * Display logs in the table
 * @param {Array} logs - Array of log objects
 */
function displayLogs(logs) {
    const tbody = document.getElementById("logs-table-body");
    
    if (!tbody) {
        console.error('Logs table body not found');
        return;
    }
    
    if (logs.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4 ">
                    <i class="fas fa-inbox fa-2x mb-2"></i>
                    <div>No logs found</div>
                    <small>Try adjusting your filters or check back later</small>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = logs.map(log => `
        <tr class="log-row" data-log-id="${log.id}">
            <td>
                <span class="badge bg-${log.camera_id === 'cam1' ? 'primary' : 'secondary'}">
                    ${log.camera_name}
                </span>
            </td>
            <td>
                <span class="badge bg-${log.light_state.toLowerCase() === 'green' ? 'success' : 'danger'}">
                    <i class="fas fa-circle me-1"></i>${log.light_state}
                </span>
            </td>
            <td>
                <span class="badge bg-${log.mode_type.toLowerCase() === 'auto' ? 'info' : 'warning'}">
                    <i class="fas fa-${log.mode_type.toLowerCase() === 'auto' ? 'robot' : 'hand-pointer'} me-1"></i>
                    ${log.mode_type}
                </span>
            </td>
            <td class="text-center">
                ${log.duration_formatted}
            </td>
            <td class="small">
                ${log.created_at_formatted}
            </td>
            <td>
                <div>
                    <strong>${log.username}</strong>
                    <br>
                    <small class="">${log.user_full_name}</small>
                </div>
            </td>
            <td class="small">
                ${log.user_email}
            </td>
            <td>
                <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-outline-info" onclick="viewLogDetails(${log.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteLog(${log.id})" title="Delete Log">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * Update pagination controls
 * @param {Object} pagination - Pagination information
 */
function updatePagination(pagination) {
    const paginationContainer = document.getElementById('pagination-container');
    
    if (!paginationContainer) return;
    
    const { current_page, total_pages, has_prev, has_next, total_records } = pagination;
    
    // Update records info
    const recordsInfo = document.getElementById('records-info');
    if (recordsInfo) {
        const start = ((current_page - 1) * pagination.per_page) + 1;
        const end = Math.min(current_page * pagination.per_page, total_records);
        recordsInfo.textContent = `Showing ${start}-${end} of ${total_records} logs`;
    }
    
    // Generate pagination buttons
    let paginationHTML = `
        <nav aria-label="Logs pagination">
            <ul class="pagination justify-content-center mb-0">
                <li class="page-item ${!has_prev ? 'disabled' : ''}">
                    <button class="page-link" onclick="changePage(${current_page - 1})" ${!has_prev ? 'disabled' : ''}>
                        <i class="fas fa-chevron-left"></i> Previous
                    </button>
                </li>
    `;
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, current_page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(total_pages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === current_page ? 'active' : ''}">
                <button class="page-link" onclick="changePage(${i})">${i}</button>
            </li>
        `;
    }
    
    paginationHTML += `
                <li class="page-item ${!has_next ? 'disabled' : ''}">
                    <button class="page-link" onclick="changePage(${current_page + 1})" ${!has_next ? 'disabled' : ''}>
                        Next <i class="fas fa-chevron-right"></i>
                    </button>
                </li>
            </ul>
        </nav>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

/**
 * Update filters display
 * @param {Object} filters - Current filter values
 */
function updateFiltersDisplay(filters) {
    // Update filter form values
    const cameraFilter = document.getElementById('camera-filter');
    const modeFilter = document.getElementById('mode-filter');
    const dateFromFilter = document.getElementById('date-from-filter');
    const dateToFilter = document.getElementById('date-to-filter');
    
    if (cameraFilter) cameraFilter.value = filters.camera || '';
    if (modeFilter) modeFilter.value = filters.mode || '';
    if (dateFromFilter) dateFromFilter.value = filters.date_from || '';
    if (dateToFilter) dateToFilter.value = filters.date_to || '';
}

// ================================================================
// EVENT HANDLERS
// ================================================================

/**
 * Change page
 * @param {number} page - Page number to navigate to
 */
function changePage(page) {
    if (page >= 1) {
        fetchLogs(page, currentFilters);
    }
}

/**
 * Apply filters
 */
function applyFilters() {
    const filters = {
        camera: document.getElementById('camera-filter')?.value || '',
        mode: document.getElementById('mode-filter')?.value || '',
        date_from: document.getElementById('date-from-filter')?.value || '',
        date_to: document.getElementById('date-to-filter')?.value || ''
    };
    
    fetchLogs(1, filters); // Reset to page 1 when applying filters
}

/**
 * Clear all filters
 */
function clearFilters() {
    document.getElementById('camera-filter').value = '';
    document.getElementById('mode-filter').value = '';
    document.getElementById('date-from-filter').value = '';
    document.getElementById('date-to-filter').value = '';
    
    fetchLogs(1, {}); // Fetch first page with no filters
}

/**
 * Refresh logs and statistics
 */
function refreshLogs() {
    fetchLogs(currentPage, currentFilters);
    fetchStatistics();
}

/**
 * Export logs to CSV
 */
async function exportLogs() {
    try {
        const params = new URLSearchParams({
            export: 'csv',
            ...currentFilters
        });
        
        const response = await fetch(`../admin/export-logs-traffic.php?${params}`);
        
        if (!response.ok) {
            throw new Error('Export failed');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `traffic_logs_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Show success message
        openInfoModal({
            title: "Export Successful",
            body: `
                <div class="text-center">
                    <i class="fas fa-download text-success fa-3x mb-3"></i>
                    <p class="mb-0">Users have been exported successfully!</p>
                    <small class="">File: users_export_${new Date().toISOString().split('T')[0]}.csv</small>
                </div>
            `,
            footer: `<button type="button" class="btn btn-success" onclick="closeInfoModal()">Close</button>`
        });

        setTimeout(() => {
            closeInfoModal();
        }, 2000);
        
    } catch (error) {
        console.error('Export error:', error);
        showError('Failed to export logs');
    }
}

/**
 * View log details in modal
 * @param {number} logId - Log ID to view
 */
async function viewLogDetails(logId) {
    try {
        // Try to get log from current page data first
        const logRow = document.querySelector(`[data-log-id="${logId}"]`);
        let logData = null;
        
        if (logRow) {
            // Extract data from the row
            const cells = logRow.querySelectorAll('td');
            logData = {
                id: logId,
                camera: cells[0].textContent.trim(),
                light_state: cells[1].textContent.trim(),
                mode_type: cells[2].textContent.trim(),
                duration: cells[3].textContent.trim(),
                timestamp: cells[4].textContent.trim(),
                user: cells[5].textContent.trim(),
                email: cells[6].textContent.trim()
            };
        }
        
        if (!logData) {
            // If not found in current data, fetch from server
            const response = await fetch(`../admin/get-logs-traffic.php?log_id=${logId}`);
            const data = await response.json();
            
            if (data.success && data.logs && data.logs.length > 0) {
                const log = data.logs[0];
                logData = {
                    id: log.id,
                    camera: log.camera_name,
                    light_state: log.light_state,
                    mode_type: log.mode_type,
                    duration: log.duration_formatted,
                    timestamp: log.created_at_formatted,
                    user: log.username + ' (' + log.user_full_name + ')',
                    email: log.user_email
                };
            }
        }
        
        if (logData) {
            showLogDetailsModal(logData);
        } else {
            showError('Log details not found');
        }
        
    } catch (error) {
        console.error('Error fetching log details:', error);
        showError('Failed to load log details');
    }
}

/**
 * Show log details in reusable modal
 * @param {Object} logData - Log data to display
 */
function showLogDetailsModal(logData) {
    // Try to use the existing info modal
    if (typeof openInfoModal === 'function') {
        const modalBody = `
            <div class="row g-3">
                <div class="col-md-6">
                    <div class="card-dark border-0">
                        <div class="card-body">
                            <h6 class="card-title">
                                <i class="fas fa-video text-primary me-2"></i>Camera
                            </h6>
                            <p class="card-text">${logData.camera}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card-dark border-0">
                        <div class="card-body">
                            <h6 class="card-title">
                                <i class="fas fa-circle text-${logData.light_state.toLowerCase() === 'green' ? 'success' : 'danger'} me-2"></i>Light State
                            </h6>
                            <p class="card-text">
                                <span class="badge bg-${logData.light_state.toLowerCase() === 'green' ? 'success' : 'danger'}">
                                    ${logData.light_state}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card-dark border-0">
                        <div class="card-body">
                            <h6 class="card-title">
                                <i class="fas fa-cog text-info me-2"></i>Mode
                            </h6>
                            <p class="card-text">
                                <span class="badge bg-${logData.mode_type.toLowerCase() === 'auto' ? 'info' : 'warning'}">
                                    <i class="fas fa-${logData.mode_type.toLowerCase() === 'auto' ? 'robot' : 'hand-pointer'} me-1"></i>
                                    ${logData.mode_type}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card-dark border-0">
                        <div class="card-body">
                            <h6 class="card-title">
                                <i class="fas fa-clock text-warning me-2"></i>Duration
                            </h6>
                            <p class="card-text">${logData.duration}</p>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="card-dark border-0">
                        <div class="card-body">
                            <h6 class="card-title">
                                <i class="fas fa-calendar-alt text-secondary me-2"></i>Timestamp
                            </h6>
                            <p class="card-text">${logData.timestamp}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card-dark border-0">
                        <div class="card-body">
                            <h6 class="card-title">
                                <i class="fas fa-user text-primary me-2"></i>User
                            </h6>
                            <p class="card-text">${logData.user}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card-dark border-0">
                        <div class="card-body">
                            <h6 class="card-title">
                                <i class="fas fa-envelope text-info me-2"></i>Email
                            </h6>
                            <p class="card-text">${logData.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const modalFooter = `
            <button type="button" class="btn btn-secondary" onclick="closeInfoModal()">
                <i class="fas fa-times me-1"></i>Close
            </button>
        `;
        
        openInfoModal({
            title: `Traffic Log Details - ID: ${logData.id}`,
            body: modalBody,
            footer: modalFooter
        });
    } else {
        // Fallback to built-in modal if info modal is not available
        const modal = document.getElementById('logDetailsModal');
        if (modal) {
            const content = document.getElementById('logDetailsContent');
            if (content) {
                content.innerHTML = `
                    <div class="row g-3">
                        <div class="col-md-6">
                            <strong>Camera:</strong> ${logData.camera}
                        </div>
                        <div class="col-md-6">
                            <strong>Light State:</strong> 
                            <span class="badge bg-${logData.light_state.toLowerCase() === 'green' ? 'success' : 'danger'}">
                                ${logData.light_state}
                            </span>
                        </div>
                        <div class="col-md-6">
                            <strong>Mode:</strong> 
                            <span class="badge bg-${logData.mode_type.toLowerCase() === 'auto' ? 'info' : 'warning'}">
                                ${logData.mode_type}
                            </span>
                        </div>
                        <div class="col-md-6">
                            <strong>Duration:</strong> ${logData.duration}
                        </div>
                        <div class="col-12">
                            <strong>Timestamp:</strong> ${logData.timestamp}
                        </div>
                        <div class="col-md-6">
                            <strong>User:</strong> ${logData.user}
                        </div>
                        <div class="col-md-6">
                            <strong>Email:</strong> ${logData.email}
                        </div>
                    </div>
                `;
            }
            new bootstrap.Modal(modal).show();
        }
    }
}

/**
 * Delete a log entry
 * @param {number} logId - Log ID to delete
 */
async function deleteLog(logId) {
    // Get log details for the confirmation modal
    const logRow = document.querySelector(`[data-log-id="${logId}"]`);
    let logInfo = 'this log entry';
    
    if (logRow) {
        const cells = logRow.querySelectorAll('td');
        const camera = cells[0].textContent.trim();
        const timestamp = cells[4].textContent.trim();
        logInfo = `${camera} log from ${timestamp}`;
    }
    
    // Use reusable modal for confirmation
    if (typeof openInfoModal === 'function') {
        const modalBody = `
            <div class="text-center">
                <div class="mb-3">
                    <i class="fas fa-exclamation-triangle text-warning fa-3x"></i>
                </div>
                <h5 class="mb-3">Confirm Deletion</h5>
                <p class="mb-0">Are you sure you want to delete ${logInfo}?</p>
                <p class=" small mb-0">This action cannot be undone.</p>
            </div>
        `;
        
        const modalFooter = `
            <button type="button" class="btn btn-secondary" onclick="closeInfoModal()">
                <i class="fas fa-times me-1"></i>Cancel
            </button>
            <button type="button" class="btn btn-danger" onclick="confirmDeleteLog(${logId})">
                <i class="fas fa-trash me-1"></i>Delete
            </button>
        `;
        
        openInfoModal({
            title: 'Delete Log Entry',
            body: modalBody,
            footer: modalFooter
        });
    } else {
        // Fallback to confirm dialog if modal is not available
        if (confirm(`Are you sure you want to delete ${logInfo}?`)) {
            await performDeleteLog(logId);
        }
    }
}

/**
 * Confirm and perform the log deletion
 * @param {number} logId - Log ID to delete
 */
async function confirmDeleteLog(logId) {
    closeInfoModal();
    await performDeleteLog(logId);
}

/**
 * Perform the actual log deletion
 * @param {number} logId - Log ID to delete
 */
async function performDeleteLog(logId) {
    try {
        // Show loading state
        showSuccess('Deleting log...');
        
        const response = await fetch('../admin/delete-log-traffic.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ log_id: logId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess('Log deleted successfully');
            refreshLogs(); // Refresh the current view
        } else {
            throw new Error(data.message || 'Failed to delete log');
        }
        
    } catch (error) {
        console.error('Delete error:', error);
        showError('Failed to delete log: ' + error.message);
    }
}

// ================================================================
// INITIALIZATION
// ================================================================

/**
 * Initialize the logs page
 */
document.addEventListener("DOMContentLoaded", () => {
    console.log('Traffic Logs System Initializing...');
    
    // Set up filter event listeners
    const filterButton = document.getElementById('apply-filters');
    const clearButton = document.getElementById('clear-filters');
    const refreshButton = document.getElementById('refresh-logs');
    const exportButton = document.getElementById('export-logs');
    
    if (filterButton) {
        filterButton.addEventListener('click', applyFilters);
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', clearFilters);
    }
    
    if (refreshButton) {
        refreshButton.addEventListener('click', refreshLogs);
    }
    
    if (exportButton) {
        exportButton.addEventListener('click', exportLogs);
    }
    
    // Set up filter form submission
    const filterForm = document.getElementById('filter-form');
    if (filterForm) {
        filterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            applyFilters();
        });
    }
    
    // Set up auto-refresh (optional)
    const autoRefreshCheckbox = document.getElementById('auto-refresh');
    if (autoRefreshCheckbox) {
        autoRefreshCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                if (statisticsInterval) {
                    clearInterval(statisticsInterval);
                }
                statisticsInterval = setInterval(refreshLogs, 30000); // Refresh every 30 seconds
            } else {
                if (statisticsInterval) {
                    clearInterval(statisticsInterval);
                    statisticsInterval = null;
                }
            }
        });
    }
    
    // Initial load
    fetchLogs();
    fetchStatistics();
    
    console.log('Traffic Logs System Initialized');
});

// Make functions globally available
window.changePage = changePage;
window.applyFilters = applyFilters;
window.clearFilters = clearFilters;
window.refreshLogs = refreshLogs;
window.exportLogs = exportLogs;
window.viewLogDetails = viewLogDetails;
window.deleteLog = deleteLog;
window.confirmDeleteLog = confirmDeleteLog;