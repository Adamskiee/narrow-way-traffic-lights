<?php

$page_title = 'Landing page';
include './includes/header.php';
?>
<main class="flex flex-col">
    <section class="section-bg w-full h-screen">
        <div class="container w-7xl h-full mx-auto grid grid-cols-2 justify-center">
            <div class="flex justify-center flex-col gap-5">
                <span class="text-white text-3xl">Introducing</span>
                <h2 class="text-orange text-6xl font-bold">Flow<span class="text-green">Sync</span></h2>
                <p class="text-white">When a road is under construction and only one lane is available, driving through can get confusing and stressful. FlowSync was created to make that experience simple, safe, and organized for everyone.
                Instead of drivers guessing who should go first, our system uses clear, easy-to-see traffic lights to guide cars from both directions one side at a time. It keeps traffic moving smoothly, prevents sudden stops, and helps protect workers on the road.
                Whether it's a short repair or a long-term project, the system ensures that cars can still pass through the area without chaos or long delays. It's a reliable, user-friendly way to handle one-lane traffic during construction, keeping the road safe and stress-free for all drivers.</p>
                <button type="button" class="text-white bg-green focus:outline-none font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5 rounded-xl w-fit">Get Started</button>
            </div>
            <div class="flex justify-center flex-col pt-20">
                <img src="<?= BASE_URL ?>/assets/img/traffic-icon.png" alt="" class="h-auto max-w-full">
            </div>
        </div>
    </section>
    <section class="section-bg w-full h-screen" id="tutorial">
        <h2>Tutorial</h2>
    </section>
    <section class="section-bg w-full h-screen" id="about">
        <div class="container w-7xl h-full mx-auto grid grid-cols-2 justify-center pt-40 pb-30 gap-5">
            <div class="flex flex-col justify-center gap-10">
                <h2 class="text-orange text-6xl font-bold">About <span class="text-green">Us</span></h2>
                <p class="text-white">We are a team of aspiring innovators committed to building smarter, safer, and more efficient traffic systems. Our goal is to develop technology that doesn’t just monitor traffic—it understands it. By combining modern software development, real-time data processing, and forward-thinking design, we aim to reduce congestion, improve road safety, and help communities move better.<br/>
                We believe that traffic solutions should be intuitive, adaptive, and built for the future. Whether it's automated monitoring, intelligent alerts, or data-driven decision support, we're focused on creating a system that makes urban mobility smoother for everyone.</p>
            </div>
            <div class="grid grid-cols-2 grid-rows-2 gap-16">
                <div class="card card-active">
                    <img src="<?= BASE_URL ?>/assets/img/adriele-pic.png" alt="">
                    <h3><span class="last-name">Tosino,</span><span class="first-name"> Adriele Matthew G.</span></h3>
                    <span class="font-extralight text-xl text-white">Developer</span>
                </div>
                <div class="card">
                    <img src="<?= BASE_URL ?>/assets/img/magsino-pic.png" alt="">
                    <h3><span class="last-name">Magsino,</span><span class="first-name">Marc Russel</span></h3>
                    <span class="font-extralight text-xl text-white">Project Manager</span>
                </div>
                <div class="card">
                    <img src="<?= BASE_URL ?>/assets/img/adriele-pic.png" alt="">
                    <h3><span class="last-name">Rose,</span><span class="first-name">Jeric</span></h3>
                    <span class="font-extralight text-xl text-white">Designer</span>
                </div>
                <div class="card">
                    <img src="<?= BASE_URL ?>/assets/img/adriele-pic.png" alt="">
                    <h3><span class="last-name">Maligalig,</span><span class="first-name">Ian</span></h3>
                    <span class="font-extralight text-xl text-white">Asst. Project Manager</span>
                </div>
            </div>
        </div>
    </section>
    <section class="section-bg w-full h-screen" id="contact">
        <div class="w-7xl h-full mx-auto grid grid-cols-2 justify-center pt-40 pb-30 gap-5">
            <div class="flex flex-col justify-center gap-5 border-r border-r-white px-20">
                <h2 class="text-orange text-6xl font-bold">Get in <span class="text-green">Touch</span></h2>
                <p class="text-white">Whether you have suggestions, questions, or feedback, we're always open to connect. <br/> Send us a message and we'll get back to you shortly.</p>
                <p class="text-white"></p>
                <div class="grid-cols-4 grid">
                    <div class="flex flex-col items-center">
                        <img src="<?= BASE_URL ?>/assets/img/adriele-pic.png" class="w-[100px] h-[100px] max-w-full object-cover rounded-full border-3 border-orange bg-gray" alt="">
                        <span class="text-xl font-bold text-orange">Adriele</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <img src="<?= BASE_URL ?>/assets/img/adriele-pic.png" class="w-[100px] h-[100px] max-w-full object-cover rounded-full border-3 border-orange bg-gray" alt="">
                        <span class="text-xl font-bold text-orange">Adriele</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <img src="<?= BASE_URL ?>/assets/img/adriele-pic.png" class="w-[100px] h-[100px] max-w-full object-cover rounded-full border-3 border-orange bg-gray" alt="">
                        <span class="text-xl font-bold text-orange">Adriele</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <img src="<?= BASE_URL ?>/assets/img/adriele-pic.png" class="w-[100px] h-[100px] max-w-full object-cover rounded-full border-3 border-orange bg-gray" alt="">
                        <span class="text-xl font-bold text-orange">Adriele</span>
                    </div>
                </div>
            </div>
            <div class="flex flex-col justify-center gap-5 px-20" >
                <form action="">
                    <div class="flex flex-col justify-center gap-5">
                        <div>
                            <label for="name" class="contact__label">Name</label>
                            <input type="text" name="name" id="name" class="contact__input" placeholder="Name" required />
                        </div>
                        <div>
                            <label for="email" class="contact__label">Email</label>
                            <input type="text" id="email" name="email" class="contact__input" placeholder="Email" required />
                        </div>
                        <div>
                            <label for="phone-number" class="contact__label">Phone Number</label>
                            <input type="text" id="phone-number" name="phone-number" class="contact__input" placeholder="Phone Number" required />
                        </div>
                        <div>
                            <label for="message" class="contact__label">Your message</label>
                            <textarea id="message" name="message" rows="4" class="contact__textarea" placeholder="Message"></textarea>
                        </div>
                        <button type="submit" class="e">Submit</button>
                    </div>
                </form>
            </div>
        </div>    
    </section>
</main>

<?php
include BASE_PATH . "/includes/footer.php"
?>