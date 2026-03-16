const inputField = document.querySelector(".input-container input");
const sendBtn = document.getElementById("sendBtn");
const chatBox = document.getElementById("chatBox");

// 1. Fungsi Kirim Pesan (Update: Menangani respon AI langsung)
async function sendMessage() {
    const text = inputField.value.trim();
    if (text === "") return;

    // Tampilkan loading sederhana di tombol atau input
    sendBtn.disabled = true;
    inputField.placeholder = "Nova is thinking...";

    const isIndex = window.location.pathname.includes("index.html") || window.location.pathname === "/";

    if (isIndex) {
        // Simpan pesan ke localStorage biar gak hilang pas pindah halaman
        localStorage.setItem("firstPrompt", text);
        // Langsung pindah! Gak pake nunggu server
        window.location.href = "chat.html";
        return; 
    }

    try {
        const response = await fetch("/prompt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text })
        });
        
        const result = await response.json();

        if (result.status === 'success') {
            inputField.value = "";
            await loadPrompt();
        }
    } catch (error) {
        console.error("Gagal kirim chat:", error);
    } finally {
        sendBtn.disabled = false;
        inputField.placeholder = "Just Drop it here..";
    }
}

// 2. Fungsi Ambil Data (Update: Sesuaikan path data dari controller)
async function loadPrompt() {
    try {
        const response = await fetch("/prompt");
        const result = await response.json();
        
        // Sesuaikan dengan return dari controller baru: result.data.prompts
        const prompts = result.data.prompts || result.data.input || []; 
        displayPrompt(prompts);
    } catch (error) {
        console.error("Gagal load chat:", error);
    }
}

// 3. Fungsi Nampilin Chat (Update: Menampilkan Jawaban AI Asli)
function displayPrompt(prompts) {
    if (!chatBox) return;

    chatBox.innerHTML = ""; 

    prompts.forEach((prompt) => {
        // Balon Chat User
        const userDiv = document.createElement("div");
        userDiv.className = "message-user"; 
        userDiv.textContent = prompt.text; // Sesuai kolom 'text' di DynamoDB
        chatBox.appendChild(userDiv);

        // Balon Chat Bot (Update: Ambil dari aiResponse)
        if (prompt.aiResponse) {
            const botDiv = document.createElement("div");
            botDiv.className = "message-bot";
            botDiv.textContent = prompt.aiResponse; // Jawaban asli Nova Lite!
            chatBox.appendChild(botDiv);
        }
    });

    chatBox.scrollTop = chatBox.scrollHeight;
}

// Event Listeners
sendBtn.addEventListener("click", sendMessage);

// Tambahan: Tekan Enter buat kirim
inputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
    }
});

// Cek kalau ada 'firstPrompt' dari index.html
window.addEventListener("DOMContentLoaded", async () => {
    if (!window.location.pathname.includes("chat.html")) return;

    const firstPrompt = localStorage.getItem("firstPrompt");
    
    if (firstPrompt) {
        localStorage.removeItem("firstPrompt"); 
        // Isi field dan langsung tembak ke API
        inputField.value = firstPrompt;
        await sendMessage(); 
    } else {
        await loadPrompt();
    }
});