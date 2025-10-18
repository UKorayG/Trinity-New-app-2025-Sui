// --- Select HTML elements ---
const gameScreen = document.getElementById('game-screen');
const mapScreen = document.getElementById('map-screen');
const startButton = document.getElementById('start-button');
const submitButton = document.getElementById('submit-button');
const viewMapButton = document.getElementById('view-feed-button');
const backToGameButton = document.getElementById('back-to-game-button');
const wordElements = [
    document.getElementById('word1'),
    document.getElementById('word2'),
    document.getElementById('word3')
];
const timerElement = document.getElementById('timer');
const storyInput = document.getElementById('story-input');
const universeMap = document.getElementById('universe-map');
const progressBarContainer = document.getElementById('progress-bar-container');
const progressBar = document.getElementById('progress-bar');
const storyModal = document.getElementById('story-modal');
const modalTitle = document.getElementById('modal-title');
const modalStoryText = document.getElementById('modal-story-text');
const modalRewardIcon = document.querySelector('.modal-reward-icon');
const closeModalButton = document.querySelector('.close-button');
const timeDisplay = document.getElementById('time-display');
const ghostModal = document.getElementById('ghost-modal');
const ghostTitle = document.getElementById('ghost-title');
const ghostMessage = document.getElementById('ghost-message');
const closeGhostButton = ghostModal.querySelector('.close-button');

// --- Application data ---
let allWords = [
    "future", "cyborg", "android", "glitch", "network", "data", "system", "hacker", "cybernetic",
    "dystopia", "utopia", "terminal", "nexus", "matrix", "virtual", "reality", "augment",
    "street", "neon", "city", "street", "alley", "roof", "skyline", "subway", "drone",
    "robot", "machine", "synth", "clone", "gene", "virus", "biotech", "nano", "organism",
    "pulse", "signal", "whisper", "echo", "transmission", "frequency", "code", "protocol",
    "crime", "detective", "bounty", "hunter", "syndicate", "corp", "corporation", "shadow",
    "memory", "dream", "ghost", "soul", "mind", "consciousness", "upload", "download", "erase",
    "chaos", "order", "rebel", "resistance", "revolution", "control", "freedom", "power", "truth",
    "light", "darkness", "static", "noise", "silence", "echo", "reflection", "portal", "gate",
    "metal", "plastic", "glass", "circuit", "cable", "wire", "chip", "armor", "weapon",
    "love", "hate", "fear", "hope", "sadness", "joy", "anger", "calm", "storm",
    "urban", "decay", "future", "past", "present", "unknown", "infinite", "void", "star",
    "planet", "galaxy", "universe", "nebula", "asteroid", "comet", "satellite", "orbital",
    "hologram", "illusion", "mirage", "perception", "illusion", "deception", "secret", "lie",
    "story", "narrative", "myth", "legend", "history", "future", "prophecy", "destiny",
    "firewall", "encryption", "firewall", "backdoor", "exploit", "patch", "glitch", "bug",
    "neural", "link", "synapse", "processor", "core", "kernel", "interface", "terminal"
];
let stories = [];
let currentWords = [];
let userSentences = [];
let currentLevel = 0;
const totalLevels = 5;
const initialTimer = 30;
let timerInterval;
let gameHour = 12;
let ghostTimerInterval;
let isGameReady = true;
let finalStoryContainerEl = null;
let nextLevelButton = null;

const rewards = [
    { name: "Cyber-Cherry", image: "images/cherry.gif" },
    { name: "Neon-Banana", image: "images/banana.gif" },
    { name: "Quantum-Apple", image: "images/apple.gif" },
    { name: "Hologram-Orange", image: "images/orange.gif" },
    { name: "Glitch-Grapes", image: "images/grapes.gif" }
];

// --- Functions ---
function updateClock() {
    gameHour++;
    if (gameHour >= 24) gameHour = 0;
    const hour = gameHour < 10 ? '0' + gameHour : gameHour;
    const minutes = Math.floor(Math.random() * 60);
    const min = minutes < 10 ? '0' + minutes : minutes;
    timeDisplay.textContent = `${hour}:${min}`;
    updateTheme();
}

function updateTheme() {
    const isDay = gameHour >= 6 && gameHour < 18;
    if (isDay) {
        document.body.classList.add('day-theme');
        clearInterval(ghostTimerInterval); 
        showGhostModal(false);
    } else {
        document.body.classList.remove('day-theme');
        if (!ghostTimerInterval) {
            ghostTimerInterval = setInterval(() => {
                showGhostModal(true);
            }, 600000); // 10 minutes (milliseconds)
            showGhostModal(true);
        }
    }
}

function showGhostModal(isNight) {
    if (isNight && !ghostModal.classList.contains('active')) {
        const ghostMessages = [
            "NIGHT MODE INITIATED. UNEXPECTED SIGNALS DETECTED IN THE DATASTREAM. PROCEED WITH CAUTION.",
            "THREAT DETECTED. FOREIGN CODE MAY HAVE INFILTRATED THE SYSTEM. SCANNING...",
            "SUBCONSCIOUS DATA INJECTION. STORIES ARE DEEPENING. REMEMBER, THE SYSTEM IS WATCHING."
        ];
        ghostTitle.textContent = "EMERGENCY NOTIFICATION: 'GHOST' HAS MADE CONTACT";
        ghostMessage.textContent = ghostMessages[Math.floor(Math.random() * ghostMessages.length)];
        ghostModal.classList.add('active');
    } else if (!isNight) {
        ghostModal.classList.remove('active');
    }
}

function createFinalStory(lastSentence, words) {
    const aiStoryStarts = [
        `The flickering lights of the neon city revealed a forgotten ${words[0]}.`,
        `A corrupted ${words[1]} file led them deep into the cybernetic underbelly.`,
        `The only clue was a ${words[2]} signal, echoing through the network.`,
        `He had to find a way to ${words[0]} the system before the ${words[1]} and the ${words[2]} were gone forever.`,
        `The rebel's plan was simple: steal the ${words[0]}, bypass the ${words[1]}, and escape through the ${words[2]}.`,
        `In a world of ${words[0]} and ${words[1]}, their only hope was a mysterious ${words[2]} that promised to change everything.`
    ];

    const randomStory = aiStoryStarts[Math.floor(Math.random() * aiStoryStarts.length)];
    return `${userSentences.join(' ')} ${randomStory}`;
}

function getRandomWords() {
    const randomWords = new Set();
    while (randomWords.size < 3) {
        const randomIndex = Math.floor(Math.random() * allWords.length);
        randomWords.add(allWords[randomIndex]);
    }
    currentWords = Array.from(randomWords);
    renderWords(currentWords);
}

function renderWords(words) {
    words.forEach((word, index) => {
        wordElements[index].textContent = word.toUpperCase();
    });
}

function startNewRound() {
    if (finalStoryContainerEl) {
        finalStoryContainerEl.remove();
        finalStoryContainerEl = null;
    }
    if (nextLevelButton) {
        nextLevelButton.remove();
    }
    
    // Gerekli elementleri görünür yap
    storyInput.style.display = 'block';
    submitButton.style.display = 'block';
    timerElement.style.display = 'block';

    // Start a new round
    getRandomWords();
    storyInput.value = '';
    storyInput.focus();
    storyInput.classList.remove('correct');
    submitButton.classList.remove('correct');
    
    let timerValue = initialTimer - (currentLevel * 3);
    if (timerValue < 10) timerValue = 10;
    startTimer(timerValue);
}

function startTimer(timeLeft) {
    timerElement.textContent = timeLeft;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleSubmit();
        }
    }, 1000);
}

function updateProgressBar() {
    const progressPercentage = ((userSentences.length % totalLevels) / totalLevels) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

function checkAndHandleInput() {
    const userStory = storyInput.value.trim().toLowerCase();
    const containsAllWords = currentWords.every(word => userStory.includes(word.toLowerCase()));
    
    if (userStory && containsAllWords) {
        storyInput.classList.add('correct');
        submitButton.classList.add('correct');
    } else {
        storyInput.classList.remove('correct');
        submitButton.classList.remove('correct');
    }
}

function handleSubmit() {
    clearInterval(timerInterval);

    const userStory = storyInput.value.trim();
    const containsAllWords = currentWords.every(word => userStory.toLowerCase().includes(word.toLowerCase()));

    if (containsAllWords && userStory) {
        userSentences.push(userStory);
    }
    
    if (userSentences.length % totalLevels === 0 && userSentences.length > 0) {
        currentLevel++;
        if (currentLevel <= rewards.length) {
            const finalStoryText = createFinalStory(userSentences[userSentences.length - 1], currentWords);
            const reward = rewards[currentLevel - 1];
            
            stories.push({
                id: Date.now(),
                level: currentLevel,
                story: finalStoryText,
                reward: reward
            });
            
            displayFinalStory(finalStoryText, reward);
        } else {
            // All levels completed
            alert("Congratulations! You have completed all levels of COSMIC ORACLE. You can view all your stories in the FEEDS section.");
            window.location.reload(); 
        }
    } else {
        startNewRound();
        updateProgressBar();
    }
}

function displayFinalStory(text, reward) {
    if (finalStoryContainerEl) {
        finalStoryContainerEl.remove();
    }
    
    // Gerekli elementleri gizle
    storyInput.style.display = 'none';
    submitButton.style.display = 'none';
    
    const container = document.createElement('div');
    container.classList.add('final-story-container');
    
    const finalStoryEl = document.createElement('div');
    finalStoryEl.classList.add('final-story-text');
    finalStoryEl.textContent = text;
    container.appendChild(finalStoryEl);
    
    const rewardItem = document.createElement('div');
    rewardItem.classList.add('reward-item');
    rewardItem.style.backgroundImage = `url(${reward.image})`;
    rewardItem.title = reward.name;
    container.appendChild(rewardItem);
    
    finalStoryContainerEl = container;
    gameScreen.insertBefore(finalStoryContainerEl, progressBarContainer);
    
    // Eğer buton daha önce oluşturulmadıysa oluştur, varsa sadece metnini güncelle
    if (!nextLevelButton) {
        nextLevelButton = document.createElement('button');
        nextLevelButton.classList.add('action-button');
        nextLevelButton.onclick = () => {
            userSentences = []; // Reset sentences for new level
            startNewRound();
            updateProgressBar();
        };
        gameScreen.appendChild(nextLevelButton);
    }
    
    nextLevelButton.textContent = 'NEXT LEVEL';
}

function renderMap() {
    universeMap.innerHTML = '';
    stories.forEach((story, index) => {
        const point = document.createElement('div');
        point.classList.add('map-point');
        // Rastgele konum ataması
        const topPos = Math.random() * 80 + 10; // 10% - 90%
        const leftPos = Math.random() * 80 + 10; // 10% - 90%
        point.style.top = `${topPos}%`;
        point.style.left = `${leftPos}%`;
        
        point.style.backgroundImage = `url(${story.reward.image})`;
        point.title = story.reward.name;
        
        point.addEventListener('click', () => {
            showStoryModal(story);
        });
        
        universeMap.appendChild(point);
    });
}

function showStoryModal(story) {
    modalTitle.textContent = `Level ${story.level}: ${story.reward.name}`;
    modalStoryText.textContent = story.story;
    modalRewardIcon.style.backgroundImage = `url(${story.reward.image})`;
    storyModal.classList.add('active');
}

// --- Event Listeners ---
startButton.addEventListener('click', () => {
    if (!isGameReady) {
        alert("The game is loading words. Please wait a moment and try again.");
        return;
    }
    
    startButton.classList.add('hidden');
    submitButton.classList.remove('hidden');
    progressBarContainer.style.display = 'block';
    userSentences = [];
    currentLevel = 0;
    progressBar.style.width = '0%';
    startNewRound();
});

submitButton.addEventListener('click', () => {
    handleSubmit();
});

storyInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleSubmit();
    }
});

storyInput.addEventListener('input', checkAndHandleInput);

viewMapButton.addEventListener('click', () => {
    switchScreen('map-screen');
    renderMap();
});

backToGameButton.addEventListener('click', () => {
    switchScreen('game-screen');
});

closeModalButton.addEventListener('click', () => {
    storyModal.classList.remove('active');
});

closeGhostButton.addEventListener('click', () => {
    ghostModal.classList.remove('active');
});

function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });
    const targetScreen = document.getElementById(screenId);
    targetScreen.classList.remove('hidden');
    targetScreen.classList.add('active');
}

// Application initialization
startButton.textContent = "LOADING...";
startButton.disabled = true;
getRandomWords();
isGameReady = true;
startButton.disabled = false;
startButton.textContent = "START";
progressBarContainer.style.display = 'none';
submitButton.style.display = 'none';
setInterval(updateClock, 3000);
updateClock();