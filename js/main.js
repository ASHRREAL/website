document.addEventListener('DOMContentLoaded', () => {\n    const output = document.getElementById('output');\n    const commandInput = document.getElementById('command-input');\n    const terminal = document.getElementById('terminal');\n    const projectModal = document.getElementById('project-modal');\n    const modalTitle = document.getElementById('modal-title');\n    const modalImage = document.getElementById('modal-image');\n    const modalDescription = document.getElementById('modal-description');\n    const modalLink = document.getElementById('modal-link');\n    const closeModal = document.getElementById('close-modal');\n\n    let commandHistory = [];\n    let historyIndex = -1;\n    let projectsData = {};\n    let currentTheme = 'dark';\n    let visitorCount = 0;\n\n    // Check if device is mobile\n    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);\n\n    // Only autofocus on non-mobile devices\n    if (!isMobile) {\n        commandInput.focus();\n    }\n\n    const asciiArt = String.raw`\n    ░█████╗░░██████╗██╗░░██╗\n    ██╔══██╗██╔════╝██║░░██║\n    ███████║╚█████╗░███████║\n    ██╔══██║░╚═══██╗██╔══██║\n    ██║░░██║██████╔╝██║░░██║\n    ╚═╝░░╚═╝╚═════╝░╚═╝░░╚═╝\n`;\n\n    const spinosaurusArt = String.raw`\n⠀⠀⠀⠀⠀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⣾⣿⣿⣿⣿⣷⣆⠀⠀⠀⠀⠀⠀⣠⣤⣤⣤⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⣠⣾⡟⢿⣿⣿⣿⣿⣿⡄⠀⠀⢀⣴⢿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⣾⠛⠃⠀⢸⣿⠋⢻⣿⣿⣧⠀⢀⣾⣿⢾⢻⡏⣿⣹⡇⡿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⢀⣽⡇⠀⢸⣿⣿⡿⣷⣿⣿⣿⣿⣿⣷⣿⣾⣿⣿⣸⡿⣽⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠈⠛⠀⠀⠈⢿⣿⣟⣿⣽⣿⡻⡿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣏⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠈⢻⣿⣿⣾⣿⡶⣐⠠⡠⡾⠙⠹⢿⣿⣿⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣯⣷⣆⡄⡡⣲⡰⣾⣿⣽⣿⣿⣿⣿⣷⣶⣤⣤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⡿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣻⣿⣷⣦⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⡄⠀⠉⠉⠛⢹⣿⣿⣿⣿⣿⡿⠿⠿⢿⣿⣿⣿⣽⣳⣿⣿⣿⣿⣿⣶⣤⣄⣀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⢻⣿⡟⠀⠀⠀⠀⠈⣿⡿⠈⠻⢿⣿⡀⠀⠀⠀⠈⠉⠛⠿⢿⣿⣯⣟⣿⣿⣿⣿⣿⣿⣶⣤⡀⠀\n⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠀⠁⠀⠀⠀⠀⠀⠀⢸⣧⠀⠀⠀⠹⣷⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠛⠻⠿⣿⣿⣿⣿⣿⣿⣿⠄\n⠰⣶⣾⣿⣿⣦⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣴⣿⠃⠀⠀⣤⣾⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠻⠋⠀\n⠘⣿⣿⣿⣿⣾⣿⣿⣿⣷⣶⣶⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠘⠛⠿⠿⠿⠿⠿⠛⠛⠛⠛⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n`;\n\n    const welcomeMessage = `Welcome to my portfolio.\\nType or click <a href=\"#\" class=\"command-link\">help</a> to see available commands.`;

    function initVisitorCounter() {
        let visited = localStorage.getItem('visited');
        let count = parseInt(localStorage.getItem('visitorCount') || '0');

        if (!visited) {
            count++;
            localStorage.setItem('visitorCount', count.toString());
            localStorage.setItem('visited', 'true');
        }

        return count;
    }



    const commands = {
        help: () => {
            const count = initVisitorCounter();
            const commandList = Object.keys(commands) .filter(c => c !== 'spinosaurus').map(c => `  - <a href="#" class="command-link">${c}</a>: ${getCommandDescription(c)}`).join('\n');
            return `Available commands:
-------
${commandList}

Visitor Count: ${count}`;
        },
        about: () => `I like math and circuits :33`,
        skills: () => {
            return `
SKILLS
------
Programming Languages :  Java, C++, Python, JavaScript, HTML, CSS, C

Object-Oriented Prog. :  OOP principles, design patterns (MVC), inheritance, polymorphism

Dev Tools & Platforms :  Git, Linux, IntelliJ IDEA, VS Code,
                          Browser Extension Dev, Raspberry Pi, Arduino

APIs & Libraries      :  Discord.py, ACRCloud API, aiohttp, aiofiles,
                          CustomTkinter, Pillow

Concepts              :  SDLC, Agile, API Integration, GUI Development,
                          Data Structures & Algorithms, Cloud Storage,
                          Embedded Systems`;
        },
        experience: () => `No technical experience outside my projects :(`,
        education: () => `University of Guelph - Computer Engineering (Expected Graduation: 2029)
Relevant Coursework: Data Structures, Algorithms, Software Design, Computer Systems, Database Systems`,
        projects: () => {
            let projectList = 'My Projects:\n-------\n';
            Object.keys(projectsData).forEach(key => {
                projectList += `  <div class="project-card" data-project="${key}">${projectsData[key].title}</div>\n`;
            });
            projectList += `\nFor more, visit my <a href="https://github.com/ASHRREAL" target="_blank">GitHub</a>.`;
            return projectList;
        },
        contact: `
CONTACT
-------
   - GitHub:   <a href="https://github.com/ASHRREAL" target="_blank">github.com/ASHRREAL</a>
   - LinkedIn: <a href="https://www.linkedin.com/in/seiar-husain-4aa3ba338/" target="_blank">linkedin.com/in/seiar-husain-4aa3ba338</a>
   - Email:    <a href="mailto:ahmadseiar011@gmail.com">ahmadseiar011@gmail.com</a>
`,
        theme: () => {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('dark-mode', currentTheme === 'dark');
            return `Theme switched to ${currentTheme} mode.`;
        },
        history: () => {
            if (commandHistory.length === 0) {
                return "No command history available.";
            }
            
            let historyList = "Command History:\n-------\n";
            commandHistory.slice(0, 10).forEach((cmd, index) => {
                historyList += `  ${index + 1}. ${cmd}\n`;
            });
            
            if (commandHistory.length > 10) {
                historyList += `\n  ... and ${commandHistory.length - 10} more commands`;
            }
            
            return historyList;
        },
        clear: "",
        spinosaurus: () => {
            return spinosaurusArt;
        }
    };

    const aliases = {
        proj: 'projects',
        exp: 'experience',
        edu: 'education',
        cont: 'contact',
        spinos: 'spinosaurus'
    };

    function getCommandDescription(command) {
        const descriptions = {
            help: 'Show this help message',
            about: 'Display information about me',
            skills: 'List my technical skills',
            experience: 'Show my work experience',
            education: 'Show my educational background',
            projects: 'List my projects',
            contact: 'Show my contact information',
            theme: 'Toggle between light and dark themes',
            history: 'Show command history',
            clear: 'Clear the terminal screen',
        };
        return descriptions[command] || '';
    }

    function type(text, element, callback) {\n        element.innerHTML = '';\n        let i = 0;\n        \n        const baseSpeed = 5;\n        const minSpeed = 1;\n        const maxLengthForBaseSpeed = 100;\n        \n        let speed = baseSpeed;\n        if (text.length > maxLengthForBaseSpeed) {\n            speed = Math.max(minSpeed, baseSpeed - Math.floor(text.length / 100));\n        }\n        \n        const typing = setInterval(() => {\n            if (i < text.length) {\n                if (text.charAt(i) === '\n') {\n                    element.innerHTML += '<br>';\n                } else {\n                    element.innerHTML += text.charAt(i);\n                }\n                i++;\n                // Improved scrolling for mobile\n                if (!isMobile || i % 5 === 0) {\n                    terminal.scrollTop = terminal.scrollHeight;\n                }\n            } else {\n                clearInterval(typing);\n                if (callback) callback();\n                // Ensure final scroll position\n                terminal.scrollTop = terminal.scrollHeight;\n            }\n        }, speed);\n    }

    function executeCommand(command) {
        command = command.toLowerCase().trim();
        commandHistory.unshift(command);
        historyIndex = -1;

        const echoDiv = document.createElement('div');
        echoDiv.classList.add('command-echo');
        echoDiv.innerHTML = `<span class="prompt">>&nbsp;</span>${command}`;
        output.appendChild(echoDiv);

        if (command === 'clear') {
            output.innerHTML = '';
            startTerminal();
            return;
        }

        let actualCommand = command;
        if (aliases[command]) {
            actualCommand = aliases[command];
        }

        let response;
        if (typeof commands[actualCommand] === 'function') {
            response = commands[actualCommand]();
        } else {
            response = commands[actualCommand] || `Command not found: ${command}. Type or click <a href="#" class="command-link">help</a> for a list of commands.`;
        }

        const responseDiv = document.createElement('div');
        responseDiv.classList.add('command-output');
        output.appendChild(responseDiv);

        const commandsToAnimate = ['help', 'about', 'skills', 'experience', 'education', 'projects', 'contact', 'history', 'spinosaurus'];

        if (commandsToAnimate.includes(actualCommand) || typeof commands[actualCommand] === 'undefined') {
            if (typeof response === 'string') {
                if (response.includes('<') || response.includes('&')) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = response;
                    const textToType = tempDiv.textContent;
                    
                    type(textToType, responseDiv, () => {
                        responseDiv.innerHTML = response;
                        terminal.scrollTop = terminal.scrollHeight;
                        ensureInputVisible();
                    });
                } else {
                    type(response, responseDiv, () => {
                        ensureInputVisible();
                    });
                }
            } else {
                responseDiv.innerHTML = response;
                ensureInputVisible();
            }
        } else if (typeof response === 'string' && !response.includes('<') && !response.includes('&')) {
            type(response, responseDiv, () => {
                ensureInputVisible();
            });
        } else {
            responseDiv.innerHTML = response;
            ensureInputVisible();
        }

        // Ensure visibility immediately as well
        ensureInputVisible();
    }

    // Function to ensure the input line is visible
    function ensureInputVisible() {
        // Small delay to ensure DOM updates are complete
        setTimeout(() => {
            const inputLine = document.querySelector('.input-line');
            if (inputLine) {
                inputLine.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        }, 100);
    }

    function autocomplete(input) {
        const value = input.toLowerCase();
        const allCommands = [...Object.keys(commands), ...Object.keys(aliases)];
        const matches = allCommands.filter(cmd => cmd.startsWith(value));
        
        if (matches.length === 1) {
            return matches[0];
        } else if (matches.length > 1) {
            const suggestionsDiv = document.createElement('div');
            suggestionsDiv.classList.add('command-output');
            suggestionsDiv.innerHTML = `Suggestions: ${matches.join(', ')}`;
            output.appendChild(suggestionsDiv);
            terminal.scrollTop = terminal.scrollHeight;
        }
        
        return input;
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
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = welcomeMessage;
            const textToType = tempDiv.textContent;
            
            type(textToType, welcomeDiv, () => {
                welcomeDiv.innerHTML = welcomeMessage;
                terminal.scrollTop = terminal.scrollHeight;
                ensureInputVisible();
            });
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
        } else if (e.key === 'Tab') {
            e.preventDefault();
            if (commandInput.value) {
                commandInput.value = autocomplete(commandInput.value);
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
        } else if (e.target.classList.contains('project-card')) {
            e.preventDefault();
            const projectId = e.target.getAttribute('data-project');
            openProjectModal(projectId);
        }
        // Only focus on non-mobile devices to prevent keyboard from appearing
        if (!isMobile) {
            commandInput.focus();
        }
    });

    async function openProjectModal(projectId) {
        try {
            const response = await fetch(`projects/${projectId}.json`);
            const project = await response.json();

            modalTitle.textContent = project.title;
            modalImage.src = `images/${project.image}`;
            modalDescription.textContent = project.description;
            
            const techStackDiv = document.createElement('div');
            techStackDiv.id = 'modal-tech-stack';
            techStackDiv.innerHTML = `<strong>Tech Stack:</strong> ${project.tech || 'Not specified'}`;
            modalDescription.parentNode.insertBefore(techStackDiv, modalDescription.nextSibling);
            
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
        const techStackDiv = document.getElementById('modal-tech-stack');
        if (techStackDiv) {
            techStackDiv.remove();
        }
    }

    closeModal.addEventListener('click', closeProjectModal);
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.style.display === 'flex') {
            closeProjectModal();
        }
    });

    window.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeProjectModal();
        }
    });

    async function init() {
        await loadProjects();
        startTerminal();
    }

    init();
});