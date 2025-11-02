const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
let lang = 'fr';
const SIGNATURE = "By Mr Tchoulo";

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

function setLang(l) {
  lang = l;
  appendMessage("Assistant", `Langue changée à ${l} ${SIGNATURE}`);
}

async function sendMessage() {
  const question = userInput.value.trim();
  if (!question) return;
  appendMessage("Vous", question);
  userInput.value = "";

  // Message spinner
  const loadingMsg = document.createElement("p");
  loadingMsg.id = "loading";
  loadingMsg.innerHTML = `<strong>Assistant:</strong> <span class="spinner"></span> En cours...`;
  chatbox.appendChild(loadingMsg);
  chatbox.scrollTop = chatbox.scrollHeight;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_OPENAI_API_KEY" // ⚠️ Remplace par ta clé OpenAI
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: question
      })
    });
    const data = await response.json();
    const answer = data.output?.[0]?.content?.[0]?.text || "Désolé, je n'ai pas de réponse.";
    loadingMsg.innerHTML = `<strong>Assistant:</strong> ${answer}\n${SIGNATURE}`;
  } catch (err) {
    loadingMsg.innerHTML = `<strong>Assistant:</strong> ❌ Erreur API OpenAI.\n${SIGNATURE}`;
  }
}

function appendMessage(sender, text) {
  const p = document.createElement("p");
  p.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatbox.appendChild(p);
  chatbox.scrollTop = chatbox.scrollHeight;
}