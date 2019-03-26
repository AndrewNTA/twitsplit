document.getElementById("chatForm").addEventListener("submit", saveMessage);
document
  .getElementById("btnClearMsg")
  .addEventListener("click", clearAllMessage);
window.addEventListener("load", fetchAllMessage);

function clearAllMessage() {
  sessionStorage.setItem("messages", JSON.stringify([]));
  document.getElementById("errorMessage").innerHTML = "";
  fetchAllMessage();
}

function saveMessage(e) {
  const contentMessage = document.getElementById("messageInput").value;
  const chunkedMessages = chunkMessage(contentMessage);
  if (chunkedMessages && chunkedMessages.error) {
    document.getElementById("chatForm").reset();
    document.getElementById("errorMessage").innerHTML =
      '<div class="alert alert-danger w-100 mt-2">' +
      chunkedMessages.error +
      "</div>";
  } else {
    const allMsg = chunkedMessages.map(m => {
      return {
        id: uuid(),
        content: m
      };
    });
    let messages = [];
    if (sessionStorage.getItem("messages") != null) {
      messages = JSON.parse(sessionStorage.getItem("messages"));
    }

    allMsg.map(msg => messages.push(msg));
    sessionStorage.setItem("messages", JSON.stringify(messages));

    document.getElementById("chatForm").reset();
    document.getElementById("errorMessage").innerHTML = "";

    fetchAllMessage();
  }
  e.preventDefault();
}

function fetchAllMessage() {
  const messages = JSON.parse(sessionStorage.getItem("messages"));

  const listMessages = document.getElementById("listMessages");

  listMessages.innerHTML = "";
  if (messages && messages.length > 0) {
    for (let i = 0; i < messages.length; i++) {
      const content = messages[i].content;
      listMessages.innerHTML +=
        '<div class="alert alert-info">' + content + "</div>";
    }
  }
}
