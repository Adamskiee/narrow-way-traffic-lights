document.addEventListener("DOMContentLoaded", ()=>{
    fetch("../admin/get-logs-traffic.php")
    .then(res => res.json())
    .then(data => {
        const tbody = document.getElementById("logs-table-body");
        data.logs.forEach(user => {
            const row = `
                <tr>
                    <td>${user.username}</td>
                    <td>${user["first_name"]}</td>
                    <td>${user["last_name"] ?? ""}</td>
                    <td>${user["email"] ?? ""}</td>
                    <td>${user["phone_number"] ?? ""}</td>
                    <td>${user["created_at"] ?? ""}</td>
                </tr>
                `
            tbody.innerHTML += row 
            attachEvents();
        });
    });
})