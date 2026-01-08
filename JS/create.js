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