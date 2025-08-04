// Events will be loaded dynamically from events.yaml
let events = [];

// DOM elements
const eventsContainer = document.getElementById('events-container');
const navLinks = document.querySelectorAll('.nav-link');
const icalUrlInput = document.getElementById('ical-url');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadEventsFromYaml();
    setupNavigation();
    updateIcalUrl();
});

// Load events from events.yaml file
async function loadEventsFromYaml() {
    try {
        console.log('Attempting to load events.yaml...');
        const response = await fetch('events.yaml');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`Failed to load events.yaml: ${response.status} ${response.statusText}`);
        }
        
        const yamlText = await response.text();
        console.log('YAML content loaded:', yamlText.substring(0, 200) + '...');
        
        events = parseYamlEvents(yamlText);
        console.log('Parsed events:', events);
        
        loadEvents();
    } catch (error) {
        console.error('Error loading events from YAML:', error);
        console.log('Falling back to embedded events...');
        
        // Fallback to embedded events if YAML loading fails
        if (window.embeddedEvents) {
            events = window.embeddedEvents;
        } else {
            // Final fallback to sample events
            events = [
                {
                    id: 1,
                    title: "Lorem Ipsum Event",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    date: "2024-12-15",
                    time: "7:00 PM",
                    location: "Lorem Ipsum Location"
                },
                {
                    id: 2,
                    title: "Another Lorem Event",
                    description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                    date: "2024-12-22",
                    time: "7:00 PM",
                    location: "Lorem Ipsum Venue"
                },
                {
                    id: 3,
                    title: "Lorem Ipsum Party",
                    description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
                    date: "2024-12-25",
                    time: "6:00 PM",
                    location: "Lorem Ipsum Hall"
                },
                {
                    id: 4,
                    title: "Lorem Ipsum Workshop",
                    description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                    date: "2024-12-29",
                    time: "7:00 PM",
                    location: "Lorem Ipsum Center"
                }
            ];
        }
        loadEvents();
    }
}

// Parse YAML events (simple parser for our specific format)
function parseYamlEvents(yamlText) {
    const events = [];
    const lines = yamlText.split('\n');
    let currentEvent = null;
    let inEventsBlock = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line === 'events:') {
            inEventsBlock = true;
            continue;
        }
        
        if (!inEventsBlock) continue;
        
        if (line.startsWith('- id:')) {
            if (currentEvent) {
                events.push(currentEvent);
            }
            currentEvent = {};
            const idMatch = line.match(/id: (\d+)/);
            if (idMatch) {
                currentEvent.id = parseInt(idMatch[1]);
            }
        } else if (line.startsWith('title:')) {
            if (currentEvent) {
                currentEvent.title = line.substring(6).trim().replace(/"/g, '');
            }
        } else if (line.startsWith('description:')) {
            if (currentEvent) {
                currentEvent.description = line.substring(12).trim().replace(/"/g, '');
            }
        } else if (line.startsWith('date:')) {
            if (currentEvent) {
                currentEvent.date = line.substring(5).trim().replace(/"/g, '');
            }
        } else if (line.startsWith('start_time:')) {
            if (currentEvent) {
                currentEvent.start_time = line.substring(11).trim().replace(/"/g, '');
            }
        } else if (line.startsWith('end_time:')) {
            if (currentEvent) {
                currentEvent.end_time = line.substring(9).trim().replace(/"/g, '');
            }
        } else if (line.startsWith('location:')) {
            if (currentEvent) {
                currentEvent.location = line.substring(9).trim().replace(/"/g, '');
            }
        }
    }
    
    // Add the last event
    if (currentEvent) {
        events.push(currentEvent);
    }
    
    return events;
}

// Load and display events
function loadEvents() {
    if (!eventsContainer) {
        console.error('Events container not found!');
        return;
    }
    
    console.log('Total events loaded:', events.length);
    console.log('Current date/time:', new Date());
    
    // Filter out past events
    const now = new Date();
    const futureEvents = events.filter(event => {
        const eventDate = new Date(event.date + ' ' + event.start_time);
        console.log('Event:', event.title, 'Date:', eventDate, 'Is future:', eventDate > now);
        return eventDate > now;
    });
    
    console.log('Loading events into container:', futureEvents.length, 'future events');
    eventsContainer.innerHTML = '';
    
    if (futureEvents.length === 0) {
        eventsContainer.innerHTML = `
            <div class="no-events">
                <h3>No upcoming events</h3>
                <p>Check back soon for new events!</p>
            </div>
        `;
        return;
    }
    
    futureEvents.forEach(event => {
        const eventCard = createEventCard(event);
        eventsContainer.appendChild(eventCard);
    });
}

// Create an event card element
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    
    const formattedDate = formatDate(event.date);
    const formattedTime = formatTime(event.start_time);
    
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
    
    // Use the hardcoded GitHub Pages URL
    const icalUrl = 'https://charlesz54.github.io/mewhenbowling/calendar.ics';
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