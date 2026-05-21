// GitHub API Configuration
const GITHUB_USERNAME = 'b1l4l-sec';
const GITHUB_TOKEN = ''; // Use environment variable or token
const API_BASE = 'https://api.github.com';

// Cache for API calls
const cache = {};

// Project configurations with enhanced descriptions
const projectsConfig = {
    'b1l4l-sec': {
        title: 'Cybersecurity & Full-Stack Developer',
        description: 'Personal portfolio and profile repository',
        icon: '👨‍💻'
    },
    'Wazuh-VirusTotal-SOC-Automation': {
        title: 'Wazuh & VirusTotal SOC Automation',
        description: 'Automated malware detection, quarantine, and email alerting using Wazuh SIEM and VirusTotal API',
        icon: '🛡️'
    },
    'codealpha_tasks': {
        title: 'CodeAlpha Tasks',
        description: 'Collection of Python and web development tasks and projects',
        icon: '🐍'
    },
    'TheZero': {
        title: 'TheZero - Security Tool',
        description: 'Advanced security analysis and pentesting tool built with Python',
        icon: '⚙️'
    },
    'My-Portfolio': {
        title: 'Portfolio Website',
        description: 'Full-stack portfolio showcasing projects and skills',
        icon: '🌐'
    },
    'PhishingCTFs': {
        title: 'Phishing CTF Challenges',
        description: 'Interactive Capture The Flag challenges for phishing and social engineering education',
        icon: '🎯'
    },
    'ZeroPhishing': {
        title: 'ZeroPhishing',
        description: 'Advanced phishing detection and prevention platform',
        icon: '📧'
    },
    'secops_home': {
        title: 'SecOps Home',
        description: 'Security Operations website and documentation hub',
        icon: '🔐'
    },
    'IDS-Project': {
        title: 'IDS & ELK Stack',
        description: 'Intrusion Detection System with Elasticsearch, Logstash, and Kibana integration',
        icon: '📊'
    }
};

// Skills data
const skillsData = {
    'Security & Networking': [
        'Penetration Testing', 'SIEM', 'Wazuh', 'IDS/IPS', 'Firewalls',
        'Network Security', 'Cryptography', 'Threat Analysis', 'Incident Response'
    ],
    'Backend Development': [
        'Python', 'Shell/Bash', 'Node.js', 'PHP', 'RESTful APIs',
        'Database Design', 'DevOps', 'Docker', 'Kubernetes'
    ],
    'Frontend Development': [
        'JavaScript', 'React', 'HTML5', 'CSS3', 'UI/UX Design',
        'Responsive Design', 'Web Performance', 'Accessibility'
    ],
    'Tools & Platforms': [
        'GitHub', 'GitLab', 'AWS', 'Azure', 'Linux',
        'Burp Suite', 'Metasploit', 'Wireshark', 'Git', 'Docker'
    ]
};

// Certificates data
const certificatesData = [
    {
        title: 'CEH (Certified Ethical Hacker)',
        issuer: 'EC-Council',
        date: '2024',
        icon: '🏆',
        badge: 'Verified'
    },
    {
        title: 'OSCP (Offensive Security Certified Professional)',
        issuer: 'Offensive Security',
        date: '2024',
        icon: '🎖️',
        badge: 'In Progress'
    },
    {
        title: 'AWS Solutions Architect Associate',
        issuer: 'Amazon Web Services',
        date: '2024',
        icon: '☁️',
        badge: 'Verified'
    },
    {
        title: 'CompTIA Security+',
        issuer: 'CompTIA',
        date: '2023',
        icon: '🔐',
        badge: 'Verified'
    },
    {
        title: 'Google Cloud Associate Cloud Engineer',
        issuer: 'Google Cloud',
        date: '2023',
        icon: '☁️',
        badge: 'Verified'
    },
    {
        title: 'Microsoft Azure Fundamentals',
        issuer: 'Microsoft',
        date: '2023',
        icon: '💼',
        badge: 'Verified'
    }
];

/**
 * Fetch data from GitHub API with caching
 */
async function fetchGitHub(endpoint, useCache = true) {
    const cacheKey = endpoint;
    
    if (useCache && cache[cacheKey]) {
        return cache[cacheKey];
    }

    try {
        const url = `${API_BASE}${endpoint}`;
        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };

        if (GITHUB_TOKEN) {
            headers['Authorization'] = `token ${GITHUB_TOKEN}`;
        }

        const response = await fetch(url, { headers });
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.statusText}`);
        }

        const data = await response.json();
        cache[cacheKey] = data;
        return data;
    } catch (error) {
        console.error('Error fetching from GitHub:', error);
        return null;
    }
}

/**
 * Get user repositories
 */
async function getRepositories() {
    const endpoint = `/users/${GITHUB_USERNAME}/repos?sort=stars&per_page=100`;
    return fetchGitHub(endpoint);
}

/**
 * Create project card HTML
 */
function createProjectCard(repo) {
    const config = projectsConfig[repo.name] || {};
    const languages = repo.language ? [repo.language] : [];
    
    // Extract language info from topics if available
    if (repo.topics && repo.topics.length > 0) {
        languages.push(...repo.topics.slice(0, 3));
    }

    const techStack = languages
        .filter(lang => lang)
        .map(lang => `<div class="tech-tag">${lang}</div>`)
        .join('');

    return `
        <div class="project-card">
            <div class="project-header">
                <div>
                    <div class="project-title">${config.title || repo.name}</div>
                    <div style="color: var(--primary); font-size: 0.9rem; margin-top: 0.3rem;">
                        <i class="fas fa-star"></i> ${repo.stargazers_count} stars
                    </div>
                </div>
                <div class="project-icon">${config.icon || '📦'}</div>
            </div>
            <div class="project-desc">${config.description || repo.description || 'No description'}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; font-size: 0.9rem; color: rgba(240, 240, 240, 0.6);">
                <div><i class="fas fa-code-branch"></i> ${repo.forks_count} forks</div>
                <div><i class="fas fa-eye"></i> ${repo.watchers_count} watchers</div>
            </div>
            <div class="tech-stack">${techStack}</div>
            <div style="margin-top: 1.5rem;">
                <a href="${repo.html_url}" target="_blank" class="btn btn-primary" style="width: 100%; text-align: center;">
                    View on GitHub <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        </div>
    `;
}

/**
 * Create skills section HTML
 */
function createSkillsHTML() {
    return Object.entries(skillsData)
        .map(([category, skills]) => `
            <div class="skill-category">
                <div class="skill-name"><i class="fas fa-check-circle"></i> ${category}</div>
                <div class="skill-items">
                    ${skills.map(skill => `<div class="skill-item">${skill}</div>`).join('')}
                </div>
            </div>
        `)
        .join('');
}

/**
 * Create certificate card HTML
 */
function createCertificateCard(cert) {
    return `
        <div class="cert-card">
            <div class="cert-icon">${cert.icon}</div>
            <div class="cert-title">${cert.title}</div>
            <div class="cert-issuer">${cert.issuer}</div>
            <div class="cert-date">
                <i class="fas fa-calendar"></i> ${cert.date}
            </div>
            <div class="cert-badge">
                <i class="fas fa-badge"></i> ${cert.badge}
            </div>
        </div>
    `;
}

/**
 * Animate number counter
 */
function animateCounter(element, target, duration = 1500) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/**
 * Initialize portfolio
 */
async function initPortfolio() {
    try {
        // Show loading state
        const projectsContainer = document.getElementById('projects-container');
        projectsContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center;"><div class="loading"></div><p style="margin-top: 1rem; color: rgba(240, 240, 240, 0.6);">Loading projects from GitHub...</p></div>';

        // Fetch repositories
        const repos = await getRepositories();
        
        if (repos && repos.length > 0) {
            // Filter and sort repositories
            const filteredRepos = repos
                .filter(repo => !repo.fork || Object.keys(projectsConfig).includes(repo.name))
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, 9);

            // Render projects
            projectsContainer.innerHTML = filteredRepos
                .map(repo => createProjectCard(repo))
                .join('');

            // Update stats
            document.getElementById('repo-count').textContent = repos.length;
            animateCounter(document.getElementById('repo-count'), repos.length);

            // Calculate unique languages
            const languages = new Set();
            repos.forEach(repo => {
                if (repo.language) languages.add(repo.language);
                if (repo.topics) repo.topics.forEach(topic => languages.add(topic));
            });
            
            document.getElementById('lang-count').textContent = languages.size;
            animateCounter(document.getElementById('lang-count'), languages.size);
        }

        // Render skills
        document.getElementById('skills-container').innerHTML = createSkillsHTML();

        // Render certificates
        document.getElementById('certificates-container').innerHTML = certificatesData
            .map(cert => createCertificateCard(cert))
            .join('');
        
        document.getElementById('cert-count').textContent = certificatesData.length;
        animateCounter(document.getElementById('cert-count'), certificatesData.length);

        // Add smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

    } catch (error) {
        console.error('Error initializing portfolio:', error);
        document.getElementById('projects-container').innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <p style="color: var(--secondary);">Unable to load projects. Please try again later.</p>
            </div>
        `;
    }
}

/**
 * Intersection Observer for animations
 */
function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInUp 0.8s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all project cards
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.project-card').forEach(card => {
            observer.observe(card);
        });
    });
}

/**
 * Keyboard shortcuts
 */
document.addEventListener('keydown', (e) => {
    // Press 'G' to go to GitHub
    if (e.key === 'g' || e.key === 'G') {
        window.open(`https://github.com/${GITHUB_USERNAME}`, '_blank');
    }
    // Press '/' to scroll to projects
    if (e.key === '/') {
        e.preventDefault();
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    }
});

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    initPortfolio();
    setupIntersectionObserver();
});

// Refresh portfolio every 30 minutes
setInterval(initPortfolio, 30 * 60 * 1000);
