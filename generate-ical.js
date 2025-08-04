#!/usr/bin/env node

/**
 * Script to generate calendar.ics from events in script.js
 * Usage: node generate-ical.js
 */

const fs = require('fs');
const path = require('path');

// Sample events (you can modify this or load from script.js)
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
        // Parse date and time
        const [year, month, day] = event.date.split('-');
        const [time, period] = event.time.split(' ');
        const [hours, minutes] = time.split(':');
        
        // Convert to 24-hour format
        let hour24 = parseInt(hours);
        if (period === 'PM' && hour24 !== 12) hour24 += 12;
        if (period === 'AM' && hour24 === 12) hour24 = 0;
        
        // Create start date
        const startDate = new Date(year, month - 1, day, hour24, parseInt(minutes));
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration
        
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
DESCRIPTION:${event.description}
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
        const icalContent = generateIcalFile(events);
        const outputPath = path.join(__dirname, 'calendar.ics');
        
        fs.writeFileSync(outputPath, icalContent);
        console.log('✅ calendar.ics generated successfully!');
        console.log(`📁 File saved to: ${outputPath}`);
        console.log(`📅 Generated ${events.length} events`);
        
        // Display events
        console.log('\n📋 Events included:');
        events.forEach(event => {
            console.log(`  • ${event.title} - ${event.date} at ${event.time}`);
        });
        
    } catch (error) {
        console.error('❌ Error generating calendar.ics:', error.message);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { generateIcalFile, events }; 