document.addEventListener('DOMContentLoaded', function() {
    let resumeData = {
        personalInfo: {},
        experiences: [],
        education: [],
        skills: [],
        projects: []
    };

    // Template selection
    const templateButtons = document.querySelectorAll('.template-btn');
    templateButtons.forEach(button => {
        button.addEventListener('click', function() {
            templateButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            updateResumePreview();
        });
    });

    // Color scheme selection
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            document.getElementById('resumePreview').className = `bg-white text-gray-800 shadow-2xl rounded-lg p-6 transform hover:scale-105 transition-all duration-300 ${color}`;
            updateResumePreview();
        });
    });

    // Layout selection
    const layoutButtons = document.querySelectorAll('.layout-btn');
    layoutButtons.forEach(button => {
        button.addEventListener('click', function() {
            layoutButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            updateResumePreview();
        });
    });

    // Personal Information
    const personalInfoInputs = document.querySelectorAll('#resumeForm input:not([type="button"]), #resumeForm textarea');
    personalInfoInputs.forEach(input => {
        input.addEventListener('input', function() {
            resumeData.personalInfo[this.name] = this.value;
            updateResumePreview();
            updateProgress();
            updateATSScore();
        });
    });

    // Experience
    document.getElementById('addExperience').addEventListener('click', function() {
        const experienceEntry = createExperienceEntry();
        document.getElementById('experienceEntries').appendChild(experienceEntry);
        updateProgress();
        updateATSScore();
    });

    // Education
    document.getElementById('addEducation').addEventListener('click', function() {
        const educationEntry = createEducationEntry();
        document.getElementById('educationEntries').appendChild(educationEntry);
        updateProgress();
        updateATSScore();
    });

    // Skills
    document.getElementById('addSkill').addEventListener('click', function() {
        const skillInput = document.getElementById('skillInput');
        if (skillInput.value.trim() !== '') {
            addSkill(skillInput.value.trim());
            skillInput.value = '';
            updateProgress();
            updateATSScore();
        }
    });

    // Projects
    document.getElementById('addProject').addEventListener('click', function() {
        const projectEntry = createProjectEntry();
        document.getElementById('projectEntries').appendChild(projectEntry);
        updateProgress();
        updateATSScore();
    });

    // Form submission
    document.getElementById('resumeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        generateResume();
    });

    // Helper functions
    function createExperienceEntry() {
        const entry = document.createElement('div');
        entry.className = 'experience-entry slide-in';
        entry.innerHTML = `
            <div class="drag-handle"><i class="fas fa-grip-lines"></i></div>
            <input type="text" placeholder="Job Title" name="jobTitle" required>
            <input type="text" placeholder="Company" name="company" required>
            <input type="text" placeholder="Location" name="location">
            <input type="date" name="startDate">
            <input type="date" name="endDate">
            <textarea placeholder="Job Description" name="description" required></textarea>
            <button type="button" class="remove-btn">Remove</button>
        `;
        entry.querySelector('.remove-btn').addEventListener('click', function() {
            entry.remove();
            updateResumePreview();
            updateProgress();
            updateATSScore();
        });
        entry.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', function() {
                updateResumePreview();
                updateProgress();
                updateATSScore();
            });
        });
        return entry;
    }

    function createEducationEntry() {
        const entry = document.createElement('div');
        entry.className = 'education-entry slide-in';
        entry.innerHTML = `
            <div class="drag-handle"><i class="fas fa-grip-lines"></i></div>
            <input type="text" placeholder="Degree" name="degree" required>
            <input type="text" placeholder="Institution" name="institution" required>
            <input type="text" placeholder="Location" name="location">
            <input type="date" name="graduationDate">
            <button type="button" class="remove-btn">Remove</button>
        `;
        entry.querySelector('.remove-btn').addEventListener('click', function() {
            entry.remove();
            updateResumePreview();
            updateProgress();
            updateATSScore();
        });
        entry.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', function() {
                updateResumePreview();
                updateProgress();
                updateATSScore();
            });
        });
        return entry;
    }

    function addSkill(skill) {
        const skillTag = document.createElement('span');
        skillTag.className = 'skill-tag fade-in';
        skillTag.textContent = skill;
        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '&times;';
        removeBtn.addEventListener('click', function() {
            skillTag.remove();
            resumeData.skills = resumeData.skills.filter(s => s !== skill);
            updateResumePreview();
            updateProgress();
            updateATSScore();
        });
        skillTag.appendChild(removeBtn);
        document.getElementById('skillsEntries').appendChild(skillTag);
        resumeData.skills.push(skill);
        updateResumePreview();
    }

    function createProjectEntry() {
        const entry = document.createElement('div');
        entry.className = 'project-entry slide-in';
        entry.innerHTML = `
            <div class="drag-handle"><i class="fas fa-grip-lines"></i></div>
            <input type="text" placeholder="Project Name" name="projectName" required>
            <textarea placeholder="Project Description" name="projectDescription" required></textarea>
            <input type="text" placeholder="Technologies Used" name="technologies">
            <button type="button" class="remove-btn">Remove</button>
        `;
        entry.querySelector('.remove-btn').addEventListener('click', function() {
            entry.remove();
            updateResumePreview();
            updateProgress();
            updateATSScore();
        });
        entry.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', function() {
                updateResumePreview();
                updateProgress();
                updateATSScore();
            });
        });
        return entry;
    }

    function updateProgress() {
        const totalFields = document.querySelectorAll('#resumeForm input:not([type="button"]), #resumeForm textarea').length;
        const filledFields = Array.from(document.querySelectorAll('#resumeForm input:not([type="button"]), #resumeForm textarea')).filter(field => field.value.trim() !== '').length;
        const progress = (filledFields / totalFields) * 100;
        document.querySelector('.progress').style.width = `${progress}%`;
    }

    function updateResumePreview() {
        const preview = document.getElementById('resumePreview');
        const template = document.querySelector('.template-btn.active').getAttribute('data-template');
        const layout = document.querySelector('.layout-btn.active').getAttribute('data-layout');

        preview.className = `${template} ${layout} bg-white text-gray-800 shadow-2xl rounded-lg p-6 transform hover:scale-105 transition-all duration-300`;

        // Update personal info
        preview.innerHTML = `
            <h1 class="text-4xl font-bold mb-2">${resumeData.personalInfo.name || 'Your Name'}</h1>
            <p class="text-lg mb-4">${resumeData.personalInfo.email || 'email@example.com'} | ${resumeData.personalInfo.phone || 'Phone'} | ${resumeData.personalInfo.location || 'Location'}</p>
            <h2 class="text-2xl font-semibold mt-6 mb-2">Professional Summary</h2>
            <p class="mb-4">${resumeData.personalInfo.summary || 'Your professional summary goes here.'}</p>
        `;

        // Update experiences
        const experiences = Array.from(document.querySelectorAll('.experience-entry')).map(entry => {
            return {
                jobTitle: entry.querySelector('[name="jobTitle"]').value,
                company: entry.querySelector('[name="company"]').value,
                location: entry.querySelector('[name="location"]').value,
                startDate: entry.querySelector('[name="startDate"]').value,
                endDate: entry.querySelector('[name="endDate"]').value,
                description: entry.querySelector('[name="description"]').value
            };
        });
        if (experiences.length > 0) {
            preview.innerHTML += `<h2 class="text-2xl font-semibold mt-6 mb-2">Work Experience</h2>`;
            experiences.forEach(exp => {
                preview.innerHTML += `
                    <div class="mb-4">
                        <h3 class="text-xl font-semibold">${exp.jobTitle} at ${exp.company}</h3>
                        <p class="text-sm text-gray-600">${exp.location} | ${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}</p>
                        <p class="mt-2">${exp.description}</p>
                    </div>
                `;
            });
        }

        // Update education
        const education = Array.from(document.querySelectorAll('.education-entry')).map(entry => {
            return {
                degree: entry.querySelector('[name="degree"]').value,
                institution: entry.querySelector('[name="institution"]').value,
                location: entry.querySelector('[name="location"]').value,
                graduationDate: entry.querySelector('[name="graduationDate"]').value
            };
        });
        if (education.length > 0) {
            preview.innerHTML += `<h2 class="text-2xl font-semibold mt-6 mb-2">Education</h2>`;
            education.forEach(edu => {
                preview.innerHTML += `
                    <div class="mb-4">
                        <h3 class="text-xl font-semibold">${edu.degree} - ${edu.institution}</h3>
                        <p class="text-sm text-gray-600">${edu.location} | Graduated: ${formatDate(edu.graduationDate)}</p>
                    </div>
                `;
            });
        }

        // Update skills
        if (resumeData.skills.length > 0) {
            preview.innerHTML += `<h2 class="text-2xl font-semibold mt-6 mb-2">Skills</h2>`;
            preview.innerHTML += `<div class="flex flex-wrap gap-2">`;
            resumeData.skills.forEach(skill => {
                preview.innerHTML += `<span class="bg-gray-200 text-gray-800 px-2 py-1 rounded">${skill}</span>`;
            });
            preview.innerHTML += `</div>`;
        }

        // Update projects
        const projects = Array.from(document.querySelectorAll('.project-entry')).map(entry => {
            return {
                name: entry.querySelector('[name="projectName"]').value,
                description: entry.querySelector('[name="projectDescription"]').value,
                technologies: entry.querySelector('[name="technologies"]').value
            };
        });
        if (projects.length > 0) {
            preview.innerHTML += `<h2 class="text-2xl font-semibold mt-6 mb-2">Projects</h2>`;
            projects.forEach(project => {
                preview.innerHTML += `
                    <div class="mb-4">
                        <h3 class="text-xl font-semibold">${project.name}</h3>
                        <p class="mt-2">${project.description}</p>
                        <p class="text-sm text-gray-600">Technologies: ${project.technologies}</p>
                    </div>
                `;
            });
        }

        // Add fade-in animation to new content
        const newSections = preview.querySelectorAll('h2, h3, p, ul');
        newSections.forEach(section => {
            section.classList.add('fade-in');
        });
    }

    function formatDate(dateString) {
        if (!dateString) return 'Present';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }

    function updateATSScore() {
        let score = 0;
        const maxScore = 100;

        // Personal Information
        score += resumeData.personalInfo.name ? 5 : 0;
        score += resumeData.personalInfo.email ? 5 : 0;
        score += resumeData.personalInfo.phone ? 5 : 0;
        score += resumeData.personalInfo.location ? 3 : 0;
        score += resumeData.personalInfo.summary ? 7 : 0;

        // Experience
        const experiences = document.querySelectorAll('.experience-entry');
        experiences.forEach(exp => {
            score += 5; // Base score for each experience
            score += exp.querySelector('[name="description"]').value.length > 100 ? 3 : 0; // Bonus for detailed description
        });

        // Education
        const education = document.querySelectorAll('.education-entry');
        education.forEach(edu => {
            score += 5; // Base score for each education entry
        });

        // Skills
        score += Math.min(resumeData.skills.length * 2, 10); // Up to 10 points for skills

        // Projects
        const projects = document.querySelectorAll('.project-entry');
        projects.forEach(project => {
            score += 3; // Base score for each project
            score += project.querySelector('[name="technologies"]').value.split(',').length > 2 ? 2 : 0; // Bonus for multiple technologies
        });

        // Keyword matching (simplified version)
        const keywords = ['leadership', 'teamwork', 'communication', 'problem-solving', 'innovative'];
        const allText = JSON.stringify(resumeData).toLowerCase();
        keywords.forEach(keyword => {
            if (allText.includes(keyword)) score += 2;
        });

        // Normalize score
        score = Math.min(score, maxScore);

        // Update ATS score display
        const atsScoreElement = document.getElementById('atsScoreValue');
        const atsScoreBar = document.querySelector('#atsScore .bg-blue-600');
        atsScoreElement.textContent = `${score}%`;
        atsScoreBar.style.width = `${score}%`;

        // Update suggestions
        updateSuggestions(score);
    }

    function updateSuggestions(score) {
        const suggestionsList = document.getElementById('suggestionsList');
        suggestionsList.innerHTML = '';

        if (score < 70) {
            suggestionsList.innerHTML += '<li>Consider adding more details to your work experiences.</li>';
        }
        if (resumeData.skills.length < 5) {
            suggestionsList.innerHTML += '<li>Try to include at least 5 relevant skills.</li>';
        }
        if (!resumeData.personalInfo.summary) {
            suggestionsList.innerHTML += '<li>A professional summary can greatly improve your resume.</li>';
        }
        if (document.querySelectorAll('.experience-entry').length < 2) {
            suggestionsList.innerHTML += '<li>Including more work experiences can strengthen your resume.</li>';
        }
        if (document.querySelectorAll('.project-entry').length < 2) {
            suggestionsList.innerHTML += '<li>Adding more projects can showcase your practical skills.</li>';
        }
        if (!resumeData.personalInfo.location) {
            suggestionsList.innerHTML += '<li>Including your location can help with local job searches.</li>';
        }
        // Check for keywords
        const keywords = ['leadership', 'teamwork', 'communication', 'problem-solving', 'innovative'];
        const allText = JSON.stringify(resumeData).toLowerCase();
        const missingKeywords = keywords.filter(keyword => !allText.includes(keyword));
        if (missingKeywords.length > 0) {
            suggestionsList.innerHTML += `<li>Consider incorporating these keywords: ${missingKeywords.join(', ')}</li>`;
        }
    }

    function generateResume() {
        const template = document.querySelector('.template-btn.active').getAttribute('data-template');
        const layout = document.querySelector('.layout-btn.active').getAttribute('data-layout');
        const color = document.querySelector('.color-btn.active').getAttribute('data-color');
    
        // Collect all data
        const experiences = Array.from(document.querySelectorAll('.experience-entry')).map(entry => ({
            jobTitle: entry.querySelector('[name="jobTitle"]').value,
            company: entry.querySelector('[name="company"]').value,
            location: entry.querySelector('[name="location"]').value,
            startDate: entry.querySelector('[name="startDate"]').value,
            endDate: entry.querySelector('[name="endDate"]').value,
            description: entry.querySelector('[name="description"]').value
        }));
    
        const education = Array.from(document.querySelectorAll('.education-entry')).map(entry => ({
            degree: entry.querySelector('[name="degree"]').value,
            institution: entry.querySelector('[name="institution"]').value,
            location: entry.querySelector('[name="location"]').value,
            graduationDate: entry.querySelector('[name="graduationDate"]').value
        }));
    
        const projects = Array.from(document.querySelectorAll('.project-entry')).map(entry => ({
            name: entry.querySelector('[name="projectName"]').value,
            description: entry.querySelector('[name="projectDescription"]').value,
            technologies: entry.querySelector('[name="technologies"]').value
        }));
    
        // Combine all data
        const finalResumeData = {
            personalInfo: resumeData.personalInfo,
            experiences: experiences,
            education: education,
            skills: resumeData.skills,
            projects: projects,
            template: template,
            layout: layout,
            color: color
        };
    
        // Generate PDF
        generatePDF(finalResumeData);
    }
    
    function generatePDF(data) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        const element = document.getElementById('resumePreview');
        
        pdf.html(element, {
            callback: function(pdf) {
                pdf.save('resume.pdf');
            },
            x: 15,
            y: 15,
            width: 170,
            windowWidth: 650
        });
    }
    
    function downloadWord() {
        const doc = new docx.Document({
            sections: [{
                properties: {},
                children: [
                    new docx.Paragraph({
                        text: resumeData.personalInfo.name,
                        heading: docx.HeadingLevel.HEADING_1
                    }),
                    new docx.Paragraph({
                        text: `${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone} | ${resumeData.personalInfo.location}`
                    }),
                    // Add more sections (experience, education, etc.) here
                ]
            }]
        });
        
        docx.Packer.toBlob(doc).then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style = 'display: none';
            a.href = url;
            a.download = 'resume.docx';
            a.click();
            window.URL.revokeObjectURL(url);
        });
    }

    function initDragAndDrop() {
        const containers = document.querySelectorAll('#experienceEntries, #educationEntries, #projectEntries');
        containers.forEach(container => {
            new Sortable(container, {
                animation: 150,
                handle: '.drag-handle',
                onEnd: () => {
                    updateResumePreview();
                    updateATSScore();
                }
            });
        });
    }

    // Initialize the application
    function init() {
        updateResumePreview();
        updateProgress();
        updateATSScore();
        initDragAndDrop();
    }
    
    // Event listeners for download buttons
    document.getElementById('downloadPDF').addEventListener('click', generateResume);
    document.getElementById('downloadWord').addEventListener('click', downloadWord);
    document.getElementById('downloadATS').addEventListener('click', () => {
        alert('ATS-friendly version download functionality to be implemented');
    });

    init();
});