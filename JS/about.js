  function toggleChatbot() {
    const box = document.getElementById("chatbotBox");
    box.style.display = box.style.display === "flex" ? "none" : "flex";
  }

  const chatInput = document.querySelector(".chatbot-footer input");
  const chatButton = document.querySelector(".chatbot-footer button");
  const chatBody = document.querySelector(".chatbot-body");

  function addMessage(text, sender) {
    const msgDiv = document.createElement("p");
    msgDiv.classList.add(sender === "bot" ? "bot-msg" : "user-msg");

    if (sender === "user") {
      msgDiv.style.background = "#2563eb";
      msgDiv.style.color = "white";
      msgDiv.style.padding = "8px 10px";
      msgDiv.style.borderRadius = "6px";
      msgDiv.style.fontSize = "13px";
      msgDiv.style.marginBottom = "8px";
      msgDiv.style.alignSelf = "flex-end";
      msgDiv.style.textAlign = "right";
    }

    msgDiv.innerText = text;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function getBotResponse(input) {
    const userText = input.toLowerCase().trim();

    if (userText.includes("hello") || userText.includes("hi")) {
      return "Hello! How can I assist you with TicketDesk today?";
    }else if (userText.includes("ticket")) {
      return "U Want Ticket-List or Ticket-Creation";
    }    
    else if (userText.includes("ticket-list")|| userText.includes("Ticket-List")) {
      return "You can view your tickets by clicking the 'Ticket List' section.";
    } else if (userText.includes("create-ticket")|| userText.includes("Create")|| userText.includes("create")) {
      return "To create a ticket, go to the 'Create Ticket' page and fill the details.";
    } else if (userText.includes("Update")|| userText.includes("Edit")|| userText.includes("edit")) {
      return "Our workflow is: Create → Assign → Work In Progress → Resolve.";
    }else if (userText.includes("Dashboard")|| userText.includes("dashboard")|| userText.includes("reports")|| userText.includes("Reports")) {
      return "Our workflow is: Create → Assign → Work In Progress → Resolve.";
    }
     else if (userText.includes("snow")) {
      return "Check the SNOW section for ServiceNow-aligned links.";
    } else {
      return "Sorry, I didn't understand.I can only HELP u for few only.So Try asking about 'ABOUT' 'Create Tickets', 'Edit/Update','Dashboard' or 'snow'.";
    }
  }

  function handleSendMessage() {
    const message = chatInput.value.trim();
    if (message === "") return;

    addMessage(message, "user");
    chatInput.value = "";

    setTimeout(() => {
      const response = getBotResponse(message);
      addMessage(response, "bot");
    }, 500);
  }

  chatButton.addEventListener("click", handleSendMessage);

  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  });
AOS.init({
        duration: 800,
      });
      function showSection(sectionId, element) {
        document
          .querySelectorAll(".arrow")
          .forEach((a) => a.classList.remove("active"));
        element.classList.add("active");
        document
          .querySelectorAll(".section")
          .forEach((sec) => sec.classList.remove("active"));
        document.getElementById(sectionId).classList.add("active");
        setTimeout(() => {
          AOS.refresh();
        }, 100);
      }