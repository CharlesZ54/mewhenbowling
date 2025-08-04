// Events will be loaded from events.yaml by the server or build process
// For now, we'll use a fallback array that matches the YAML structure
const events = [
    {
        id: 1,
        title: "Team Meeting",
        description: "Weekly team sync to discuss project progress and upcoming milestones.",
        date: "2024-12-15",
        time: "10:00 AM",
        location: "Conference Room A"
    },
    {
        id: 2,
        title: "Product Launch",
        description: "Launch of our new product line with live demonstrations and Q&A session.",
        date: "2024-12-20",
        time: "2:00 PM",
        location: "Main Auditorium"
    },
    {
        id: 3,
        title: "Holiday Party",
        description: "Annual company holiday celebration with food, drinks, and entertainment.",
        date: "2024-12-25",
        time: "6:00 PM",
        location: "Grand Ballroom"
    },
    {
        id: 4,
        title: "Training Workshop",
        description: "Advanced training session on new technologies and best practices.",
        date: "2024-12-28",
        time: "9:00 AM",
        location: "Training Center"
    }
];

// DOM elements
const eventsContainer = document.getElementById('events-container');
const navLinks = document.querySelectorAll('.nav-link');
const icalUrlInput = document.getElementById('ical-url');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadEvents();
    setupNavigation();
    updateIcalUrl();
});

// Load and display events
function loadEvents() {
    if (!eventsContainer) return;
    
    eventsContainer.innerHTML = '';
    
    events.forEach(event => {
        const eventCard = createEventCard(event);
        eventsContainer.appendChild(eventCard);
    });
}

// Create an event card element
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    
    const formattedDate = formatDate(event.date);
    const formattedTime = formatTime(event.time);
    
    card.innerHTML = `
        <div class="event-date">
            <i class="fas fa-calendar"></i>
            ${formattedDate} at ${formattedTime}
        </div>
        <h3 class="event-title">${event.title}</h3>
        <p class="event-description">${event.description}</p>
        <div class="event-location">
            <i class="fas fa-map-marker-alt"></i>
            ${event.location}
        </div>
    `;
    
    return card;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

// Format time for display
function formatTime(timeString) {
    return timeString;
}

// Setup navigation highlighting
function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
    
    // Highlight active section based on scroll position
    window.addEventListener('scroll', highlightActiveSection);
}

// Highlight active navigation based on scroll position
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(l => l.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

// Copy iCal URL to clipboard
function copyIcalUrl() {
    if (!icalUrlInput) return;
    
    icalUrlInput.select();
    icalUrlInput.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        document.execCommand('copy');
        showSuccessMessage('iCal URL copied to clipboard!');
    } catch (err) {
        // Fallback for modern browsers
        navigator.clipboard.writeText(icalUrlInput.value).then(() => {
            showSuccessMessage('iCal URL copied to clipboard!');
        }).catch(() => {
            showSuccessMessage('Failed to copy URL. Please copy manually.');
        });
    }
}

// Show success message
function showSuccessMessage(message) {
    // Remove existing success message
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message show';
    successMessage.textContent = message;
    
    // Insert after the copy button
    const copyButton = document.querySelector('.btn-copy');
    if (copyButton && copyButton.parentNode) {
        copyButton.parentNode.insertAdjacentElement('afterend', successMessage);
    }
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
        setTimeout(() => successMessage.remove(), 300);
    }, 3000);
}

// Update iCal URL based on current domain
function updateIcalUrl() {
    if (!icalUrlInput) return;
    
    const currentDomain = window.location.origin;
    const icalUrl = `${currentDomain}/calendar.ics`;
    icalUrlInput.value = icalUrl;
}

// Calendar app integration functions
function openGoogleCalendar() {
    const icalUrl = icalUrlInput.value;
    const googleCalendarUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(icalUrl)}`;
    window.open(googleCalendarUrl, '_blank');
}

function openAppleCalendar() {
    // Apple Calendar doesn't have a direct web URL, so we'll just copy the iCal URL
    copyIcalUrl();
    showSuccessMessage('iCal URL copied! Add it to Apple Calendar manually.');
}

function openOutlook() {
    const icalUrl = icalUrlInput.value;
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=Calendar%20Subscription&body=Please%20add%20this%20calendar:%20${encodeURIComponent(icalUrl)}`;
    window.open(outlookUrl, '_blank');
}

// Smooth scrolling for navigation links
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

// Add loading animation for dynamic content
function showLoading(element) {
    element.innerHTML = '<div class="loading"></div>';
}

function hideLoading(element) {
    const loadingElement = element.querySelector('.loading');
    if (loadingElement) {
        loadingElement.remove();
    }
}

// Export functions for global access
window.copyIcalUrl = copyIcalUrl;
window.openGoogleCalendar = openGoogleCalendar;
window.openAppleCalendar = openAppleCalendar;
window.openOutlook = openOutlook; 