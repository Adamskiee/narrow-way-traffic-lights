import { openModal, closeModal } from "./modal.js";
import { openInfoModal, closeInfoModal } from "./infoModal.js";
import { handleFormSubmit } from "./formHandler.js";

function attachEvents() {
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            openDeleteModal(id);
        });
    });

    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            openEditModal(id);
        });
    });
    
    document.querySelectorAll(".view-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            openViewModal(id);
        });
    });
}

function generatePassword(length = 16) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, num => charset[num % charset.length]).join('');
}

function openDeleteModal(id) {
    const modalForm = document.querySelector(".modalForm");

    modalForm.onsubmit = null;
    modalForm.removeAttribute('data-form-handler');
    
    modalForm.action = "../admin/delete-user.php";
    modalForm.method = "post";
    modalForm.id = "user-delete";
    
    handleFormSubmit(
        "user-delete", 
        (data) => {
            openSuccessModal(data.message);
        },
        (error) => openErrorModal(error.message)
    );

    openModal({
        title: "Delete User",
        body: `
        <input type="hidden" name="user-id" value="${id}">
        <p>Are you sure to delete?</p>
        `,
        footer: `<button type="submit" class="btn btn-danger">Delete</button>
        `
    });
}

function openEditModal(id) {
    fetch(`../admin/get-user.php?id=${id}`)
    .then(res => res.json())
    .then(data => {
        const user = data.user;
        const modalForm = document.querySelector(".modalForm");

        modalForm.onsubmit = null;
        modalForm.removeAttribute('data-form-handler');
        
        modalForm.action = "../admin/edit-user.php";
        modalForm.method = "post";
        modalForm.id = "user-edit";
        
        handleFormSubmit(
            "user-edit", 
            (data) => {
                openSuccessModal(data.message);
            },
            (error) => openErrorModal(error.message)
        );

        openModal({
            title: "Edit User",
            body: `
            <input type="hidden" name="user-id" value="${id}">
            <div class="mb-3">
                <label for="firstName" class="form-label">First Name*</label>
                <input
                    type="text"
                    class="form-control"
                    name="first-name"
                    id="firstName"
                    value='${user["first_name"]}' required
                />
            </div>
            <div class="mb-3">
                <label for="lastName" class="form-label">Last Name</label>
                <input
                    type="text"
                    class="form-control"
                    name="last-name"
                    id="lastName"
                    value='${user["last_name"]}'
                />
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email*</label>
                <input
                    type="email"
                    class="form-control"
                    name="email"
                    id="email"
                    value='${user["email"]}' required
                />
            </div>
            <div class="mb-3">
                <label for="phone" class="form-label">Phone Number</label>
                <input
                    type="text"
                    class="form-control"
                    name="phone"
                    id="phone"
                    value='${user["phone_number"]}'
                />
            </div>
            <div class="mb-3">
                <label for="username" class="form-label">Username*</label>
                <input
                    type="text"
                    class="form-control"
                    name="username"
                    id="username"
                    value='${user["username"]}' required
                />
            </div>
            `,
            footer: `<button type="submit" class="btn btn-primary">Edit</button>
            `
        });

    })
}

function openSuccessModal(message) {
    closeModal();

    openInfoModal({
        title: "Success",
        body: `
            <div class="text-center">
                <i class="fas fa-check-circle text-success fa-3x mb-3"></i>
                <p class="mb-0">${message}</p>
            </div>
        `,
        footer: `<button type="button" class="btn btn-success" id="closeSuccessModal">Close</button>`
    });

    setTimeout(() => {
        const closeBtn = document.getElementById('closeSuccessModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                closeInfoModal();
                loadUsers();
            });
        }
    }, 100);
    
    setTimeout(() => {
        closeInfoModal();
        loadUsers();
    }, 1500);
}

function openErrorModal(message) {
    closeModal();

    openInfoModal({
        title: "Error",
        body: `
            <div class="text-center">
                <i class="fas fa-exclamation-triangle text-danger fa-3x mb-3"></i>
                <p class="mb-0">${message}</p>
            </div>
        `,
        footer: `<button type="button" class="btn btn-danger" id="closeErrorModal">Close</button>`
    });

    setTimeout(() => {
        const closeBtn = document.getElementById('closeErrorModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                closeInfoModal();
            });
        }
    }, 100);
    
    setTimeout(() => {
        closeInfoModal();
    }, 3000);
}

let currentUsers = [];

/**
 * Load users from server
 */
function loadUsers() {
    const tbody = document.getElementById("user-table-body");
    const usersCountEl = document.getElementById("users-count");
    
    // Show loading state
    tbody.innerHTML = `
        <tr>
            <td colspan="7" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div class="mt-2">Loading users...</div>
            </td>
        </tr>
    `;
    
    fetch("../admin/users.php")
    .then(res => res.json())
    .then(data => {
        currentUsers = data.users;
        tbody.innerHTML = ''; 
        
        if (data.users.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4 ">
                        <i class="fas fa-users fa-2x mb-2"></i>
                        <div>No users found</div>
                        <small>Click "Add User" to create the first user</small>
                    </td>
                </tr>
            `;
            return;
        }
        
        data.users.forEach(user => {
            const row = `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 32px; height: 32px; font-size: 14px;">
                                ${user.username.charAt(0).toUpperCase()}
                            </div>
                            <strong>${user.username}</strong>
                        </div>
                    </td>
                    <td>${user["first_name"] || '-'}</td>
                    <td>${user["last_name"] || '-'}</td>
                    <td>
                        <div>
                            ${user["email"] || '-'}
                            ${user["email"] ? '<br><small class="">Verified</small>' : ''}
                        </div>
                    </td>
                    <td>${user["phone_number"] || '-'}</td>
                    <td>
                        <small class="">
                            ${new Date(user["created_at"]).toLocaleDateString()}
                        </small>
                    </td>
                    <td class="text-center">
                        <div class="btn-group" role="group">
                            <button class="btn btn-sm btn-outline-info view-btn" data-id="${user.id}" title="View Details">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-secondary edit-btn" data-id="${user.id}" title="Edit User">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${user.id}" title="Delete User">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
        
        if (usersCountEl) {
            usersCountEl.textContent = `${data.users.length} user${data.users.length !== 1 ? 's' : ''}`;
        }
        
        updateUserStatistics(data.users);
        
        attachEvents();
    })
    .catch(error => {
        console.error('Error loading users:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4 text-danger">
                    <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
                    <div>Failed to load users</div>
                    <button class="btn btn-sm btn-outline-primary mt-2" onclick="loadUsers()">
                        <i class="fas fa-redo me-1"></i>Retry
                    </button>
                </td>
            </tr>
        `;
    });
}

/**
 * Update user statistics display
 */
function updateUserStatistics(users) {
    const totalUsersEl = document.getElementById('total-users-count');
    const activeUsersEl = document.getElementById('active-users-count');
    const recentUsersEl = document.getElementById('recent-users-count');
    
    if (totalUsersEl) {
        totalUsersEl.textContent = users.length;
    }
    
    if (activeUsersEl) {
        activeUsersEl.textContent = users.length;
    }
    
    if (recentUsersEl) {
        // Count users created in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentCount = users.filter(user => 
            new Date(user.created_at) > thirtyDaysAgo
        ).length;
        
        recentUsersEl.textContent = recentCount;
    }
}


function openAddModal() {
    openModal({
        title: "Add User",
        body: `
        <div class="mb-3">
            <label for="firstName" class="form-label">First Name*</label>
            <input
                type="text"
                class="form-control"
                name="first-name"
                id="firstName"
                placeholder="e.g. Juan"
                required
            />
        </div>
        <div class="mb-3">
            <label for="lastName" class="form-label">Last Name</label>
            <input
                type="text"
                class="form-control"
                name="last-name"
                id="lastName"
                placeholder="e.g. Dela Cruz"
            />
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Email*</label>
            <input
                type="email"
                class="form-control"
                name="email"
                id="email"
                placeholder="e.g. juandelacruz@gmail.com"
                required
            />
        </div>
        <div class="mb-3">
            <label for="phone" class="form-label">Phone Number</label>
            <input
                type="text"
                class="form-control"
                name="phone"
                id="phone"
                placeholder="e.g. 09123456789"
            />
        </div>
        <div class="mb-3">
            <label for="username" class="form-label">Username*</label>
            <input
                type="text"
                class="form-control"
                name="username"
                id="username"
                placeholder="e.g. Juan"
                required
            />
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Password*</label>
            <div class="input-group">
                <input
                    type="password"
                    class="form-control"
                    name="password"
                    id="password"
                    placeholder="Password"
                    aria-describedby="generate-btn"
                    required
                />
                <button type="button" class="btn btn-secondary" id="generate-btn">Generate</button>
            </div>
        </div>
        `,
        footer: `
        <button type="submit" class="btn btn-primary" id="add-user-submit-btn">Add User</button>
        `
    });
    
    setTimeout(() => {
        const generateBtn = document.getElementById("generate-btn");
        if (generateBtn && !generateBtn.hasAttribute('data-listener-attached')) {
            generateBtn.setAttribute('data-listener-attached', 'true');
            generateBtn.addEventListener("click", () => {
                document.getElementById("password").value = generatePassword();
            });
        }
    }, 100);
}

/**
 * Export users to CSV
 */
function exportUsers() {
    if (currentUsers.length === 0) {
        openInfoModal({
            title: "No Data",
            body: `
                <div class="text-center">
                    <i class="fas fa-info-circle text-info fa-3x mb-3"></i>
                    <p class="mb-0">No users available to export.</p>
                </div>
            `,
            footer: `<button type="button" class="btn btn-secondary" onclick="closeInfoModal()">Close</button>`
        });
        return;
    }
    
    try {
        const headers = ['Username', 'First Name', 'Last Name', 'Email', 'Phone Number', 'Created At'];
        
        const rows = currentUsers.map(user => [
            user.username || '',
            user.first_name || '',
            user.last_name || '',
            user.email || '',
            user.phone_number || '',
            new Date(user.created_at).toLocaleDateString()
        ]);
        
        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
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
        }
    } catch (error) {
        console.error('Export error:', error);
        openErrorModal('Failed to export users. Please try again.');
    }
}

/**
 * Open view user details modal
 */
function openViewModal(id) {
    fetch(`../admin/get-user.php?id=${id}`)
    .then(res => res.json())
    .then(data => {
        const user = data.user;
        
        openInfoModal({
            title: `User Details - ${user.username}`,
            body: `
                <div class="row g-3">
                    <div class="col-12 text-center mb-3">
                        <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 80px; height: 80px; font-size: 32px;">
                            ${user.username.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card-dark border-0">
                            <div class="card-body">
                                <h6 class="card-title">
                                    <i class="fas fa-user text-primary me-2"></i>Username
                                </h6>
                                <p class="card-text">${user.username}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card-dark border-0">
                            <div class="card-body">
                                <h6 class="card-title">
                                    <i class="fas fa-id-card text-info me-2"></i>Full Name
                                </h6>
                                <p class="card-text">${user.first_name || ''} ${user.last_name || ''}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card-dark border-0">
                            <div class="card-body">
                                <h6 class="card-title">
                                    <i class="fas fa-envelope text-success me-2"></i>Email
                                </h6>
                                <p class="card-text">${user.email || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card-dark border-0">
                            <div class="card-body">
                                <h6 class="card-title">
                                    <i class="fas fa-phone text-warning me-2"></i>Phone Number
                                </h6>
                                <p class="card-text">${user.phone_number || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="card-dark border-0">
                            <div class="card-body">
                                <h6 class="card-title">
                                    <i class="fas fa-calendar text-secondary me-2"></i>Account Created
                                </h6>
                                <p class="card-text">${new Date(user.created_at).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            footer: `
                <button type="button" class="btn btn-secondary" id="closeViewModal">
                    <i class="fas fa-times me-1"></i>Close
                </button>
                <button type="button" class="btn btn-primary" id="editFromView" data-user-id="${id}">
                    <i class="fas fa-edit me-1"></i>Edit User
                </button>
            `
        });
        
        setTimeout(() => {
            const closeBtn = document.getElementById('closeViewModal');
            const editBtn = document.getElementById('editFromView');
            const modalCloseBtn = document.querySelector('#infoModal .btn-close');
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    closeInfoModal();
                });
            }
            
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    const userId = editBtn.getAttribute('data-user-id');
                    closeInfoModal();
                    setTimeout(() => {
                        openEditModal(userId);
                    }, 300);
                });
            }
            
            if (modalCloseBtn) {
                modalCloseBtn.addEventListener('click', () => {
                    closeInfoModal();
                });
            }
            
            const infoModal = document.getElementById('infoModal');
            if (infoModal) {
                infoModal.addEventListener('hidden.bs.modal', () => {
                    closeInfoModal();
                });
            }
        }, 100);
    })
    .catch(error => {
        console.error('Error fetching user details:', error);
        openErrorModal('Failed to load user details');
    });
}

function setupAddUserButton() {
    const addUserBtn = document.getElementById("add-user-btn");
    if (addUserBtn && !addUserBtn.hasAttribute('data-listener-attached')) {
        addUserBtn.setAttribute('data-listener-attached', 'true');
        addUserBtn.addEventListener("click", () => {
            const modalForm = document.querySelector(".modalForm");
            
            modalForm.action = "../admin/add-user.php";
            modalForm.method = "post";
            modalForm.id = "user-add";
            
            handleFormSubmit(
                "user-add", 
                (data) => {
                    openSuccessModal(data.message);
                },
                (error) => openErrorModal(error.message)
            );
            
            openAddModal();
        });
    }
}


document.addEventListener("DOMContentLoaded", () => {
    loadUsers();
    
    const refreshBtn = document.getElementById('refresh-users');
    if (refreshBtn && !refreshBtn.hasAttribute('data-listener-attached')) {
        refreshBtn.setAttribute('data-listener-attached', 'true');
        refreshBtn.addEventListener('click', loadUsers);
    }
    
    const exportBtn = document.getElementById('export-users');
    if (exportBtn && !exportBtn.hasAttribute('data-listener-attached')) {
        exportBtn.setAttribute('data-listener-attached', 'true');
        exportBtn.addEventListener('click', exportUsers);
    }
    
    setupAddUserButton();
});

// Make functions globally available for onclick handlers
window.loadUsers = loadUsers;
window.exportUsers = exportUsers;