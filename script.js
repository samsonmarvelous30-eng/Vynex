
// VYNEX APP NAVIGATION

function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.add("hidden");
    });

    const target = document.getElementById(screenId);

    if (target) {
        target.classList.remove("hidden");
        window.scrollTo(0, 0);
    }
}

// LOGIN FORM
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = this.querySelector('input[type="email"]').value.trim();
    const password = this.querySelector('input[type="password"]').value;

    if (!email || !password) {
        alert("Please complete all fields.");
        return;
    }

    alert("Demo login successful! Welcome to Vynex.");
    showScreen("inbox");
});

// REGISTRATION FORM
document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const inputs = this.querySelectorAll("input");

    const username = inputs[0].value.trim();
    const email = inputs[1].value.trim();
    const password = inputs[2].value;

    if (!username || !email || !password) {
        alert("Please complete all fields.");
        return;
    }

    if (password.length < 8) {
        alert("Password must contain at least 8 characters.");
        return;
    }

    alert("Demo registration successful! Welcome to Vynex.");
    showScreen("inbox");
});

// OPEN CONVERSATION
function openChat(name) {
    document.getElementById("chatName").textContent = name;
    document.getElementById("chatAvatar").textContent = name.charAt(0);

    showScreen("chat");
}

// SEARCH CONVERSATIONS
document.getElementById("searchInput").addEventListener("input", function() {
    const search = this.value.toLowerCase();

    document.querySelectorAll(".conversation").forEach(item => {
        const name = item.dataset.name.toLowerCase();

        item.style.display = name.includes(search) ? "flex" : "none";
    });
});

// SEND DEMO MESSAGE
document.getElementById("messageForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const input = document.getElementById("messageInput");
    const message = input.value.trim();

    if (!message) return;

    const messageElement = document.createElement("div");
    messageElement.className = "message sent";
    messageElement.textContent = message;

    const chatMessages = document.getElementById("chatMessages");

    chatMessages.appendChild(messageElement);

    input.value = "";

    chatMessages.scrollTop = chatMessages.scrollHeight;
});
