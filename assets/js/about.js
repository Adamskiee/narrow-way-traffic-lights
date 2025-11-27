const description = document.getElementById("description");
const cards = document.querySelectorAll(".about__card");
const title = document.getElementById("title");

let descriptions = 
    {
        "tosino-card": {
            description: "As the Full Stack Developer, I architected FlowSync from concept to implementation, bridging frontend and backend technologies seamlessly. I developed the real-time WebSocket communication for camera integration, built the responsive glassmorphism UI with dark theme aesthetics, and created the robust authentication system with role-based access control. My expertise spans JavaScript, PHP, MySQL, and modern CSS frameworks, ensuring FlowSync delivers both powerful functionality and exceptional user experience across all devices.",
            title: "Adriele Tosino",
        },
        "maligalig-card": {
            description: "I serve as the Assistant Project Manager, supporting our development workflow and ensuring quality deliverables throughout FlowSync's development lifecycle. I coordinate between team members, manage our Git repository structure, assist in project timeline planning, and conduct thorough testing of system features. My role involves maintaining documentation, facilitating team communication, and supporting both technical development and project management processes to ensure our traffic management system meets professional standards.",
            title: "Ian Maligalig"
        },
        "rose-card": {
            description: "As the UI/UX Designer, I crafted FlowSync's visual identity and user experience, transforming complex traffic management concepts into intuitive, accessible interfaces. I designed the modern glassmorphism aesthetic, created the traffic light-themed color schemes, and developed responsive layouts that work seamlessly across desktop and mobile devices. My focus on user-centered design ensures that both administrators and operators can efficiently manage traffic systems through clean, professional interfaces that prioritize functionality and visual appeal.",
            title: "Jeric Rose"
        },
        "magsino-card": {
            description: "As the Project Manager, I oversee FlowSync's development strategy, coordinate team efforts, and ensure our traffic management system meets industry standards and project requirements. I manage sprint planning, maintain project timelines, facilitate stakeholder communication, and implement quality assurance processes. My responsibility includes architectural decision-making, risk management, and ensuring that our team delivers a production-ready solution that effectively addresses real-world traffic control challenges while maintaining code quality and system reliability.",
            title: "Ian Magsino"
        }
    }

cards.forEach(card => {
    card.addEventListener("click", (e) => {
        description.innerText = descriptions[card.id].description;
        title.innerText = descriptions[card.id].title;
        cards.forEach(cardA => {
            cardA.classList.remove("active");
        })
        card.classList.add("active");
    })
})