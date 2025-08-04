#!/usr/bin/env node

/**
 * Script to generate calendar.ics from events in events.yaml
 * Usage: node generate-ical.js
 */

const fs = require('fs');
const path = require('path');

function loadEventsFromYaml() {
    try {
        const yamlPath = path.join(__dirname, 'events.yaml');
        const yamlContent = fs.readFileSync(yamlPath, 'utf8');
        
        // Simple YAML parser for our specific format
        const events = [];
        const lines = yamlContent.split('\n');
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
        
        if (events.length === 0) {
            throw new Error('No events found in events.yaml');
        }
        
        return events;
    } catch (error) {
        console.error('Error loading events from events.yaml:', error.message);
        console.log('Falling back to sample events...');
        
        // Fallback to sample events
        return [
            {
                id: 1,
                title: "Team Meeting",
                description: "Weekly team sync to discuss project progress and upcoming milestones.",
                date: "2024-12-15",
                start_time: "10:00 AM",
                end_time: "11:00 AM",
                location: "Conference Room A"
            },
            {
                id: 2,
                title: "Product Launch",
                description: "Launch of our new product line with live demonstrations and Q&A session.",
                date: "2024-12-20",
                start_time: "2:00 PM",
                end_time: "4:00 PM",
                location: "Main Auditorium"
            },
            {
                id: 3,
                title: "Holiday Party",
                description: "Annual company holiday celebration with food, drinks, and entertainment.",
                date: "2024-12-25",
                start_time: "6:00 PM",
                end_time: "9:00 PM",
                location: "Grand Ballroom"
            },
            {
                id: 4,
                title: "Training Workshop",
                description: "Advanced training session on new technologies and best practices.",
                date: "2024-12-28",
                start_time: "9:00 AM",
                end_time: "12:00 PM",
                location: "Training Center"
            }
        ];
    }
}

function generateIcalFile(events) {
    let ical = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Calendar//Calendar Website//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:My Calendar
X-WR-CALDESC:Subscribe to our events calendar
X-WR-TIMEZONE:UTC\n`;

    events.forEach(event => {
        // Parse start date and time
        const [year, month, day] = event.date.split('-');
        const [startTime, startPeriod] = event.start_time.split(' ');
        const [startHours, startMinutes] = startTime.split(':');
        
        // Parse end date and time
        const [endTime, endPeriod] = event.end_time.split(' ');
        const [endHours, endMinutes] = endTime.split(':');
        
        // Convert to 24-hour format for start time
        let startHour24 = parseInt(startHours);
        if (startPeriod === 'PM' && startHour24 !== 12) startHour24 += 12;
        if (startPeriod === 'AM' && startHour24 === 12) startHour24 = 0;
        
        // Convert to 24-hour format for end time
        let endHour24 = parseInt(endHours);
        if (endPeriod === 'PM' && endHour24 !== 12) endHour24 += 12;
        if (endPeriod === 'AM' && endHour24 === 12) endHour24 = 0;
        
        // Create start and end dates
        const startDate = new Date(year, month - 1, day, startHour24, parseInt(startMinutes));
        const endDate = new Date(year, month - 1, day, endHour24, parseInt(endMinutes));
        
        // Format dates for iCal
        const formatDate = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        
        ical += `BEGIN:VEVENT
UID:event-${event.id}@mewhenbowling.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${event.title}
DESCRIPTION:${event.description || event.title}
LOCATION:${event.location}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT\n`;
    });

    ical += 'END:VCALENDAR';
    return ical;
}

function main() {
    try {
        console.log('📖 Loading events from events.yaml...');
        const events = loadEventsFromYaml();
        
        console.log(`📅 Found ${events.length} events`);
        events.forEach(event => {
            console.log(`  • ${event.title} - ${event.date} at ${event.start_time}`);
        });
        
        const icalContent = generateIcalFile(events);
        const outputPath = path.join(__dirname, 'calendar.ics');
        
        fs.writeFileSync(outputPath, icalContent);
        console.log('\n✅ calendar.ics generated successfully!');
        console.log(`📁 File saved to: ${outputPath}`);
        
    } catch (error) {
        console.error('❌ Error generating calendar.ics:', error.message);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { generateIcalFile, loadEventsFromYaml }; 