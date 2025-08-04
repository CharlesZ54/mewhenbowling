# Me When Bowling League Calendar

A modern, responsive website that hosts a calendar with an iCal feed for the Me When Bowling league at Westbrook Lanes in Brooklawn, NJ. Built for hosting on GitHub Pages with automatic iCal generation via GitHub Actions.

## Features

- 🗓️ **iCal Feed**: Subscribe to bowling league events via iCal URL
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- 🎳 **League Events**: View upcoming bowling league events
- 🔗 **Easy Integration**: One-click buttons for popular calendar apps
- 📋 **Copy to Clipboard**: Easy iCal URL copying functionality
- 🤖 **Auto-Generation**: GitHub Actions automatically generates iCal file from YAML events

## Quick Start

### 1. Clone or Download

```bash
git clone https://github.com/CharlesZ54/mewhenbowling.git
cd mewhenbowling
```

### 2. Customize Your Calendar

#### Update Events in `events.yaml`
Edit the `events.yaml` file to add your own bowling league events:

```yaml
events:
  - id: 1
    title: "League Night - Week 1"
    description: "First week of the Me When Bowling league season"
    date: "2024-12-15"
    time: "7:00 PM"
    location: "Westbrook Lanes, Brooklawn, NJ"
    
  - id: 2
    title: "Tournament Night"
    description: "Special tournament event with prizes"
    date: "2024-12-20"
    time: "6:00 PM"
    location: "Westbrook Lanes, Brooklawn, NJ"
```

#### Event Format
Each event should have:
- `id`: Unique identifier (number)
- `title`: Event title
- `description`: Event description
- `date`: Date in YYYY-MM-DD format
- `time`: Time in 12-hour format (e.g., "7:00 PM")
- `location`: Event location

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

### Method 1: Manual Updates (Recommended)
1. Edit the `events.yaml` file with your new bowling league events
2. Commit and push changes to GitHub
3. GitHub Actions will automatically generate the new `calendar.ics` file
4. The iCal feed will be updated automatically

### Method 2: Local Generation
If you want to test locally:
```bash
# Install Node.js if you haven't already
# Then run:
node generate-ical.js
```

## GitHub Actions Workflow

The repository includes a GitHub Actions workflow (`.github/workflows/generate-ical.yml`) that:

1. **Triggers** when `events.yaml` is modified
2. **Generates** a new `calendar.ics` file from the YAML events
3. **Commits** the updated iCal file back to the repository
4. **Updates** the iCal feed automatically

This ensures your bowling league calendar feed is always in sync with your events!

## File Structure

```
mewhenbowling/
├── index.html                    # Main website page
├── styles.css                    # CSS styling
├── script.js                     # JavaScript functionality
├── events.yaml                   # Bowling league event definitions (YAML format)
├── calendar.ics                  # iCal feed file (auto-generated)
├── generate-ical.js              # Script to generate iCal from YAML
├── .github/workflows/            # GitHub Actions workflows
│   └── generate-ical.yml        # Auto-generation workflow
└── README.md                     # This file
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
4. Check GitHub Actions logs for generation errors

### Events Not Displaying
1. Check the browser console for JavaScript errors
2. Verify the `events.yaml` file is properly formatted
3. Ensure all required fields are present (id, title, description, date, time, location)

### GitHub Actions Not Working
1. Check the Actions tab in your repository
2. Ensure the workflow file is in `.github/workflows/`
3. Verify the YAML syntax is correct
4. Check that Node.js is available in the workflow

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

**Happy bowling! 🎳✨** 