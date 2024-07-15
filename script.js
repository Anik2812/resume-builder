document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('resumeForm');
    const addExperienceBtn = document.getElementById('addExperience');
    const addEducationBtn = document.getElementById('addEducation');
    const addSkillBtn = document.getElementById('addSkill');
    const addProjectBtn = document.getElementById('addProject');
    const downloadPDFBtn = document.getElementById('downloadPDF');
    const downloadWordBtn = document.getElementById('downloadWord');
    const templateBtns = document.querySelectorAll('.template-btn');

    let selectedTemplate = 'modern';

    // Template selection
    templateBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            templateBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedTemplate = this.dataset.template;
        });
    });

    // Add dynamic entries
    addExperienceBtn.addEventListener('click', addExperience);
    addEducationBtn.addEventListener('click', addEducation);
    addSkillBtn.addEventListener('click', addSkill);
    addProjectBtn.addEventListener('click', addProject);

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        generateResume();
    });

    // Download buttons
    downloadPDFBtn.addEventListener('click', downloadPDF);
    downloadWordBtn.addEventListener('click', downloadWord);

    function addExperience() {
        const experienceEntries = document.getElementById('experienceEntries');
        const entry = document.createElement('div');
        entry.classList.add('experience-entry', 'mb-4');
        entry.innerHTML = `
            <input type="text" name="company" placeholder="Company Name" class="form-input">
            <input type="text" name="position" placeholder="Position" class="form-input">
            <input type="text" name="duration" placeholder="Duration" class="form-input">
            <textarea name="responsibilities" placeholder="Responsibilities" rows="3" class="form-input"></textarea>
            <button type="button" class="remove-btn">Remove</button>
        `;
        experienceEntries.appendChild(entry);
        entry.querySelector('.remove-btn').addEventListener('click', function() {
            experienceEntries.removeChild(entry);
        });
    }

    function addEducation() {
        const educationEntries = document.getElementById('educationEntries');
        const entry = document.createElement('div');
        entry.classList.add('education-entry', 'mb-4');
        entry.innerHTML = `
            <input type="text" name="institution" placeholder="Institution" class="form-input">
            <input type="text" name="degree" placeholder="Degree" class="form-input">
            <input type="text" name="year" placeholder="Year" class="form-input">
            <button type="button" class="remove-btn">Remove</button>
        `;
        educationEntries.appendChild(entry);
        entry.querySelector('.remove-btn').addEventListener('click', function() {
            educationEntries.removeChild(entry);
        });
    }

    function addSkill() {
        const skillsEntries = document.getElementById('skillsEntries');
        const skillInput = document.getElementById('skillInput');
        if (skillInput.value.trim() !== '') {
            const skillTag = document.createElement('span');
            skillTag.classList.add('skill-tag');
            skillTag.textContent = skillInput.value;
            const removeBtn = document.createElement('span');
            removeBtn.textContent = '×';
            removeBtn.classList.add('remove-btn');
            removeBtn.addEventListener('click', function() {
                skillsEntries.removeChild(skillTag);
            });
            skillTag.appendChild(removeBtn);
            skillsEntries.appendChild(skillTag);
            skillInput.value = '';
        }
    }

    function addProject() {
        const projectEntries = document.getElementById('projectEntries');
        const entry = document.createElement('div');
        entry.classList.add('project-entry', 'mb-4');
        entry.innerHTML = `
            <input type="text" name="projectTitle" placeholder="Project Title" class="form-input">
            <textarea name="projectDescription" placeholder="Description" rows="3" class="form-input"></textarea>
            <input type="text" name="projectTechnologies" placeholder="Technologies Used" class="form-input">
            <button type="button" class="remove-btn">Remove</button>
        `;
        projectEntries.appendChild(entry);
        entry.querySelector('.remove-btn').addEventListener('click', function() {
            projectEntries.removeChild(entry);
        });
    }

    function generateResume() {
        const resumePreview = document.getElementById('resumePreview');
        const formData = new FormData(form);
        
        let resumeHTML = `
            <div class="resume-${selectedTemplate}">
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

    function generateExperienceHTML() {
        const experiences = document.querySelectorAll('.experience-entry');
        return Array.from(experiences).map(exp => `
            <div>
                <h3>${exp.querySelector('[name="company"]').value}</h3>
                <p>${exp.querySelector('[name="position"]').value} | ${exp.querySelector('[name="duration"]').value}</p>
                <p>${exp.querySelector('[name="responsibilities"]').value}</p>
            </div>
        `).join('');
    }

    function generateEducationHTML() {
        const educations = document.querySelectorAll('.education-entry');
        return Array.from(educations).map(edu => `
            <div>
                <h3>${edu.querySelector('[name="institution"]').value}</h3>
                <p>${edu.querySelector('[name="degree"]').value} | ${edu.querySelector('[name="year"]').value}</p>
            </div>
        `).join('');
    }

    function generateSkillsHTML() {
        const skills = document.querySelectorAll('.skill-tag');
        return `<ul>${Array.from(skills).map(skill => `<li>${skill.textContent.replace('×', '')}</li>`).join('')}</ul>`;
    }

    function generateProjectsHTML() {
        const projects = document.querySelectorAll('.project-entry');
        return Array.from(projects).map(proj => `
            <div>
                <h3>${proj.querySelector('[name="projectTitle"]').value}</h3>
                <p>${proj.querySelector('[name="projectDescription"]').value}</p>
                <p>Technologies: ${proj.querySelector('[name="projectTechnologies"]').value}</p>
            </div>
        `).join('');
    }

    function downloadPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const resumePreview = document.getElementById('resumePreview');
        
        doc.html(resumePreview, {
            callback: function(doc) {
                doc.save('resume.pdf');
            },
            x: 15,
            y: 15,
            width: 170,
            windowWidth: 650
        });
    }

    function downloadWord() {
        const { Document, Paragraph, TextRun, HeadingLevel, Packer } = docx;

        const doc = new Document({
            sections: [{
                properties: {},
                children: generateWordContent()
            }]
        });

        Packer.toBlob(doc).then(blob => {
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

    function generateWordContent() {
        const content = [];
        const formData = new FormData(form);

        // Personal Information
        content.push(
            new Paragraph({
                text: formData.get('name'),
                heading: HeadingLevel.TITLE
            }),
            new Paragraph({
                text: `${formData.get('email')} | ${formData.get('phone')} | ${formData.get('location')}`
            }),
            new Paragraph({})
        );

        // Professional Summary
        content.push(
            new Paragraph({
                text: 'Professional Summary',
                heading: HeadingLevel.HEADING_1
            }),
            new Paragraph({
                text: formData.get('summary')
            }),
            new Paragraph({})
        );

        // Work Experience
        content.push(
            new Paragraph({
                text: 'Work Experience',
                heading: HeadingLevel.HEADING_1
            })
        );
        document.querySelectorAll('.experience-entry').forEach(exp => {
            content.push(
                new Paragraph({
                    text: exp.querySelector('[name="company"]').value,
                    heading: HeadingLevel.HEADING_2
                }),
                new Paragraph({
                    text: `${exp.querySelector('[name="position"]').value} | ${exp.querySelector('[name="duration"]').value}`
                }),
                new Paragraph({
                    text: exp.querySelector('[name="responsibilities"]').value
                }),
                new Paragraph({})
            );
        });

        // Education
        content.push(
            new Paragraph({
                text: 'Education',
                heading: HeadingLevel.HEADING_1
            })
        );
        document.querySelectorAll('.education-entry').forEach(edu => {
            content.push(
                new Paragraph({
                    text: edu.querySelector('[name="institution"]').value,
                    heading: HeadingLevel.HEADING_2
                }),
                new Paragraph({
                    text: `${edu.querySelector('[name="degree"]').value} | ${edu.querySelector('[name="year"]').value}`
                }),
                new Paragraph({})
            );
        });

        // Skills
        content.push(
            new Paragraph({
                text: 'Skills',
                heading: HeadingLevel.HEADING_1
            }),
            new Paragraph({
                children: Array.from(document.querySelectorAll('.skill-tag')).map(skill => 
                    new TextRun({
                        text: skill.textContent.replace('×', '').trim() + ', ',
                    })
                )
            }),
            new Paragraph({})
        );

        // Projects
        content.push(
            new Paragraph({
                text: 'Projects',
                heading: HeadingLevel.HEADING_1
            })
        );
        document.querySelectorAll('.project-entry').forEach(proj => {
            content.push(
                new Paragraph({
                    text: proj.querySelector('[name="projectTitle"]').value,
                    heading: HeadingLevel.HEADING_2
                }),
                new Paragraph({
                    text: proj.querySelector('[name="projectDescription"]').value
                }),
                new Paragraph({
                    text: 'Technologies: ' + proj.querySelector('[name="projectTechnologies"]').value
                }),
                new Paragraph({})
            );
        });

        return content;
    }
});