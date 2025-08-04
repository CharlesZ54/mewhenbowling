# My Calendar Website

A modern, responsive website that hosts a calendar with an iCal feed that people can subscribe to. Built for hosting on GitHub Pages.

## Features

- 🗓️ **iCal Feed**: Subscribe to calendar events via iCal URL
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- 📅 **Event Display**: View upcoming events on the website
- 🔗 **Easy Integration**: One-click buttons for popular calendar apps
- 📋 **Copy to Clipboard**: Easy iCal URL copying functionality

## Quick Start

### 1. Clone or Download

```bash
git clone https://github.com/yourusername/mewhenbowling.git
cd mewhenbowling
```

### 2. Customize Your Calendar

#### Update Events in `script.js`
Edit the `events` array in `script.js` to add your own events:

```javascript
const events = [
    {
        id: 1,
        title: "Your Event Title",
        description: "Event description here",
        date: "2024-12-15",
        time: "10:00 AM",
        location: "Event Location"
    },
    // Add more events...
];
```

#### Update iCal Feed in `calendar.ics`
Edit the `calendar.ics` file to match your events. Each event should have:

- `UID`: Unique identifier (e.g., `event-1@yourdomain.com`)
- `DTSTART`: Start date/time in UTC format
- `DTEND`: End date/time in UTC format
- `SUMMARY`: Event title
- `DESCRIPTION`: Event description
- `LOCATION`: Event location

### 3. Customize Website

#### Update Website Title and Branding
Edit `index.html` to change:
- Page title
- Logo text
- Hero section content
- Footer information

#### Update Colors and Styling
Modify `styles.css` to change:
- Color scheme
- Fonts
- Layout spacing
- Animations

### 4. Deploy to GitHub Pages

#### Option A: Using GitHub Desktop
1. Create a new repository on GitHub
2. Push your files to the repository
3. Go to Settings → Pages
4. Select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click Save

#### Option B: Using Command Line
```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit"

# Create repository on GitHub, then:
git remote add origin https://github.com/yourusername/mewhenbowling.git
git branch -M main
git push -u origin main
```

### 5. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click Settings
3. Scroll down to "Pages" section
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click Save

Your website will be available at: `https://yourusername.github.io/mewhenbowling`

## How to Update Events

### Method 1: Manual Updates
1. Edit the `events` array in `script.js`
2. Update the corresponding events in `calendar.ics`
3. Commit and push changes to GitHub

### Method 2: Automated Updates (Advanced)
You can create a script to automatically generate the iCal file from a database or external source:

```javascript
// Example: Generate iCal from events array
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
        const startDate = new Date(event.date + ' ' + event.time);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration
        
        ical += `BEGIN:VEVENT
UID:event-${event.id}@yourdomain.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
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
```

## File Structure

```
mewhenbowling/
├── index.html          # Main website page
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
├── calendar.ics        # iCal feed file
└── README.md          # This file
```

## Customization Options

### Colors
The website uses a purple gradient theme. To change colors, update these CSS variables in `styles.css`:

```css
/* Primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Secondary gradient */
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
```

### Fonts
The website uses Inter font. To change fonts, update the font-family in `styles.css`:

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Layout
The website uses CSS Grid and Flexbox for responsive layouts. Key breakpoints:
- Mobile: < 480px
- Tablet: 480px - 768px
- Desktop: > 768px

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## Troubleshooting

### iCal URL Not Working
1. Ensure the `calendar.ics` file is in the root directory
2. Check that the file has the correct MIME type (text/calendar)
3. Verify the URL is accessible via direct link

### Events Not Displaying
1. Check the browser console for JavaScript errors
2. Verify the `events` array in `script.js` is properly formatted
3. Ensure all required fields are present (id, title, description, date, time, location)

### GitHub Pages Not Updating
1. Wait 5-10 minutes for changes to propagate
2. Clear browser cache
3. Check GitHub Actions for deployment status

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you need help or have questions:
1. Check the troubleshooting section above
2. Search existing issues
3. Create a new issue with detailed information

---

**Happy calendaring! 📅✨** 