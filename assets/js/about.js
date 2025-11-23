const description = document.getElementById("description");
const cards = document.querySelectorAll(".about__card");
let descriptions = 
    {
        "tosino-card": "I’m the type of person who can spend hours lost in a book or suddenly get the urge to rearrange my entire room at 2 AM. I love warm coffee, rainy afternoons, and anything that sparks creativity. I’m naturally quiet, but once I’m comfortable, I can talk about my favorite things endlessly. I believe in being kind, staying curious, and finding joy in small, unexpected moments.",
        "maligalig-card": "I’m the type of person who can spend hours lost in a book or suddenly get the urge to rearrange my entire room at 2 AM. I love warm coffee, rainy afternoons, and anything that sparks creativity. I’m naturally quiet, but once I’m comfortable, I can talk about my favorite things endlessly. I believe in being kind, staying curious, and finding joy in small, unexpected moments.",
        "rose-card": "I’m a simple person with oddly specific preferences. I like long walks, minimalist aesthetics, and movies that make me question my whole existence. I’m a planner by nature, but life keeps convincing me to just go with the flow more often. I enjoy meeting people who can keep up with deep conversations but also appreciate comfortable silence. Overall, I’m just trying to grow, stay grounded, and enjoy the journey.",
        "magsino-card": "I’m a simple person with oddly specific preferences. I like long walks, minimalist aesthetics, and movies that make me question my whole existence. I’m a planner by nature, but life keeps convincing me to just go with the flow more often. I enjoy meeting people who can keep up with deep conversations but also appreciate comfortable silence. Overall, I’m just trying to grow, stay grounded, and enjoy the journey."
    }

cards.forEach(card => {
    card.addEventListener("click", (e) => {
        console.log(descriptions["tosino-card"]);
        description.innerText = descriptions[card.id];

        cards.forEach(cardA => {
            cardA.classList.remove("active");
        })
        card.classList.add("active");
    })
})

const toggleActive = (cardId) => {

}