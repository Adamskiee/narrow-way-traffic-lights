const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(nav => {
    nav.addEventListener("click", (e) => {
        navLinks.forEach(navA => {
            navA.classList.remove("active");
        })
        nav.classList.add("active");
    })
})