/* ==========================================================================
   Syed Mohammad Rayees - DevOps Engineer Portfolio JavaScript Logic
   Includes: Interactive Canvas Engine, DevSecOps Simulator, CLI Shell, & Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    initTypewriter();
    initTerminalSimulation();
    initPipelineSimulator();
    initCLIShell();
    initResumeModal();
    initSkillsTabs();
    initCounters();
    initMobileNav();
    initScrollObserver();
});

/* ==========================================================================
   1. Interactive Particle Network Canvas
   ========================================================================== */
function initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 45;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 2 + 1;
            this.alpha = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(6, 182, 212, ${this.alpha})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(6, 182, 212, 0.8)';
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 140) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(6, 182, 212, ${0.15 * (1 - dist / 140)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   2. Typewriter Effect
   ========================================================================== */
function initTypewriter() {
    const typewriterEl = document.getElementById('typewriter');
    if (!typewriterEl) return;

    const phrases = [
        "DevOps Engineer",
        "AWS & Azure Cloud Specialist",
        "CI/CD Pipeline Automation",
        "Shift-Left DevSecOps Engineer",
        "Docker & Kubernetes Specialist"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentPhrase.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 400;
        }

        setTimeout(type, speed);
    }

    type();
}

/* ==========================================================================
   3. Live Terminal Simulation in Hero
   ========================================================================== */
function initTerminalSimulation() {
    const terminalBody = document.getElementById('hero-terminal-body');
    if (!terminalBody) return;

    const commands = [
        { cmd: "terraform apply -auto-approve", output: "✓ Azure Infrastructure Provisioned (14 Resources Created)", type: "success" },
        { cmd: "trivy image scan school-mgmt:v1.2", output: "✓ 0 Critical, 0 High Vulnerabilities found!", type: "success" },
        { cmd: "gitleaks detect --source=.", output: "✓ Gitleaks Audit: Zero Secrets or API Keys leaked", type: "success" },
        { cmd: "kubectl get pods -n production", output: "school-mgmt-frontend-79f8b READY 1/1 Running\nschool-mgmt-backend-56bc9 READY 1/1 Running\nredis-cache-84df1 READY 1/1 Running", type: "info" }
    ];

    let index = 0;

    function cycleTerminalCommands() {
        const item = commands[index];
        
        // Remove previous dynamic lines if too long
        const lines = terminalBody.querySelectorAll('.terminal-line');
        if (lines.length > 8) {
            lines[0].remove();
            lines[1].remove();
        }

        const cmdLine = document.createElement('div');
        cmdLine.className = 'terminal-line';
        cmdLine.innerHTML = `<span class="prompt">rayees@cluster:~$</span> <span class="cmd">${item.cmd}</span>`;

        const outputLine = document.createElement('div');
        outputLine.className = `terminal-line ${item.type}`;
        outputLine.innerText = item.output;

        // Insert before the prompt line
        const promptLine = terminalBody.querySelector('.prompt-line');
        terminalBody.insertBefore(cmdLine, promptLine);
        
        setTimeout(() => {
            terminalBody.insertBefore(outputLine, promptLine);
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }, 500);

        index = (index + 1) % commands.length;
    }

    setInterval(cycleTerminalCommands, 4000);
}

/* ==========================================================================
   4. DevSecOps Interactive Pipeline Simulator
   ========================================================================== */
function initPipelineSimulator() {
    const logContainer = document.getElementById('pipeline-log-content');
    const stepNumEl = document.getElementById('current-step-num');
    const stepNameEl = document.getElementById('current-step-name');
    const runFullBtn = document.getElementById('run-full-pipeline-btn');
    const clearBtn = document.getElementById('clear-pipeline-logs');

    if (!logContainer) return;

    const pipelineSteps = {
        1: {
            title: "Git Commit & Webhook Trigger",
            logs: [
                { type: "info", text: "[Git] Webhook push received for branch: main (Commit: 9b2d10f)" },
                { type: "success", text: "[Git] Triggered GitHub Actions & Jenkins self-hosted runner." }
            ]
        },
        2: {
            title: "SonarQube SAST Static Code Analysis",
            logs: [
                { type: "info", text: "[SonarQube] Running sonar-scanner for Java application..." },
                { type: "info", text: "[SonarQube] Analyzing 148 source files, checking code smells & vulnerabilities..." },
                { type: "success", text: "[SonarQube] Quality Gate Status: PASSED (Bugs: 0, Code Smells: 0, Coverage: 92.4%)" }
            ]
        },
        3: {
            title: "Trivy Vulnerability & File System Scan",
            logs: [
                { type: "info", text: "[Trivy] Scanning filesystem dependencies & base Docker image: openjdk:17-alpine..." },
                { type: "success", text: "[Trivy] 0 Critical Vulnerabilities, 0 High Vulnerabilities found in container layers!" }
            ]
        },
        4: {
            title: "Gitleaks Secret Detection Audit",
            logs: [
                { type: "info", text: "[Gitleaks] Scanning commit history for AWS keys, Azure tokens, private SSH keys..." },
                { type: "success", text: "[Gitleaks] Secret audit complete. 0 Secrets detected. Push validated!" }
            ]
        },
        5: {
            title: "Docker Image Containerization & Push",
            logs: [
                { type: "info", text: "[Docker] Executing 'docker build -t rayees1907/board-game-app:v2026.1 .'" },
                { type: "info", text: "[Docker] Layer cache matched (8/8). Image size optimized to 112MB." },
                { type: "success", text: "[Docker Hub] Image successfully pushed to docker.io/rayees1907/board-game-app:latest" }
            ]
        },
        6: {
            title: "Azure VM Automated Release Deployment",
            logs: [
                { type: "info", text: "[Azure] Connecting via SSH to Azure Virtual Machine (10.0.1.4)..." },
                { type: "info", text: "[Nginx] Reloading reverse proxy load balancing configuration..." },
                { type: "success", text: "[Azure Deployment] Deployment SUCCESSFUL! All 3/3 microservices active & healthy." }
            ]
        }
    };

    // Node click handlers
    document.querySelectorAll('.pipeline-node').forEach(node => {
        node.addEventListener('click', () => {
            const stepId = parseInt(node.getAttribute('data-step'));
            executeStep(stepId);
        });
    });

    function executeStep(stepId) {
        // Highlight active step
        document.querySelectorAll('.pipeline-node').forEach(n => n.classList.remove('active'));
        const targetNode = document.getElementById(`step-node-${stepId}`);
        if (targetNode) {
            targetNode.classList.add('active');
            const statusBadge = targetNode.querySelector('.node-status');
            statusBadge.className = 'node-status badge-success';
            statusBadge.innerText = 'PASSED';
        }

        const stepData = pipelineSteps[stepId];
        if (stepData) {
            stepNumEl.textContent = stepId;
            stepNameEl.textContent = stepData.title;

            const timeStr = new Date().toLocaleTimeString();
            stepData.logs.forEach(log => {
                const p = document.createElement('p');
                p.className = `log-line ${log.type}`;
                p.innerHTML = `[${timeStr}] ${log.text}`;
                logContainer.appendChild(p);
            });
            logContainer.scrollTop = logContainer.scrollHeight;
        }
    }

    // Run Full Pipeline sequentially
    if (runFullBtn) {
        runFullBtn.addEventListener('click', async () => {
            runFullBtn.disabled = true;
            runFullBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Executing Pipeline...`;

            for (let i = 1; i <= 6; i++) {
                const node = document.getElementById(`step-node-${i}`);
                if (node) {
                    const statusBadge = node.querySelector('.node-status');
                    statusBadge.className = 'node-status badge-running';
                    statusBadge.innerText = 'RUNNING';
                }
                executeStep(i);
                await new Promise(res => setTimeout(res, 1200));
            }

            runFullBtn.disabled = false;
            runFullBtn.innerHTML = `<i class="fa-solid fa-play"></i> Run Complete Pipeline`;
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            logContainer.innerHTML = `<p class="log-line muted">[System] Console output logs cleared. Ready for next pipeline trigger.</p>`;
        });
    }
}

/* ==========================================================================
   5. Interactive CLI Shell Modal
   ========================================================================= */
function initCLIShell() {
    const cliTrigger = document.getElementById('cli-trigger');
    const cliModal = document.getElementById('cli-modal');
    const cliClose = document.getElementById('cli-close');
    const cliCloseX = document.getElementById('cli-close-x');
    const cliInput = document.getElementById('cli-input');
    const cliOutput = document.getElementById('cli-output');

    if (!cliModal || !cliInput) return;

    function openCLI() {
        cliModal.classList.add('active');
        cliInput.focus();
    }

    function closeCLI() {
        cliModal.classList.remove('active');
    }

    if (cliTrigger) cliTrigger.addEventListener('click', openCLI);
    if (cliClose) cliClose.addEventListener('click', closeCLI);
    if (cliCloseX) cliCloseX.addEventListener('click', closeCLI);

    cliModal.addEventListener('click', (e) => {
        if (e.target === cliModal) closeCLI();
    });

    cliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawCmd = cliInput.value.trim();
            if (rawCmd) {
                processCommand(rawCmd);
            }
            cliInput.value = '';
        }
    });

    function processCommand(cmd) {
        const lowerCmd = cmd.toLowerCase();

        // Print entered command
        const cmdLine = document.createElement('div');
        cmdLine.innerHTML = `<span class="cli-prompt">rayees@devops-shell:~$</span> <span>${escapeHtml(cmd)}</span>`;
        cliOutput.appendChild(cmdLine);

        const responseEl = document.createElement('div');
        responseEl.className = 'cli-response';

        switch (lowerCmd) {
            case 'help':
                responseEl.innerHTML = `
                    <p class="text-cyan">Available DevOps Commands:</p>
                    <p>• <span class="highlight-cmd">resume</span> / <span class="highlight-cmd">cv</span> - Open formatted resume document modal</p>
                    <p>• <span class="highlight-cmd">skills</span> - Display cloud & technical skills breakdown</p>
                    <p>• <span class="highlight-cmd">projects</span> - View featured cloud deployment projects</p>
                    <p>• <span class="highlight-cmd">experience</span> - View AKHM DevOps internship history</p>
                    <p>• <span class="highlight-cmd">certifications</span> - Show AWS & DevOps certifications</p>
                    <p>• <span class="highlight-cmd">contact</span> - Show direct contact details</p>
                    <p>• <span class="highlight-cmd">deploy</span> - Run simulated deployment script</p>
                    <p>• <span class="highlight-cmd">clear</span> - Clear terminal screen</p>
                    <p>• <span class="highlight-cmd">exit</span> - Close CLI window</p>
                `;
                break;
            case 'resume':
            case 'cv':
                responseEl.innerHTML = `<p class="text-success"><i class="fa-solid fa-file-pdf"></i> Opening Syed Mohammad Rayees formatted Resume...</p>`;
                setTimeout(() => {
                    openResumeModal();
                }, 400);
                break;
            case 'skills':
                responseEl.innerHTML = `
                    <p class="text-success">Cloud Platforms:</p> AWS (EC2, S3, IAM, VPC, RDS), Microsoft Azure (VMs, Blob Storage, DevOps)
                    <p class="text-success">CI/CD & Containers:</p> Jenkins, GitHub Actions, GitLab, Docker, Docker Compose, Kubernetes
                    <p class="text-success">IaC & DevSecOps:</p> Terraform, Nginx, SonarQube, Trivy, Gitleaks, Python, Bash, Git, Linux
                `;
                break;
            case 'projects':
                responseEl.innerHTML = `
                    <p class="text-cyan">1. School Management System — 3-Tier Azure Deployment</p>
                    <p class="text-muted">Architected 3-tier containerized system with Nginx, PostgreSQL, Redis, Azure Blob Storage & Jenkins CI/CD.</p>
                    <br>
                    <p class="text-cyan">2. Java Board Game — DevSecOps Pipeline</p>
                    <p class="text-muted">GitHub Actions pipeline with SonarQube SAST, Trivy vulnerability scanning & Gitleaks secret detection.</p>
                `;
                break;
            case 'experience':
                responseEl.innerHTML = `
                    <p class="text-cyan">DevOps Engineer Intern | AKHM Software Solutions Pvt Ltd, Bangalore (Dec 2025 - May 2026)</p>
                    <p>Designed Jenkins CI/CD pipelines, automated Azure VM rollouts, configured Nginx load balancing & containerized microservices.</p>
                `;
                break;
            case 'certifications':
                responseEl.innerHTML = `
                    <p>✓ AWS Certified Solutions Architect – Associate (upGrad)</p>
                    <p>✓ DevOps Engineer Internship Certificate (AKHM Software Solutions)</p>
                `;
                break;
            case 'contact':
                responseEl.innerHTML = `
                    <p>Email: <a href="mailto:syedrayees1907@gmail.com" class="text-cyan">syedrayees1907@gmail.com</a></p>
                    <p>Phone: +91-9640728610</p>
                    <p>LinkedIn: <a href="https://linkedin.com/in/rayees-devops" target="_blank" class="text-cyan">linkedin.com/in/rayees-devops</a></p>
                    <p>GitHub: <a href="https://github.com/Rayees1907" target="_blank" class="text-cyan">github.com/Rayees1907</a></p>
                `;
                break;
            case 'deploy':
                responseEl.innerHTML = `<p class="text-success"><i class="fa-solid fa-spinner fa-spin"></i> Triggering Azure Terraform Plan & Deployment... SUCCESS!</p>`;
                break;
            case 'clear':
                cliOutput.innerHTML = '';
                return;
            case 'exit':
                closeCLI();
                return;
            case 'sudo':
            case 'sudo rm -rf /':
                responseEl.innerHTML = `<p class="text-danger">Nice try! Permission denied: Rayees security rules strictly enforced.</p>`;
                break;
            default:
                responseEl.innerHTML = `<p class="text-danger">Command not recognized: '${escapeHtml(cmd)}'. Type <span class="highlight-cmd">help</span> for command list.</p>`;
                break;
        }

        cliOutput.appendChild(responseEl);
        cliOutput.scrollTop = cliOutput.scrollHeight;
    }

    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
}

/* ==========================================================================
   Resume Modal Initialization & Controls
   ========================================================================== */
function openResumeModal() {
    const resumeModal = document.getElementById('resume-modal');
    if (resumeModal) resumeModal.classList.add('active');
}

function initResumeModal() {
    const resumeModal = document.getElementById('resume-modal');
    const resumeTrigger = document.getElementById('resume-trigger');
    const heroResumeBtn = document.getElementById('hero-resume-btn');
    const resumeCloseX = document.getElementById('resume-close-x');

    function closeResumeModal() {
        if (resumeModal) resumeModal.classList.remove('active');
    }

    if (resumeTrigger) resumeTrigger.addEventListener('click', openResumeModal);
    if (heroResumeBtn) heroResumeBtn.addEventListener('click', openResumeModal);
    if (resumeCloseX) resumeCloseX.addEventListener('click', closeResumeModal);

    if (resumeModal) {
        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) closeResumeModal();
        });
    }
}

/* ==========================================================================
   6. Skills Category Filter Tabs
   ========================================================================== */
function initSkillsTabs() {
    const tabs = document.querySelectorAll('#skills-tabs .tab-btn');
    const cards = document.querySelectorAll('#skills-container .skill-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const category = tab.getAttribute('data-tab');

            cards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   7. Animated Counter Statistics
   ========================================================================== */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;

    function startCounters() {
        const heroSection = document.getElementById('hero');
        if (!heroSection) return;

        const rect = heroSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight && !animated) {
            animated = true;

            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const duration = 1500;
                const increment = target / (duration / 16);
                let current = 0;

                const updateCount = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.ceil(current);
                        setTimeout(updateCount, 16);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCount();
            });
        }
    }

    window.addEventListener('scroll', startCounters);
    startCounters();
}

/* ==========================================================================
   8. Mobile Navigation Toggle
   ========================================================================== */
function initMobileNav() {
    const toggleBtn = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (toggleBtn && navLinks) {
        toggleBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
}

/* ==========================================================================
   9. Scroll Observer, Navbar State & Scroll Reveal Animations
   ========================================================================== */
function initScrollObserver() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar Scroll Shadow
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // IntersectionObserver for Butter-Smooth Reveal Animations
    const revealElements = document.querySelectorAll('.glass-card, .section-header, .stat-card, .timeline-item, .cert-card, .edu-card, .contact-card, .contact-form-col');
    
    revealElements.forEach(el => {
        if (!el.classList.contains('reveal') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
            el.classList.add('reveal');
        }
    });

    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        revealObserver.observe(el);
    });
}

/* Contact Form Functional Submission Handler */
function handleFormSubmit() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    const submitBtn = document.getElementById('form-submit-btn');
    const feedback = document.getElementById('form-feedback');

    if (!name || !email || !subject || !message) return;

    if (submitBtn && feedback) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Dispatching Message...`;

        // Construct pre-filled mailto URL for direct delivery
        const mailSubject = encodeURIComponent(`[Portfolio Query] ${subject}`);
        const mailBody = encodeURIComponent(`Sender Name: ${name}\nSender Email: ${email}\n\nMessage:\n${message}`);
        const mailtoUrl = `mailto:syedrayees1907@gmail.com?subject=${mailSubject}&body=${mailBody}`;

        setTimeout(() => {
            // Trigger user's mail client (Gmail, Outlook, Apple Mail)
            window.location.href = mailtoUrl;

            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Send Message`;
            feedback.style.display = 'block';
            feedback.className = 'form-feedback success';
            feedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> <strong>Message Ready!</strong> Your default email app opened with pre-filled content for <strong>syedrayees1907@gmail.com</strong>.`;
            
            if (document.getElementById('contact-form')) {
                document.getElementById('contact-form').reset();
            }
        }, 800);
    }
}
