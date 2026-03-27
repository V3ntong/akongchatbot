async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (!message) return;

    // 1. Add User Message (The 'user' tag here moves it to the right)
    appendMessage('user', message);
    input.value = '';

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });
        const data = await response.json();

        // 2. Add AI Message (The 'bot' tag here keeps it on the left)
        if (data.reply) {
            appendMessage('bot', data.reply);
        } else if (data.error) {
            appendMessage('bot', "Error: " + data.error);
        }
    } catch (e) {
        appendMessage('bot', "I'm having a dark moment. Check the console.");
        console.error("Error:", e);
    }
}

function appendMessage(role, text) {
    const chatContainer = document.getElementById('chat-container');
    
    // Create the outer row
    const row = document.createElement('div');
    
    // CRITICAL: This adds the 'user' or 'bot' class so CSS can move it!
    row.className = `message-row ${role} message-fade-in`;
    
    // Create the bubble
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerText = text;
    
    // Put them together
    row.appendChild(bubble);
    chatContainer.appendChild(row);
    
    // Auto-scroll so you don't have to do it manually
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const container = document.getElementById('chat-container');

    row.className = `message-row ${role} message-fade-in`;

    // Create the icon for the AI
    let iconHtml = '';
    if (role === 'bot') {
        // You can use a URL to an image or an SVG icon
        iconHtml = `<div class="ai-icon">
                        <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Felix" alt="AI">
                    </div>`;
    }

    // Wrap the icon and bubble together
    row.innerHTML = `${iconHtml}<div class="bubble">${text}</div>`;
    
    container.appendChild(row);
    container.scrollTop = container.scrollHeight;
}

// Allow pressing "Enter" to send
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});