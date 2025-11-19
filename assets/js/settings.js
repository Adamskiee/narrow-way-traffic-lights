const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");
const username = document.getElementById("username");
const email = document.getElementById("email");
const phoneNumber = document.getElementById("phone-number");

document.addEventListener("DOMContentLoaded", () => {
    fetch("../user/get-info.php")
        .then(res=>res.json())
        .then(data=> {
            const info = data.information;
            console.log(info);
            firstName.value = info["first_name"];
            lastName.value = info["last_name"]
            username.value = info["username"];
            email.value = info["email"];
            phoneNumber.value = info["phone_number"]
        })
})
