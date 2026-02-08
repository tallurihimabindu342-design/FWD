let attempts = 0;
let failedAttempts = 0;
let lastAttemptTime = null;

const riskFill = document.getElementById("riskFill");
const timeline = document.getElementById("timeline");

document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    analyzeLogin();
});

function analyzeLogin() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    const status = document.getElementById("status");
    const rulesList = document.getElementById("rulesTriggered");
    const riskLevel = document.getElementById("riskLevel");
    const attemptDisplay = document.getElementById("attemptCount");
    const lastAttemptDisplay = document.getElementById("lastAttempt");

    rulesList.innerHTML = "";
    status.innerText = "";

    attempts++;
    attemptDisplay.innerText = attempts;

    const now = new Date();
    lastAttemptDisplay.innerText = now.toLocaleTimeString();

    let risk = 0;
    let triggered = [];

    const validUser = "admin";
    const validPass = "1234";

    if (attempts > 3) {
        risk += 2;
        triggered.push("Multiple login attempts detected");
    }

    if (lastAttemptTime !== null) {
        const diff = (now - lastAttemptTime) / 1000;
        if (diff < 30) {
            risk += 2;
            triggered.push("Rapid login attempts within short time");
        }
    }

    if (user !== validUser || pass !== validPass) {
        failedAttempts++;
        if (failedAttempts >= 2) {
            risk += 3;
            triggered.push("Repeated failed login attempts");
        }
    }

    const hour = now.getHours();
    if (hour >= 0 && hour <= 5) {
        risk += 1;
        triggered.push("Login during unusual hours");
    }

    if (risk === 0 && user === validUser && pass === validPass) {
        status.style.color = "#9cffc7";
        status.innerText = "Authentication successful. System secure.";
        failedAttempts = 0;
    } else {
        status.style.color = "#ff9e9e";
        status.innerText = "Suspicious activity detected.";
    }

    if (risk <= 1) {
        riskLevel.innerText = "LOW";
        riskLevel.className = "low";
    } else if (risk <= 3) {
        riskLevel.innerText = "MEDIUM";
        riskLevel.className = "medium";
    } else {
        riskLevel.innerText = "HIGH";
        riskLevel.className = "high";
    }

    let riskPercent = Math.min((risk / 6) * 100, 100);
    riskFill.style.width = riskPercent + "%";

    triggered.forEach(rule => {
        const li = document.createElement("li");
        li.innerText = rule;
        rulesList.appendChild(li);
    });

    const event = document.createElement("li");
    event.innerText = now.toLocaleTimeString() + " — Risk level " + riskLevel.innerText;
    timeline.prepend(event);

    if (timeline.children.length > 5) {
        timeline.removeChild(timeline.lastChild);
    }

    lastAttemptTime = now;
}