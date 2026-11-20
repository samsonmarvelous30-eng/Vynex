
// =====================================
// VYNEX APP
// FRONTEND DEMO
// =====================================

let currentUsername = "vynexuser";
let selectedVideoURL = null;
let videoPosts = [];

// SCREEN NAVIGATION

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

// UPDATE PROFILE

function updateProfile(username) {
    currentUsername = username || "vynexuser";

    document.getElementById("profileUsername").textContent =
        "@" + currentUsername;

    document.getElementById("profileDisplayName").textContent =
        currentUsername;

    document.getElementById("profileAvatar").textContent =
        currentUsername.charAt(0).toUpperCase() || "V";
}

// SIGN UP

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

    updateProfile(username);

    alert("Demo registration successful! Welcome to Vynex.");

    showScreen("feed");
});

// LOGIN

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = this.querySelector('input[type="email"]').value.trim();
    const password = this.querySelector('input[type="password"]').value;

    if (!email || !password) {
        alert("Please complete all fields.");
        return;
    }

    alert("Demo login successful! Welcome to Vynex.");

    showScreen("feed");
});

// EDIT PROFILE

function editProfile() {
    const newUsername = prompt(
        "Enter your display name:",
        currentUsername
    );

    if (!newUsername || !newUsername.trim()) {
        return;
    }

    updateProfile(newUsername.trim().replace(/\s+/g, ""));
}

// OPEN CHAT

function openChat(name) {
    document.getElementById("chatName").textContent = name;
    document.getElementById("chatAvatar").textContent =
        name.charAt(0).toUpperCase();

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

// =====================================
// VIDEO SELECTION AND PREVIEW
// =====================================

const videoFile = document.getElementById("videoFile");
const videoPreview = document.getElementById("videoPreview");
const videoPreviewBox = document.getElementById("videoPreviewBox");
const postVideoBtn = document.getElementById("postVideoBtn");
const videoCaption = document.getElementById("videoCaption");
const removeVideoBtn = document.getElementById("removeVideo");

videoFile.addEventListener("change", function() {
    const file = this.files[0];

    if (!file) return;

    if (!file.type.startsWith("video/")) {
        alert("Please select a video file.");
        this.value = "";
        return;
    }

    if (selectedVideoURL) {
        URL.revokeObjectURL(selectedVideoURL);
    }

    selectedVideoURL = URL.createObjectURL(file);

    videoPreview.src = selectedVideoURL;
    videoPreviewBox.classList.remove("hidden");
    postVideoBtn.disabled = false;
});

removeVideoBtn.addEventListener("click", function() {
    clearSelectedVideo();
});

function clearSelectedVideo() {
    videoPreview.pause();
    videoPreview.removeAttribute("src");
    videoPreview.load();

    if (selectedVideoURL) {
        URL.revokeObjectURL(selectedVideoURL);
        selectedVideoURL = null;
    }

    videoFile.value = "";
    videoPreviewBox.classList.add("hidden");
    postVideoBtn.disabled = true;
}

// =====================================
// POST VIDEO TO LOCAL DEMO FEED
// =====================================

postVideoBtn.addEventListener("click", function() {
    if (!selectedVideoURL) {
        alert("Please select a video first.");
        return;
    }

    const caption = videoCaption.value.trim();

    const post = {
        username: currentUsername,
        videoURL: selectedVideoURL,
        caption: caption
    };

    videoPosts.unshift(post);

    addVideoToFeed(post);
    addVideoToProfile(post);

    updatePostCount();

    selectedVideoURL = null;
    videoFile.value = "";
    videoPreview.removeAttribute("src");
    videoPreview.load();
    videoPreviewBox.classList.add("hidden");
    videoCaption.value = "";
    postVideoBtn.disabled = true;

    alert("Your video has been added to the demo feed!");

    showScreen("feed");
});

// CREATE FEED VIDEO

function addVideoToFeed(post) {
    const feed = document.getElementById("videoFeed");
    const emptyFeed = document.getElementById("emptyFeed");

    if (emptyFeed) {
        emptyFeed.remove();
    }

    const card = document.createElement("article");
    card.className = "video-post";

    const header = document.createElement("div");
    header.className = "video-post-header";

    const avatar = document.createElement("div");
    avatar.className = "video-post-avatar";
    avatar.textContent = post.username.charAt(0).toUpperCase();

    const username = document.createElement("span");
    username.className = "video-post-user";
    username.textContent = "@" + post.username;

    header.appendChild(avatar);
    header.appendChild(username);

    const video = document.createElement("video");
    video.src = post.videoURL;
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";

    const caption = document.createElement("p");
    caption.className = "video-post-caption";
    caption.textContent = post.caption || "Shared on Vynex.";

    card.appendChild(header);
    card.appendChild(video);
    card.appendChild(caption);

    feed.prepend(card);
}

// ADD VIDEO TO PROFILE

function addVideoToProfile(post) {
    const grid = document.getElementById("profileVideoGrid");
    const emptyMessage = grid.querySelector(".no-profile-videos");

    if (emptyMessage) {
        emptyMessage.remove();
    }

    const item = document.createElement("div");
    item.className = "profile-video-item";

    const video = document.createElement("video");
    video.src = post.videoURL;
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.controls = true;

    item.appendChild(video);
    grid.prepend(item);
}

// UPDATE POST COUNT

function updatePostCount() {
    document.getElementById("postCount").textContent =
        videoPosts.length;
}

