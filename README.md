# PASSES Terminal Check-In System

A calming and intuitive web application for student check-ins and teacher management in the PASSES program.

## Features

### User Account System
- **Create Accounts**: Both students and teachers can create their own accounts
- **Secure Login**: Username and password authentication
- **Session Persistence**: Stay logged in between browser sessions
- **Account Management**: Delete your own account if needed

### Student Features
- **Easy Check-In Form**: Submit check-in information including:
  - Reason for visit
  - Current mood/feeling (mood selector with emoji)
  - Type of help needed (multiple selections)
  - Additional details or notes
- **Privacy**: Can only see their own pending forms
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Teacher Features
- **Dashboard View**: See all check-ins from 7:15 AM to 1:58 PM
- **Filter Options**: View pending forms, checked-in forms, or all forms
- **Form Management**:
  - View detailed student information
  - Set accommodation/action (e.g., "Check in with counselor")
  - Check in students with a single click
  - Delete/end completed forms
- **Teacher Management**:
  - View all other teachers
  - Admin users can grant/revoke teacher access
  - Admin users can promote other teachers to admin
  - Cannot revoke access from other admin users
  - First teacher account automatically becomes admin
- **Form History**: View what accommodations were provided
- **Student Privacy**: Can see all forms from the day

## Getting Started

### Installation
1. Clone this repository
2. Open `index.html` in your web browser
3. No backend or database required - uses browser local storage

## How to Use

### Creating an Account
1. Click "Create one" on the login screen
2. Choose a username (minimum 3 characters)
3. Create a password
4. Check "Register as Teacher" if you want teacher access
5. Click "Create Account"

### Logging In
1. Enter your username and password
2. Click "Login"
3. You'll be directed to either the student or teacher dashboard

### Student Check-In
1. Fill out the check-in form with:
   - Reason for visiting
   - Your current mood
   - What type of help you need
   - Any additional details
2. Click "Submit Check-In"
3. A teacher will review and check you in

### Teacher Dashboard
1. **View Forms**: See all pending student check-ins
2. **Filter Forms**: Toggle between pending, checked-in, and all forms
3. **Process Check-In**: Click a form to view details
4. **Add Action**: Enter what accommodation/action you're providing
5. **Check In Student**: Click "Check In Student" to save

### Managing Teachers
1. Click "Manage Teachers" in the teacher dashboard
2. View all teachers and their roles
3. **As an Admin**, you can:
   - Promote regular teachers to admin (👑 badge)
   - Revoke teacher access from regular teachers
   - Cannot modify other admin accounts
4. **Delete Your Account**: You can delete your own account anytime

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
- Clearing browser data will delete all stored check-ins and accounts
- For production use, integrate with a backend database

## Admin System

- **First Teacher**: The very first teacher account created gets an admin badge (👑)
- **Admin Privileges**:
  - Can view all teachers
  - Can promote other teachers to admin
  - Can revoke teacher access from non-admin teachers
  - Cannot be revoked unless they delete their own account
- **Multiple Admins**: Admins can promote other teachers to admin, creating multiple admin accounts

## Future Enhancements

- Backend API integration for data persistence
- Email notifications for new check-ins
- Analytics and reporting dashboard
- Export data to CSV/PDF
- Student notification when checked in
- Daily reset of forms
- Multi-language support
- Password reset functionality
- Teacher notes/comments on student forms

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Closed source - Internal use only
