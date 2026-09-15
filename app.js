// Data storage (in production, use a backend)
let currentUser = null;
let currentUserType = null;
let currentFormId = null;
let forms = JSON.parse(localStorage.getItem('passes_forms')) || [];
let users = JSON.parse(localStorage.getItem('passes_users')) || {};
let teachers = JSON.parse(localStorage.getItem('passes_teachers')) || {};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    // Check if already logged in
    const savedUser = localStorage.getItem('passes_currentUser');
    const savedUserType = localStorage.getItem('passes_currentUserType');
    if (savedUser) {
        currentUser = savedUser;
        currentUserType = savedUserType;
        showScreens();
    }
});

function loadFromLocalStorage() {
    const savedForms = localStorage.getItem('passes_forms');
    const savedUsers = localStorage.getItem('passes_users');
    const savedTeachers = localStorage.getItem('passes_teachers');
    
    if (savedForms) forms = JSON.parse(savedForms);
    if (savedUsers) users = JSON.parse(savedUsers);
    if (savedTeachers) teachers = JSON.parse(savedTeachers);
}

function saveToLocalStorage() {
    localStorage.setItem('passes_forms', JSON.stringify(forms));
    localStorage.setItem('passes_users', JSON.stringify(users));
    localStorage.setItem('passes_teachers', JSON.stringify(teachers));
}

function toggleForm() {
    document.getElementById('loginForm').classList.toggle('hidden');
    document.getElementById('registerForm').classList.toggle('hidden');
    document.getElementById('loginError').textContent = '';
    document.getElementById('registerError').textContent = '';
}

function register() {
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const confirmPassword = document.getElementById('registerConfirmPassword').value.trim();
    const isTeacher = document.getElementById('registerTeacher').checked;
    const errorElement = document.getElementById('registerError');
    
    errorElement.textContent = '';
    
    if (!username || !password || !confirmPassword) {
        errorElement.textContent = 'Please fill in all fields';
        return;
    }
    
    if (password !== confirmPassword) {
        errorElement.textContent = 'Passwords do not match';
        return;
    }
    
    if (username.length < 3) {
        errorElement.textContent = 'Username must be at least 3 characters';
        return;
    }
    
    if (users[username]) {
        errorElement.textContent = 'Username already exists';
        return;
    }
    
    // Create user
    users[username] = {
        password: password,
        isTeacher: isTeacher,
        createdAt: new Date().toISOString()
    };
    
    // If this is the first teacher, make them admin
    const existingTeachers = Object.keys(teachers);
    if (isTeacher && existingTeachers.length === 0) {
        teachers[username] = {
            isAdmin: true,
            createdAt: new Date().toISOString()
        };
    } else if (isTeacher) {
        teachers[username] = {
            isAdmin: false,
            createdAt: new Date().toISOString()
        };
    }
    
    saveToLocalStorage();
    
    // Clear form and switch to login
    document.getElementById('registerUsername').value = '';
    document.getElementById('registerPassword').value = '';
    document.getElementById('registerConfirmPassword').value = '';
    document.getElementById('registerTeacher').checked = false;
    toggleForm();
    
    alert('Account created successfully! Please login.');
}

function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const errorElement = document.getElementById('loginError');
    
    errorElement.textContent = '';
    
    if (!username || !password) {
        errorElement.textContent = 'Please enter both username and password';
        return;
    }
    
    if (!users[username]) {
        errorElement.textContent = 'Username does not exist';
        return;
    }
    
    if (users[username].password !== password) {
        errorElement.textContent = 'Invalid password';
        return;
    }
    
    currentUser = username;
    currentUserType = users[username].isTeacher ? 'teacher' : 'student';
    
    // Save to session storage
    localStorage.setItem('passes_currentUser', currentUser);
    localStorage.setItem('passes_currentUserType', currentUserType);
    
    // Clear form
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    
    showScreens();
}

function showScreens() {
    document.getElementById('authScreen').classList.add('hidden');
    
    if (currentUserType === 'teacher') {
        document.getElementById('studentScreen').classList.add('hidden');
        document.getElementById('teacherScreen').classList.remove('hidden');
        loadTeacherDashboard();
    } else {
        document.getElementById('teacherScreen').classList.add('hidden');
        document.getElementById('studentScreen').classList.remove('hidden');
        document.getElementById('studentName').textContent = currentUser.charAt(0).toUpperCase() + currentUser.slice(1);
        resetCheckInForm();
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        currentUserType = null;
        localStorage.removeItem('passes_currentUser');
        localStorage.removeItem('passes_currentUserType');
        
        document.getElementById('authScreen').classList.remove('hidden');
        document.getElementById('studentScreen').classList.add('hidden');
        document.getElementById('teacherScreen').classList.add('hidden');
        
        // Reset forms
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('formsView').classList.remove('hidden');
        document.getElementById('teacherManagementView').classList.add('hidden');
    }
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
    // Find and highlight the clicked button
    document.querySelectorAll('.mood-btn').forEach(btn => {
        if (btn.getAttribute('data-mood') === mood) {
            btn.classList.add('selected');
        }
    });
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
        timestamp: new Date().toISOString(),
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
    document.getElementById('formsView').classList.remove('hidden');
    document.getElementById('teacherManagementView').classList.add('hidden');
    displayForms('pending');
}

function showTeacherManagement() {
    document.getElementById('formsView').classList.add('hidden');
    document.getElementById('teacherManagementView').classList.remove('hidden');
    displayTeachers();
}

function displayTeachers() {
    const container = document.getElementById('teachersContainer');
    container.innerHTML = '';
    
    const teacherList = Object.keys(teachers);
    
    if (teacherList.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No teachers yet</p>';
        return;
    }
    
    teacherList.forEach(teacherName => {
        const teacher = teachers[teacherName];
        const isCurrentUser = teacherName === currentUser;
        const isCurrentUserAdmin = teachers[currentUser]?.isAdmin;
        const canModify = isCurrentUserAdmin && !teacher.isAdmin && !isCurrentUser;
        
        const card = document.createElement('div');
        card.className = 'teacher-card';
        
        card.innerHTML = `
            <div class="teacher-info">
                <h3>${teacherName.charAt(0).toUpperCase() + teacherName.slice(1)}</h3>
                ${teacher.isAdmin ? '<span class="admin-badge">👑 Admin</span>' : '<span class="teacher-badge">Teacher</span>'}
            </div>
            <div class="teacher-actions">
                ${isCurrentUserAdmin && !isCurrentUser ? `
                    ${teacher.isAdmin ? '<button class="btn btn-secondary" disabled>Cannot Revoke Admin</button>' : `
                        <button class="btn btn-warning" onclick="makeAdmin('${teacherName}')">Make Admin</button>
                        <button class="btn btn-danger" onclick="revokeTeacher('${teacherName}')">Revoke Access</button>
                    `}
                ` : ''}
                ${isCurrentUser ? `
                    <button class="btn btn-danger" onclick="deleteOwnAccount()">Delete My Account</button>
                ` : ''}
            </div>
        `;
        
        container.appendChild(card);
    });
}

function makeAdmin(teacherName) {
    if (confirm(`Make ${teacherName} an admin?`)) {
        teachers[teacherName].isAdmin = true;
        saveToLocalStorage();
        displayTeachers();
    }
}

function revokeTeacher(teacherName) {
    if (confirm(`Revoke teacher access from ${teacherName}?`)) {
        delete teachers[teacherName];
        users[teacherName].isTeacher = false;
        saveToLocalStorage();
        displayTeachers();
    }
}

function deleteOwnAccount() {
    if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
        if (confirm('This is permanent. Type "delete" in the next prompt to confirm.')) {
            const confirmation = prompt('Type "delete" to confirm:');
            if (confirmation === 'delete') {
                delete users[currentUser];
                if (teachers[currentUser]) {
                    delete teachers[currentUser];
                }
                saveToLocalStorage();
                logout();
            }
        }
    }
}

function filterForms(status) {
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    // Find the clicked button and mark it as active
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.textContent.toLowerCase().includes(status === 'pending' ? 'pending' : status === 'checked-in' ? 'checked' : 'all')) {
            btn.classList.add('active');
        }
    });
    
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
        forms[formIndex].checkedInAt = new Date().toISOString();
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

// Allow Enter key to submit login/register
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const loginUsername = document.getElementById('loginUsername');
        const loginPassword = document.getElementById('loginPassword');
        const registerUsername = document.getElementById('registerUsername');
        const registerPassword = document.getElementById('registerPassword');
        
        if (document.activeElement === loginUsername || document.activeElement === loginPassword) {
            login();
        } else if (document.activeElement === registerUsername || document.activeElement === registerPassword) {
            register();
        }
    }
});