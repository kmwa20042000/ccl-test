// ccl.js
// Author: [Your Name]
// Date: [Current Date]
// Description: [Brief description of the purpose of this file]

// Main function
function main() {
    console.log("Hello, world!");
}

// Execute main function
main(); // Default questions with different question types
let pollQuestions = [
    {
        text: "Which planet is closest to the sun?",
        type: "single",
        options: [
            { text: "Mercury", correct: true },
            { text: "Venus", correct: false },
            { text: "Earth", correct: false },
            { text: "Mars", correct: false }
        ]
    },
    {
        text: "What is the capital of Japan?",
        type: "single",
        options: [
            { text: "Beijing", correct: false },
            { text: "Seoul", correct: false },
            { text: "Tokyo", correct: true },
            { text: "Bangkok", correct: false }
        ]
    },
    {
        text: "Which of these are primary colors in painting? (Select all that apply)",
        type: "multiple",
        options: [
            { text: "Red", correct: true },
            { text: "Green", correct: false },
            { text: "Blue", correct: true },
            { text: "Yellow", correct: true }
        ]
    },
    {
        text: "Which animal is known as the 'King of the Jungle'?",
        type: "single",
        options: [
            { text: "Tiger", correct: false },
            { text: "Lion", correct: true },
            { text: "Elephant", correct: false },
            { text: "Gorilla", correct: false }
        ]
    },
    {
        text: "What year did the first iPhone release?",
        type: "single",
        options: [
            { text: "2005", correct: false },
            { text: "2007", correct: true },
            { text: "2009", correct: false },
            { text: "2010", correct: false }
        ]
    },
    {
        text: "Which elements have the chemical symbol starting with 'O'? (Select all that apply)",
        type: "multiple",
        options: [
            { text: "Gold", correct: false },
            { text: "Oxygen", correct: true },
            { text: "Osmium", correct: true },
            { text: "Oganesson", correct: true }
        ]
    },
    {
        text: "Which of these are mammals? (Select all that apply)",
        type: "multiple",
        options: [
            { text: "Dolphin", correct: true },
            { text: "Bat", correct: true },
            { text: "Whale", correct: true },
            { text: "Penguin", correct: false }
        ]
    },
    {
        text: "Who wrote 'Romeo and Juliet'?",
        type: "single",
        options: [
            { text: "Charles Dickens", correct: false },
            { text: "Jane Austen", correct: false },
            { text: "William Shakespeare", correct: true },
            { text: "Mark Twain", correct: false }
        ]
    },
    {
        text: "Which of these are oceans on Earth? (Select all that apply)",
        type: "multiple",
        options: [
            { text: "Atlantic Ocean", correct: true },
            { text: "Indian Ocean", correct: true },
            { text: "Arctic Ocean", correct: true },
            { text: "Mediterranean Ocean", correct: false }
        ]
    },
    {
        text: "What is the square root of 144?",
        type: "single",
        options: [
            { text: "10", correct: false },
            { text: "12", correct: true },
            { text: "14", correct: false },
            { text: "16", correct: false }
        ]
    }
];

// Poll state
let pollState = {
    active: false,
    currentQuestion: 0,
    participants: 0,
    participantsList: [],
    votes: {},
    answeredParticipants: {},
    revealedResults: false
};

// User state
let userState = {
    isHost: false,
    isParticipant: false,
    hasAnswered: false,
    participantId: null,
    selectedOptions: []
};

// Editor state
let editorState = {
    editingIndex: null,
    questionType: "single"
};

// DOM Elements
const pages = {
    login: document.getElementById('login-page'),
    host: document.getElementById('host-dashboard'),
    participant: document.getElementById('participant-page'),
    thankYou: document.getElementById('thank-you-page')
};

// Host elements
const hostPasswordInput = document.getElementById('host-password');
const loginHostBtn = document.getElementById('login-host-btn');
const joinParticipantBtn = document.getElementById('join-participant-btn');
const startPollBtn = document.getElementById('start-poll-btn');
const editQuestionsBtn = document.getElementById('edit-questions-btn');
const endPollBtn = document.getElementById('end-poll-btn');
const hostLogoutBtn = document.getElementById('host-logout-btn');
const hostStatus = document.getElementById('host-status');
const hostContent = document.getElementById('host-content');
const questionCounter = document.getElementById('question-counter');
const participantCounter = document.getElementById('participant-counter');
const totalParticipants = document.getElementById('total-participants');
const voteCounter = document.getElementById('vote-counter');
const questionText = document.getElementById('question-text');
const questionTypeElement = document.getElementById('question-type');
const hostOptions = document.getElementById('host-options');
const showResultsBtn = document.getElementById('show-results-btn');
const hostResults = document.getElementById('host-results');
const resultsContainer = document.getElementById('results-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Edit modal elements
const editModal = document.getElementById('edit-modal');
const questionList = document.getElementById('question-list');
const addQuestionBtn = document.getElementById('add-question-btn');
const saveQuestionsBtn = document.getElementById('save-questions-btn');
const closeButtons = document.querySelectorAll('.close-btn');

// Question editor elements
const questionEditorModal = document.getElementById('question-editor-modal');
const editorTitle = document.getElementById('editor-title');
const editQuestionText = document.getElementById('edit-question-text');
const questionTypeSelect = document.getElementById('question-type-select');
const editOptionsContainer = document.getElementById('edit-options-container');
const addOptionBtn = document.getElementById('add-option-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const saveQuestionBtn = document.getElementById('save-question-btn');

// Participant elements
const waitingConnection = document.getElementById('waiting-connection');
const waitingStart = document.getElementById('waiting-start');
const participantActive = document.getElementById('participant-active');
const participantQuestionCounter = document.getElementById('participant-question-counter');
const participantQuestionText = document.getElementById('participant-question-text');
const participantQuestionType = document.getElementById('participant-question-type');
const participantOptions = document.getElementById('participant-options');
const multiAnswerSubmit = document.getElementById('multi-answer-submit');
const submitAnswersBtn = document.getElementById('submit-answers-btn');
const waitingResults = document.getElementById('waiting-results');
const participantResults = document.getElementById('participant-results');
const participantResultsContainer = document.getElementById('participant-results-container');
const participantLogoutBtn = document.getElementById('participant-logout-btn');
const closePollBtn = document.getElementById('close-poll-btn');

// Initialize the app
function init() {
    loadSettings();
    attachEventListeners();
    
    // Check local storage for saved questions
    const savedQuestions = localStorage.getItem('pollQuestions');
    if (savedQuestions) {
        try {
            pollQuestions = JSON.parse(savedQuestions);
        } catch (e) {
            console.error('Failed to load saved questions', e);
        }
    }
}

// Load saved settings
function loadSettings() {
    // Set the host password hash (for "service8")
    if (!localStorage.getItem('hostPasswordHash')) {
        const defaultHash = hashPassword("service8");
        localStorage.setItem('hostPasswordHash', defaultHash);
    }
}

// Simple hash function for passwords
function hashPassword(password) {
    // This is a simple hash function for demonstration
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
}

function attachEventListeners() {
    // Login events
    loginHostBtn.addEventListener('click', loginAsHost);
    joinParticipantBtn.addEventListener('click', joinAsParticipant);
    
    // Host events
    startPollBtn.addEventListener('click', startOrResetPoll);
    editQuestionsBtn.addEventListener('click', openEditModal);
    endPollBtn.addEventListener('click', endPoll);
    hostLogoutBtn.addEventListener('click', logOut);
    showResultsBtn.addEventListener('click', showResults);
    prevBtn.addEventListener('click', previousQuestion);
    nextBtn.addEventListener('click', nextQuestion);
    
    // Edit modal events
    addQuestionBtn.addEventListener('click', () => openQuestionEditor());
    saveQuestionsBtn.addEventListener('click', saveAllQuestions);
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Question editor events
    questionTypeSelect.addEventListener('change', handleQuestionTypeChange);
    addOptionBtn.addEventListener('click', addOptionField);
    cancelEditBtn.addEventListener('click', () => {
        questionEditorModal.classList.remove('active');
    });
    saveQuestionBtn.addEventListener('click', saveQuestion);
    
    // Participant events
    submitAnswersBtn.addEventListener('click', submitMultipleAnswers);
    participantLogoutBtn.addEventListener('click', logOut);
    closePollBtn.addEventListener('click', () => showPage('login'));
}

// Handle question type change in editor
function handleQuestionTypeChange() {
    editorState.questionType = questionTypeSelect.value;
    
    // Update option input types
    const optionsContainer = document.getElementById('edit-options-container');
    const optionGroups = optionsContainer.querySelectorAll('.form-group');
    
    optionGroups.forEach(group => {
        const inputContainer = group.querySelector('.checkbox-container');
        if (inputContainer) {
            const isCorrectInput = inputContainer.querySelector('input');
            const inputLabel = inputContainer.querySelector('label');
            
            if (editorState.questionType === 'single') {
                isCorrectInput.type = 'radio';
                isCorrectInput.name = 'correct-option';
                inputLabel.textContent = 'Correct answer';
            } else {
                isCorrectInput.type = 'checkbox';
                isCorrectInput.name = 'correct-options[]';
                inputLabel.textContent = 'Correct answer';
            }
        }
    });
}

// Login functions
function loginAsHost() {
    const password = hostPasswordInput.value;
    const passwordHash = hashPassword(password);
    const storedHash = localStorage.getItem('hostPasswordHash');
    
    if (passwordHash === storedHash) {
        userState.isHost = true;
        showPage('host');
        
        // Clear password field
        hostPasswordInput.value = '';
        
        // Initialize host view
        if (pollState.active) {
            hostStatus.textContent = "Poll is currently active. Students can join and answer questions.";
            hostStatus.style.display = 'block';
            hostContent.style.display = 'block';
            loadQuestion(pollState.currentQuestion);
        } else {
            hostStatus.textContent = "Poll is not active. Click 'Start Poll' to begin.";
            hostStatus.style.display = 'block';
            hostContent.style.display = 'none';
        }
    } else {
        alert('Incorrect password. Please try again.');
    }
}

function joinAsParticipant() {
    userState.isParticipant = true;
    userState.participantId = generateParticipantId();
    showPage('participant');
    
    // Simulate connecting
    setTimeout(() => {
        waitingConnection.style.display = 'none';
        
        if (pollState.active) {
            // Add participant to the list
            if (!pollState.participantsList.includes(userState.participantId)) {
                pollState.participantsList.push(userState.participantId);
                pollState.participants = pollState.participantsList.length;
                updateParticipantCounter();
            }
            
            participantActive.style.display = 'block';
            loadParticipantQuestion(pollState.currentQuestion);
        } else {
            waitingStart.style.display = 'block';
        }
    }, 1500);
}

function generateParticipantId() {
    return 'participant_' + Math.random().toString(36).substr(2, 9);
}

function logOut() {
    // Remove participant from list if logging out
    if (userState.isParticipant && userState.participantId) {
        pollState.participantsList = pollState.participantsList.filter(id => id !== userState.participantId);
        pollState.participants = pollState.participantsList.length;
        updateParticipantCounter();
    }
    
    userState.isHost = false;
    userState.isParticipant = false;
    userState.hasAnswered = false;
    userState.participantId = null;
    userState.selectedOptions = [];
    showPage('login');
}

// Navigation
function showPage(pageId) {
    Object.keys(pages).forEach(key => {
        pages[key].classList.remove('active');
    });
    pages[pageId].classList.add('active');
}

// Host functions
function startOrResetPoll() {
    // Reset poll state
    pollState.active = true;
    pollState.currentQuestion = 0;
    pollState.votes = {};
    pollState.answeredParticipants = {};
    pollState.revealedResults = false;
    // Keep the participants count
    
    // Update UI
    hostStatus.textContent = "Poll started! Students can now join and answer questions.";
    hostStatus.className = "alert success";
    hostStatus.style.display = 'block';
    hostContent.style.display = 'block';
    
    endPollBtn.style.display = 'inline-block';
    
    loadQuestion(0);
    
    // Notify participants
    notifyParticipantsOfStart();
}

function updateParticipantCounter() {
    if (participantCounter) {
        participantCounter.textContent = pollState.participants;
    }
    if (totalParticipants) {
        totalParticipants.textContent = pollState.participants;
    }
    updateVoteCounter();
}

function updateVoteCounter() {
    if (voteCounter && pollState.currentQuestion !== undefined) {
        // Count how many participants have answered the current question
        const answeredCount = Object.keys(pollState.answeredParticipants).filter(
            participantId => pollState.answeredParticipants[participantId][pollState.currentQuestion]
        ).length;
        
        voteCounter.textContent = answeredCount;
    }
}

function loadQuestion(index) {
    if (index < 0 || index >= pollQuestions.length) return;
    
    const question = pollQuestions[index];
    pollState.currentQuestion = index;
    pollState.revealedResults = false;
    
    // Update question counter
    questionCounter.textContent = index + 1;
    questionText.textContent = question.text;
    
    // Update question type indicator
    questionTypeElement.textContent = question.type === 'single' ? 'Single Answer' : 'Multiple Answers';
    
    // Clear previous options and results
    hostOptions.innerHTML = '';
    hostResults.style.display = 'none';
    
    // Add options
    question.options.forEach((option, i) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option.text;
        optionElement.dataset.index = i;
        optionElement.dataset.correct = option.correct;
        
        hostOptions.appendChild(optionElement);
    });
    
    // Update navigation buttons
    prevBtn.disabled = (index === 0);
    nextBtn.disabled = (index === pollQuestions.length - 1);
    
    // Reset control buttons
    showResultsBtn.style.display = 'inline-block';
    
    // Update participant counter and vote counter
    updateParticipantCounter();
    
    // Update participant view if poll is active
    notifyParticipantsOfQuestionChange();
}

function showResults() {
    pollState.revealedResults = true;
    
    // Get current question and votes
    const questionIndex = pollState.currentQuestion;
    const question = pollQuestions[questionIndex];
    const votes = pollState.votes[questionIndex] || {};
    
    // Calculate total votes
    let totalVotes = 0;
    if (question.type === 'single') {
        Object.values(votes).forEach(count => {
            totalVotes += count;
        });
    } else {
        // For multiple choice, count number of participants who answered
        totalVotes = Object.keys(votes).length;
    }
    
    // Create result bars
    resultsContainer.innerHTML = '';
    question.options.forEach((option, i) => {
        let voteCount = 0;
        
        if (question.type === 'single') {
            voteCount = votes[i] || 0;
        } else {
            // For multiple choice, votes are stored as arrays of selected options
            voteCount = 0;
            Object.values(votes).forEach(selectedOptions => {
                if (selectedOptions.includes(i)) {
                    voteCount++;
                }
            });
        }
        
        const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
        
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        const resultLabel = document.createElement('div');
        resultLabel.className = 'result-label';
        
        const optionText = document.createElement('span');
        optionText.textContent = option.text + (option.correct ? ' ✓' : '');
        if (option.correct) {
            optionText.style.color = 'var(--correct)';
            optionText.style.fontWeight = 'bold';
        }
        
        const voteText = document.createElement('span');
        voteText.textContent = `${voteCount} vote${voteCount !== 1 ? 's' : ''} (${percentage}%)`;
        
        resultLabel.appendChild(optionText);
        resultLabel.appendChild(voteText);
        
        const barContainer = document.createElement('div');
        barContainer.className = 'result-bar-container';
        
        const bar = document.createElement('div');
        bar.className = 'result-bar';
        if (option.correct) {
            bar.className += ' correct';
        }
        bar.style.width = '0%';
        
        barContainer.appendChild(bar);
        
        resultItem.appendChild(resultLabel);
        resultItem.appendChild(barContainer);
        
        resultsContainer.appendChild(resultItem);
        
        // Animate the bars
        setTimeout(() => {
            bar.style.width = `${percentage}%`;
            if (percentage > 10) {
                bar.textContent = `${percentage}%`;
            }
        }, 50);
    });
    
    hostResults.style.display = 'block';
    showResultsBtn.style.display = 'none';
    
    // Automatically highlight correct answers in options list
    hostOptions.querySelectorAll('.option').forEach(option => {
        if (option.dataset.correct === 'true') {
            option.classList.add('correct');
        }
    });
    
    // Notify participants
    notifyParticipantsOfResultsReveal();
}

function previousQuestion() {
    if (pollState.currentQuestion > 0) {
        loadQuestion(pollState.currentQuestion - 1);
    }
}

function nextQuestion() {
    if (pollState.currentQuestion < pollQuestions.length - 1) {
        loadQuestion(pollState.currentQuestion + 1);
    }
}

function endPoll() {
    // Reset poll state
    pollState.active = false;
    
    // Update UI
    hostStatus.textContent = "Poll has ended. Click 'Start/Reset Poll' to begin a new poll.";
    hostStatus.className = "alert success";
    hostContent.style.display = 'none';
    endPollBtn.style.display = 'none';
    
    // Notify participants to show thank you page
    notifyParticipantsOfPollEnd();
}

// Question editing functions
function openEditModal() {
    // Populate question list
    renderQuestionList();
    editModal.classList.add('active');
}

function renderQuestionList() {
    questionList.innerHTML = '';
    
    pollQuestions.forEach((question, index) => {
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item';
        
        const questionText = document.createElement('div');
        const typeIndicator = question.type === 'single' ? '[Single]' : '[Multiple]';
        questionText.textContent = `Q${index + 1}: ${typeIndicator} ${question.text.length > 40 ? question.text.substring(0, 40) + '...' : question.text}`;
        
        const questionActions = document.createElement('div');
        questionActions.className = 'question-actions';
        
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => openQuestionEditor(index));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'danger';
        deleteBtn.addEventListener('click', () => deleteQuestion(index));
        
        questionActions.appendChild(editBtn);
        questionActions.appendChild(deleteBtn);
        
        questionItem.appendChild(questionText);
        questionItem.appendChild(questionActions);
        
        questionList.appendChild(questionItem);
    });
}

function openQuestionEditor(index = null) {
    editorState.editingIndex = index;
    
    // Set title
    editorTitle.textContent = index !== null ? 'Edit Question' : 'Add New Question';
    
    // Clear form
    editQuestionText.value = '';
    editOptionsContainer.innerHTML = '';
    
    // If editing, populate form
    if (index !== null) {
        const question = pollQuestions[index];
        editQuestionText.value = question.text;
        questionTypeSelect.value = question.type;
        editorState.questionType = question.type;
        
        // Add options
        question.options.forEach(option => {
            addOptionField(option.text, option.correct);
        });
    } else {
        // Add default options
        questionTypeSelect.value = 'single';
        editorState.questionType = 'single';
        addOptionField('', true);
        addOptionField('', false);
    }
    
    // Close edit modal and open editor
    editModal.classList.remove('active');
    questionEditorModal.classList.add('active');
}

function addOptionField(text = '', isCorrect = false) {
    const optionContainer = document.createElement('div');
    optionContainer.className = 'form-group';
    
    const optionInput = document.createElement('input');
    optionInput.type = 'text';
    optionInput.className = 'option-input';
    optionInput.placeholder = 'Enter an option';
    optionInput.value = text;
    
    const checkboxContainer = document.createElement('div');
    checkboxContainer.className = 'checkbox-container';
    
    const correctInput = document.createElement('input');
    if (editorState.questionType === 'single') {
        correctInput.type = 'radio';
        correctInput.name = 'correct-option';
    } else {
        correctInput.type = 'checkbox';
        correctInput.name = 'correct-options[]';
    }
    correctInput.className = 'correct-input';
    correctInput.checked = isCorrect;
    
    const correctLabel = document.createElement('label');
    correctLabel.textContent = 'Correct answer';
    
    checkboxContainer.appendChild(correctInput);
    checkboxContainer.appendChild(correctLabel);
    
    optionContainer.appendChild(optionInput);
    optionContainer.appendChild(checkboxContainer);
    
    editOptionsContainer.appendChild(optionContainer);
}

function saveQuestion() {
    const questionText = editQuestionText.value.trim();
    if (!questionText) {
        alert('Please enter a question');
        return;
    }
    
    const questionType = questionTypeSelect.value;
    const options = [];
    const optionInputs = document.querySelectorAll('.option-input');
    const correctInputs = document.querySelectorAll('.correct-input');
    
    let hasCorrectOption = false;
    
    for (let i = 0; i < optionInputs.length; i++) {
        const text = optionInputs[i].value.trim();
        if (!text) {
            alert('All options must have text');
            return;
        }
        
        const isCorrect = correctInputs[i].checked;
        if (isCorrect) hasCorrectOption = true;
        
        options.push({
            text: text,
            correct: isCorrect
        });
    }
    
    if (!hasCorrectOption) {
        alert('You must mark at least one option as correct');
        return;
    }
    
    const question = {
        text: questionText,
        type: questionType,
        options: options
    };
    
    if (editorState.editingIndex !== null) {
        // Update existing question
        pollQuestions[editorState.editingIndex] = question;
    } else {
        // Add new question
        pollQuestions.push(question);
    }
    
    // Close editor and update list
    questionEditorModal.classList.remove('active');
    editModal.classList.add('active');
    renderQuestionList();
}

function deleteQuestion(index) {
    if (confirm('Are you sure you want to delete this question?')) {
        pollQuestions.splice(index, 1);
        renderQuestionList();
    }
}

function saveAllQuestions() {
    // Save to localStorage
    localStorage.setItem('pollQuestions', JSON.stringify(pollQuestions));
    
    // Close modal
    editModal.classList.remove('active');
    
    // Show success message
    hostStatus.textContent = "Questions saved successfully!";
    hostStatus.className = "alert success";
    hostStatus.style.display = 'block';
    
    // If poll is active, reload current question
    if (pollState.active) {
        loadQuestion(pollState.currentQuestion);
    }
}

// Participant functions
function loadParticipantQuestion(index) {
    if (index < 0 || index >= pollQuestions.length) return;
    
    const question = pollQuestions[index];
    
    // Reset selected options
    userState.selectedOptions = [];
    
    // Update question counter
    participantQuestionCounter.textContent = index + 1;
    participantQuestionText.textContent = question.text;
    participantQuestionType.textContent = question.type === 'single' ? 'Single Answer' : 'Multiple Answers';
    
    // Reset state
    userState.hasAnswered = false;
    if (pollState.answeredParticipants[userState.participantId] && 
        pollState.answeredParticipants[userState.participantId][index]) {
        userState.hasAnswered = true;
    }
    
    // Show or hide submit button for multiple choice
    multiAnswerSubmit.style.display = question.type === 'multiple' ? 'block' : 'none';
    
    // Show appropriate screen
    participantActive.style.display = 'block';
    
    if (pollState.revealedResults) {
        // If results are already revealed, show them
        waitingResults.style.display = 'none';
        document.getElementById('participant-question').style.display = 'none';
        multiAnswerSubmit.style.display = 'none';
        showParticipantResults();
    } else if (userState.hasAnswered) {
        // If user already answered, show waiting
        document.getElementById('participant-question').style.display = 'none';
        multiAnswerSubmit.style.display = 'none';
        waitingResults.style.display = 'block';
        participantResults.style.display = 'none';
    } else {
        // Show question for answering
        document.getElementById('participant-question').style.display = 'block';
        waitingResults.style.display = 'none';
        participantResults.style.display = 'none';
        
        // Clear previous options
        participantOptions.innerHTML = '';
        
        // Add options
        question.options.forEach((option, i) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option.text;
            optionElement.dataset.index = i;
            
            // Add click handler for voting
            if (question.type === 'single') {
                // Single choice: click to submit immediately
                optionElement.addEventListener('click', () => {
                    recordVote(i);
                });
            } else {
                // Multiple choice: click to select, need to submit explicitly
                optionElement.addEventListener('click', () => {
                    toggleOption(optionElement, i);
                });
            }
            
            participantOptions.appendChild(optionElement);
        });
    }
}

function toggleOption(optionElement, optionIndex) {
    if (optionElement.classList.contains('selected')) {
        // Deselect option
        optionElement.classList.remove('selected');
        userState.selectedOptions = userState.selectedOptions.filter(i => i !== optionIndex);
    } else {
        // Select option
        optionElement.classList.add('selected');
        userState.selectedOptions.push(optionIndex);
    }
    
    // Enable/disable submit button
    submitAnswersBtn.disabled = userState.selectedOptions.length === 0;
}

function submitMultipleAnswers() {
    if (userState.selectedOptions.length === 0) return;
    
    const questionIndex = pollState.currentQuestion;
    
    // Initialize vote storage if needed
    if (!pollState.votes[questionIndex]) {
        pollState.votes[questionIndex] = {};
    }
    
    // Store the selected options for this participant
    pollState.votes[questionIndex][userState.participantId] = [...userState.selectedOptions];
    
    // Mark as answered
    if (!pollState.answeredParticipants[userState.participantId]) {
        pollState.answeredParticipants[userState.participantId] = {};
    }
    pollState.answeredParticipants[userState.participantId][questionIndex] = true;
    userState.hasAnswered = true;
    
    // Update vote counter for host
    updateVoteCounter();
    
    // Show waiting screen
    document.getElementById('participant-question').style.display = 'none';
    multiAnswerSubmit.style.display = 'none';
    waitingResults.style.display = 'block';
}

function recordVote(optionIndex) {
    const questionIndex = pollState.currentQuestion;
    
    // Initialize vote counters if needed
    if (!pollState.votes[questionIndex]) {
        pollState.votes[questionIndex] = {};
    }
    
    if (!pollState.votes[questionIndex][optionIndex]) {
        pollState.votes[questionIndex][optionIndex] = 0;
    }
    
    // Increment vote count
    pollState.votes[questionIndex][optionIndex]++;
    
    // Mark as answered
    if (!pollState.answeredParticipants[userState.participantId]) {
        pollState.answeredParticipants[userState.participantId] = {};
    }
    pollState.answeredParticipants[userState.participantId][questionIndex] = true;
    userState.hasAnswered = true;
    
    // Update vote counter for host
    updateVoteCounter();
    
    // Show waiting screen
    document.getElementById('participant-question').style.display = 'none';
    multiAnswerSubmit.style.display = 'none';
    waitingResults.style.display = 'block';
}

function showParticipantResults() {
    // Get current question and votes
    const questionIndex = pollState.currentQuestion;
    const question = pollQuestions[questionIndex];
    const votes = pollState.votes[questionIndex] || {};
    
    // Calculate total votes based on question type
    let totalVotes = 0;
    if (question.type === 'single') {
        Object.values(votes).forEach(count => {
            totalVotes += count;
        });
    } else {
        // For multiple choice, count unique participants
        totalVotes = Object.keys(votes).length;
    }
    
    // Create result bars
    participantResultsContainer.innerHTML = '';
    question.options.forEach((option, i) => {
        let voteCount = 0;
        
        if (question.type === 'single') {
            voteCount = votes[i] || 0;
        } else {
            // For multiple choice, count how many selected this option
            voteCount = 0;
            Object.values(votes).forEach(selectedOptions => {
                if (selectedOptions.includes(i)) {
                    voteCount++;
                }
            });
        }
        
        const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
        
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        const resultLabel = document.createElement('div');
        resultLabel.className = 'result-label';
        
        const optionText = document.createElement('span');
        optionText.textContent = option.text + (option.correct ? ' ✓' : '');
        if (option.correct) {
            optionText.style.color = 'var(--correct)';
            optionText.style.fontWeight = 'bold';
        }
        
        const voteText = document.createElement('span');
        voteText.textContent = `${voteCount} vote${voteCount !== 1 ? 's' : ''} (${percentage}%)`;
        
        resultLabel.appendChild(optionText);
        resultLabel.appendChild(voteText);
        
        const barContainer = document.createElement('div');
        barContainer.className = 'result-bar-container';
        
        const bar = document.createElement('div');
        bar.className = 'result-bar';
        if (option.correct) {
            bar.className += ' correct';
        }
        bar.style.width = '0%';
        
        barContainer.appendChild(bar);
        
        resultItem.appendChild(resultLabel);
        resultItem.appendChild(barContainer);
        
        participantResultsContainer.appendChild(resultItem);
        
        // Animate the bars
        setTimeout(() => {
            bar.style.width = `${percentage}%`;
            if (percentage > 10) {
                bar.textContent = `${percentage}%`;
            }
        }, 50);
    });
    
    participantResults.style.display = 'block';
}

// Participant notifications (simulating real-time updates)
function notifyParticipantsOfStart() {
    if (userState.isParticipant) {
        waitingStart.style.display = 'none';
        participantActive.style.display = 'block';
        loadParticipantQuestion(0);
    }
}

function notifyParticipantsOfQuestionChange() {
    if (userState.isParticipant) {
        loadParticipantQuestion(pollState.currentQuestion);
    }
}

function notifyParticipantsOfResultsReveal() {
    if (userState.isParticipant) {
        waitingResults.style.display = 'none';
        document.getElementById('participant-question').style.display = 'none';
        multiAnswerSubmit.style.display = 'none';
        showParticipantResults();
    }
}

function notifyParticipantsOfPollEnd() {
    if (userState.isParticipant) {
        showPage('thankYou');
    }
}

// Initialize the app
init();