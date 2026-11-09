
const questions = [
    {
        question: "Which environment makes you feel most comfortable?",
        answers: [
            "A quiet forest",
            "A crowded city",
            "An empty beach",
            "A familiar room"
        ]
    },
    {
        question: "When do you feel most productive?",
        answers: [
            "Early morning",
            "Afternoon",
            "Late evening",
            "After midnight"
        ]
    },
    {
        question: "Which color are you most drawn to?",
        answers: [
            "Red",
            "Blue",
            "Green",
            "Black"
        ]
    },
    {
        question: "How do you approach difficult decisions?",
        answers: [
            "Trust my instincts",
            "Analyze every possibility",
            "Ask other people",
            "Avoid deciding"
        ]
    },
    {
        question: "Which object would you choose to keep?",
        answers: [
            "An old photograph",
            "A mysterious key",
            "A broken clock",
            "An empty notebook"
        ]
    }
];


const personalityTypes = {
    observer: {
        name: "THE OBSERVER",
        description: "You are analytical, introspective, and highly aware of your surroundings. You prefer understanding the world before participating in it."
    },
    explorer: {
        name: "THE EXPLORER",
        description: "You are driven by curiosity and novelty. You seek unfamiliar experiences and resist predictable routines."
    },
    architect: {
        name: "THE ARCHITECT",
        description: "You value structure, control, and logical thinking. You tend to organize the world into systems and patterns."
    },
    dreamer: {
        name: "THE DREAMER",
        description: "You are imaginative and emotionally perceptive. You often find meaning in things that others overlook."
    }
};

// Arbitrary classifications.
// These are NOT scientifically supported.
const answerScores = [
    {
        "A quiet forest": "observer",
        "A crowded city": "explorer",
        "An empty beach": "dreamer",
        "A familiar room": "architect"
    },
    {
        "Early morning": "architect",
        "Afternoon": "explorer",
        "Late evening": "observer",
        "After midnight": "dreamer"
    },
    {
        "Red": "explorer",
        "Blue": "observer",
        "Green": "architect",
        "Black": "dreamer"
    },
    {
        "Trust my instincts": "explorer",
        "Analyze every possibility": "architect",
        "Ask other people": "dreamer",
        "Avoid deciding": "observer"
    },
    {
        "An old photograph": "dreamer",
        "A mysterious key": "explorer",
        "A broken clock": "observer",
        "An empty notebook": "architect"
    }
];

function generatePersonality(answers) {
    const scores = {
        observer: 0,
        explorer: 0,
        architect: 0,
        dreamer: 0
    };

    answers.forEach((item, index) => {
        const category = answerScores[index][item.answer];

        if (category) {
            scores[category]++;
        }
    });

    // Find the personality with the highest score
    const winner = Object.keys(scores).reduce((a, b) =>
        scores[a] >= scores[b] ? a : b
    );

    // Invent a confidence percentage
    const confidence = (
        85 + Math.random() * 14
    ).toFixed(1);

    return {
        type: winner,
        name: personalityTypes[winner].name,
        description: personalityTypes[winner].description,
        confidence: confidence
    };
}


let currentQuestion = 0;
let userAnswers = [];

const welcomeScreen = document.getElementById("welcomeScreen");
const questionScreen = document.getElementById("questionScreen");
const completeScreen = document.getElementById("completeScreen");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const questionText = document.getElementById("questionText");
const answersContainer = document.getElementById("answers");
const progress = document.getElementById("progress");

// Start the questionnaire
startBtn.addEventListener("click", () => {
    welcomeScreen.classList.add("hidden");
    questionScreen.classList.remove("hidden");

    currentQuestion = 0;
    userAnswers = [];

    showQuestion();
});

// Display the current question
function showQuestion() {
    const current = questions[currentQuestion];

    progress.textContent =
        `QUESTION ${currentQuestion + 1} / ${questions.length}`;

    questionText.textContent = current.question;

    answersContainer.innerHTML = "";

    current.answers.forEach((answer) => {
        const button = document.createElement("button");

        button.textContent = answer;
        button.classList.add("answerBtn");

        button.addEventListener("click", () => {
            selectAnswer(answer);
        });

        answersContainer.appendChild(button);
    });
}

// Save selected answer and advance
function selectAnswer(answer) {
    userAnswers.push({
        question: questions[currentQuestion].question,
        answer: answer
    });

    currentQuestion++;

    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        finishQuestionnaire();
    }
}

// Finish the questionnaire


async function finishQuestionnaire() {
    questionScreen.classList.add("hidden");
    completeScreen.classList.remove("hidden");

    // Generate the personality profile
    const result = generatePersonality(userAnswers);

    document.getElementById("personalityName").textContent =
        result.name;

    document.getElementById("personalityDescription").textContent =
        result.description;

    document.getElementById("confidenceValue").textContent =
        result.confidence + "%";

    document.getElementById("confidenceFill").style.width =
        result.confidence + "%";

    const saveStatus = document.getElementById("saveStatus");
    const restartBtn = document.getElementById("restartBtn");

    saveStatus.textContent = "Saving your responses...";
    restartBtn.disabled = true;

    try {
        const response = await fetch("/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                answers: userAnswers
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Failed to save responses"
            );
        }

        saveStatus.textContent =
            "Your responses have been recorded.";

        console.log("Server response:", data);
        console.log("Personality result:", result);

    } catch (error) {
        console.error("Error:", error);

        saveStatus.textContent =
            "Could not save your responses.";

    } finally {
        restartBtn.disabled = false;
    }
}

// Restart
restartBtn.addEventListener("click", () => {
    completeScreen.classList.add("hidden");
    collectiveScreen.classList.add("hidden");
    deconstructionScreen.classList.add("hidden");

    welcomeScreen.classList.remove("hidden");

    currentQuestion = 0;
    userAnswers = [];
});


// Collective dashboard elements
const collectiveScreen =
    document.getElementById("collectiveScreen");

const viewCollectiveBtn =
    document.getElementById("viewCollective");

const backToResultsBtn =
    document.getElementById("backToResults");

const populationChart =
    document.getElementById("populationChart");

const totalUsers =
    document.getElementById("totalUsers");


// Open the collective dashboard
viewCollectiveBtn.addEventListener("click", async () => {
    completeScreen.classList.add("hidden");
    collectiveScreen.classList.remove("hidden");

    await loadCollectiveData();
});


// Return to individual results
backToResultsBtn.addEventListener("click", () => {
    collectiveScreen.classList.add("hidden");
    completeScreen.classList.remove("hidden");
});


// Retrieve saved data from Flask
async function loadCollectiveData() {
    populationChart.textContent = "Retrieving population data...";
    totalUsers.textContent = "";

    try {
        const response = await fetch("/data");

        if (!response.ok) {
            throw new Error("Could not retrieve data");
        }

        const submissions = await response.json();

        // Count each personality type
        const counts = {
            observer: 0,
            explorer: 0,
            architect: 0,
            dreamer: 0
        };

        submissions.forEach(submission => {
            if (!Array.isArray(submission.answers)) {
                return;
            }

            const result =
                generatePersonality(submission.answers);

            counts[result.type]++;
        });

        displayPopulation(counts, submissions.length);

    } catch (error) {
        console.error(error);
        populationChart.textContent =
            "Failed to retrieve population data.";
    }
}


// Generate the visualization
function displayPopulation(counts, total) {
    populationChart.innerHTML = "";

    Object.keys(counts).forEach(type => {
        const count = counts[type];

        const percentage =
            total > 0 ? (count / total) * 100 : 0;

        const container = document.createElement("div");
        container.classList.add("populationItem");

        const label = document.createElement("div");
        label.classList.add("populationLabel");

        const name = document.createElement("span");
        name.textContent = personalityTypes[type].name;

        const value = document.createElement("span");
        value.textContent = percentage.toFixed(1) + "%";

        label.appendChild(name);
        label.appendChild(value);

        const bar = document.createElement("div");
        bar.classList.add("populationBar");

        const fill = document.createElement("div");
        fill.classList.add("populationFill");

        fill.style.width = percentage + "%";

        bar.appendChild(fill);

        container.appendChild(label);
        container.appendChild(bar);

        populationChart.appendChild(container);
    });

    totalUsers.textContent =
        `TOTAL SUBJECTS ANALYZED: ${total}`;
}


// ======================================
// ALGORITHM DECONSTRUCTION
// ======================================

const deconstructionScreen =
    document.getElementById("deconstructionScreen");

const viewDeconstructionBtn =
    document.getElementById("viewDeconstruction");

const backFromDeconstructionBtn =
    document.getElementById("backFromDeconstruction");

const deconstructionChart =
    document.getElementById("deconstructionChart");

const deconstructionTotal =
    document.getElementById("deconstructionTotal");

const algorithmExplanation =
    document.getElementById("algorithmExplanation");

let savedSubmissions = [];


// Open the deconstruction screen
viewDeconstructionBtn.addEventListener("click", async () => {
    completeScreen.classList.add("hidden");
    deconstructionScreen.classList.remove("hidden");

    await loadDeconstructionData();
});


// Return to results
backFromDeconstructionBtn.addEventListener("click", () => {
    deconstructionScreen.classList.add("hidden");
    completeScreen.classList.remove("hidden");
});


// Retrieve the original saved data
async function loadDeconstructionData() {
    deconstructionChart.textContent = "Loading data...";

    try {
        const response = await fetch("/data");

        if (!response.ok) {
            throw new Error("Failed to retrieve data");
        }

        savedSubmissions = await response.json();

        applyAlgorithm("original");

    } catch (error) {
        console.error(error);
        deconstructionChart.textContent =
            "Could not retrieve data.";
    }
}


// Apply a different interpretation
function applyAlgorithm(mode) {
    const counts = {
        observer: 0,
        explorer: 0,
        architect: 0,
        dreamer: 0
    };

    let total = 0;

    savedSubmissions.forEach(submission => {
        if (!Array.isArray(submission.answers)) {
            return;
        }

        const originalResult =
            generatePersonality(submission.answers);

        let type = originalResult.type;

        if (mode === "reverse") {
            const reversed = {
                observer: "dreamer",
                explorer: "architect",
                architect: "explorer",
                dreamer: "observer"
            };

            type = reversed[type];
        }

        if (mode === "shift") {
            const shifted = {
                observer: "explorer",
                explorer: "architect",
                architect: "dreamer",
                dreamer: "observer"
            };

            type = shifted[type];
        }

        counts[type]++;
        total++;
    });

    displayDeconstruction(counts, total);

    const explanations = {
        original:
            "Original: Each answer is interpreted using the initial arbitrary classification rules.",

        reverse:
            "Reverse: The personality labels are swapped. The underlying answers remain identical.",

        shift:
            "Shift: Every personality category is reassigned to another category. No new data was collected."
    };

    algorithmExplanation.textContent = explanations[mode];
}


// Display recalculated population data
function displayDeconstruction(counts, total) {
    deconstructionChart.innerHTML = "";

    Object.keys(counts).forEach(type => {
        const percentage =
            total > 0 ? (counts[type] / total) * 100 : 0;

        const container = document.createElement("div");
        container.classList.add("populationItem");

        const label = document.createElement("div");
        label.classList.add("populationLabel");

        const name = document.createElement("span");
        name.textContent = personalityTypes[type].name;

        const value = document.createElement("span");
        value.textContent = percentage.toFixed(1) + "%";

        label.appendChild(name);
        label.appendChild(value);

        const bar = document.createElement("div");
        bar.classList.add("populationBar");

        const fill = document.createElement("div");
        fill.classList.add("populationFill");

        fill.style.width = percentage + "%";

        bar.appendChild(fill);

        container.appendChild(label);
        container.appendChild(bar);

        deconstructionChart.appendChild(container);
    });

    deconstructionTotal.textContent =
        `UNCHANGED DATASET: ${total} SUBMISSIONS`;
}


// Algorithm control buttons
document.getElementById("originalAlgorithm")
    .addEventListener("click", () => {
        applyAlgorithm("original");
    });

document.getElementById("reverseAlgorithm")
    .addEventListener("click", () => {
        applyAlgorithm("reverse");
    });

document.getElementById("shiftAlgorithm")
    .addEventListener("click", () => {
        applyAlgorithm("shift");
    });
