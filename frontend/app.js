// Reorganized Main Application Coordinator for AI Resume Analyzer Frontend
// Coordinates UI views, event handling, file parsing, and REST client calls to the Express API (port 5000)

import { jobTemplates, sampleResumes, mockAnalysis } from "./templates.js";
import { parseFile } from "./parser.js";

const BACKEND_URL = "http://localhost:5000/api";

// --- Global Application State ---
const state = {
  currentTab: "dashboard",
  uploadedFile: null,
  resumeText: "",
  targetJobDescription: "",
  analysisResult: null,
  history: [],
  demoModeActive: true,
  serverHasKey: false
};

// --- DOM References ---
const DOM = {
  // Sidebar
  navItems: document.querySelectorAll(".nav-item"),
  tabPanels: document.querySelectorAll(".tab-panel"),
  modeBadge: document.getElementById("mode-badge"),
  
  // Dashboard Panel
  statCount: document.getElementById("stat-count"),
  statAvg: document.getElementById("stat-avg"),
  statBest: document.getElementById("stat-best"),
  historyContainer: document.getElementById("history-container"),

  // Analyzer Panel - Inputs
  jobDescInput: document.getElementById("job-desc-input"),
  fileSelector: document.getElementById("file-selector"),
  dropZone: document.getElementById("drop-zone"),
  loadSampleBtn: document.getElementById("load-sample-resume-btn"),
  filePreviewCard: document.getElementById("file-preview-card"),
  previewFilename: document.getElementById("preview-filename"),
  previewFilesize: document.getElementById("preview-filesize"),
  removeFileBtn: document.getElementById("remove-file-btn"),
  btnRunAnalysis: document.getElementById("btn-run-analysis"),
  
  // Templates
  tplBtns: {
    frontend: document.getElementById("tpl-btn-frontend"),
    datascientist: document.getElementById("tpl-btn-datascientist"),
    productmanager: document.getElementById("tpl-btn-productmanager")
  },

  // Loader & Results Screen
  workspaceInputs: document.getElementById("analyzer-input-workspace"),
  loadingScreen: document.getElementById("analysis-loading-screen"),
  resultsScreen: document.getElementById("results-display-section"),
  btnReanalyze: document.getElementById("btn-reanalyze"),
  
  // Results details
  reportScoreNum: document.getElementById("report-score-num"),
  scoreRingFill: document.getElementById("score-ring-fill"),
  reportSummaryText: document.getElementById("report-summary-text"),
  
  scoreBreakdown: {
    keywords: document.getElementById("score-breakdown-keywords"),
    experience: document.getElementById("score-breakdown-experience"),
    skills: document.getElementById("score-breakdown-skills"),
    formatting: document.getElementById("score-breakdown-formatting")
  },
  scoreBars: {
    keywords: document.getElementById("score-bar-keywords"),
    experience: document.getElementById("score-bar-experience"),
    skills: document.getElementById("score-bar-skills"),
    formatting: document.getElementById("score-bar-formatting")
  },
  
  resultsTabBtns: document.querySelectorAll(".results-tab-btn"),
  resultsTabPanels: document.querySelectorAll(".results-tab-panel"),
  foundTagsContainer: document.getElementById("found-tags-container"),
  missingTagsContainer: document.getElementById("missing-tags-container"),
  
  strengthsContainer: document.getElementById("strengths-list-container"),
  weaknessesContainer: document.getElementById("weaknesses-list-container"),
  recommendationsContainer: document.getElementById("recommendations-list-container"),
  
  // Tailoring Panel
  tailorLocked: document.getElementById("tailoring-locked-state"),
  tailorUnlocked: document.getElementById("tailoring-unlocked-state"),
  tailoredSummaryContent: document.getElementById("tailored-summary-content"),
  btnCopySummary: document.getElementById("btn-copy-summary"),
  tailoredBulletsContainer: document.getElementById("tailored-bullets-container"),

  // Interview Panel
  interviewLocked: document.getElementById("interview-locked-state"),
  interviewUnlocked: document.getElementById("interview-unlocked-state"),
  interviewQuestionsContainer: document.getElementById("interview-questions-container"),

  // Settings Panel
  apiKeyInput: document.getElementById("api-key-input"),
  modelSelector: document.getElementById("model-selector"),
  apiKeyStatus: document.getElementById("api-key-status"),
  apiStatusText: document.getElementById("api-status-text"),
  btnTestApi: document.getElementById("btn-test-api"),
  btnSaveSettings: document.getElementById("btn-save-settings"),
  btnClearSettings: document.getElementById("btn-clear-settings"),

  // Toast
  toast: document.getElementById("toast-notification"),
  toastMessage: document.getElementById("toast-message"),
  toastIcon: document.getElementById("toast-icon")
};

// --- API Request Helpers ---
function getHeaders(customKey = "") {
  const headers = { "Content-Type": "application/json" };
  const key = customKey || localStorage.getItem("gemini_api_key");
  if (key) {
    headers["X-Gemini-API-Key"] = key;
  }
  return headers;
}

// --- Initialization ---
document.addEventListener("DOMContentLoaded", async () => {
  lucide.createIcons();
  
  // 1. Load History from Local Storage
  loadHistory();
  
  // 2. Query local server capabilities (.env status)
  await checkServerStatus();

  // 3. Render Settings and Badges
  loadSettings();
  
  // 4. Bind UI Components
  initNavigation();
  initTemplates();
  initFileUpload();
  initSettings();

  DOM.btnRunAnalysis.addEventListener("click", triggerAnalysisPipeline);
  DOM.btnReanalyze.addEventListener("click", resetAnalyzerScreen);

  initReportInnerTabs();
  initCopyTriggers();
});

// --- Toast helper ---
function showToast(message, type = "info") {
  DOM.toastMessage.textContent = message;
  DOM.toast.className = `alert-popup glass-panel show ${type}`;
  
  let iconName = "info";
  if (type === "success") iconName = "check-circle-2";
  if (type === "danger") iconName = "alert-triangle";
  
  DOM.toastIcon.setAttribute("data-lucide", iconName);
  lucide.createIcons();
  
  setTimeout(() => {
    DOM.toast.classList.remove("show");
  }, 4000);
}

// --- Server Status Query ---
async function checkServerStatus() {
  try {
    const response = await fetch(`${BACKEND_URL}/status`);
    if (response.ok) {
      const data = await response.json();
      state.serverHasKey = !!data.hasKey;
      if (data.model) {
        localStorage.setItem("gemini_model", data.model);
      }
    }
  } catch (e) {
    console.warn("Backend server not responding. Operating in offline mock mode.", e);
    state.serverHasKey = false;
  }
}

// --- Navigation Tabs switching ---
function initNavigation() {
  DOM.navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const tabName = item.getAttribute("data-tab");
      switchTab(tabName);
    });
  });

  window.switchTab = (tabName) => {
    switchTab(tabName);
  };
}

function switchTab(tabName) {
  state.currentTab = tabName;
  
  DOM.navItems.forEach(item => {
    if (item.getAttribute("data-tab") === tabName) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  DOM.tabPanels.forEach(panel => {
    if (panel.id === `panel-${tabName}`) {
      panel.classList.add("active");
    } else {
      panel.classList.remove("active");
    }
  });
}

// --- Templates Management ---
function initTemplates() {
  DOM.jobDescInput.value = jobTemplates.frontend.description;
  state.targetJobDescription = jobTemplates.frontend.description;

  Object.keys(DOM.tplBtns).forEach(key => {
    DOM.tplBtns[key].addEventListener("click", () => {
      Object.values(DOM.tplBtns).forEach(btn => btn.classList.remove("active"));
      DOM.tplBtns[key].classList.add("active");

      DOM.jobDescInput.value = jobTemplates[key].description;
      state.targetJobDescription = jobTemplates[key].description;
      showToast(`Loaded target Job Description for ${jobTemplates[key].title}`, "info");
    });
  });

  DOM.jobDescInput.addEventListener("input", (e) => {
    state.targetJobDescription = e.target.value;
  });

  DOM.loadSampleBtn.addEventListener("click", () => {
    state.uploadedFile = {
      name: "Alex_Rivera_Senior_Frontend_Developer.docx",
      size: 15420
    };
    state.resumeText = sampleResumes.alex.text;
    
    Object.values(DOM.tplBtns).forEach(btn => btn.classList.remove("active"));
    DOM.tplBtns.frontend.classList.add("active");
    DOM.jobDescInput.value = jobTemplates.frontend.description;
    state.targetJobDescription = jobTemplates.frontend.description;

    displayUploadedFilePreview(state.uploadedFile.name, state.uploadedFile.size);
    showToast("Sample resume and matching job description loaded!", "success");
  });
}

// --- File Uploading & Parsing Integration ---
function initFileUpload() {
  const dropZone = DOM.dropZone;
  const selector = DOM.fileSelector;

  dropZone.addEventListener("click", () => selector.click());

  selector.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  });

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragging");
  });

  ["dragleave", "dragend"].forEach(type => {
    dropZone.addEventListener(type, () => {
      dropZone.classList.remove("dragging");
    });
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragging");
    if (e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  });

  DOM.removeFileBtn.addEventListener("click", () => {
    state.uploadedFile = null;
    state.resumeText = "";
    selector.value = "";
    DOM.filePreviewCard.style.display = "none";
    dropZone.style.display = "block";
    showToast("Resume file removed", "info");
  });
}

async function handleFileSelected(file) {
  state.uploadedFile = file;
  DOM.dropZone.style.display = "none";
  displayUploadedFilePreview(file.name, file.size);

  showToast(`Parsing file: ${file.name}...`, "info");

  try {
    const text = await parseFile(file);
    state.resumeText = text;
    showToast("Extracted resume text successfully!", "success");
  } catch (error) {
    showToast(error.message, "danger");
    state.uploadedFile = null;
    state.resumeText = "";
    DOM.filePreviewCard.style.display = "none";
    DOM.dropZone.style.display = "block";
  }
}

function displayUploadedFilePreview(name, size) {
  DOM.previewFilename.textContent = name;
  let sizeText = "Unknown size";
  if (size) {
    const kb = size / 1024;
    sizeText = kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`;
  }
  DOM.previewFilesize.textContent = sizeText;
  DOM.dropZone.style.display = "none";
  DOM.filePreviewCard.style.display = "flex";
}

// --- Settings Module Integration ---
function loadSettings() {
  const clientKey = localStorage.getItem("gemini_api_key");
  const model = localStorage.getItem("gemini_model") || "gemini-1.5-flash";

  if (clientKey) {
    DOM.apiKeyInput.value = clientKey;
  }

  DOM.modelSelector.value = model;

  // Decide if we are in Demo Mode
  if (state.serverHasKey) {
    state.demoModeActive = false;
    DOM.modeBadge.className = "demo-pill";
    DOM.modeBadge.textContent = "Server Connected";
    DOM.modeBadge.style.background = "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))";
    DOM.modeBadge.style.borderColor = "rgba(16, 185, 129, 0.4)";
    DOM.modeBadge.style.color = "#10b981";
  } else if (clientKey && clientKey.trim().length > 10) {
    state.demoModeActive = false;
    DOM.modeBadge.className = "demo-pill";
    DOM.modeBadge.textContent = "Client Connected";
    DOM.modeBadge.style.background = "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.15))";
    DOM.modeBadge.style.borderColor = "rgba(99, 102, 241, 0.4)";
    DOM.modeBadge.style.color = "#6366f1";
  } else {
    state.demoModeActive = true;
    DOM.modeBadge.className = "demo-pill";
    DOM.modeBadge.textContent = "Demo Mode";
    DOM.modeBadge.style.background = "";
    DOM.modeBadge.style.borderColor = "";
    DOM.modeBadge.style.color = "";
  }
}

function initSettings() {
  DOM.btnSaveSettings.addEventListener("click", async () => {
    const key = DOM.apiKeyInput.value.trim();
    const model = DOM.modelSelector.value;
    
    localStorage.setItem("gemini_model", model);

    if (key.length > 0) {
      showToast("Verifying API connection...", "info");
      const isValid = await testBackendConnection(key);
      if (isValid) {
        localStorage.setItem("gemini_api_key", key);
        state.demoModeActive = false;
        loadSettings();
        showToast("Gemini API key saved and verified successfully!", "success");
      } else {
        showToast("Connection verification failed. Make sure server is running and key is valid.", "danger");
      }
    } else {
      localStorage.removeItem("gemini_api_key");
      loadSettings();
      showToast("Client key cleared.", "info");
    }
  });

  DOM.btnTestApi.addEventListener("click", async () => {
    const key = DOM.apiKeyInput.value.trim();
    
    DOM.apiKeyStatus.style.display = "flex";
    DOM.apiKeyStatus.className = "api-status";
    DOM.apiStatusText.textContent = "Testing Connection...";
    const dot = DOM.apiKeyStatus.querySelector(".status-dot");
    dot.className = "status-dot";

    const isConnected = await testBackendConnection(key);
    if (isConnected) {
      DOM.apiStatusText.textContent = "Connected Successfully!";
      dot.classList.add("active");
      showToast("Connected successfully via local server!", "success");
    } else {
      DOM.apiStatusText.textContent = "Connection Failed";
      dot.classList.add("inactive");
      showToast("Connection failed. Check local server terminal or key validity.", "danger");
    }
  });

  DOM.btnClearSettings.addEventListener("click", () => {
    DOM.apiKeyInput.value = "";
    DOM.apiKeyStatus.style.display = "none";
    localStorage.removeItem("gemini_api_key");
    loadSettings();
    showToast("Settings cleared.", "info");
  });
}

async function testBackendConnection(key = "") {
  try {
    const response = await fetch(`${BACKEND_URL}/test-connection`, {
      method: "POST",
      headers: getHeaders(key),
      body: JSON.stringify({ model: DOM.modelSelector.value })
    });
    if (response.ok) {
      const data = await response.json();
      return !!data.success;
    }
    return false;
  } catch (e) {
    console.error("Test connection failed:", e);
    return false;
  }
}

// --- ATS Analysis & UI Rendering Pipeline ---
async function triggerAnalysisPipeline() {
  const resume = state.resumeText.trim();
  const jd = DOM.jobDescInput.value.trim();

  if (!resume) {
    showToast("Please upload a resume or load sample data first.", "danger");
    return;
  }
  if (!jd) {
    showToast("Please provide target Job Description details.", "danger");
    return;
  }

  state.targetJobDescription = jd;

  // Reveal loader screen
  DOM.workspaceInputs.style.display = "none";
  DOM.resultsScreen.style.display = "none";
  DOM.loadingScreen.style.display = "flex";

  try {
    const payload = {
      resume,
      jobDescription: jd,
      model: localStorage.getItem("gemini_model") || "gemini-1.5-flash",
      demoMode: state.demoModeActive
    };

    // Trigger local server REST APIs concurrently
    const [report, tailoring, interview] = await Promise.all([
      fetchAPI("/analyze", payload),
      fetchAPI("/tailor", payload),
      fetchAPI("/interview", payload)
    ]);

    state.analysisResult = {
      timestamp: new Date().toLocaleString(),
      jobTitle: parseJobTitle(jd),
      report,
      tailoring,
      interview
    };

    addToHistory(state.analysisResult);
    renderReportDashboard(state.analysisResult);
    unlockFeatureTabs(state.analysisResult);

    DOM.loadingScreen.style.display = "none";
    DOM.resultsScreen.style.display = "block";
    showToast("Resume Analysis Complete!", "success");

  } catch (error) {
    console.error("Pipeline Failure:", error);
    showToast(error.message || "An unexpected error occurred during analysis. Confirm backend is running.", "danger");
    DOM.loadingScreen.style.display = "none";
    DOM.workspaceInputs.style.display = "grid";
  }
}

async function fetchAPI(endpoint, payload) {
  // Fallback to offline mock data if server is dead and demo mode is triggered
  if (state.demoModeActive && !state.serverHasKey) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (endpoint === "/analyze") return mockAnalysis;
    if (endpoint === "/tailor") return mockAnalysis.tailored;
    if (endpoint === "/interview") return mockAnalysis.interview;
  }

  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Server returned ${response.status}`);
  }

  return response.json();
}

function resetAnalyzerScreen() {
  DOM.resultsScreen.style.display = "none";
  DOM.workspaceInputs.style.display = "grid";
}

function parseJobTitle(jd) {
  const lines = jd.split("\n");
  for (let line of lines) {
    line = line.trim();
    if (line.toLowerCase().startsWith("position:") || line.toLowerCase().startsWith("title:")) {
      return line.replace(/(position:|title:)/i, "").trim();
    }
  }
  if (lines.length > 0 && lines[0].trim().length > 3) {
    const cleanLine = lines[0].trim();
    if (cleanLine.length < 50) return cleanLine;
  }
  return "Custom Job Role";
}

// --- Dynamic Rendering Modules ---
function renderReportDashboard(data) {
  const report = data.report;
  
  DOM.reportScoreNum.textContent = report.atsScore;
  const offset = 439.8 - (439.8 * report.atsScore) / 100;
  DOM.scoreRingFill.style.strokeDashoffset = offset;

  DOM.reportSummaryText.textContent = report.summary;

  const categories = ["keywords", "experience", "skills", "formatting"];
  categories.forEach(cat => {
    const val = report.breakdown[cat] || 0;
    DOM.scoreBreakdown[cat].textContent = `${val}%`;
    DOM.scoreBars[cat].style.width = `${val}%`;
  });

  DOM.foundTagsContainer.innerHTML = "";
  if (report.keywords.found && report.keywords.found.length > 0) {
    report.keywords.found.forEach(kw => {
      const tag = document.createElement("span");
      tag.className = "tag found";
      tag.innerHTML = `<i data-lucide="check"></i> ${kw}`;
      DOM.foundTagsContainer.appendChild(tag);
    });
  } else {
    DOM.foundTagsContainer.innerHTML = `<span style="font-size:12px; color:var(--text-muted);">None detected</span>`;
  }

  DOM.missingTagsContainer.innerHTML = "";
  if (report.keywords.missing && report.keywords.missing.length > 0) {
    report.keywords.missing.forEach(kw => {
      const tag = document.createElement("span");
      tag.className = "tag missing";
      tag.innerHTML = `<i data-lucide="x"></i> ${kw}`;
      DOM.missingTagsContainer.appendChild(tag);
    });
  } else {
    DOM.missingTagsContainer.innerHTML = `<span style="font-size:12px; color:var(--text-muted);">None detected</span>`;
  }

  renderBulletList(DOM.strengthsContainer, report.feedback.strengths, "success", "check-circle-2");
  renderBulletList(DOM.weaknessesContainer, report.feedback.weaknesses, "danger", "alert-circle");
  renderBulletList(DOM.recommendationsContainer, report.feedback.recommendations, "warning", "lightbulb");

  lucide.createIcons();
}

function renderBulletList(container, items, themeClass, iconName) {
  container.innerHTML = "";
  if (items && items.length > 0) {
    items.forEach(item => {
      const div = document.createElement("div");
      div.className = "list-item";
      const parsedText = item.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      div.innerHTML = `
        <i data-lucide="${iconName}" class="list-item-icon ${themeClass}"></i>
        <div class="list-item-content">${parsedText}</div>
      `;
      container.appendChild(div);
    });
  } else {
    container.innerHTML = `<span style="font-size:13px; color:var(--text-muted);">No insights available.</span>`;
  }
}

function initReportInnerTabs() {
  DOM.resultsTabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const panelId = btn.getAttribute("data-report-tab");
      
      DOM.resultsTabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      DOM.resultsTabPanels.forEach(panel => {
        if (panel.id === panelId) {
          panel.classList.add("active");
        } else {
          panel.classList.remove("active");
        }
      });
    });
  });
}

function unlockFeatureTabs(data) {
  // Tailoring Panel
  DOM.tailorLocked.style.display = "none";
  DOM.tailorUnlocked.style.display = "flex";
  
  DOM.tailoredSummaryContent.textContent = data.tailoring.summary;
  
  DOM.tailoredBulletsContainer.innerHTML = "";
  data.tailoring.bullets.forEach((bullet, index) => {
    const card = document.createElement("div");
    card.className = "comparison-box";
    card.innerHTML = `
      <div class="compare-card original">
        <div class="compare-label original">Original Bullet</div>
        <div class="compare-text">${bullet.original}</div>
      </div>
      <div class="compare-card tailored">
        <div class="compare-label tailored">Tailored (ATS Optimized)</div>
        <div class="compare-text" id="tailored-bullet-text-${index}">${bullet.tailored}</div>
        <button class="btn-copy" data-copy-target="tailored-bullet-text-${index}">
          <i data-lucide="copy"></i> Copy Bullet
        </button>
      </div>
    `;
    DOM.tailoredBulletsContainer.appendChild(card);
  });

  // Interview Panel
  DOM.interviewLocked.style.display = "none";
  DOM.interviewUnlocked.style.display = "block";
  
  DOM.interviewQuestionsContainer.innerHTML = "";
  data.interview.forEach((qa, index) => {
    const badgeClass = qa.type.toLowerCase() === "technical" ? "technical" : "behavioral";
    const qaCard = document.createElement("div");
    qaCard.className = "qa-card glass-panel";
    
    qaCard.innerHTML = `
      <div class="qa-header" id="qa-header-${index}">
        <div class="qa-title-block">
          <span class="qa-badge ${badgeClass}">${qa.type}</span>
          <span class="qa-question">${qa.question}</span>
        </div>
        <i data-lucide="chevron-down" class="qa-chevron"></i>
      </div>
      <div class="qa-body" id="qa-body-${index}">
        <div class="qa-content">
          <div class="qa-approach-label">
            <i data-lucide="help-circle"></i> Strategy & STAR Guidance
          </div>
          <div class="qa-approach-text">${qa.approach}</div>
        </div>
      </div>
    `;
    DOM.interviewQuestionsContainer.appendChild(qaCard);

    const header = qaCard.querySelector(".qa-header");
    header.addEventListener("click", () => {
      const isOpen = qaCard.classList.contains("open");
      document.querySelectorAll(".qa-card").forEach(c => {
        c.classList.remove("open");
        c.querySelector(".qa-body").style.maxHeight = null;
      });
      if (!isOpen) {
        qaCard.classList.add("open");
        const body = qaCard.querySelector(".qa-body");
        body.style.maxHeight = `${body.scrollHeight}px`;
      }
    });
  });

  lucide.createIcons();
  bindBulletCopyTriggers();
}

function initCopyTriggers() {
  DOM.btnCopySummary.addEventListener("click", () => {
    const text = DOM.tailoredSummaryContent.textContent;
    navigator.clipboard.writeText(text).then(() => {
      showToast("Tailored summary copied to clipboard!", "success");
    }).catch(e => {
      showToast("Copy failed. Please copy manually.", "danger");
    });
  });
}

function bindBulletCopyTriggers() {
  const copyButtons = DOM.tailoredBulletsContainer.querySelectorAll(".btn-copy");
  copyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-copy-target");
      const text = document.getElementById(targetId).textContent;
      
      navigator.clipboard.writeText(text).then(() => {
        showToast("Tailored bullet point copied to clipboard!", "success");
      }).catch(e => {
        showToast("Copy failed.", "danger");
      });
    });
  });
}

// --- History Log persistence (LocalStorage) ---
function loadHistory() {
  const storedHistory = localStorage.getItem("resume_analyzer_history");
  if (storedHistory) {
    try {
      state.history = JSON.parse(storedHistory);
      renderHistoryList();
      renderDashboardStats();
    } catch (e) {
      console.error("Failed to parse history", e);
      state.history = [];
    }
  }
}

function addToHistory(item) {
  state.history.unshift(item);
  if (state.history.length > 10) {
    state.history.pop();
  }
  localStorage.setItem("resume_analyzer_history", JSON.stringify(state.history));
  renderHistoryList();
  renderDashboardStats();
}

function renderHistoryList() {
  if (state.history.length === 0) {
    DOM.historyContainer.innerHTML = `
      <div class="empty-state">
        <i data-lucide="folder-open"></i>
        <div class="empty-state-title">No reports generated yet</div>
        <div class="empty-state-desc">Head over to the Resume Analyzer to run your first compatibility report.</div>
        <button class="btn-secondary" onclick="window.switchTab('analyzer')">Go to Analyzer</button>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  DOM.historyContainer.innerHTML = "";
  state.history.forEach((item, index) => {
    const score = item.report.atsScore;
    let ringClass = "score-low";
    if (score >= 80) ringClass = "score-high";
    else if (score >= 60) ringClass = "score-mid";

    const itemDiv = document.createElement("div");
    itemDiv.className = "history-item glass-panel";
    itemDiv.innerHTML = `
      <div>
        <div class="history-title">${item.jobTitle}</div>
        <div class="history-meta">
          <span><i data-lucide="calendar" style="width:11px; height:11px; vertical-align:middle; margin-right:3px;"></i> ${item.timestamp}</span>
        </div>
      </div>
      <div class="history-score-ring ${ringClass}">${score}</div>
    `;

    itemDiv.addEventListener("click", () => {
      state.analysisResult = item;
      renderReportDashboard(item);
      unlockFeatureTabs(item);
      switchTab("analyzer");
      DOM.workspaceInputs.style.display = "none";
      DOM.resultsScreen.style.display = "block";
      showToast(`Loaded report for ${item.jobTitle}`, "success");
    });

    DOM.historyContainer.appendChild(itemDiv);
  });
  
  lucide.createIcons();
}

function renderDashboardStats() {
  const count = state.history.length;
  DOM.statCount.textContent = count;

  if (count === 0) {
    DOM.statAvg.textContent = "N/A";
    DOM.statBest.textContent = "N/A";
    return;
  }

  const sum = state.history.reduce((acc, curr) => acc + curr.report.atsScore, 0);
  const avg = Math.round(sum / count);
  DOM.statAvg.textContent = `${avg}%`;

  let bestScore = -1;
  let bestRole = "";
  state.history.forEach(item => {
    if (item.report.atsScore > bestScore) {
      bestScore = item.report.atsScore;
      bestRole = item.jobTitle;
    }
  });

  DOM.statBest.textContent = bestRole.length > 18 ? `${bestRole.substring(0, 16)}...` : bestRole;
}
