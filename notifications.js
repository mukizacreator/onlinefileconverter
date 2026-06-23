/* ============================================
   MODERN TOAST NOTIFICATION SYSTEM
   ============================================ */

// Toast types: success, error, warning, info
// All toasts auto-dismiss after 2 seconds

function showToast(message, type = 'info', duration = 2000) {
  // Remove existing toasts if any
  const existingContainer = document.getElementById('toastContainer');
  if (existingContainer) existingContainer.remove();

  // Create container
  const container = document.createElement('div');
  container.id = 'toastContainer';
  container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    max-width: 400px;
    width: 100%;
    pointer-events: none;
  `;

  // Create toast element
  const toast = document.createElement('div');
  const colors = {
    success: { bg: '#28a745', border: '#34ce57', icon: 'fa-check-circle' },
    error: { bg: '#dc3545', border: '#ff6b6b', icon: 'fa-exclamation-circle' },
    warning: { bg: '#ff9800', border: '#ffb74d', icon: 'fa-exclamation-triangle' },
    info: { bg: '#00bcd4', border: '#4dd0e1', icon: 'fa-info-circle' }
  };

  const color = colors[type] || colors.info;

  toast.style.cssText = `
    background: rgba(20, 30, 40, 0.95);
    backdrop-filter: blur(12px);
    border-left: 4px solid ${color.border};
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 12px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    gap: 14px;
    color: white;
    font-family: 'Segoe UI', sans-serif;
    font-size: 0.95rem;
    transform: translateX(120%);
    animation: slideIn 0.4s ease forwards;
    pointer-events: auto;
    transition: all 0.3s ease;
  `;

  // Icon
  const icon = document.createElement('i');
  icon.className = `fa-solid ${color.icon}`;
  icon.style.cssText = `
    font-size: 1.4rem;
    color: ${color.border};
    flex-shrink: 0;
  `;

  // Message text
  const text = document.createElement('span');
  text.textContent = message;
  text.style.cssText = `
    flex: 1;
    line-height: 1.4;
    word-break: break-word;
  `;

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.cssText = `
    background: none;
    border: none;
    color: rgba(255,255,255,0.5);
    font-size: 1.4rem;
    cursor: pointer;
    padding: 0 4px;
    transition: 0.2s;
    pointer-events: auto;
  `;
  closeBtn.onmouseover = () => closeBtn.style.color = 'white';
  closeBtn.onmouseout = () => closeBtn.style.color = 'rgba(255,255,255,0.5)';
  closeBtn.onclick = () => {
    toast.style.transform = 'translateX(120%)';
    setTimeout(() => toast.remove(), 400);
  };

  toast.appendChild(icon);
  toast.appendChild(text);
  toast.appendChild(closeBtn);
  container.appendChild(toast);
  document.body.appendChild(container);

  // Auto-dismiss after duration
  const timer = setTimeout(() => {
    toast.style.transform = 'translateX(120%)';
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
      if (container.children.length === 0) container.remove();
    }, 400);
  }, duration);

  // Pause auto-dismiss on hover
  toast.onmouseenter = () => clearTimeout(timer);
  toast.onmouseleave = () => {
    setTimeout(() => {
      toast.style.transform = 'translateX(120%)';
      setTimeout(() => {
        if (toast.parentNode) toast.remove();
        if (container.children.length === 0) container.remove();
      }, 400);
    }, duration);
  };
}

// Animation keyframes (injected dynamically)
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes slideIn {
    0% { transform: translateX(120%); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }
`;
document.head.appendChild(styleSheet);

// Shorthand functions
function toastSuccess(msg) { showToast(msg, 'success'); }
function toastError(msg) { showToast(msg, 'error'); }
function toastWarning(msg) { showToast(msg, 'warning'); }
function toastInfo(msg) { showToast(msg, 'info'); }