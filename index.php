<?php

$page_title = 'Landing page';
include './includes/header.php';
?>

<main class="container">
    <section class="hero-section position-relative overflow-hidden">
        <div class="hero-background">
            <!-- Animated background elements -->
            <div class="traffic-light-bg"></div>
            <div class="road-pattern"></div>
        </div>
        
        <div class="container">
            <div class="row min-vh-100 align-items-center g-5">
                <!-- Hero Content -->
                <div class="col-lg-6 order-2 order-lg-1">
                    <div class="hero-content">
                        <div class="hero-badge">
                            <i class="fas fa-traffic-light me-2"></i>
                            <span>Introducing</span>
                        </div>
                        
                        <h1 class="hero-title">
                            Flow<span class="text-gradient">Sync</span>
                        </h1>
                        
                        <p class="hero-description">
                            When a road is under construction and only one lane is available, driving through can get confusing and stressful. <strong>FlowSync</strong> was created to make that experience simple, safe, and organized for everyone.
                        </p>
                        
                        <div class="hero-features">
                            <div class="feature-item">
                                <i class="fas fa-shield-alt"></i>
                                <span>Safe & Reliable</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-clock"></i>
                                <span>Real-time Control</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-cogs"></i>
                                <span>Smart Automation</span>
                            </div>
                        </div>
                        
                        <div class="hero-actions">
                            <a href="<?= BASE_URL ?>/login.php" class="btn btn-hero-primary">
                                <i class="fas fa-rocket me-2"></i>
                                <span>Get Started</span>
                                <div class="btn-glow"></div>
                            </a>
                            <a href="#tutorial" class="btn btn-hero-secondary">
                                <i class="fas fa-play me-2"></i>
                                <span>Learn More</span>
                            </a>
                        </div>
                        
                        <div class="hero-stats">
                            <div class="stat-item">
                                <div class="stat-number">99.9%</div>
                                <div class="stat-label">Uptime</div>
                            </div>
                            <div class="stat-divider"></div>
                            <div class="stat-item">
                                <div class="stat-number">24/7</div>
                                <div class="stat-label">Monitoring</div>
                            </div>
                            <div class="stat-divider"></div>
                            <div class="stat-item">
                                <div class="stat-number">Instant</div>
                                <div class="stat-label">Response</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Hero Visual -->
                <div class="col-lg-6 order-1 order-lg-2">
                    <div class="hero-visual">
                        <div class="traffic-light-container">
                            <img src="assets/images/traffic-light.png" 
                                 class="img-fluid traffic-light-img" 
                                 alt="FlowSync Traffic Light">
                            
                            <!-- Animated elements -->
                            <div class="light-glow red-glow"></div>
                            <div class="light-glow green-glow"></div>
                            
                            <!-- Status indicators -->
                            <div class="status-card">
                                <div class="status-item">
                                    <div class="status-indicator active"></div>
                                    <span>System Online</span>
                                </div>
                                <div class="status-item">
                                    <div class="status-indicator"></div>
                                    <span>Auto Mode</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Floating elements -->
                        <div class="floating-card card-1">
                            <i class="fas fa-video"></i>
                            <span>Live Camera Feed</span>
                        </div>
                        <div class="floating-card card-2">
                            <i class="fas fa-chart-line"></i>
                            <span>Traffic Analytics</span>
                        </div>
                        <div class="floating-card card-3">
                            <i class="fas fa-mobile-alt"></i>
                            <span>Remote Control</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Scroll indicator -->
        <div class="scroll-indicator">
            <div class="scroll-arrow">
                <i class="fas fa-chevron-down"></i>
            </div>
            <span>Scroll to explore</span>
        </div>
    </section>
    <section id="tutorial" class="py-5">
        <div class="container">
            <!-- Section Header -->
            <div class="tutorial-header text-center mb-5">
                <h2 class="header-color mb-3">
                    <i class="fas fa-graduation-cap text-primary me-3"></i>
                    How It <span>Works</span>
                </h2>
                <p class="text-muted fs-5">Get started with FlowSync in three simple steps</p>
            </div>

            <!-- Tutorial Steps -->
            <div class="tutorial-steps">
                <!-- Step 1 -->
                <div class="tutorial-step mb-5" data-step="1">
                    <div class="row align-items-center g-4">
                        <div class="col-lg-2 text-center">
                            <div class="step-number">
                                <span>01</span>
                            </div>
                            <h3 class="step-title mt-3">Setup</h3>
                        </div>
                        <div class="col-lg-10">
                            <div class="step-content-card">
                                <div class="row g-0">
                                    <div class="col-md-6">
                                        <div class="step-image-container">
                                            <img src="assets/images/tutorial-step1.png" 
                                                class="img-fluid step-image" 
                                                alt="Account Setup"
                                                loading="lazy">
                                            <div class="image-overlay">
                                                <i class="fas fa-user-plus"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="step-text">
                                            <h4>Account Registration</h4>
                                            <p>Contact our system administrator to create your account. Prepare your personal information including name, email, and contact details for quick account setup.</p>
                                            <div class="step-features">
                                                <div class="feature-item">
                                                    <i class="fas fa-check-circle text-success me-2"></i>
                                                    Secure account creation
                                                </div>
                                                <div class="feature-item">
                                                    <i class="fas fa-check-circle text-success me-2"></i>
                                                    Admin verification process
                                                </div>
                                                <div class="feature-item">
                                                    <i class="fas fa-check-circle text-success me-2"></i>
                                                    Personal credentials setup
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Step 2 -->
                <div class="tutorial-step mb-5" data-step="2">
                    <div class="row align-items-center g-4">
                        <div class="col-lg-10 order-1 order-lg-0">
                            <div class="step-content-card">
                                <div class="row g-0">
                                    <div class="col-md-6 order-1 order-md-0">
                                        <div class="step-text">
                                            <h4>System Access</h4>
                                            <p>Login to the FlowSync dashboard using your provided credentials. Access the intuitive control panel designed for efficient traffic management.</p>
                                            <div class="step-features">
                                                <div class="feature-item">
                                                    <i class="fas fa-check-circle text-success me-2"></i>
                                                    Secure authentication
                                                </div>
                                                <div class="feature-item">
                                                    <i class="fas fa-check-circle text-success me-2"></i>
                                                    User-friendly interface
                                                </div>
                                                <div class="feature-item">
                                                    <i class="fas fa-check-circle text-success me-2"></i>
                                                    Real-time dashboard
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 order-0 order-md-1">
                                        <div class="step-image-container">
                                            <img src="assets/images/tutorial-step2.png" 
                                                class="img-fluid step-image" 
                                                alt="Login Process"
                                                loading="lazy">
                                            <div class="image-overlay">
                                                <i class="fas fa-sign-in-alt"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-2 text-center order-0 order-lg-1">
                            <div class="step-number">
                                <span>02</span>
                            </div>
                            <h3 class="step-title mt-3">Login</h3>
                        </div>
                    </div>
                </div>

                <!-- Step 3 -->
                <div class="tutorial-step mb-5" data-step="3">
                    <div class="row align-items-center g-4">
                        <div class="col-lg-2 text-center">
                            <div class="step-number">
                                <span>03</span>
                            </div>
                            <h3 class="step-title mt-3">Control</h3>
                        </div>
                        <div class="col-lg-10">
                            <div class="step-content-card">
                                <div class="row g-0">
                                    <div class="col-md-6">
                                        <div class="step-image-container">
                                            <img src="assets/images/tutorial-step3.png" 
                                                class="img-fluid step-image" 
                                                alt="Traffic Control"
                                                loading="lazy">
                                            <div class="image-overlay">
                                                <i class="fas fa-traffic-light"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="step-text">
                                            <h4>Traffic Management</h4>
                                            <p>Take full control of traffic light operations. Switch between manual and automatic modes, monitor real-time camera feeds, and ensure smooth traffic flow.</p>
                                            <div class="step-features">
                                                <div class="feature-item">
                                                    <i class="fas fa-check-circle text-success me-2"></i>
                                                    Manual & auto control modes
                                                </div>
                                                <div class="feature-item">
                                                    <i class="fas fa-check-circle text-success me-2"></i>
                                                    Live camera monitoring
                                                </div>
                                                <div class="feature-item">
                                                    <i class="fas fa-check-circle text-success me-2"></i>
                                                    Traffic flow optimization
                                                </div>
                                            </div>
                                            <div class="step-cta mt-4">
                                                <a href="<?= BASE_URL ?>/login.php" class="btn btn-get-started">
                                                    <i class="fas fa-rocket me-2"></i>
                                                    Start Managing Traffic
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tutorial Navigation -->
            <div class="tutorial-navigation text-center mt-5">
                <div class="step-indicators">
                    <button class="step-indicator active" data-target="1">
                        <span class="indicator-number">1</span>
                        <span class="indicator-label">Setup</span>
                    </button>
                    <button class="step-indicator" data-target="2">
                        <span class="indicator-number">2</span>
                        <span class="indicator-label">Login</span>
                    </button>
                    <button class="step-indicator" data-target="3">
                        <span class="indicator-number">3</span>
                        <span class="indicator-label">Control</span>
                    </button>
                </div>
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
<script src="<?= BASE_URL ?>/assets/js/tutorial.js"></script>
<script src="<?= BASE_URL ?>/assets/js/contact.js"></script>
<?php
include BASE_PATH . "/includes/footer.php"
?>