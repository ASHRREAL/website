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
    const visitorCounter = document.createElement('div');
    visitorCounter.classList.add('visitor-counter');
    document.body.appendChild(visitorCounter);


    let commandHistory = [];
    let historyIndex = -1;
    let projectsData = {};
    let currentTheme = 'dark';

    const asciiArt = String.raw`
    ░█████╗░░██████╗██╗░░██╗
    ██╔══██╗██╔════╝██║░░██║
    ███████║╚█████╗░███████║
    ██╔══██║░╚═══██╗██╔══██║
    ██║░░██║██████╔╝██║░░██║
    ╚═╝░░╚═╝╚═════╝░╚═╝░░╚═╝
`;

    const spinosaurusArt = String.raw`
⠀⠀⠀⠀⠀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣾⣿⣿⣿⣿⣷⣆⠀⠀⠀⠀⠀⠀⣠⣤⣤⣤⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⣠⣾⡟⢿⣿⣿⣿⣿⣿⡄⠀⠀⢀⣴⢿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣾⠛⠃⠀⢸⣿⠋⢻⣿⣿⣧⠀⢀⣾⣿⢾⢻⡏⣿⣹⡇⡿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢀⣽⡇⠀⢸⣿⣿⡿⣷⣿⣿⣿⣿⣿⣷⣿⣾⣿⣿⣸⡿⣽⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠈⠛⠀⠀⠈⢿⣿⣟⣿⣽⣿⡻⡿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣏⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⢻⣿⣿⣾⣿⡶⣐⠠⡠⡾⠙⠹⢿⣿⣿⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣯⣷⣆⡄⡡⣲⡰⣾⣿⣽⣿⣿⣿⣿⣷⣶⣤⣤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⡿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣻⣿⣷⣦⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⡄⠀⠉⠉⠛⢹⣿⣿⣿⣿⣿⡿⠿⠿⢿⣿⣿⣿⣽⣳⣿⣿⣿⣿⣿⣶⣤⣄⣀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⢻⣿⡟⠀⠀⠀⠀⠈⣿⡿⠈⠻⢿⣿⡀⠀⠀⠀⠈⠉⠛⠿⢿⣿⣯⣟⣿⣿⣿⣿⣿⣿⣶⣤⡀⠀
⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠀⠁⠀⠀⠀⠀⠀⠀⢸⣧⠀⠀⠀⠹⣷⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠛⠻⠿⣿⣿⣿⣿⣿⣿⣿⠄
⠰⣶⣾⣿⣿⣦⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣴⣿⠃⠀⠀⣤⣾⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠻⠋⠀
⠘⣿⣿⣿⣿⣾⣿⣿⣿⣷⣶⣶⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠘⠛⠿⠿⠿⠿⠿⠛⠛⠛⠛⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
`;

    const welcomeMessage = `Welcome to my portfolio.
Type or click <a href="#" class="command-link">help</a> to see available commands.`;

    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    async function initVisitorCounter() {
        try {
            const res = await fetch('https://visitor.6developer.com/visit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    domain: 'ashrreal.github.io',
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    page_path: window.location.pathname,
                    page_title: document.title,
                    referrer: document.referrer
                })
            });
            const data = await res.json();
            visitorCounter.textContent = `Visitors: ${data.totalCount}`;
            return data.totalCount;
        } catch (error) {
            console.error("Visitor counter failed:", error);
            visitorCounter.textContent = "Visitors: N/A";
            return "N/A";
        }
    }


    const commands = {
        help: () => {
            const commandList = Object.keys(commands).filter(c => c !== 'spinosaurus').map(c => `  - <a href="#" class="command-link">${c}</a>: ${getCommandDescription(c)}`).join('\n');
            return `Available commands:
-------
${commandList}`;
        },
        about: () => `I like math and circuits :33`,
        skills: () => {
            return `
SKILLS
------
Languages             :  Java, Go, Python, TypeScript, JavaScript, C++, C, SQL,
                          HTML, CSS

Frameworks & Libraries:  Next.js, JavaFX, Discord API, ACRCloud API, aiohttp,
                          CustomTkinter

Tools & Platforms     :  Git, Linux, VS Code, IntelliJ IDEA,
                          Browser Extension Development, Raspberry Pi, Arduino,
                          ESP32

Concepts              :  Object-Oriented Programming, Data Structures & Algorithms,
                          API Integration, SDLC, Web & GUI Development`;
        },
        experience: () => `No technical experience outside my projects :(\n`,
        education: () => `University of Guelph - Computer Engineering (Expected Graduation: 2029)
Relevant Coursework: Data Structures, Algorithms, Software Design, Computer Systems, Digital System Design, Computer Organization`,
        projects: () => {
            let projectList = 'My Projects:\n-------\n';
            Object.keys(projectsData).forEach(key => {
                projectList += `  - <a href="#" class="project-card" data-project="${key}">${projectsData[key].title}</a>\n`;
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
                historyList += `
  ... and ${commandHistory.length - 10} more commands`;
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

    function type(text, element, callback) {
        element.innerHTML = '';
        let i = 0;
        
        const baseSpeed = 5;
        const minSpeed = 0;
        
        let speed = baseSpeed;
        if (text.length > 100) {
            speed = minSpeed;
        } else if (text.length > 50) {
            speed = 2;
        }

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
        }, speed);
    }

    async function executeCommand(command) {
        command = command.toLowerCase().trim();
        commandHistory.unshift(command);
        historyIndex = -1;

        const echoDiv = document.createElement('div');
        echoDiv.classList.add('command-echo');
        echoDiv.innerHTML = `<span class="prompt">&gt;&nbsp;</span>${command}`;
        output.appendChild(echoDiv);
        terminal.scrollTop = terminal.scrollHeight;

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
            response = await commands[actualCommand]();
        } else {
            response = commands[actualCommand] || `Command not found: ${command}. Type or click <a href="#" class="command-link">help</a> for a list of commands.`;
        }

        const responseDiv = document.createElement('div');
        responseDiv.classList.add('command-output');
        output.appendChild(responseDiv);
        terminal.scrollTop = terminal.scrollHeight;

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
                    });
                } else {
                    type(response, responseDiv, () => {
                        terminal.scrollTop = terminal.scrollHeight;
                    });
                }
            } else {
                responseDiv.innerHTML = response;
                terminal.scrollTop = terminal.scrollHeight;
            }
        } else if (typeof response === 'string' && !response.includes('<') && !response.includes('&')) {
            type(response, responseDiv, () => {
                terminal.scrollTop = terminal.scrollHeight;
            });
        } else {
            responseDiv.innerHTML = response;
            terminal.scrollTop = terminal.scrollHeight;
        }
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
            terminal.scrollTop = terminal.scrollHeight;
        }
    }

    function startTerminal() {
        commandInput.disabled = true;
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
                commandInput.disabled = false;
                if (!isMobile()) {
                    commandInput.focus();
                }
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
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.style.display === 'flex') {
            closeProjectModal();
        } else if (!isMobile() && document.activeElement !== commandInput) {
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
            terminal.scrollTop = terminal.scrollHeight;
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
    window.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeProjectModal();
        }
    });

    async function init() {
        await loadProjects();
        await initVisitorCounter();
        startTerminal();
    }

    init();
});