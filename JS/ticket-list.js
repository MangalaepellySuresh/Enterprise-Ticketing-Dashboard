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
const hasTickets = !!localStorage.getItem("tickets");

if (!hasTickets) {
    const sampleTickets = [
        {
            number: "TCK-001",
            shortDescription: "Login page not loading",
            description: "The login page shows a blank screen when accessed via Chrome.",
            priority: "High",
            state: "Open",
            openedBy: loggedInUser.role,
            openedDate: "2025-01-02 10:00",
        },
    ];

    localStorage.setItem("tickets", JSON.stringify(sampleTickets));
}

let tickets = JSON.parse(localStorage.getItem("tickets")) || [];

const searchInput = document.getElementById("searchInput");
const priorityFilter = document.getElementById("priorityFilter");
const stateFilter = document.getElementById("stateFilter");
const tableContainer = document.getElementById("tableContainer");
const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileMenu = document.getElementById("mobileMenu");

document.getElementById("username").textContent = loggedInUser.name;
document.getElementById("userAvatar").textContent =
    loggedInUser.name.charAt(0).toUpperCase();

function formatOpenedDate(dateStr) {
    if (!dateStr) return "";

    const isoStr = dateStr.replace(" ", "T");
    const d = new Date(isoStr);
    if (isNaN(d)) return dateStr;

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

function renderTickets() {
    const searchText = (searchInput.value || "").toLowerCase();
    const priority = priorityFilter.value;
    const state = stateFilter.value;

    const filteredTickets = tickets.filter((t) =>
        (
            (t.number || "") +
            (t.shortDescription || t.description || "") +
            (t.openedBy || "") +
            (t.openedDate || "")
        )
            .toLowerCase()
            .includes(searchText) &&
        (priority === "" || t.priority === priority) &&
        (state === "" || t.state === state)
    );

    if (!filteredTickets.length) {
        tableContainer.innerHTML = `
      <div class="empty-state">
        <h2>No tickets found</h2>
        <p>Create a new ticket to get started</p>
      </div>
    `;
        return;
    }

    tableContainer.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Number</th>
          <th>Description</th>
          <th>Priority</th>
          <th>State</th>
          <th>Opened By</th>
          <th>Opened Date</th>
        </tr>
      </thead>
      <tbody>
        ${filteredTickets
            .map(
                (t) => `
          <tr>
            <td data-label="Number">
              <a href="ticket-detail.html?ticket=${encodeURIComponent(t.number)}" style="color: #1D4ED8; text-decoration: none;">
                ${t.number}
              </a>
            </td>
            <td data-label="Description">${t.shortDescription || t.description}</td>
            <td data-label="Priority">${t.priority}</td>
            <td data-label="State">${t.state}</td>
            <td data-label="Opened By">${t.openedBy}</td>
            <td data-label="Opened Date">${formatOpenedDate(t.openedDate)}</td>
          </tr>
        `
            )
            .join("")}
      </tbody>
    </table>
  `;
}

function toggleMenu() {
    mobileMenu.style.display =
        mobileMenu.style.display === "block" ? "none" : "block";
}

function showTickets() {
    window.location.href = "../HTML/ticket-list.html";
}

function showReports() {
    window.location.href = "../HTML/reports.html";
}

function showAbout() {
    window.location.href = "../HTML/about.html";
}

function setActiveNav() {
    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");

        const page = item.getAttribute("data-page");

        if (
            (currentPage === "../HTML/ticket-list.html" && page === "tickets") ||
            (currentPage === "../HTML/reports.html" && page === "reports")
        ) {
            item.classList.add("active");
        }
    });
}

function logout() {
    Swal.fire({
        title: "Logout?",
        text: "Are you sure you want to logout?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2563eb",
        cancelButtonColor: "#dc2626",
        confirmButtonText: "Yes, Logout"
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            window.location.href = "../HTML/login.html";
        }
    });
}
searchInput.addEventListener("input", renderTickets);
priorityFilter.addEventListener("change", renderTickets);
stateFilter.addEventListener("change", renderTickets);
hamburgerBtn.addEventListener("click", toggleMenu);
window.toggleMenu = toggleMenu;
window.showTickets = showTickets;
window.showReports = showReports;
window.showAbout = showAbout;
renderTickets();
setActiveNav();


