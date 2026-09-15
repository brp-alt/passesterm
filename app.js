// ========================================
// TEACHER ACCESS - EDIT THIS LIST
// ========================================
// Add or remove teacher usernames here
const TEACHER_USERNAMES = ['teacher1', 'teacher2', 'counselor'];
// ========================================

// Data storage (in production, use a backend)
let currentUser = null;
let currentUserType = null;
let currentFormId = null;
let forms = JSON.parse(localStorage.getItem('passes_forms')) || [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
});

function loadFromLocalStorage() {
    const savedForms = localStorage.getItem('passes_forms');
    
    if (savedForms) forms = JSON.parse(savedForms);
}

function saveToLocalStorage() {
    localStorage.setItem('passes_forms', JSON.stringify(forms));
}

function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorElement = document.getElementById('loginError');
    
    errorElement.textContent = '';
    
    if (!username || !password) {
        errorElement.textContent = 'Please enter both username and password';
        return;
    }
    
    // Simple validation (in production, use proper authentication)
    if (password !== 'pass123') {
        errorElement.textContent = 'Invalid password';
        return;
    }
    
    currentUser = username;
    
    if (TEACHER_USERNAMES.includes(username)) {
        currentUserType = 'teacher';
        showTeacherScreen();
    } else {
        currentUserType = 'student';
        showStudentScreen();
    }
    
    // Clear form
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

function logout() {
    currentUser = null;
    currentUserType = null;
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('studentScreen').classList.add('hidden');
    document.getElementById('teacherScreen').classList.add('hidden');
}

function showStudentScreen() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('studentScreen').classList.remove('hidden');
    document.getElementById('studentName').textContent = currentUser.charAt(0).toUpperCase() + currentUser.slice(1);
    resetCheckInForm();
}

function showTeacherScreen() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('teacherScreen').classList.remove('hidden');
    loadTeacherDashboard();
}

function resetCheckInForm() {
    document.getElementById('checkInForm').classList.remove('hidden');
    document.getElementById('successMessage').classList.add('hidden');
    document.getElementById('reason').value = '';
    document.getElementById('mood').value = '';
    document.getElementById('helpDetails').value = '';
    document.querySelectorAll('input[name="help"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
}

function selectMood(mood) {
    document.getElementById('mood').value = mood;
    document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
}

function submitCheckIn(event) {
    event.preventDefault();
    
    const reason = document.getElementById('reason').value.trim();
    const mood = document.getElementById('mood').value;
    const helpDetails = document.getElementById('helpDetails').value.trim();
    
    const helpCheckboxes = document.querySelectorAll('input[name="help"]:checked');
    const helpTypes = Array.from(helpCheckboxes).map(cb => cb.value);
    
    if (!reason || !mood || helpTypes.length === 0) {
        alert('Please fill in all required fields');
        return;
    }
    
    const form = {
        id: Date.now(),
        studentName: currentUser,
        studentDisplayName: currentUser.charAt(0).toUpperCase() + currentUser.slice(1),
        reason: reason,
        mood: mood,
        helpTypes: helpTypes,
        helpDetails: helpDetails,
        timestamp: new Date(),
        status: 'pending',
        accommodation: '',
        checkedInAt: null
    };
    
    forms.push(form);
    saveToLocalStorage();
    
    // Show success message
    document.getElementById('checkInForm').classList.add('hidden');
    document.getElementById('successMessage').classList.remove('hidden');
    
    // Reset after 3 seconds
    setTimeout(() => {
        resetCheckInForm();
    }, 3000);
}

function loadTeacherDashboard() {
    displayForms('pending');
}

function filterForms(status) {
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    displayForms(status);
}

function displayForms(filterStatus) {
    const container = document.getElementById('formsContainer');
    container.innerHTML = '';
    
    // Get today's date range (7:15 AM to 1:58 PM)
    const today = new Date();
    today.setHours(7, 15, 0, 0);
    
    const endToday = new Date();
    endToday.setHours(13, 58, 59, 999);
    
    // Filter forms for today and by status
    let filteredForms = forms.filter(form => {
        const formDate = new Date(form.timestamp);
        const isToday = formDate >= today && formDate <= endToday;
        
        if (filterStatus === 'all') {
            return isToday;
        }
        return isToday && form.status === filterStatus;
    });
    
    if (filteredForms.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px;">No check-ins found</p>';
        return;
    }
    
    // Sort by most recent first
    filteredForms.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    filteredForms.forEach(form => {
        const card = document.createElement('div');
        card.className = `form-card ${form.status === 'checked-in' ? 'checked-in' : ''}`;
        card.onclick = () => openFormModal(form);
        
        const statusText = form.status === 'checked-in' ? 'Checked In' : 'Pending';
        const time = new Date(form.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        card.innerHTML = `
            <h3>${form.studentDisplayName}</h3>
            <span class="status ${form.status}">${statusText}</span>
            <div class="time">${time}</div>
            <div class="reason"><strong>Reason:</strong> ${form.reason}</div>
            ${form.accommodation ? `<div class="reason"><strong>Action:</strong> ${form.accommodation}</div>` : ''}
        `;
        
        container.appendChild(card);
    });
}

function openFormModal(form) {
    currentFormId = form.id;
    
    document.getElementById('studentNameModal').textContent = form.studentDisplayName;
    document.getElementById('checkInTime').textContent = new Date(form.timestamp).toLocaleString();
    document.getElementById('detailReason').textContent = form.reason;
    document.getElementById('detailMood').textContent = form.mood;
    document.getElementById('detailHelp').textContent = form.helpTypes.join(', ');
    document.getElementById('detailHelpDetails').textContent = form.helpDetails || 'None provided';
    
    const modalActions = document.getElementById('modalActions');
    const checkedInInfo = document.getElementById('checkedInInfo');
    
    if (form.status === 'pending') {
        modalActions.classList.remove('hidden');
        checkedInInfo.classList.add('hidden');
        document.getElementById('accommodation').value = '';
    } else {
        modalActions.classList.add('hidden');
        checkedInInfo.classList.remove('hidden');
        document.getElementById('givenAccommodation').textContent = form.accommodation;
    }
    
    document.getElementById('formModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('formModal').classList.add('hidden');
    currentFormId = null;
}

function checkInForm() {
    const accommodation = document.getElementById('accommodation').value.trim();
    
    if (!accommodation) {
        alert('Please enter an accommodation or action');
        return;
    }
    
    const formIndex = forms.findIndex(f => f.id === currentFormId);
    if (formIndex !== -1) {
        forms[formIndex].status = 'checked-in';
        forms[formIndex].accommodation = accommodation;
        forms[formIndex].checkedInAt = new Date();
        saveToLocalStorage();
        
        closeModal();
        displayForms('all');
    }
}

function endForm() {
    if (confirm('Are you sure you want to delete this form?')) {
        forms = forms.filter(f => f.id !== currentFormId);
        saveToLocalStorage();
        
        closeModal();
        displayForms('all');
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('formModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Allow Enter key to submit login
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const username = document.getElementById('username');
        const password = document.getElementById('password');
        
        if (document.activeElement === username || document.activeElement === password) {
            login();
        }
    }
});
