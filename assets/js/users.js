import { openModal, closeModal } from "./modal.js";
import { openInfoModal, closeInfoModal } from "./infoModal.js";
import { handleFormSubmit } from "./formHandler.js";
import { setupRealtimeValidation, validateForm, showFieldError } from "./validate.js";
import { createPasswordInputWithToggle, initPasswordToggles } from "./password-toggle.js";

function attachEvents() {
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            openDeleteModal(id);
        });
    });

    document.querySelectorAll(".ban-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            openBanModal(id);
        });
    });

    document.querySelectorAll(".unban-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            openUnbanModal(id);
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
    openInfoModal({
        title: "Delete User",
        body: `
        <div class="text-center">
            <div class="mb-3">
                <i class="fas fa-exclamation-triangle text-warning fa-3x"></i>
            </div>
            <h5 class="mb-3">Confirm Deletion</h5>
            <p class="mb-0">Are you sure you want to delete this user?</p>
            <p class=" small mb-0">This action cannot be undone.</p>
        </div>
        `,
        footer: `
        <button class="btn btn-secondary" onclick="closeInfoModal()">
        <i class="fas fa-times me-1"></i>Close</button>
        <button class="btn btn-danger" onclick="deleteUser(${id})">
        <i class="fas fa-trash me-1"></i>Delete</button>
        `
    });
    setTimeout(() => {
        const modalCloseBtn = document.querySelector('#infoModal .btn-close');
        
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => {
                closeInfoModal();
            });
        }
    }, 100)
}

async function deleteUser(id) {
    try {
      const response = await fetch("../admin/delete-user.php", {
        method: "post",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({"user-id": id}),
      });

      const data = await response.json();
      if (data.success) openSuccessModal(data.message);
      else openErrorModal(data.message)
    } catch (err) {
      openErrorModal(err.message)
      console.log(err);
    }
}

function openBanModal(id) {
    openInfoModal({
        title: "Ban User",
        body: `
        <div class="text-center">
            <div class="mb-3">
                <i class="fas fa-exclamation-triangle text-warning fa-3x"></i>
            </div>
            <h5 class="mb-3">Confirm Ban</h5>
            <p class="mb-0">Are you sure you want to ban this user?</p>
        </div>
        `,
        footer: `
        <button class="btn btn-secondary" onclick="closeInfoModal()">
        <i class="fas fa-times me-1"></i>Close</button>
        <button class="btn btn-danger" onclick="banUser(${id})">
        <i class="fas fa-ban me-1"></i>Ban</button>
        `
    });
    setTimeout(() => {
        const modalCloseBtn = document.querySelector('#infoModal .btn-close');
        
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => {
                closeInfoModal();
            });
        }
    }, 100)
}

async function banUser(id) {
    try {
      const response = await fetch("../admin/ban-user.php", {
        method: "post",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({"user-id": id}),
      });

      const data = await response.json();
      if (data.success) openSuccessModal(data.message);
      else openErrorModal(data.message)
    } catch (err) {
      openErrorModal(err.message)
      console.log(err);
    }
}

function openUnbanModal(id) {
    openInfoModal({
        title: "Unban User",
        body: `
        <div class="text-center">
            <div class="mb-3">
                <i class="fas fa-exclamation-triangle text-warning fa-3x"></i>
            </div>
            <h5 class="mb-3">Confirm Unban</h5>
            <p class="mb-0">Are you sure you want to unban this user?</p>
        </div>
        `,
        footer: `
        <button class="btn btn-secondary" onclick="closeInfoModal()">
        <i class="fas fa-times me-1"></i>Close</button>
        <button class="btn btn-danger" onclick="unbanUser(${id})">
        <i class="fas fa-check me-1"></i>Unban</button>
        `
    });
    setTimeout(() => {
        const modalCloseBtn = document.querySelector('#infoModal .btn-close');
        
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => {
                closeInfoModal();
            });
        }
    }, 100)
}

async function unbanUser(id) {
    try {
      const response = await fetch("../admin/unban-user.php", {
        method: "post",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({"user-id": id}),
      });

      const data = await response.json();
      if (data.success) openSuccessModal(data.message);
      else openErrorModal(data.message)
    } catch (err) {
      openErrorModal(err.message)
      console.log(err);
    }
}

function openEditModal(id) {
    fetch(`../admin/get-user.php?id=${id}`, {credentials: "include"})
    .then(res => res.json())
    .then(data => {
        const user = data.user;
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
            footer: `
            <button type="button" class="btn btn-secondary" onclick="closeModal()"> 
                <i class="fas fa-times me-1"></i>Close
            </button>
            <button type="submit" class="btn btn-primary"> 
                <i class="fas fa-edit me-1"></i>Edit
            </button>
            `
        });

        setTimeout(() => {
            const modalForm = document.querySelector(".modalForm");
            setupRealtimeValidation(modalForm);
        }, 100);
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
    
    fetch("../admin/users.php", {credentials: "include"})
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
                    <td>${user["is_active"] === 1 ? 'Active' : 'Inactive'} </td>
                    <td>${user["is_2fa_enabled"] === 1 ? 'Verified' : 'Unverified'} </td>
                    <td>${user["first_name"] || '-'}</td>
                    <td>${user["last_name"] || '-'}</td>
                    <td>
                        <div>
                            ${user["email"] || '-'}
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
                            <button class="btn btn-sm btn-outline-danger ${user['is_banned'] ? 'unban-btn' : 'ban-btn' }" data-id="${user.id}" title="Ban User">
                                <i class="fas ${user['is_banned'] ? 'fa-check' : 'fa-ban' }"></i>
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
        setupEditUserButton();
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

function setupEditUserButton() {
    const editUserBtn = document.querySelectorAll(".edit-btn");
    editUserBtn.forEach(btn => {
        if (btn && !btn.hasAttribute('data-listener-attached')) {
            btn.setAttribute('data-listener-attached', 'true');
            btn.addEventListener("click", () => {
                const modalForm = document.querySelector(".modalForm");
                
                modalForm.action = "../admin/edit-user.php";
                modalForm.method = "post";
                modalForm.id = "user-edit";
                
                if (!modalForm.hasAttribute('data-form-handler')) {
                    modalForm.setAttribute('data-form-handler', 'true');
                    modalForm.addEventListener("submit", async (e) => {
                        e.preventDefault();
                        
                        const validation = validateForm(modalForm);
                        if(!validation.isValid) {
                            return;
                        }

                        showEditUserLoading(true);
                        const formData = new FormData(modalForm);
                        const payload = Object.fromEntries(formData.entries());

                        try {
                            const response = await fetch(modalForm.action, {
                            method: modalForm.method,
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(payload),
                            });

                            showEditUserLoading(false);
                            
                            const data = await response.json();
                            if (data.success) openSuccessModal(data.message);
                            else showFieldError(document.getElementById("username"), data.message);
                        } catch (err) {
                            openErrorModal(err.message);
                            showEditUserLoading(false);
                            console.log(err);
                        }
                    });
                }
                
                openEditModal(btn.dataset.id);
            });
        }
    });
}

function showEditUserLoading(isLoading) {
    const submitBtn = document.getElementById("edit-user-submit-btn");
    const modal = document.querySelector("#modal .modal-content");
    
    if (isLoading) {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                Adding User...
            `;
        }
        
        if (modal) {
            modal.style.opacity = "0.7";
            modal.style.pointerEvents = "none";
        }
    } else {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `Add User`;
        }
        
        if (modal) {
            modal.style.opacity = "1";
            modal.style.pointerEvents = "auto";
        }
    }
}

/**
 * Update user statistics display
 */
function updateUserStatistics(users) {
    const totalUsersEl = document.getElementById('total-users-count');
    const activeUsersEl = document.getElementById('active-users-count');
    const verifiedUsersEl = document.getElementById('verified-users-count');
    
    if (totalUsersEl) {
        totalUsersEl.textContent = users.length;
    }
    
    if (activeUsersEl) {
        activeUsersEl.textContent = calculateActiveUsers(users);
    }
    
    if (verifiedUsersEl) {
        verifiedUsersEl.textContent = calculateVerifiedUsers(users);
    }
}

function calculateActiveUsers(users) {
    let total = 0;
    users.forEach(user => {
        if(user.active == 1) {
            total+=1;
        }
    })
    return total;
}

function calculateVerifiedUsers(users) {
    let total = 0;
    users.forEach(user => {
        if(user['is_2fa_enabled'] == 1) {
            total+=1;
        }   
    })
    return total;
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
              ${createPasswordInputWithToggle({
                  name: 'password',
                  id: 'password',
                  placeholder: 'Password',
                  required: true,
                  showGenerate: true})}
            </div>
        </div>
        `,
        footer: `
        <button type="button" class="btn btn-secondary">
            <i class="fas fa-times me-1"></i>Cancel
        </button>
        <button type="submit" class="btn btn-primary" id="add-user-submit-btn">
            <i class="fas fa-plus me-1"></i>Add User
        </button>
        `
    });
    
    setTimeout(() => {
        const form = document.querySelector(".modalForm");

        setupRealtimeValidation(form);

        const generateBtn = document.querySelector(".generate-password");
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
    fetch(`../admin/get-user.php?id=${id}`, {credentials: "include"})
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
                    console.log("close");
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
            
            if (!modalForm.hasAttribute('data-form-handler')) {
                modalForm.setAttribute('data-form-handler', 'true');
                modalForm.addEventListener("submit", async (e) => {
                    e.preventDefault();

                    const validation = validateForm(modalForm);
                    if(!validation.isValid) {
                        return;
                    }

                    showAddUserLoading(true);
                    const formData = new FormData(modalForm);
                    const payload = Object.fromEntries(formData.entries());
                    try {
                        const response = await fetch(modalForm.action, {
                        method: modalForm.method,
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                        });

                        showAddUserLoading(false);
                        
                        const data = await response.json();
                        if (data.success) openSuccessModal(data.message);
                        else showFieldError(document.getElementById("username"), data.message);
                    } catch (err) {
                        openErrorModal(err.message);
                        showAddUserLoading(false);
                        console.log(err);
                    }
                });
            }
            
            openAddModal();
        });
    }
}

function showAddUserLoading(isLoading) {
    const submitBtn = document.getElementById("add-user-submit-btn");
    const modal = document.querySelector("#modal .modal-content");
    
    if (isLoading) {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                Adding User...
            `;
        }
        
        if (modal) {
            modal.style.opacity = "0.7";
            modal.style.pointerEvents = "none";
        }
    } else {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `Add User`;
        }
        
        if (modal) {
            modal.style.opacity = "1";
            modal.style.pointerEvents = "auto";
        }
    }
}

function phoneInputChange() {
    console.log("ahdsfahsfd")
}

document.addEventListener("DOMContentLoaded", () => {
    loadUsers();
    initPasswordToggles();
    
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
window.deleteUser = deleteUser;
window.banUser = banUser;
window.unbanUser = unbanUser;
window.closeModal = closeModal;
window.closeInfoModal = closeInfoModal;
window.phoneInputChange = phoneInputChange;
