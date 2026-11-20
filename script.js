
function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.add("hidden");
    });

    document.getElementById(screenId).classList.remove("hidden");
    window.scrollTo(0, 0);
}

function openChat(name) {
    document.getElementById("chatName").textContent = name;
    document.getElementById("chatAvatar").textContent = name.charAt(0);

    const colors = {
        "Alex Morgan": "avatar-blue",
        "Jordan Lee": "avatar-purple",
        "Taylor James": "avatar-pink"
    };

    const avatar = document.getElementById("chatAvatar");
    avatar.className = "avatar " + (colors[name] || "avatar-blue");

    showScreen("chat");
}

document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault();
    alert("Vynex registration is not connected yet. This is a design preview.");
});

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    alert("Vynex login is not connected yet. This is a design preview.");
});

// Search conversations
document.getElementById("searchInput").addEventListener("input", function() {
    const search = this.value.toLowerCase();

    document.querySelectorAll(".conversation").forEach(item => {
        const name = item.dataset.name.toLowerCase();
        item.style.display = name.includes(search) ? "flex" : "none";
    });
});

// Demo message sending
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
