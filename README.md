# PASSES Terminal Check-In System

A calming and intuitive web application for student check-ins and teacher management in the PASSES program.

## Features

### Student Features
- **Easy Check-In Form**: Submit check-in information including:
  - Reason for check-in
  - Current mood/feeling (mood selector with emoji)
  - Type of help needed (multiple selections)
  - Additional details or notes
- **Privacy**: Students can only see their own pending forms
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Teacher Features
- **Dashboard View**: See all check-ins from 7:15 AM to 1:58 PM
- **Filter Options**: View pending forms, checked-in forms, or all forms
- **Form Management**:
  - View detailed student information
  - Set accommodation/action (e.g., "Check in with counselor")
  - Check in students with a single click
  - Delete forms when complete
- **Form History**: View what accommodations were provided
- **Student Privacy**: Teachers can see all forms from the day

## Getting Started

### Installation
1. Clone this repository
2. Open `index.html` in your web browser
3. No backend or database required - uses browser local storage

### Default Login Credentials
- **Password**: `pass123` (same for all users)
- **Teacher usernames**: `admin`, `teacher1`, `teacher2`
- **Student usernames**: Any other username (e.g., `john`, `sarah`, `mike`)

## Managing Teachers

To add or remove teachers, edit the `teachers.json` file or modify the teacher list in the app:

1. Open `app.js`
2. Find the line: `let teachers = JSON.parse(localStorage.getItem('passes_teachers')) || ['admin', 'teacher1', 'teacher2'];`
3. Add or remove usernames from the array
4. Save and refresh the page

Alternatively, teachers can be edited through the app's local storage system.

## Design Philosophy

The application uses:
- **Calming Color Palette**: Purple gradient and soft colors for a welcoming atmosphere
- **Clear Typography**: Easy-to-read fonts and hierarchy
- **Intuitive Navigation**: Simple, straightforward user flows
- **Accessibility**: Large touch targets and readable text
- **Responsive Design**: Works on all device sizes

## Data Storage

Currently, all data is stored in the browser's local storage. This means:
- Data persists between sessions on the same browser
- Clearing browser data will delete all stored check-ins
- For production use, integrate with a backend database

## Future Enhancements

- Backend API integration for data persistence
- User authentication system
- Email notifications for new check-ins
- Analytics and reporting dashboard
- Export data to CSV/PDF
- Admin panel for teacher management
- Student notification when checked in
- Daily reset of forms
- Multi-language support

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Closed source - Internal use only
