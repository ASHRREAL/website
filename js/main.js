document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('output');
    const commandInput = document.getElementById('command-input');
    const terminal = document.getElementById('terminal');
    const projectModal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const modalLink = document.getElementById('modal-link');
    const closeModal = document.getElementById('close-modal');

    let commandHistory = [];
    let historyIndex = -1;
    let projectsData = {};

    const asciiArt = String.raw`
__        __   _                          _ 
\ \      / /__| | ___ ___  _ __ ___   ___| |
 \ \ /\ / / _ \ |/ __/ _ \| '_ \` _ \/ _ \ |
  \ V  V /  __/ | (_| (_) | | | | | |  __/_|
   \_/\_/ \___|_|\___\___/|_| |_| |_|\___(_)
`;


    const welcomeMessage = `Welcome to my portfolio.
Type or click <a href="#" class="command-link">help</a> to see available commands.`;

    const commands = {
        help: () => {
            const commandList = Object.keys(commands).map(c => `  - <a href="#" class="command-link">${c}</a>: ${getCommandDescription(c)}`).join('\n');
            return `Available commands:\n-------\n${commandList}`;
        },
        about: "I like Math :33",
        skills: `
SKILLS
------
   - Programming Languages:         Java, C++, Python, JavaScript, HTML, CSS, C
   - Object-Oriented Programming:   Proficient in OOP principles, design patterns (e.g., MVC), inheritance, and polymorphism.
   - Dev Tools & Platforms:         Git, Linux, IntelliJ IDEA, VS Code, Browser Extension Development, Raspberry Pi, Arduino
   - APIs & Libraries:              Discord.py, ACRCloud API, aiohttp, aiofiles, CustomTkinter, Pillow
   - Concepts:                      SDLC, Agile Methodologies, API Integration, GUI Development, Data Structures & Algorithms, Cloud Storage Concepts, Embedded Systems
`,
        experience: `No technical exprience yet outside of my projects :(.`,
        projects: () => {
            let projectList = 'Fetching projects...\n-------\n';
            Object.keys(projectsData).forEach(key => {
                projectList += `  - <a href="#" class="project-link" data-project="${key}">${projectsData[key].title}</a>\n`;
            });
            projectList += `\nFor more, visit my <a href="https://github.com/ASHRREAL" target="_blank">GitHub</a>.`;
            return projectList;
        },
        contact: `\nCONTACT\n-------\n   - GitHub:   <a href="https://github.com/ASHRREAL" target="_blank">github.com/ASHRREAL</a>\n   - LinkedIn: <a href="https://www.linkedin.com/in/seiar-husain-4aa3ba338/" target="_blank">linkedin.com/in/seiar-husain-4aa3ba338</a>\n   - Email:    <a href="mailto:ahmadseiar011@gmail.com">ahmadseiar011@gmail.com</a>\n`,
        clear: "",
    };

    function getCommandDescription(command) {
        const descriptions = {
            help: 'Show this help message',
            about: 'Display information about me',
            skills: 'List my technical skills',
            experience: 'Show my work experience',
            projects: 'List my projects',
            contact: 'Show my contact information',
            clear: 'Clear the terminal screen'
        };
        return descriptions[command] || '';
    }

    function type(text, element, callback) {
        element.innerHTML = '';
        let i = 0;
        const typing = setInterval(() => {
            if (i < text.length) {
                if (text.charAt(i) === '\n') {
                    element.innerHTML += '<br>';
                } else {
                    element.innerHTML += text.charAt(i);
                }
                i++;
                terminal.scrollTop = terminal.scrollHeight;
            } else {
                clearInterval(typing);
                if (callback) callback();
            }
        }, 5);
    }

    function executeCommand(command) {
        command = command.toLowerCase().trim();
        commandHistory.unshift(command);
        historyIndex = -1;

        const echoDiv = document.createElement('div');
        echoDiv.classList.add('command-echo');
        echoDiv.innerHTML = `<span class="prompt">> </span>${command}`;
        output.appendChild(echoDiv);

        if (command === 'clear') {
            output.innerHTML = '';
            startTerminal();
            const asciiArt = String.raw`
            __        __   _                          _ 
            \ \      / /__| | ___ ___  _ __ ___   ___| |
            \ \ /\ / / _ \ |/ __/ _ \| '_ \` _ \/ _ \ |
            \ V  V /  __/ | (_| (_) | | | | | |  __/_|
            \_/\_/ \___|_|\___\___/|_| |_| |_|\___(_)
            `;


            const welcomeMessage = `Welcome to my portfolio.
            Type or click <a href="#" class="command-link">help</a> to see available commands.`;
            return;
        }

        let response;
        if (typeof commands[command] === 'function') {
            response = commands[command]();
        } else {
            response = commands[command] || `Command not found: ${command}. Type or click <a href="#" class="command-link">help</a> for a list of commands.`;
        }

        const responseDiv = document.createElement('div');
        responseDiv.classList.add('command-output');
        output.appendChild(responseDiv);

        const commandsToAnimate = ['help', 'about', 'skills', 'experience', 'projects', 'contact'];

        if (commandsToAnimate.includes(command)) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = response;
            const textToType = tempDiv.textContent;

            type(textToType, responseDiv, () => {
                responseDiv.innerHTML = response;
                terminal.scrollTop = terminal.scrollHeight;
            });
        } else if (!response.includes('<') && !response.includes('&')) {
            type(response, responseDiv);
        } else {
            responseDiv.innerHTML = response;
        }

        terminal.scrollTop = terminal.scrollHeight;
    }


    async function loadProjects() {
        try {
            const response = await fetch('projects.json');
            projectsData = await response.json();
        } catch (error) {
            console.error('Error loading projects:', error);
            const errorDiv = document.createElement('div');
            errorDiv.classList.add('command-output');
            errorDiv.textContent = 'Error: Could not load projects.json';
            output.appendChild(errorDiv);
        }
    }

    function startTerminal() {
        const artDiv = document.createElement('div');
        artDiv.classList.add('ascii-art');
        output.appendChild(artDiv);

        type(asciiArt, artDiv, () => {
            const welcomeDiv = document.createElement('div');
            welcomeDiv.classList.add('command-output');
            output.appendChild(welcomeDiv);
            welcomeDiv.innerHTML = welcomeMessage;
            terminal.scrollTop = terminal.scrollHeight;
        });
    }

    commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = commandInput.value.trim();
            if (command) {
                executeCommand(command);
                commandInput.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                commandInput.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                commandInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = -1;
                commandInput.value = '';
            }
        }
    });

    terminal.addEventListener('click', (e) => {
        if (e.target.classList.contains('command-link')) {
            e.preventDefault();
            const command = e.target.textContent.split(':')[0].trim();
            commandInput.value = command;
            executeCommand(command);
            commandInput.value = '';
        } else if (e.target.classList.contains('project-link')) {
            e.preventDefault();
            const projectId = e.target.getAttribute('data-project');
            openProjectModal(projectId);
        }
    });

    async function openProjectModal(projectId) {
        try {
            const response = await fetch(`projects/${projectId}.json`);
            const project = await response.json();

            modalTitle.textContent = project.title;
            modalImage.src = `images/${project.image}`;
            modalDescription.textContent = project.description;
            modalLink.href = project.url;
            projectModal.style.display = 'flex';

        } catch (error) {
            console.error(`Error loading project details for ${projectId}:`, error);
            const errorDiv = document.createElement('div');
            errorDiv.classList.add('command-output');
            errorDiv.textContent = `Error: Could not load details for ${projectId}.`;
            output.appendChild(errorDiv);
        }
    }

    function closeProjectModal() {
        projectModal.style.display = 'none';
    }

    closeModal.addEventListener('click', closeProjectModal);
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.style.display === 'flex') {
            closeProjectModal();
        }
    });

    async function init() {
        await loadProjects();
        startTerminal();
    }

    init();
});