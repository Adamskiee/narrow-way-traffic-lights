<?php

$page_title = 'Landing page';
include './includes/header.php';
?>

<main class="container">
    <section class="row row-cols-1 row-cols-md-2 vh-100">
        <div class="col d-flex flex-column justify-content-center order-2 order-lg-1">
            <p>Introducing</p>
            <h2 class="header-color">Flow<span>Sync</span></h2>
            <p>
                When a road is under construction and only one lane is available, driving through can get confusing and stressful. FlowSync was created to make that experience simple, safe, and organized for everyone. 
                <br>
                Instead of drivers guessing who should go first, our system uses clear, easy-to-see traffic lights to guide cars from both directions one side at a time. It keeps traffic moving smoothly, prevents sudden stops, and helps protect workers on the road. 
                <br>
                Whether it's a short repair or a long-term project, the system ensures that cars can still pass through the area without chaos or long delays. It’s a reliable, user-friendly way to handle one-lane traffic during construction, keeping the road safe and stress-free for all drivers.
            </p>
            <button class="hero-btn" type="button">Get Started</button>
        </div>
        <div class="col d-flex flex-column justify-content-center order-1 order-lg-2" style="padding-inline: 100px;">
            <img
            src="assets/images/traffic-light.png"
            class="img-fluid mw-50"
            />
        </div>
    </section>
    <section id="tutorial">
        <div class="tutorials-header">
            <h2>Tutorials</h2>
        </div>
        <div class="row row-cols-1 row-cols-lg-2  align-items-center justify-content-center">
            <div class="col-lg-2 d-flex align-items-center">
                <h3>Step 1</h3>
            </div>
            <div class="col-lg-10">
                <img
                    src="assets/images/gray.png"
                    class="img-fluid rounded-top w-100"
                    alt=""
                />
                <p>First, contact the admin for the account creation, preparing your necessary personal information.</p>
            </div>
        </div>
        <div class="tutorials-content row row-cols-1 row-cols-lg-2 align-items-center justify-content-center">
            <div class="col col-lg-10 order-1">
                <img
                src="assets/images/gray.png"
                class="img-fluid rounded-top w-100"
                />
                <p>Second, login to the page using the account credentials.</p>
            </div>
            <div class="col col-lg-2 d-flex align-items-center justify-content-lg-end order-0 order-lg-2">
                <h3>Step 2</h3>
            </div>
        </div>
        <div class="tutorials-content row row-cols-1 row-cols-lg-2 align-items-center">
            <div class="col col-lg-2">
                <h3>Step 3</h3>
            </div>
            <div class="col col-lg-10">
                <img
                    src="assets/images/gray.png"
                    class="img-fluid rounded-top w-100"
                    alt=""
                />
                <p>Third, you may now use and control the traffic lights for road operations.</p>
            </div>
        </div>
    </section>
    <section id="about">
        <div class="row row-cols-1 row-cols-lg-2 min-vh-100 about__container" >
            <div class="col d-flex justify-content-lg-center justify-content-start flex-column about__content ">
                <h2 class="header-color" id="title">About <span>Us</span></h2>
                <p id="description">
                    We are a team of aspiring innovators committed to building smarter, safer, and more efficient traffic systems. Our goal is to develop technology that doesn't just monitor traffic—it understands it. By combining modern software development, real-time data processing, and forward-thinking design, we aim to reduce congestion, improve road safety, and help communities move better.
                    <br>
                    We believe that traffic solutions should be intuitive, adaptive, and built for the future. Whether it’s automated monitoring, intelligent alerts, or data-driven decision support, we’re focused on creating a system that makes urban mobility smoother for everyone.
                </p>
            </div>
            <div class="col card__container">
                <div class="about__card col" id="tosino-card">
                    <img src="assets/images/tosino.png" alt="" class="img-fluid rounded-circle object-fit-cover card__img">
                    <div>
                        <h3 class="card__name">Tosino,  <br><span>Adriele Matthew</span></h3>
                        <p class="card__role">Developer</p>
                    </div>
                </div>
                <div class="about__card col" id="rose-card">
                    <img src="assets/images/rose.jpg" alt="" class="img-fluid rounded-circle object-fit-cover card__img">
                    <div>
                        <h3 class="card__name">Rose,  <br><span>Jeric</span></h3>
                        <p class="card__role">Developer</p>
                    </div>
                </div>
                <div class="about__card col" id="maligalig-card">
                    <img src="assets/images/maligalig.jpg" alt="" class="img-fluid rounded-circle object-fit-cover card__img">
                    <div>
                        <h3 class="card__name">Maligalig,  <br><span>Ian</span></h3>
                        <p class="card__role">Developer</p>
                    </div>
                </div>
                <div class="about__card col" id="magsino-card">
                    <img src="assets/images/magsino.png" alt="" class="img-fluid rounded-circle object-fit-cover card__img">
                    <div>
                        <h3 class="card__name">Magsino,  <br><span>Marc Russel</span></h3>
                        <p class="card__role">Developer</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section id="contact">
        <div class="row row-cols-1 row-cols-lg-2 min-vh-100 " style="padding-top: 57px;">
            <div class="col d-flex justify-content-center  flex-column px-lg-5">
                <div>
                    <h2 class="header-color">Get in <span>Touch</span></h3>
                    <p>
                        Whether you have suggestions, questions, or feedback, we're always open to connect. <br>
                        Send us a message and we'll get back to you shortly.
                    </p>
                </div>
                <div class="d-flex justify-content-between pt-2">
                    <div class="contact__profile text-center">
                        <img 
                        src="assets/images/tosino.png" 
                        class="profile__img object-fit-cover img-fluid rounded-circle" 
                        alt=""
                        data-bs-toggle="popover" 
                        data-bs-placement="bottom"
                        data-bs-content="
                            <div class='social-links'>
                                <a href='https://github.com/adriele' target='_blank' class='social-link'><img src='assets/images/github.svg' height='25' width='25' /></a><br>
                                <a href='https://github.com/adriele' target='_blank' class='social-link'><img src='assets/images/facebook.svg' height='25' width='25' /></a><br>
                                <a href='https://linkedin.com/in/adriele' target='_blank' class='social-link'><img src='assets/images/linkedln.svg' height='25' width='25' /></a><br>
                            </div>
                        "
                        data-bs-html="true">
                        <h4>Adriele</h4>
                    </div>
                    <div class="contact__profile text-center">
                        <img src="assets/images/maligalig.jpg" class="profile__img object-fit-cover img-fluid rounded-circle" alt=""data-bs-toggle="popover" 
                        data-bs-placement="bottom"
                        data-bs-content="
                            <div class='social-links'>
                                <a href='https://github.com/adriele' target='_blank' class='social-link'><img src='assets/images/github.svg' height='25' width='25' /></a><br>
                                <a href='https://github.com/adriele' target='_blank' class='social-link'><img src='assets/images/facebook.svg' height='25' width='25' /></a><br>
                                <a href='https://linkedin.com/in/adriele' target='_blank' class='social-link'><img src='assets/images/linkedln.svg' height='25' width='25' /></a><br>
                            </div>
                        "
                        data-bs-html="true">
                        <h4>Ian</h4>
                    </div>
                    <div class="contact__profile text-center">
                        <img src="assets/images/rose.jpg" class="profile__img object-fit-cover img-fluid rounded-circle" alt=""data-bs-toggle="popover" 
                        data-bs-placement="bottom"
                        data-bs-content="
                            <div class='social-links'>
                                <a href='https://github.com/adriele' target='_blank' class='social-link'><img src='assets/images/github.svg' height='25' width='25' /></a><br>
                                <a href='https://github.com/adriele' target='_blank' class='social-link'><img src='assets/images/facebook.svg' height='25' width='25' /></a><br>
                                <a href='https://linkedin.com/in/adriele' target='_blank' class='social-link'><img src='assets/images/linkedln.svg' height='25' width='25' /></a><br>
                            </div>
                        "
                        data-bs-html="true">
                        <h4>Jeric</h4>
                    </div>
                    <div class="contact__profile text-center">
                        <img src="assets/images/magsino.png" class="profile__img object-fit-cover img-fluid rounded-circle" alt=""data-bs-toggle="popover" 
                        data-bs-placement="bottom"
                        data-bs-content="
                            <div class='social-links'>
                                <a href='https://github.com/adriele' target='_blank' class='social-link'><img src='assets/images/github.svg' height='25' width='25' /></a><br>
                                <a href='https://github.com/adriele' target='_blank' class='social-link'><img src='assets/images/facebook.svg' height='25' width='25' /></a><br>
                                <a href='https://linkedin.com/in/adriele' target='_blank' class='social-link'><img src='assets/images/linkedln.svg' height='25' width='25' /></a><br>
                            </div>
                        "
                        data-bs-html="true">
                        <h4>Marc</h4>
                    </div>
                </div>
            </div>
            <div class="col d-flex justify-content-center  flex-column">
                <div class="mb-3">
                    <label for="name" class="form-label">Name</label>
                    <input
                        type="text"
                        class="form-control contact__input"
                        name="name"
                        id="name"
                        placeholder="e.g. Juan"
                    />
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input
                        type="email"
                        class="form-control contact__input"
                        name="email"
                        id="email"
                        placeholder="e.g. juan@gmail.com"
                    />
                </div>
                <div class="mb-3">
                    <label for="phone" class="form-label">Phone</label>
                    <input
                        type="text"
                        class="form-control contact__input"
                        name="phone"
                        id="phone"
                        placeholder="e.g. juan@gmail.com"
                    />
                </div>
                <div class="mb-3">
                    <label for="message" class="form-label">Message</label>
                    <textarea class="form-control contact__input" name="message" id="message" rows="3" placeholder="Message..."></textarea>
                </div>
                <button type="submit">Submit</button>
            </div>
        </div>
    </section>
</main>

<script src="<?= BASE_URL ?>/assets/js/about.js"></script>
<script src="<?= BASE_URL ?>/assets/js/contact.js"></script>
<?php
include BASE_PATH . "/includes/footer.php"
?>