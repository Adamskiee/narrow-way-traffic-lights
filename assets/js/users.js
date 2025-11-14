import { openModal } from "./modal.js";
import { handleFormSubmit } from "./formHandler.js";

function attachEvents() {
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            deleteUser(id);
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
                document.getElementById("result").innerText=data.message
                location.reload();
            },
            (error)=>document.getElementById("result").innerText=error.message
        )

        openModal({
            title: "Edit User",
            body: `
            <input type="hidden" name="user-id" value="${id}">
            <input type="text" name="first-name" placeholder="First Name" value=${user["first_name"]} required>
            <input type="text" name="last-name" placeholder="Last Name" value=${user["last_name"]}>
            <input type="email" name="email" placeholder="Email" value=${user["email"]}>
            <input type="text" name="phone" placeholder="Phone #" value=${user["phone_number"]}>
            <input type="text" name="username" placeholder="Username" required value=${user["username"]}>
            <button type="button" id="generate-btn">Generate</button>
            <br>
            <span id="result"></span>
            `,
            footer: `<button type="submit">Edit</button>
            `
        });

        document.getElementById("generate-btn").addEventListener("click", () => {
            document.getElementById("password").value = generatePassword();
        })
    })
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
                        <button class="delete-btn" data-id="${user.id}">Delete</button>
                        <button class="edit-btn" data-id="${user.id}">Edit</button>
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
        <input type="text" name="first-name" placeholder="First Name" value="Operator3" required>
        <input type="text" name="last-name" placeholder="Last Name">
        <input type="email" name="email" placeholder="Email" value="operator3@gmail.com">
        <input type="text" name="phone" placeholder="Phone #" value="09123456782">
        <input type="text" name="username" placeholder="Username" value="Operator3" required>
        <input type="password" name="password" placeholder="Password" id="password" value="operator3" required>
        <button type="button" id="generate-btn">Generate</button>
        <hr>
        <span id="result"></span>
        `,
        footer: `
        <button type="submit">Add User</button>
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
            document.getElementById("result").innerText=data.message
            location.reload();
        },
        (error)=>document.getElementById("result").innerText=error.message
    )
    openAddModal();
})

