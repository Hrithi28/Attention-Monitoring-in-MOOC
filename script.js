// Global variables
let formResponses = JSON.parse(localStorage.getItem('formResponses')) || [];
let currentResponseIndex = 0;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeDateSelects();
    initializeTimeSelects();
    initializeTabNavigation();
    updateResponseCounts();
    loadResponsesTable();
    updateIndividualResponse();
    generateSummary();
    
    // Add form submit event listener
    document.getElementById('researchForm').addEventListener('submit', handleFormSubmit);
});

// Initialize date select dropdowns
function initializeDateSelects() {
    const daySelects = document.querySelectorAll('select[name$="Day"]');
    const monthSelects = document.querySelectorAll('select[name$="Month"]');
    const yearSelects = document.querySelectorAll('select[name$="Year"]');
    
    // Populate days (1-31)
    daySelects.forEach(select => {
        for (let i = 1; i <= 31; i++) {
            const option = document.createElement('option');
            option.value = i.toString().padStart(2, '0');
            option.textContent = i.toString().padStart(2, '0');
            select.appendChild(option);
        }
    });
    
    // Populate months
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    monthSelects.forEach(select => {
        months.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = (index + 1).toString().padStart(2, '0');
            option.textContent = month;
            select.appendChild(option);
        });
    });
    
    // Populate years (current year - 100 to current year + 10)
    const currentYear = new Date().getFullYear();
    yearSelects.forEach(select => {
        const isSessionDate = select.name === 'sessionYear';
        const startYear = isSessionDate ? currentYear : currentYear - 100;
        const endYear = isSessionDate ? currentYear + 10 : currentYear;
        
        for (let year = endYear; year >= startYear; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            select.appendChild(option);
        }
    });
}

// Initialize time select dropdowns
function initializeTimeSelects() {
    const hourSelect = document.querySelector('select[name="sessionHour"]');
    const minuteSelect = document.querySelector('select[name="sessionMinute"]');
    
    // Populate hours (1-12)
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement('option');
        option.value = i.toString().padStart(2, '0');
        option.textContent = i.toString().padStart(2, '0');
        hourSelect.appendChild(option);
    }
    
    // Populate minutes (00, 15, 30, 45)
    const minutes = ['00', '15', '30', '45'];
    minutes.forEach(minute => {
        const option = document.createElement('option');
        option.value = minute;
        option.textContent = minute;
        minuteSelect.appendChild(option);
    });
}

// Initialize tab navigation
function initializeTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all tabs and buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
            
            // Refresh content based on tab
            if (targetTab === 'responses') {
                loadResponsesTable();
            } else if (targetTab === 'individual') {
                updateIndividualResponse();
            } else if (targetTab === 'summary') {
                generateSummary();
            }
        });
    });
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const responseData = {
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
    };
    
    // Convert form data to object
    for (let [key, value] of formData.entries()) {
        responseData[key] = value;
    }
    
    // Format dates
    if (responseData.dobDay && responseData.dobMonth && responseData.dobYear) {
        responseData.dateOfBirth = `${responseData.dobDay}/${responseData.dobMonth}/${responseData.dobYear}`;
    }
    
    if (responseData.sessionDay && responseData.sessionMonth && responseData.sessionYear) {
        responseData.sessionDate = `${responseData.sessionDay}/${responseData.sessionMonth}/${responseData.sessionYear}`;
    }
    
    if (responseData.sessionHour && responseData.sessionMinute && responseData.sessionAmPm) {
        responseData.sessionTime = `${responseData.sessionHour}:${responseData.sessionMinute} ${responseData.sessionAmPm}`;
    }
    
    // Add to responses array
    formResponses.push(responseData);
    
    // Save to localStorage
    localStorage.setItem('formResponses', JSON.stringify(formResponses));
    
    // Update UI
    updateResponseCounts();
    showSuccessMessage();
    clearForm();
    
    // Switch to responses tab
    document.querySelector('.tab-btn[data-tab="responses"]').click();
}

// Show success message
function showSuccessMessage() {
    let successMessage = document.querySelector('.success-message');
    if (!successMessage) {
        successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <span class="material-icons">check_circle</span>
            Your response has been recorded successfully!
        `;
        document.querySelector('.form-container').insertBefore(successMessage, document.querySelector('.submit-section'));
    }
    
    successMessage.classList.add('show');
    
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 5000);
}

// Clear form
function clearForm() {
    document.getElementById('researchForm').reset();
}

// Update response counts
function updateResponseCounts() {
    const count = formResponses.length;
    document.getElementById('responseCount').textContent = `${count} response${count !== 1 ? 's' : ''}`;
    document.getElementById('tabResponseCount').textContent = count;
}

// Load responses into table
function loadResponsesTable() {
    const tbody = document.getElementById('responsesTableBody');
    tbody.innerHTML = '';
    
    if (formResponses.length === 0) {
        const row = tbody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 8;
        cell.textContent = 'No responses yet';
        cell.style.textAlign = 'center';
        cell.style.padding = '24px';
        cell.style.color = '#5f6368';
        return;
    }
    
    formResponses.forEach((response, index) => {
        const row = tbody.insertRow();
        
        // Format timestamp
        const date = new Date(response.timestamp);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${response.email || '-'}</td>
            <td>${response.applicantName || '-'}</td>
            <td>${response.registerNumber || '-'}</td>
            <td>${response.university || '-'}</td>
            <td>${response.gender || '-'}</td>
            <td>${response.applicantType || '-'}</td>
            <td>
                <button onclick="viewResponse(${index})" class="view-btn" style="background-color: #1a73e8; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">View</button>
                <button onclick="deleteResponse(${index})" class="delete-btn" style="background-color: #d93025; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-left: 4px;">Delete</button>
            </td>
        `;
    });
}

// View specific response
function viewResponse(index) {
    currentResponseIndex = index;
    document.querySelector('.tab-btn[data-tab="individual"]').click();
}

// Delete response
function deleteResponse(index) {
    if (confirm('Are you sure you want to delete this response?')) {
        formResponses.splice(index, 1);
        localStorage.setItem('formResponses', JSON.stringify(formResponses));
        updateResponseCounts();
        loadResponsesTable();
        generateSummary();
        
        // Update current index if necessary
        if (currentResponseIndex >= formResponses.length) {
            currentResponseIndex = Math.max(0, formResponses.length - 1);
        }
        updateIndividualResponse();
    }
}

// Navigate between individual responses
function navigateResponse(direction) {
    if (formResponses.length === 0) return;
    
    currentResponseIndex += direction;
    
    if (currentResponseIndex < 0) {
        currentResponseIndex = formResponses.length - 1;
    } else if (currentResponseIndex >= formResponses.length) {
        currentResponseIndex = 0;
    }
    
    updateIndividualResponse();
}

// Update individual response display
function updateIndividualResponse() {
    const container = document.getElementById('individualResponseContent');
    const indicator = document.getElementById('responseIndicator');
    const prevBtn = document.getElementById('prevResponse');
    const nextBtn = document.getElementById('nextResponse');
    
    if (formResponses.length === 0) {
        container.innerHTML = '<p>No responses to display</p>';
        indicator.textContent = 'No responses';
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        return;
    }
    
    const response = formResponses[currentResponseIndex];
    indicator.textContent = `${currentResponseIndex + 1} of ${formResponses.length}`;
    prevBtn.disabled = false;
    nextBtn.disabled = false;
    
    // Field labels mapping
    const fieldLabels = {
        timestamp: 'Submitted on',
        email: 'Email Address',
        applicantName: 'Applicant Name',
        registerNumber: 'Register Number',
        university: 'University',
        degree: 'Degree',
        gender: 'Gender',
        dateOfBirth: 'Date of Birth',
        phoneNumber: 'Phone Number',
        motherTongue: 'Mother Tongue',
        permanentAddress: 'Permanent Address',
        temporaryAddress: 'Temporary Address',
        district: 'District',
        state: 'State',
        country: 'Country',
        applicantType: 'Applicant Type',
        schoolName: 'School Name',
        collegeName: 'College Name',
        yearOfStudy: 'Year of Study',
        department: 'Department',
        sessionDate: 'Session Date',
        sessionTime: 'Session Time',
        researchDataInterest: 'Interested in data for research',
        eegWebcamConsent: 'Willing to wear EEG device and webcam',
        dataUsageConsent: 'Willing to give data for research use'
    };
    
    let html = '';
    
    Object.keys(response).forEach(key => {
        if (key === 'id' || key.includes('Day') || key.includes('Month') || key.includes('Year') || 
            key.includes('Hour') || key.includes('Minute') || key.includes('AmPm')) {
            return; // Skip these fields as they're combined into formatted dates/times
        }
        
        const label = fieldLabels[key] || key;
        let value = response[key];
        
        if (key === 'timestamp') {
            value = new Date(value).toLocaleString();
        }
        
        html += `
            <div class="response-field">
                <div class="response-field-label">${label}</div>
                <div class="response-field-value">${value || '-'}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Generate summary statistics
function generateSummary() {
    const container = document.getElementById('summaryContent');
    
    if (formResponses.length === 0) {
        container.innerHTML = '<p>No responses to summarize</p>';
        return;
    }
    
    // Calculate statistics
    const stats = {
        gender: {},
        applicantType: {},
        yearOfStudy: {},
        researchDataInterest: {},
        eegWebcamConsent: {},
        dataUsageConsent: {}
    };
    
    formResponses.forEach(response => {
        Object.keys(stats).forEach(field => {
            const value = response[field] || 'Not specified';
            stats[field][value] = (stats[field][value] || 0) + 1;
        });
    });
    
    let html = '';
    
    Object.keys(stats).forEach(field => {
        const fieldData = stats[field];
        const total = Object.values(fieldData).reduce((a, b) => a + b, 0);
        
        const fieldLabels = {
            gender: 'Gender Distribution',
            applicantType: 'Applicant Type Distribution',
            yearOfStudy: 'Year of Study Distribution',
            researchDataInterest: 'Research Data Interest',
            eegWebcamConsent: 'EEG & Webcam Consent',
            dataUsageConsent: 'Data Usage Consent'
        };
        
        html += `
            <div class="summary-chart">
                <h3>${fieldLabels[field]}</h3>
        `;
        
        Object.entries(fieldData).forEach(([value, count]) => {
            const percentage = Math.round((count / total) * 100);
            html += `
                <div class="chart-item">
                    <span class="chart-label">${value}</span>
                    <span class="chart-value">${count} (${percentage}%)</span>
                </div>
                <div class="chart-bar">
                    <div class="chart-bar-fill" style="width: ${percentage}%"></div>
                </div>
            `;
        });
        
        html += '</div>';
    });
    
    container.innerHTML = html;
}

// Export responses to CSV
function exportToCSV() {
    if (formResponses.length === 0) {
        alert('No responses to export');
        return;
    }
    
    // Get all unique field names
    const allFields = new Set();
    formResponses.forEach(response => {
        Object.keys(response).forEach(field => allFields.add(field));
    });
    
    const fields = Array.from(allFields).sort();
    
    // Create CSV content
    let csvContent = fields.join(',') + '\n';
    
    formResponses.forEach(response => {
        const row = fields.map(field => {
            let value = response[field] || '';
            // Escape commas and quotes in CSV
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                value = '"' + value.replace(/"/g, '""') + '"';
            }
            return value;
        });
        csvContent += row.join(',') + '\n';
    });
    
    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `research_ethics_responses_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Add some sample data for demonstration (remove in production)
function addSampleData() {
    const sampleResponses = [
        {
            id: '1',
            timestamp: new Date('2024-01-15T10:30:00').toISOString(),
            email: 'john.doe@university.edu',
            applicantName: 'John Doe',
            registerNumber: '2021CS001',
            university: 'ABC University',
            degree: 'Bachelor of Computer Science',
            gender: 'male',
            dateOfBirth: '15/03/2000',
            phoneNumber: '+91-9876543210',
            motherTongue: 'English',
            permanentAddress: '123 Main St, City, State',
            temporaryAddress: '456 College Rd, University Town',
            district: 'District Name',
            state: 'State Name',
            country: 'India',
            applicantType: 'ug-student',
            schoolName: 'XYZ High School',
            collegeName: 'ABC University',
            yearOfStudy: 'iii-year',
            department: 'Computer Science',
            sessionDate: '20/01/2024',
            sessionTime: '02:30 PM',
            researchDataInterest: 'yes',
            eegWebcamConsent: 'yes',
            dataUsageConsent: 'yes'
        },
        {
            id: '2',
            timestamp: new Date('2024-01-16T14:45:00').toISOString(),
            email: 'jane.smith@university.edu',
            applicantName: 'Jane Smith',
            registerNumber: '2020EE025',
            university: 'XYZ Institute',
            degree: 'Bachelor of Electrical Engineering',
            gender: 'female',
            dateOfBirth: '22/07/1999',
            phoneNumber: '+91-9876543211',
            motherTongue: 'Hindi',
            permanentAddress: '789 Park Ave, City, State',
            temporaryAddress: '321 Hostel Block, Campus',
            district: 'Another District',
            state: 'Another State',
            country: 'India',
            applicantType: 'ug-student',
            schoolName: 'PQR High School',
            collegeName: 'XYZ Institute',
            yearOfStudy: 'iv-year',
            department: 'Electrical Engineering',
            sessionDate: '25/01/2024',
            sessionTime: '10:00 AM',
            researchDataInterest: 'maybe',
            eegWebcamConsent: 'no',
            dataUsageConsent: 'yes'
        }
    ];
    
    // Only add sample data if no responses exist
    if (formResponses.length === 0) {
        formResponses = sampleResponses;
        localStorage.setItem('formResponses', JSON.stringify(formResponses));
        updateResponseCounts();
        loadResponsesTable();
        generateSummary();
    }
}

// Uncomment the line below to add sample data for testing
// addSampleData();