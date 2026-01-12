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
}const loggedInUser = getLoggedInUser();
 
 document.getElementById('username').textContent=loggedInUser.name;
   document.getElementById("userLogo").textContent = loggedInUser.name.charAt(0);

   let attachment = null;
   
function openAttachmentPicker()
 {
  document.getElementById("attachmentInput").click();
}
 
document.getElementById("attachmentInput").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    attachment = {
      name: file.name,
      type: file.type,
      data: reader.result
    };
    document.getElementById("attachmentInfo").innerText =
      `✔ Attached: ${file.name}`;
  };
  reader.readAsDataURL(file);
});
 
// Get next ticket number
function getNextTicketNumber() {
  const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
  let maxNum = 0;
  tickets.forEach(t => {
    const match = t.number?.match(/TCK-(\d+)/);
    if (match) {
      const num = parseInt(match[1]);
      if (num > maxNum) maxNum = num;
    }
  });
  return "TCK-" + String(maxNum + 1).padStart(3, "0");
}
 
// Build Ticket
function buildTicket(isDraft) {
  const now = new Date();
  return {
    number: isDraft ? "DRAFT-" + Date.now() : getNextTicketNumber(),
    shortDescription: shortDescription.value,
    description: description.value,
    priority: priority.value,
    category: category.value,
    state: isDraft ? "Draft" : state.value,
    contactType: contactType.value,
    assignedTo: assignedTo.value,
    department: department.value,
    dueDate: dueDate.value,
    openedBy: loggedInUser.role,
    openedDate: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`,
    attachments: attachment ? [attachment] : []
  };
}

function saveDraft(event) {
  if (!shortDescription.value.trim()) {
    alert("Short Description is required");
    shortDescription.focus();
    event.preventDefault();
    return;
  }
 
  if (!priority.value) {
    alert("Priority is required");
    priority.focus();
    event.preventDefault();
    return;
  }
 
  if (!state.value) {
    alert("State is required");
    state.focus();
    event.preventDefault();
    return;
  }
 
  if (!department.value) {
  alert("Department is required");
  department.focus();
  return;
}
 
if (!dueDate.value) {
  alert("Due Date is required");
  dueDate.focus();
  return;
}
 
  const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
  tickets.unshift(buildTicket(true));
  localStorage.setItem("tickets", JSON.stringify(tickets));
  new bootstrap.Modal(document.getElementById("draftModal")).show();
}
// Submit Ticket
function submitTicket(e) {
  if (e) e.preventDefault();
   if (!shortDescription.value.trim()) {
    alert("Short Description is required");
    shortDescription.focus();
    return;
  }
 
  if (!priority.value) {
    alert("Priority is required");
    priority.focus();
    return;
  }
 
  if (!state.value) {
    alert("State is required");
    state.focus();
    return;
  }
  const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
  tickets.unshift(buildTicket(false));
  localStorage.setItem("tickets", JSON.stringify(tickets));
  window.location.href = "../HTML/ticket-list.html";
}
// Preview
function openPreview() {
  const t = buildTicket(false);
   let html = `
<p><strong>Short Description:</strong> ${t.shortDescription}</p>
<p><strong>Description:</strong> ${t.description || "-"}</p>
<p><strong>Priority:</strong> ${t.priority}</p>
<p><strong>Department:</strong> ${t.department}</p>
<p><strong>Due Date:</strong> ${t.dueDate}</p>
<p><strong>Category:</strong> ${t.category}</p>
<p><strong>Assigned To:</strong> ${t.assignedTo || "-"}</p>
`;
 
 
 
  if (t.attachments.length) {
    html += `<img src="${t.attachments[0].data}" class="img-fluid rounded mt-3">`;
  }
  document.getElementById("previewBody").innerHTML = html;
  new bootstrap.Modal(document.getElementById("previewModal")).show();
} 
 
// Add form submit listener
document.getElementById("ticketForm").addEventListener("submit", function(e)
{
  submitTicket(e);
});
 
