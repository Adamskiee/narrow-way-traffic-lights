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
}

function generatePassword(length = 16) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, num => charset[num % charset.length]).join('');
}

function openDeleteModal(id) {
    const modalForm = document.querySelector(".modalForm");

    modalForm.action = "../admin/delete-user.php";
    modalForm.method = "post";
    modalForm.id = "user-delete";
    handleFormSubmit(
        "user-delete", 
        (data)=>{
            openSuccessModal(data.message)
        },
        (error)=> openErrorModal(error.message)
    )

    openModal({
        title: "Delete User",
        body: `
        <input type="hidden" name="user-id" value="${id}">
        <p>Are you sure to delete?</p>
        `,
        footer: `<button type="submit">Delete</button>
        `
    });
}
function openEditModal(id) {
    fetch(`../admin/get-user.php?id=${id}`)
    .then(res => res.json())
    .then(data => {
        const user = data.user;
        const modalForm = document.querySelector(".modalForm");

        modalForm.action = "../admin/edit-user.php";
        modalForm.method = "post";
        modalForm.id = "user-edit";
        handleFormSubmit(
            "user-edit", 
            (data)=>{
                openSuccessModal(data.message)
            },
            (error)=>openErrorModal(error.message)
        )

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
        body: `<p>${message}</p>`,
        footer: `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`
    })

    setTimeout(() => {
        closeInfoModal();
        location.reload();
    }, 1000);
}

function openErrorModal(message) {
    closeModal();

    openInfoModal({
        title: "Error",
        body: `<p>${message}</p>`,
        footer: `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`
    })

    setTimeout(() => {
        closeInfoModal();
        location.reload();
    }, 3000);
}

document.addEventListener("DOMContentLoaded", ()=>{
    fetch("../admin/users.php")
    .then(res => res.json())
    .then(data => {
        const tbody = document.getElementById("user-table-body");
        data.users.forEach(user => {
            const row = `
                <tr>
                    <td>${user.username}</td>
                    <td>${user["first_name"]}</td>
                    <td>${user["last_name"] ?? ""}</td>
                    <td>${user["email"] ?? ""}</td>
                    <td>${user["phone_number"] ?? ""}</td>
                    <td>${user["created_at"] ?? ""}</td>
                    <td>
                        <button class="btn btn-danger delete-btn" data-id="${user.id}">Delete</button>
                        <button class="btn btn-tertiary edit-btn" data-id="${user.id}">Edit</button>
                    </td>
                </tr>
                `
            tbody.innerHTML += row 
            attachEvents();
        });
    });
})

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
        <button type="submit" class="btn btn-primary">Add User</button>
        `
    });
    document.getElementById("generate-btn").addEventListener("click", () => {
        document.getElementById("password").value = generatePassword();
    })
}

document.getElementById("add-user-btn").addEventListener("click", () => {
    const modalForm = document.querySelector(".modalForm");
    modalForm.action = "../admin/add-user.php";
    modalForm.method = "post";
    modalForm.id = "user-add";
    handleFormSubmit(
        "user-add", 
        (data)=>{
            openSuccessModal(data.message);
        },
        (error) => openErrorModal(error.message)
    )
    openAddModal();
})

