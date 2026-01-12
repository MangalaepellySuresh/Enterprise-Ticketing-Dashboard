document.addEventListener("DOMContentLoaded", () => {
 
  /* ---------- DOM ELEMENTS ---------- */
  const totalTicketsEl = document.getElementById("total-tickets-count");
  const openEl = document.getElementById("status-open-count");
  const inProgressEl = document.getElementById("status-inprogress-count");
  const resolvedEl = document.getElementById("status-resolved-count");
  const closedEl = document.getElementById("status-closed-count");
 
  const highEl = document.getElementById("priority-high-count");
  const mediumEl = document.getElementById("priority-medium-count");
  const lowEl = document.getElementById("priority-low-count");
 
  const barCtx = document.getElementById("ChartBar")?.getContext("2d");
  const pieCtx = document.getElementById("PieChart")?.getContext("2d");
 
  if (!barCtx || !pieCtx) {
    console.error("Canvas elements not found");
    return;
  }
 
  /* ---------- STORAGE ---------- */
  function getTicketsFromStorage() {
    try {
      return JSON.parse(localStorage.getItem("tickets")) || [];
    } catch (e) {
      console.error("Invalid localStorage data");
      return [];
    }
  }
 
  /* ---------- COUNTS ---------- */
  function calculateCounts(tickets) {
    const priorityCounts = {
      High: 0,
      Medium: 0,
      Low: 0
    };
 
    const statusCounts = {
      Open: 0,
      "In Progress": 0,
      Resolved: 0,
      Closed: 0
    };
 
    tickets.forEach(ticket => {
      if (priorityCounts[ticket.priority] !== undefined) {
        priorityCounts[ticket.priority]++;
      }
 
      if (statusCounts[ticket.state] !== undefined) {
        statusCounts[ticket.state]++;
      }
    });
 
    return { priorityCounts, statusCounts };
  }
 
  /* ---------- UPDATE UI ---------- */
  function updateCountsUI(total, priorityCounts, statusCounts) {
    totalTicketsEl.textContent = total;
 
    highEl.textContent = priorityCounts.High;
    mediumEl.textContent = priorityCounts.Medium;
    lowEl.textContent = priorityCounts.Low;
 
    openEl.textContent = statusCounts.Open;
    inProgressEl.textContent = statusCounts["In Progress"];
    resolvedEl.textContent = statusCounts.Resolved;
    closedEl.textContent = statusCounts.Closed;
  }
 
  /* ---------- INIT ---------- */
  const tickets = getTicketsFromStorage();
  const { priorityCounts, statusCounts } = calculateCounts(tickets);
 
  updateCountsUI(tickets.length, priorityCounts, statusCounts);
 
  /* ---------- BAR CHART ---------- */
  new Chart(barCtx, {
    type: "bar",
    data: {
      labels: ["Open", "In Progress", "Resolved", "Closed"],
      datasets: [{
        label: "Tickets by Status",
        data: [
          statusCounts.Open,
          statusCounts["In Progress"],
          statusCounts.Resolved,
          statusCounts.Closed
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
 
  /* ---------- PIE CHART ---------- */
  new Chart(pieCtx, {
    type: "pie",
    data: {
      labels: ["High Priority", "Medium Priority", "Low Priority"],
      datasets: [{
        data: [
          priorityCounts.High,
          priorityCounts.Medium,
          priorityCounts.Low
        ]
      }]
    },
    options: {
      responsive: true
    }
  });
 
});
 
 