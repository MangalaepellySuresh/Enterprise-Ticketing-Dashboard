document.addEventListener("DOMContentLoaded", () => {
 
  /* GET TICKET */
  const params = new URLSearchParams(window.location.search);
  const ticketNumber = params.get("ticket");
 
  const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
  const ticket = tickets.find(t => t.number === ticketNumber);
 
  if (!ticket) {
    alert("Ticket not found");
    window.location.href = "ticket-list.html";
    return;
  }
 
  /* NORMALIZE DATA */
  ticket.shortDescription ||=  "";
  ticket.description ||= "";
  ticket.openedBy ||= "Unknown";
  ticket.priority ||= "Low";
  ticket.category ||= "";
  ticket.assignedTo ||= "";
  ticket.department ||= "IT Department";
  ticket.state ||= "Open";
  ticket.activity ||= [];
 
  /* ELEMENTS */
  const headerId = document.querySelector(".topbar h1");
  const headerSubject = document.querySelector(".topbar p");
  const priorityBadge = document.querySelector(".badge.red");
  const stateBadge = document.querySelector(".badge.blue");
 
  const inputs = document.querySelectorAll(".field input");
  const selects = document.querySelectorAll(".field select");
  const textarea = document.querySelector(".field textarea");
 
  const activityFeed = document.querySelector(".activity");
  const stateButtons = document.querySelectorAll(".pill");
  const noteBtn = document.querySelector(".add-note button");
  const noteArea = document.querySelector(".add-note textarea");
  const updateBtn = document.querySelector(".actions .btn.primary");
 
  /* FORM MAP (KEY FIX) */
  const formMap = {
    shortDescription: inputs[0],
    openedBy: inputs[1],
    openedDate: inputs[2],
    priority: selects[0],
    category: selects[1],
    assignedTo: selects[2],
    department: selects[3],
    description: textarea
  };
 
  /* HEADER */
  headerId.textContent = ticket.number;
  headerSubject.textContent = ticket.shortDescription;
  document.title = `${ticket.number} - ${ticket.shortDescription}`;
 
  /* POPULATE FORM */
  Object.entries(formMap).forEach(([key, el]) => {
    if (!el) return;
    if (key === "openedDate") {
      el.value = ticket.openedDate ? ticket.openedDate.split(" ")[0] : "";
    } else {
      el.value = ticket[key] || "";
    }
  });
 
  /* DYNAMIC SELECT VALUE FIX */
  ["priority", "category", "assignedTo", "department"].forEach(field => {
    const select = formMap[field];
    const value = ticket[field];
    if (!select || !value) return;
 
    const exists = [...select.options].some(o => o.value === value);
    if (!exists) {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = value;
      select.appendChild(opt);
    }
    select.value = value;
  });
 
  /* BADGES */
  function syncBadges() {
    priorityBadge.innerHTML =
      `<i class="fa-solid fa-triangle-exclamation"></i> ${ticket.priority} Priority`;
    stateBadge.innerHTML =
      `<i class="fa-solid fa-clock"></i> ${ticket.state}`;
  }
  syncBadges();
 
  function saveTickets() {
    localStorage.setItem("tickets", JSON.stringify(tickets));
  }
 
  function getLoggedInUser() {
    try {
      const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};
      return {
        name: user.name || user.fullName || user.username || "Guest User",
        role: user.role || user.userRole || "End User",
      };
    } catch {
      return { name: "Guest User", role: "End User" };
    }
  }
  const loggedInUser = getLoggedInUser();
 
  /* ACTIVITY */
  function renderActivity() {
    activityFeed.innerHTML = "";
    ticket.activity.slice().reverse().forEach(a => {
      activityFeed.insertAdjacentHTML("beforeend", `
        <div class="entry ${a.isSystem ? "system" : ""}">
          <i class="fa-solid ${a.isSystem ? "fa-gear" : "fa-user"} avatar"></i>
          <div>
            <strong>${a.user}</strong>
            <span>${a.time}</span>
            <p>${a.message}</p>
          </div>
        </div>
      `);
    });
  }
 
  function addActivity(user, message, isSystem = false) {
    ticket.activity.push({
      user,
      message,
      isSystem,
      time: new Date().toLocaleString()
    });
    saveTickets();
    renderActivity();
  }
 
  renderActivity();
 
  /* QUICK STATE (FULLY FIXED) */
  function syncState(state) {
    stateButtons.forEach(btn => {
      btn.classList.remove("active", "open", "progress", "resolved", "closed");
 
      if (btn.dataset.state === state) {
        btn.classList.add("active");
        if (state === "Open") btn.classList.add("open");
        if (state === "In Progress") btn.classList.add("progress");
        if (state === "Resolved") btn.classList.add("resolved");
        if (state === "Closed") btn.classList.add("closed");
      }
    });
 
    syncBadges();
  }
 
  syncState(ticket.state);
 
  stateButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const newState = btn.dataset.state;
      if (ticket.state === newState) return;
 
      ticket.state = newState;
      syncState(newState);
      addActivity("System", `State changed to ${newState}`, true);
      saveTickets();
    });
  });
 
  /* FIELD CHANGES (DYNAMIC) */
  Object.entries(formMap).forEach(([key, el]) => {
    let oldValue = el.value;
 
    el.addEventListener("change", () => {
      if (oldValue === el.value) return;
 
      ticket[key] = el.value;
 
      if (key === "shortDescription") {
        headerSubject.textContent = el.value;
        document.title = `${ticket.number} – ${el.value}`;
      }
 
      if (key === "priority") syncBadges();
 
      addActivity(
        "System",
        `${key.replace(/([A-Z])/g, " $1")} changed from "${oldValue}" to "${el.value}"`,
        true
      );
 
      oldValue = el.value;
      saveTickets();
    });
  });
 
  /* ADD NOTE */
  noteBtn.addEventListener("click", () => {
    const text = noteArea.value.trim();
    if (!text) return;
    addActivity(loggedInUser.name, text);
    noteArea.value = "";
  });
 
  /* UPDATE BUTTON */
  updateBtn.addEventListener("click", () => {
    saveTickets();
    addActivity("System", "Incident updated", true);
    alert("Ticket updated successfully");
  });
 
});