document.addEventListener('DOMContentLoaded', function() {
    // Global variables
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
            document.getElementById('resumePreview').className = color;
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
        });
    });

    // Experience
    document.getElementById('addExperience').addEventListener('click', function() {
        const experienceEntry = createExperienceEntry();
        document.getElementById('experienceEntries').appendChild(experienceEntry);
        updateProgress();
    });

    // Education
    document.getElementById('addEducation').addEventListener('click', function() {
        const educationEntry = createEducationEntry();
        document.getElementById('educationEntries').appendChild(educationEntry);
        updateProgress();
    });

    // Skills
    document.getElementById('addSkill').addEventListener('click', function() {
        const skillInput = document.getElementById('skillInput');
        if (skillInput.value.trim() !== '') {
            addSkill(skillInput.value.trim());
            skillInput.value = '';
            updateProgress();
        }
    });

    // Projects
    document.getElementById('addProject').addEventListener('click', function() {
        const projectEntry = createProjectEntry();
        document.getElementById('projectEntries').appendChild(projectEntry);
        updateProgress();
    });

    // Form submission
    document.getElementById('resumeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        generateResume();
    });

    // Helper functions
    function createExperienceEntry() {
        const entry = document.createElement('div');
        entry.className = 'experience-entry';
        entry.innerHTML = `
            <div class="drag-handle"><i class="fas fa-grip-lines"></i></div>
            <input type="text" placeholder="Job Title" name="jobTitle">
            <input type="text" placeholder="Company" name="company">
            <input type="text" placeholder="Location" name="location">
            <input type="date" name="startDate">
            <input type="date" name="endDate">
            <textarea placeholder="Job Description" name="description"></textarea>
            <button type="button" class="remove-btn">Remove</button>
        `;
        entry.querySelector('.remove-btn').addEventListener('click', function() {
            entry.remove();
            updateResumePreview();
            updateProgress();
        });
        entry.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', function() {
                updateResumePreview();
                updateProgress();
            });
        });
        return entry;
    }

    function createEducationEntry() {
        const entry = document.createElement('div');
        entry.className = 'education-entry';
        entry.innerHTML = `
            <div class="drag-handle"><i class="fas fa-grip-lines"></i></div>
            <input type="text" placeholder="Degree" name="degree">
            <input type="text" placeholder="Institution" name="institution">
            <input type="text" placeholder="Location" name="location">
            <input type="date" name="graduationDate">
            <button type="button" class="remove-btn">Remove</button>
        `;
        entry.querySelector('.remove-btn').addEventListener('click', function() {
            entry.remove();
            updateResumePreview();
            updateProgress();
        });
        entry.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', function() {
                updateResumePreview();
                updateProgress();
            });
        });
        return entry;
    }

    function addSkill(skill) {
        const skillTag = document.createElement('span');
        skillTag.className = 'skill-tag';
        skillTag.textContent = skill;
        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '&times;';
        removeBtn.addEventListener('click', function() {
            skillTag.remove();
            updateResumePreview();
            updateProgress();
        });
        skillTag.appendChild(removeBtn);
        document.getElementById('skillsEntries').appendChild(skillTag);
        resumeData.skills.push(skill);
        updateResumePreview();
    }

    function createProjectEntry() {
        const entry = document.createElement('div');
        entry.className = 'project-entry';
        entry.innerHTML = `
            <div class="drag-handle"><i class="fas fa-grip-lines"></i></div>
            <input type="text" placeholder="Project Name" name="projectName">
            <textarea placeholder="Project Description" name="projectDescription"></textarea>
            <input type="text" placeholder="Technologies Used" name="technologies">
            <button type="button" class="remove-btn">Remove</button>
        `;
        entry.querySelector('.remove-btn').addEventListener('click', function() {
            entry.remove();
            updateResumePreview();
            updateProgress();
        });
        entry.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', function() {
                updateResumePreview();
                updateProgress();
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

        preview.className = `${template} ${layout}`;

        // Update personal info
        preview.innerHTML = `
            <h1>${resumeData.personalInfo.name || 'Your Name'}</h1>
            <p>${resumeData.personalInfo.email || 'email@example.com'} | ${resumeData.personalInfo.phone || 'Phone'} | ${resumeData.personalInfo.location || 'Location'}</p>
            <h2>Professional Summary</h2>
            <p>${resumeData.personalInfo.summary || 'Your professional summary goes here.'}</p>
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
            preview.innerHTML += `<h2>Work Experience</h2>`;
            experiences.forEach(exp => {
                preview.innerHTML += `
                    <h3>${exp.jobTitle} at ${exp.company}</h3>
                    <p>${exp.location} | ${exp.startDate} - ${exp.endDate}</p>
                    <p>${exp.description}</p>
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
            preview.innerHTML += `<h2>Education</h2>`;
            education.forEach(edu => {
                preview.innerHTML += `
                    <h3>${edu.degree} - ${edu.institution}</h3>
                    <p>${edu.location} | Graduated: ${edu.graduationDate}</p>
                `;
            });
        }

        // Update skills
        if (resumeData.skills.length > 0) {
            preview.innerHTML += `<h2>Skills</h2><ul>`;
            resumeData.skills.forEach(skill => {
                preview.innerHTML += `<li>${skill}</li>`;
            });
            preview.innerHTML += `</ul>`;
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
            preview.innerHTML += `<h2>Projects</h2>`;
            projects.forEach(project => {
                preview.innerHTML += `
                    <h3>${project.name}</h3>
                    <p>${project.description}</p>
                    <p>Technologies: ${project.technologies}</p>
                `;
            });
        }
    }

    function generateResume() {
        const resumePreview = document.getElementById('resumePreview');
        const formData = new FormData(form);
        
        let resumeHTML = `
            <div class="resume-${selectedTemplate} ${selectedColor} ${selectedLayout}">
                <h1>${formData.get('name')}</h1>
                <p>${formData.get('email')} | ${formData.get('phone')} | ${formData.get('location')}</p>
                
                <div class="resume-section">
                    <h2>Professional Summary</h2>
                    <p>${formData.get('summary')}</p>
                </div>
                
                <div class="resume-section">
                    <h2>Work Experience</h2>
                    ${generateExperienceHTML()}
                </div>
                
                <div class="resume-section">
                    <h2>Education</h2>
                    ${generateEducationHTML()}
                </div>
                
                <div class="resume-section">
                    <h2>Skills</h2>
                    ${generateSkillsHTML()}
                </div>
                
                <div class="resume-section">
                    <h2>Projects</h2>
                    ${generateProjectsHTML()}
                </div>
            </div>
        `;
        
        resumePreview.innerHTML = resumeHTML;
        resumePreview.style.display = 'block';
    }
    
    // Download functionality
    document.getElementById('downloadPDF').addEventListener('click', function() {
        const element = document.getElementById('resumePreview');
        html2pdf().from(element).save('resume.pdf');
    });

    document.getElementById('downloadWord').addEventListener('click', function() {
        const content = document.getElementById('resumePreview').innerHTML;
        const converted = htmlDocx.asBlob(content);
        saveAs(converted, 'resume.docx');
    });

    document.getElementById('downloadATS').addEventListener('click', function() {
        const content = document.getElementById('resumePreview').innerText;
        const blob = new Blob([content], { type: 'text/plain' });
        saveAs(blob, 'resume_ATS.txt');
    });

    // Initialize Sortable for drag-and-drop functionality
    new Sortable(document.getElementById('experienceEntries'), {
        animation: 150,
        handle: '.drag-handle',
        onEnd: function() {
            updateResumePreview();
        }
    });

    new Sortable(document.getElementById('educationEntries'), {
        animation: 150,
        handle: '.drag-handle',
        onEnd: function() {
            updateResumePreview();
        }
    });

    new Sortable(document.getElementById('projectEntries'), {
        animation: 150,
        handle: '.drag-handle',
        onEnd: function() {
            updateResumePreview();
        }
    });

    // Initial update
    updateResumePreview();
    updateProgress();
});