// success calculator logic

// State
let habits = [];
const TOTAL_CIRCUMFERENCE = 339.292; // 2 * pi * 54

// DOM Elements
function getEl(id) { return document.getElementById(id); }

// Navigation
function goToStep(stepName) {
    // Hide all
    document.querySelectorAll('.card').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.card').forEach(el => el.classList.remove('active'));

    // Show target
    const target = getEl(`step-${stepName}`);
    target.classList.remove('hidden');

    // Trigger generic fade in logic by re-adding class
    target.classList.remove('fade-in');
    void target.offsetWidth; // trigger reflow
    target.classList.add('fade-in');
    target.classList.add('active');
}

// Range Slider
function updateRangeValue(input, displayId) {
    getEl(displayId).innerText = input.value;
}

// Habit Management
function addHabit() {
    const list = getEl('habit-list');
    const div = document.createElement('div');
    div.className = 'habit-item';
    div.innerHTML = `
        <input type="text" placeholder="Enter a positive habit..." class="habit-input">
        <button class="btn-icon remove" onclick="removeHabit(this)">×</button>
    `;
    list.appendChild(div);
    div.querySelector('input').focus();
}

function removeHabit(btn) {
    btn.parentElement.remove();
}

// Calculation Engine
function calculateSuccess() {
    // 1. Gather Inputs
    const productivity = parseInt(getEl('productivity-slider').value);
    const isConsistent = getEl('consistency-check').checked;

    const habitInputs = document.querySelectorAll('.habit-input');
    let validHabits = 0;
    let positiveKeywords = ['read', 'workout', 'exercise', 'study', 'code', 'meditate', 'work', 'clean', 'learn', 'save', 'plan'];
    let bonusPoints = 0;

    habitInputs.forEach(input => {
        const val = input.value.toLowerCase().trim();
        if (val.length > 2) {
            validHabits++;
            // Simple heuristic analysis
            if (positiveKeywords.some(keyword => val.includes(keyword))) {
                bonusPoints += 5;
            }
        }
    });

    // 2. Show Loading
    goToStep('loading');

    // 3. Algorithm
    // Base score from productivity (0-50)
    let score = productivity * 5;

    // Habit score (up to 30)
    score += Math.min(validHabits * 5, 30);

    // Consistency Multiplier (flat +10 or so)
    if (isConsistent) score += 15;

    // Bonus from quality of habits
    score += bonusPoints;

    // Cap at 99% (nobody is perfect, or 100 if really good)
    if (score > 98) score = 98;
    if (score < 10) score = 10 + Math.floor(Math.random() * 10); // Minimum hope

    // 4. Simulate Processing Time then Show Result
    setTimeout(() => {
        showResult(score);
    }, 2000);
}

function showResult(score) {
    goToStep('result');

    // Animate Gauge
    const progressCircle = getEl('gauge-progress');
    const textDisplay = getEl('score-value');
    const tierDisplay = getEl('score-tier');
    const analysisText = getEl('analysis-text');

    // Reset gauge
    progressCircle.style.strokeDashoffset = TOTAL_CIRCUMFERENCE;

    // Calculate new offset
    const offset = TOTAL_CIRCUMFERENCE - (score / 100 * TOTAL_CIRCUMFERENCE);

    // Animate numbers
    let currentScore = 0;
    const duration = 1500;
    const intervalTime = 20;
    const steps = duration / intervalTime;
    const increment = score / steps;

    const timer = setInterval(() => {
        currentScore += increment;
        if (currentScore >= score) {
            currentScore = score;
            clearInterval(timer);
        }
        textDisplay.innerText = Math.floor(currentScore);
    }, intervalTime);

    // Trigger stroke animation
    setTimeout(() => {
        progressCircle.style.strokeDashoffset = offset;

        // Coloring based on score
        if (score > 80) {
            tierDisplay.innerText = "Elite Performer";
            tierDisplay.style.color = "#10b981"; // Emerald
            progressCircle.style.stroke = "#10b981";
            analysisText.innerText = "Your habits are aligned with the top 1% of performers. Maintain this consistency and your success is mathematically probable.";
        } else if (score > 50) {
            tierDisplay.innerText = "On Track";
            tierDisplay.style.color = "#fbbf24"; // Amber
            progressCircle.style.stroke = "#fbbf24";
            analysisText.innerText = "You have a solid foundation. Adding 1-2 more high-impact habits and improving consistency could push you into the elite tier.";
        } else {
            tierDisplay.innerText = "Needs Optimization";
            tierDisplay.style.color = "#ef4444"; // Red
            progressCircle.style.stroke = "#ef4444";
            analysisText.innerText = "Your current trajectory suggests resistance. Focus on removing distractions and securing just one small win per day to build momentum.";
        }
    }, 100);
}

function resetCalculator() {
    goToStep('welcome');
    setTimeout(() => {
        // Reset inputs if desired, or keep them
        // getEl('productivity-slider').value = 5;
        // ...
    }, 500);
}

// Expose functions to window for HTML event handlers
window.goToStep = goToStep;
window.updateRangeValue = updateRangeValue;
window.addHabit = addHabit;
window.removeHabit = removeHabit;
window.calculateSuccess = calculateSuccess;
window.resetCalculator = resetCalculator;
