'use strict';

//Opening or closing side bar

const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

sidebarBtn.addEventListener("click", function() {elementToggleFunc(sidebar); })

//Activating Modal-testimonial

const testimonialsItem = document.querySelectorAll('[data-testimonials-item]');
const modalContainer = document.querySelector('[data-modal-container]');
const modalCloseBtn = document.querySelector('[data-modal-close-btn]');
const overlay = document.querySelector('[data-overlay]');

const modalImg = document.querySelector('[data-modal-img]');
const modalTitle = document.querySelector('[data-modal-title]');
const modalText = document.querySelector('[data-modal-text]');

const testimonialsModalFunc = function () {
    modalContainer.classList.toggle('active');
    overlay.classList.toggle('active');
}

for (let i = 0; i < testimonialsItem.length; i++) {
    testimonialsItem[i].addEventListener('click', function () {
        modalImg.src = this.querySelector('[data-testimonials-avatar]').src;
        modalImg.alt = this.querySelector('[data-testimonials-avatar]').alt;
        modalTitle.innerHTML = this.querySelector('[data-testimonials-title]').innerHTML;
        modalText.innerHTML = this.querySelector('[data-testimonials-text]').innerHTML;

        testimonialsModalFunc();
    })
}

//Activating close button in modal-testimonial

modalCloseBtn.addEventListener('click', testimonialsModalFunc);
overlay.addEventListener('click', testimonialsModalFunc);

//Activating Filter Select and filtering options

const select = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectValue = document.querySelector('[data-select-value]');
const filterBtn = document.querySelectorAll('[data-filter-btn]');

select.addEventListener('click', function () {elementToggleFunc(this); });

for(let i = 0; i < selectItems.length; i++) {
    selectItems[i].addEventListener('click', function() {

        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        elementToggleFunc(select);
        filterFunc(selectedValue);

    });
}

const filterItems = document.querySelectorAll('[data-filter-item]');

const filterFunc = function (selectedValue) {
    for(let i = 0; i < filterItems.length; i++) {
        if(selectedValue == "all") {
            filterItems[i].classList.add('active');
        } else if (selectedValue == filterItems[i].dataset.category) {
            filterItems[i].classList.add('active');
        } else {
            filterItems[i].classList.remove('active');
        }
    }
}

//Enabling filter button for larger screens 

let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

    filterBtn[i].addEventListener('click', function() {

        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        filterFunc(selectedValue);

        lastClickedBtn.classList.remove('active');
        this.classList.add('active');
        lastClickedBtn = this;

    })
}

// Enabling Contact Form

const form = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');

for(let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener('input', function () {
        if(form.checkValidity()) {
            formBtn.removeAttribute('disabled');
        } else { 
            formBtn.setAttribute('disabled', '');
        }
    })
}

// Enabling Page Navigation 

const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

for(let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].addEventListener('click', function() {

        for(let i = 0; i < pages.length; i++) {
            if(this.innerHTML.toLowerCase() == pages[i].dataset.page) {
                pages[i].classList.add('active');
                navigationLinks[i].classList.add('active');
                window.scrollTo(0, 0);
            } else {
                pages[i].classList.remove('active');
                navigationLinks[i]. classList.remove('active');
            }
        }
    });
}


// Portfolio API Class
class PortfolioAPI {
    constructor() {
        this.baseURL = '/api';
        this.loadContent();
    }

    async loadContent() {
        await Promise.all([
            this.loadProjects(),
            this.loadBlogs()
        ]);
    }

    async loadProjects() {
        try {
            const response = await fetch(`${this.baseURL}/projects`);
            const projects = await response.json();
            this.renderProjects(projects);
        } catch (error) {
            console.error('Failed to load projects:', error);
            this.loadFallbackProjects();
        }
    }

    async loadBlogs() {
        try {
            const response = await fetch(`${this.baseURL}/blog`);
            const blogs = await response.json();
            this.renderBlogs(blogs);
        } catch (error) {
            console.error('Failed to load blogs:', error);
            this.loadFallbackBlogs();
        }
    }

    renderProjects(projects) {
        const projectList = document.querySelector('.project-list');
        if (!projectList) return;

        projectList.innerHTML = projects.map(project => `
            <li class="project-item active" data-filter-item data-category="${project.category}">
                <a href="${project.link}" target="_blank">
                    <figure class="project-img">
                        <div class="project-item-icon-box">
                            <ion-icon name="eye-outline"></ion-icon>
                        </div>
                        <img src="${project.image}" alt="${project.title}" loading="lazy" 
                             onerror="this.src='https://via.placeholder.com/300x200'">
                    </figure>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-category">${project.category}</p>
                </a>
            </li>
        `).join('');
    }

    renderBlogs(blogs) {
        const blogContainer = document.getElementById("blog-list");
        if (!blogContainer) return;

        blogContainer.innerHTML = blogs.map(blog => `
            <li class="blog-post-item">
                <a href="/blog/${blog.slug}">
                    <figure class="blog-banner-box">
                        <img src="${blog.image}" alt="${blog.title}" loading="lazy"
                             onerror="this.src='https://via.placeholder.com/300x200'">
                    </figure>
                    <div class="blog-content">
                        <h3 class="h3 blog-item-title">${blog.title}</h3>
                        <p class="blog-meta">${new Date(blog.createdAt).toLocaleDateString()}</p>
                        <p class="blog-text">${blog.excerpt}</p>
                    </div>
                </a>
            </li>
        `).join('');
    }

    loadFallbackProjects() {
        const fallbackProjects = [
            {
                title: "Krishi Samvida",
                category: "web development",
                image: "assests/KRISHISAMVIDA.png",
                link: "https://krishisamvida.netlify.app/"
            },
            {
                title: "Weather App",
                category: "web development", 
                image: "assests/weather.png",
                link: "https://simple-weather788.netlify.app/"
            },
            {
                title: "Tic Tac Toe Game",
                category: "web development",
                image: "assests/tic-tac.png", 
                link: "https://tictactoo111.netlify.app/"
            }
        ];
        this.renderProjects(fallbackProjects);
    }

    loadFallbackBlogs() {
        const fallbackBlogs = [
            {
                title: "How I Built My Portfolio Website",
                createdAt: "2025-08-01",
                excerpt: "A step-by-step guide on how I designed, developed, and deployed my personal portfolio.",
                image: "https://i.postimg.cc/fyGrRH0c/portfolio.jpg",
                slug: "how-i-built-my-portfolio"
            },
            {
                title: "Top 5 JavaScript Projects for Beginners", 
                createdAt: "2025-07-01",
                excerpt: "Struggling to find practice projects? These ideas will help sharpen your skills fast.",
                image: "https://i.postimg.cc/JnqFVLhW/js-projects.jpg",
                slug: "top-5-javascript-projects"
            },
            {
                title: "My SIH 2024 Journey",
                createdAt: "2024-06-01", 
                excerpt: "How I cracked Smart India Hackathon 2024 and built 'Krishi Samvida'.",
                image: "https://i.postimg.cc/BnKXczh5/sih.jpg",
                slug: "my-sih-2024-journey"
            }
        ];
        this.renderBlogs(fallbackBlogs);
    }
}

// Enhanced Contact Form Handler
class ContactFormHandler {
    constructor() {
        this.form = document.querySelector('[data-form]');
        this.formBtn = document.querySelector('[data-form-btn]');
        this.setupFormHandling();
    }

    setupFormHandling() {
        if (!this.form) return;

        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit();
        });
    }

    async handleSubmit() {
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('fullname'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        this.setLoading(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                this.showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                this.form.reset();
            } else {
                this.showMessage(result.message || 'Failed to send message. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            this.showMessage('Network error. Please try again later.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(loading) {
        this.formBtn.disabled = loading;
        this.formBtn.innerHTML = loading 
            ? '<ion-icon name="hourglass-outline"></ion-icon><span>Sending...</span>'
            : '<ion-icon name="paper-plane"></ion-icon><span>Send Message</span>';
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 8px;
            text-align: center;
            font-weight: 500;
            ${type === 'success' ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'}
        `;

        // Remove existing message
        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        this.form.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Form validation enhancement
function validateForm() {
    const formInputs = document.querySelectorAll('[data-form-input]');
    const formBtn = document.querySelector('[data-form-btn]');
    
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            const form = input.closest('form');
            if (form && form.checkValidity()) {
                formBtn.removeAttribute('disabled');
            } else {
                formBtn.setAttribute('disabled', '');
            }
        });
    });
}

// Initialize enhanced functionality
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioAPI();
    new ContactFormHandler();
    validateForm();
});
