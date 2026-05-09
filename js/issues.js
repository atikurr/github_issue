const issuesContainer = document.getElementById("issuesContainer");
const loader = document.getElementById("loader");
const issueCount = document.querySelector(".issue-count");
const tabButtons = document.querySelectorAll(".tab-btn");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const searchInput = document.getElementById("searchInput");

const API_URL = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
const SEARCH_API =
  "https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=";

let allIssues = [];

const fetchIssues = async () => {
  loader.style.display = "block";
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    allIssues = data.data;
    displayIssues(allIssues);
  } catch (e) {
    console.log(e);
  } finally {
    loader.style.display = "none";
  }
};

const displayIssues = (issues) => {
  issuesContainer.innerHTML = "";
  issueCount.innerText = `${issues.length} Issues`;

  issues.forEach((issue) => {
    const div = document.createElement("div");
    div.className = `issue-card ${issue.status}`;

    // Status images from assets
    const statusImg =
      issue.status === "open"
        ? "./assets/Open-Status.png"
        : "./assets/Closed-Status.png";

    div.innerHTML = `
            <div class="card-header">
                <img src="${statusImg}" alt="status" class="status-img">
                <span class="badge-priority ${issue.priority.toLowerCase()}">${issue.priority}</span>
            </div>
            <h3>${issue.title}</h3>
            <p>${issue.description.slice(0, 75)}...</p>
            <div class="tags">
                <span class="tag tag-bug">🐞 BUG</span>
                <span class="tag tag-help">🙋 HELP WANTED</span>
            </div>
            <div class="card-footer">
                <p>#1 by <b>${issue.author}</b></p>
                <p>${new Date(issue.createdAt).toLocaleDateString()}</p>
            </div>
        `;

    div.onclick = () => openModal(issue);
    issuesContainer.appendChild(div);
  });
};

const openModal = (issue) => {
  modal.classList.remove("hidden");
  const date = new Date(issue.createdAt).toLocaleDateString();

  modalBody.innerHTML = `
        <h2>${issue.title}</h2>
        <div class="modal-status-bar">
            <span class="status-badge ${issue.status}">${issue.status.toUpperCase()}</span>
            <span>Opened by <b>${issue.author}</b> • ${date}</span>
        </div>
        <p style="font-size: 14px; color: #555; line-height: 1.6;">${issue.description}</p>
        <div class="info-box">
            <div class="info-item"><span>Assignee:</span><b>${issue.author}</b></div>
            <div class="info-item"><span>Priority:</span><span class="badge-priority ${issue.priority.toLowerCase()}">${issue.priority}</span></div>
        </div>
        <button class="close-modal-btn" onclick="closePopup()">Close</button>
    `;
};

window.closePopup = () => modal.classList.add("hidden");

tabButtons.forEach((btn) => {
  btn.onclick = () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const status = btn.dataset.status;
    displayIssues(
      status === "all"
        ? allIssues
        : allIssues.filter((i) => i.status === status),
    );
  };
});

searchInput.onkeypress = async (e) => {
  if (e.key === "Enter") {
    const q = searchInput.value.trim();
    if (!q) return displayIssues(allIssues);
    loader.style.display = "block";
    const res = await fetch(`${SEARCH_API}${q}`);
    const data = await res.json();
    displayIssues(data.data);
    loader.style.display = "none";
  }
};

fetchIssues();
