// ===== GAME STATE =====
const gameState = {
    currentLevel: 1,
    score: 0,
    waitingForInput: true,
    level4Commands: {
        scan: false,
        nmap: false,
        trace: false,
        decode: false
    }
};

// ===== DOM ELEMENTS =====
const terminal = document.getElementById('terminal-output');
const input = document.getElementById('command-input');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('current-level');

// ===== GAME DATA =====
const levels = {
    1: {
        type: 'decode',
        encryptedText: 'Uifsf jt b ibdlfs jo uif tztufn',
        answer: 'There is a hacker in the system',
        hint: 'Caesar Cipher - Each letter is shifted by 1'
    },
    2: {
        type: 'password',
        password: 'H4ck3r',
        hints: [
            'Length: 6 characters',
            'Contains: numbers + letters',
            'Starts with: H',
            'Ends with: r'
        ]
    },
    3: {
        type: 'logs',
        logs: [
            '[2025-01-03 12:22:15] Failed login from 192.168.1.77',
            '[2025-01-03 12:22:17] Failed login from 192.168.1.22',
            '[2025-01-03 12:22:19] Successful login from 192.168.1.77',
            '[2025-01-03 12:22:45] File accessed: /admin/secrets.db',
            '[2025-01-03 12:23:01] Data exported from 192.168.1.77'
        ],
        answer: '192.168.1.77'
    },
    4: {
        type: 'commands',
        validCommands: ['scan network', 'nmap -f system', 'trace ip', 'decode file.txt']
    },
    5: {
        type: 'puzzle',
        symbols: '🔐💡⚡',
        answer: '🔐💡⚡',
        hint: 'Arrange from security to power'
    }
};

// ===== UTILITY FUNCTIONS =====
function displayText(text, className = '', delay = 0) {
    setTimeout(() => {
        const line = document.createElement('div');
        line.className = `output-line ${className}`;
        line.textContent = text;
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
    }, delay);
}

function displayASCII(art) {
    const pre = document.createElement('pre');
    pre.className = 'ascii-art';
    pre.textContent = art;
    terminal.appendChild(pre);
    terminal.scrollTop = terminal.scrollHeight;
}

function clearTerminal() {
    terminal.innerHTML = '';
}

function updateScore(points) {
    gameState.score += points;
    scoreDisplay.textContent = gameState.score;
    
    // Score animation
    scoreDisplay.style.transform = 'scale(1.3)';
    setTimeout(() => {
        scoreDisplay.style.transform = 'scale(1)';
    }, 300);
}

function updateLevel(level) {
    gameState.currentLevel = level;
    levelDisplay.textContent = level;
}

function playSuccessAnimation() {
    displayText('', '', 100);
    displayText('╔═══════════════════════════════════╗', 'success', 200);
    displayText('║    ✓ CORRECT! ACCESS GRANTED     ║', 'success', 300);
    displayText('╚═══════════════════════════════════╝', 'success', 400);
    displayText('', '', 500);
    displayText('[+] Adding 20 points to your score...', 'info', 600);
}

function playFailAnimation(message) {
    displayText('', '', 100);
    displayText('╔═══════════════════════════════════╗', 'error', 200);
    displayText(`║    ✗ ${message.padEnd(26)} ║`, 'error', 300);
    displayText('╚═══════════════════════════════════╝', 'error', 400);
    displayText('', '', 500);
}

// ===== LEVEL INITIALIZATION =====
function startLevel(levelNum) {
    updateLevel(levelNum);
    gameState.waitingForInput = true;
    
    setTimeout(() => {
        displayText('═'.repeat(60), 'info');
        displayText(`LEVEL ${levelNum} - INITIATING...`, 'header-text', 100);
        displayText('═'.repeat(60), 'info', 200);
        displayText('', '', 300);
        
        switch(levelNum) {
            case 1:
                initLevel1();
                break;
            case 2:
                initLevel2();
                break;
            case 3:
                initLevel3();
                break;
            case 4:
                initLevel4();
                break;
            case 5:
                initLevel5();
                break;
        }
    }, 500);
}

// ===== LEVEL 1: DECODE CHALLENGE =====
function initLevel1() {
    displayText('🔓 DECODE CHALLENGE', 'warning', 400);
    displayText('', '', 500);
    displayText('Intercepted encrypted message:', 'info', 600);
    displayText('', '', 700);
    displayText(`"${levels[1].encryptedText}"`, 'system', 800);
    displayText('', '', 900);
    displayText(`Hint: ${levels[1].hint}`, 'warning', 1000);
    displayText('', '', 1100);
    displayText('Enter the decrypted message:', 'info', 1200);
}

function checkLevel1(answer) {
    const cleanAnswer = answer.trim().toLowerCase();
    const correctAnswer = levels[1].answer.toLowerCase();
    
    if (cleanAnswer === correctAnswer) {
        playSuccessAnimation();
        displayText('Decrypted Successfully – Access Granted', 'success', 1000);
        updateScore(20);
        setTimeout(() => {
            startLevel(2);
        }, 2000);
    } else {
        playFailAnimation('INCORRECT DECRYPTION');
        displayText('Try again...', 'warning', 600);
    }
}

// ===== LEVEL 2: PASSWORD CRACKING =====
function initLevel2() {
    displayText('🔑 PASSWORD CRACKING CHALLENGE', 'warning', 400);
    displayText('', '', 500);
    displayText('System locked. Password required.', 'info', 600);
    displayText('', '', 700);
    displayText('Password Hints:', 'warning', 800);
    
    levels[2].hints.forEach((hint, index) => {
        displayText(`  • ${hint}`, 'info', 900 + (index * 100));
    });
    
    displayText('', '', 1300);
    displayText('Enter password:', 'info', 1400);
}

function checkLevel2(answer) {
    if (answer === levels[2].password) {
        playSuccessAnimation();
        displayText('Password Accepted', 'success', 1000);
        updateScore(20);
        setTimeout(() => {
            startLevel(3);
        }, 2000);
    } else {
        playFailAnimation('ACCESS DENIED');
        displayText('Try again...', 'warning', 600);
    }
}

// ===== LEVEL 3: LOG ANALYZER =====
function initLevel3() {
    displayText('📊 LOG ANALYSIS CHALLENGE', 'warning', 400);
    displayText('', '', 500);
    displayText('Security breach detected!', 'error', 600);
    displayText('Analyzing system logs...', 'info', 700);
    displayText('', '', 800);
    
    levels[3].logs.forEach((log, index) => {
        displayText(log, 'success', 900 + (index * 100));
    });
    
    displayText('', '', 1500);
    displayText('Question: What is the hacker\'s IP address?', 'warning', 1600);
    displayText('Enter IP address:', 'info', 1700);
}

function checkLevel3(answer) {
    if (answer.trim() === levels[3].answer) {
        playSuccessAnimation();
        displayText('Hacker identified! IP address correct.', 'success', 1000);
        updateScore(20);
        setTimeout(() => {
            startLevel(4);
        }, 2000);
    } else {
        playFailAnimation('INCORRECT IP ADDRESS');
        displayText('Analyze the logs carefully...', 'warning', 600);
    }
}

// ===== LEVEL 4: TERMINAL COMMANDS =====
function initLevel4() {
    displayText('💻 TERMINAL COMMAND CHALLENGE', 'warning', 400);
    displayText('', '', 500);
    displayText('Execute the following commands to proceed:', 'info', 600);
    displayText('', '', 700);
    displayText('Available commands:', 'warning', 800);
    displayText('  • scan network', 'info', 900);
    displayText('  • nmap -f system', 'info', 1000);
    displayText('  • trace ip', 'info', 1100);
    displayText('  • decode file.txt', 'info', 1200);
    displayText('', '', 1300);
    displayText('Execute all commands to complete this level.', 'warning', 1400);
}

function executeCommand(cmd) {
    const command = cmd.toLowerCase().trim();
    
    displayText(`> ${cmd}`, 'info');
    displayText('', '');
    
    switch(command) {
        case 'scan network':
            if (!gameState.level4Commands.scan) {
                displayText('Scanning network...', 'warning', 100);
                displayText('', '', 200);
                displayText('Found devices:', 'success', 300);
                displayText('  192.168.1.1  - Router', 'info', 400);
                displayText('  192.168.1.50 - Server', 'info', 500);
                displayText('  192.168.1.77 - Unknown [SUSPICIOUS]', 'error', 600);
                displayText('  192.168.1.100 - Workstation', 'info', 700);
                displayText('', '', 800);
                displayText('✓ Scan complete', 'success', 900);
                gameState.level4Commands.scan = true;
            } else {
                displayText('✓ Already executed', 'warning', 100);
            }
            break;
            
        case 'nmap -f system':
            if (!gameState.level4Commands.nmap) {
                displayText('Running Nmap scan...', 'warning', 100);
                displayText('', '', 200);
                displayText('Open ports on 192.168.1.77:', 'success', 300);
                displayText('  22/tcp   open  ssh', 'info', 400);
                displayText('  80/tcp   open  http', 'info', 500);
                displayText('  443/tcp  open  https', 'info', 600);
                displayText('  3306/tcp open  mysql', 'error', 700);
                displayText('', '', 800);
                displayText('✓ Nmap scan complete', 'success', 900);
                gameState.level4Commands.nmap = true;
            } else {
                displayText('✓ Already executed', 'warning', 100);
            }
            break;
            
        case 'trace ip':
            if (!gameState.level4Commands.trace) {
                displayText('Tracing IP route...', 'warning', 100);
                displayText('', '', 200);
                displayText('Hop  IP Address        Location', 'success', 300);
                displayText('1    192.168.1.1      Local Gateway', 'info', 400);
                displayText('2    10.0.0.1         ISP Router', 'info', 500);
                displayText('3    172.16.0.1       Regional Hub', 'info', 600);
                displayText('4    192.168.1.77     TARGET FOUND', 'error', 700);
                displayText('', '', 800);
                displayText('✓ Trace complete', 'success', 900);
                gameState.level4Commands.trace = true;
            } else {
                displayText('✓ Already executed', 'warning', 100);
            }
            break;
            
        case 'decode file.txt':
            if (!gameState.level4Commands.decode) {
                displayText('Decoding file.txt...', 'warning', 100);
                displayText('', '', 200);
                displayText('File contents:', 'success', 300);
                displayText('═'.repeat(40), 'info', 400);
                displayText('CLASSIFIED INFORMATION', 'system', 500);
                displayText('Attacker: Unknown', 'error', 600);
                displayText('Method: SQL Injection', 'error', 700);
                displayText('Target: Admin Database', 'error', 800);
                displayText('Status: Active Threat', 'error', 900);
                displayText('═'.repeat(40), 'info', 1000);
                displayText('', '', 1100);
                displayText('✓ Decode complete', 'success', 1200);
                gameState.level4Commands.decode = true;
            } else {
                displayText('✓ Already executed', 'warning', 100);
            }
            break;
            
        default:
            displayText('Error: Command not recognized', 'error', 100);
            displayText('Type one of the available commands.', 'warning', 200);
            return;
    }
    
    // Check if all commands executed
    const allExecuted = Object.values(gameState.level4Commands).every(v => v === true);
    if (allExecuted) {
        setTimeout(() => {
            playSuccessAnimation();
            displayText('All commands executed successfully!', 'success', 1000);
            updateScore(20);
            setTimeout(() => {
                startLevel(5);
            }, 2000);
        }, 1000);
    }
}

// ===== LEVEL 5: SECURITY PUZZLE =====
function initLevel5() {
    displayText('🧩 SECURITY PUZZLE CHALLENGE', 'warning', 400);
    displayText('', '', 500);
    displayText('Final Challenge!', 'system', 600);
    displayText('', '', 700);
    displayText('Arrange these symbols in the correct order:', 'info', 800);
    displayText('', '', 900);
    displayText(`  ${levels[5].symbols}`, 'success', 1000);
    displayText('', '', 1100);
    displayText(`Hint: ${levels[5].hint}`, 'warning', 1200);
    displayText('', '', 1300);
    displayText('Enter the symbols in correct order (no spaces):', 'info', 1400);
}

function checkLevel5(answer) {
    if (answer.trim() === levels[5].answer) {
        playSuccessAnimation();
        displayText('Puzzle solved!', 'success', 1000);
        updateScore(20);
        setTimeout(() => {
            gameComplete();
        }, 2000);
    } else {
        playFailAnimation('INCORRECT SEQUENCE');
        displayText('Think about the order from security to power...', 'warning', 600);
    }
}

// ===== GAME COMPLETION =====
function gameComplete() {
    clearTerminal();
    
    const victoryArt = `
    ███╗   ███╗██╗███████╗███████╗██╗ ██████╗ ███╗   ██╗
    ████╗ ████║██║██╔════╝██╔════╝██║██╔═══██╗████╗  ██║
    ██╔████╔██║██║███████╗███████╗██║██║   ██║██╔██╗ ██║
    ██║╚██╔╝██║██║╚════██║╚════██║██║██║   ██║██║╚██╗██║
    ██║ ╚═╝ ██║██║███████║███████║██║╚██████╔╝██║ ╚████║
    ╚═╝     ╚═╝╚═╝╚══════╝╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝
    
     ██████╗ ██████╗ ███╗   ███╗██████╗ ██╗     ███████╗████████╗███████╗██████╗ 
    ██╔════╝██╔═══██╗████╗ ████║██╔══██╗██║     ██╔════╝╚══██╔══╝██╔════╝██╔══██╗
    ██║     ██║   ██║██╔████╔██║██████╔╝██║     █████╗     ██║   █████╗  ██║  ██║
    ██║     ██║   ██║██║╚██╔╝██║██╔═══╝ ██║     ██╔══╝     ██║   ██╔══╝  ██║  ██║
    ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║     ███████╗███████╗   ██║   ███████╗██████╔╝
     ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚══════╝╚══════╝   ╚═╝   ╚══════╝╚═════╝ 
    `;
    
    displayASCII(victoryArt);
    displayText('', '');
    displayText('═'.repeat(60), 'success');
    displayText('   🏆 MISSION COMPLETED – YOU ARE NOW A CYBER WARRIOR 🏆', 'success');
    displayText('═'.repeat(60), 'success');
    displayText('', '');
    displayText(`Final Score: ${gameState.score}/100`, 'warning');
    displayText('', '');
    displayText('All systems secured!', 'success');
    displayText('Threats neutralized!', 'success');
    displayText('Network protected!', 'success');
    displayText('', '');
    displayText('Thank you for playing!', 'info');
    displayText('', '');
    displayText('Refresh the page to play again.', 'warning');
    
    gameState.waitingForInput = false;
    input.disabled = true;
}

// ===== INPUT HANDLER =====
function handleInput(userInput) {
    if (!gameState.waitingForInput || !userInput.trim()) return;
    
    const command = userInput.trim();
    
    // Display user input
    displayText(`root@system:~$ ${command}`, 'info');
    displayText('', '');
    
    // Process based on current level
    switch(gameState.currentLevel) {
        case 1:
            checkLevel1(command);
            break;
        case 2:
            checkLevel2(command);
            break;
        case 3:
            checkLevel3(command);
            break;
        case 4:
            executeCommand(command);
            break;
        case 5:
            checkLevel5(command);
            break;
    }
    
    // Clear input
    input.value = '';
}

// ===== EVENT LISTENERS =====
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleInput(input.value);
    }
});

// Keep focus on input
document.addEventListener('click', () => {
    if (!input.disabled) {
        input.focus();
    }
});

// ===== GAME INITIALIZATION =====
function initGame() {
    displayText('═'.repeat(60), 'success');
    displayText('   INITIALIZING CYBERSECURITY TERMINAL...', 'success');
    displayText('═'.repeat(60), 'success');
    displayText('', '', 100);
    displayText('System Status: ONLINE', 'info', 200);
    displayText('Security Level: MAXIMUM', 'info', 300);
    displayText('Training Mode: ACTIVE', 'info', 400);
    displayText('', '', 500);
    displayText('Welcome, Agent.', 'warning', 600);
    displayText('Your mission: Complete 5 cybersecurity challenges.', 'warning', 700);
    displayText('Each successful challenge grants 20 points.', 'warning', 800);
    displayText('', '', 900);
    displayText('Press ENTER after typing your answer.', 'info', 1000);
    displayText('', '', 1100);
    displayText('Good luck, Cyber Warrior!', 'success', 1200);
    displayText('', '', 1300);
    
    setTimeout(() => {
        startLevel(1);
    }, 2000);
}

// Start the game when page loads
window.addEventListener('load', () => {
    input.focus();
    initGame();
});
