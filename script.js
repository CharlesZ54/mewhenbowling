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
                    date: "2025-12-15",
                    start_time: "7:00 PM",
                    end_time: "9:00 PM",
                    location: "Lorem Ipsum Location"
                },
                {
                    id: 2,
                    title: "Another Lorem Event",
                    date: "2025-12-22",
                    start_time: "7:00 PM",
                    end_time: "9:00 PM",
                    location: "Lorem Ipsum Venue"
                },
                {
                    id: 3,
                    title: "Lorem Ipsum Party",
                    date: "2025-12-25",
                    start_time: "6:00 PM",
                    end_time: "8:00 PM",
                    location: "Lorem Ipsum Hall"
                },
                {
                    id: 4,
                    title: "Lorem Ipsum Workshop",
                    date: "2025-12-29",
                    start_time: "7:00 PM",
                    end_time: "9:00 PM",
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
        // Parse date and time properly
        const [year, month, day] = event.date.split('-');
        const [time, period] = event.start_time.split(' ');
        const [hours, minutes] = time.split(':');
        
        let hour24 = parseInt(hours);
        if (period === 'PM' && hour24 !== 12) hour24 += 12;
        if (period === 'AM' && hour24 === 12) hour24 = 0;
        
        const eventDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hour24, parseInt(minutes));
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
    
    // Show first 3 events initially
    const initialEvents = futureEvents.slice(0, 3);
    const remainingEvents = futureEvents.slice(3);
    
    // Create wrapper for all events and controls
    const eventsWrapper = document.createElement('div');
    eventsWrapper.className = 'events-wrapper';
    
    // Create container for visible events
    const visibleEventsContainer = document.createElement('div');
    visibleEventsContainer.className = 'visible-events events-grid';
    
    // Add initial events
    initialEvents.forEach(event => {
        const eventCard = createEventCard(event);
        visibleEventsContainer.appendChild(eventCard);
    });
    
    eventsWrapper.appendChild(visibleEventsContainer);
    
    // Add hidden events container if there are more events
    if (remainingEvents.length > 0) {
        const hiddenEventsContainer = document.createElement('div');
        hiddenEventsContainer.className = 'hidden-events events-grid';
        hiddenEventsContainer.style.display = 'none';
        
        remainingEvents.forEach(event => {
            const eventCard = createEventCard(event);
            hiddenEventsContainer.appendChild(eventCard);
        });
        
        eventsWrapper.appendChild(hiddenEventsContainer);
        
        // Add toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-events-btn';
        toggleButton.innerHTML = `
            <i class="fas fa-chevron-down"></i>
            Show ${remainingEvents.length} More Events
        `;
        toggleButton.onclick = function() {
            const hiddenContainer = document.querySelector('.hidden-events');
            const isHidden = hiddenContainer.style.display === 'none';
            
            if (isHidden) {
                hiddenContainer.style.display = 'grid';
                this.innerHTML = `
                    <i class="fas fa-chevron-up"></i>
                    Show Less
                `;
            } else {
                hiddenContainer.style.display = 'none';
                this.innerHTML = `
                    <i class="fas fa-chevron-down"></i>
                    Show ${remainingEvents.length} More Events
                `;
            }
        };
        
        eventsWrapper.appendChild(toggleButton);
    }
    
    eventsContainer.appendChild(eventsWrapper);
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
        <div class="event-location">
            <i class="fas fa-map-marker-alt"></i>
            ${event.location}
        </div>
    `;
    
    return card;
}

// Format date for display
function formatDate(dateString) {
    // Parse the date string and create a local date to avoid timezone issues
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
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
    
    // Handle multi-line messages with HTML formatting
    if (message.includes('\n')) {
        // Add dismiss button for multi-line messages
        const dismissButton = '<button class="dismiss-btn" onclick="this.parentElement.remove()">&times;</button>';
        successMessage.innerHTML = dismissButton + message.replace(/\n/g, '<br>');
    } else {
        successMessage.textContent = message;
    }
    
    // Insert after the copy button
    const copyButton = document.querySelector('.btn-copy');
    if (copyButton && copyButton.parentNode) {
        copyButton.parentNode.insertAdjacentElement('afterend', successMessage);
    }
    
    // Auto-hide after 3 seconds for short messages only
    if (!message.includes('\n')) {
        setTimeout(() => {
            successMessage.classList.remove('show');
            setTimeout(() => successMessage.remove(), 300);
        }, 3000);
    }
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
    // Google Calendar doesn't support direct iCal URL import via web URL
    // Instead, we'll copy the iCal URL and show instructions
    copyIcalUrl();
    showSuccessMessage('iCal URL copied! To add to Google Calendar:\n1. Go to calendar.google.com\n2. Click the + next to "Other calendars"\n3. Choose "From URL"\n4. Paste the copied URL');
}

function openAppleCalendar() {
    const icalUrl = icalUrlInput.value;
    // Apple Calendar supports direct calendar subscription via webcal:// URL
    const appleCalendarUrl = icalUrl.replace('https://', 'webcal://');
    window.open(appleCalendarUrl, '_blank');
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