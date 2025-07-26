# Research Ethics Application Form

A comprehensive Google Forms-like web application for collecting research ethics applications with modern UI and full functionality.

## Features

### 📋 Complete Form Fields
- **Personal Information**: Email, Name, Register Number, University, Degree
- **Demographics**: Gender (Male, Female, Prefer not to say), Date of Birth
- **Contact Details**: Phone Number, Mother Tongue
- **Address Information**: Permanent Address, Temporary Address, District, State, Country
- **Academic Details**: Applicant Type (+12 Student, UG Student, PG Student, Diploma), School Name, College Name, Year of Study, Department
- **Session Information**: Session Date and Time with calendar selectors
- **Research Consent**: Multiple consent questions for data usage and EEG/webcam participation

### 🎛️ Navigation Tabs
- **Questions**: Main form interface
- **Responses**: Table view of all submissions with response count
- **Individual**: Navigate through individual responses
- **Summary**: Statistical charts and data visualization

### 💾 Data Management
- **Local Storage**: All responses saved in browser's local storage
- **Export to CSV**: Download all responses as CSV file
- **Response Management**: View, navigate, and delete individual responses
- **Real-time Updates**: Response counts update automatically

### 📊 Analytics & Reporting
- **Summary Statistics**: Distribution charts for key fields
- **Response Tracking**: Total response count display
- **Individual Response Viewer**: Navigate through responses with prev/next buttons

### 🎨 Modern UI/UX
- **Google Forms-like Design**: Clean, modern interface
- **Responsive Design**: Works on desktop and mobile devices
- **Material Icons**: Professional iconography
- **Interactive Elements**: Hover effects, smooth transitions

## Usage

1. **Open the Form**: Load `index.html` in your web browser
2. **Fill Out Questions**: Complete all required fields marked with *
3. **Submit Response**: Click "Submit" to save the response
4. **View Responses**: Switch to "Responses" tab to see all submissions
5. **Analyze Data**: Use "Summary" tab for statistical overview
6. **Export Data**: Click "Export to CSV" to download responses

## Files Structure

```
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality
└── README.md          # This documentation file
```

## Browser Compatibility

- Chrome/Edge (Recommended)
- Firefox
- Safari
- Mobile browsers

## Data Storage

All form responses are stored locally in the browser's localStorage. Data persists between sessions but is limited to the specific browser and device.

## Customization

You can easily customize:
- Form fields by editing the HTML
- Styling by modifying the CSS
- Functionality by updating the JavaScript
- Add new question types or validation rules

## Testing

To test with sample data, uncomment the last line in `script.js`:
```javascript
addSampleData();
```

This will add 2 sample responses for demonstration purposes.

---

**Note**: This is a client-side application. For production use with server-side storage, integrate with your preferred backend service. 
