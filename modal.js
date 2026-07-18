/* ============================================
   CUSTOM MODAL SYSTEM - With Resend Option
   ============================================ */

// Store email globally for resend functionality
let currentModalEmail = null;

function showModal(options) {
    const {
        title,
        message,
        input = false,
        inputPlaceholder = '',
        inputType = 'text',
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        onConfirm,
        onCancel,
        showCancel = true,
        stayOpenOnError = false,
        showResend = false,
        email = null
    } = options;

    // Store email for resend
    if (email) currentModalEmail = email;

    const existingModal = document.getElementById('customModal');
    if (existingModal) existingModal.remove();

    const overlay = document.createElement('div');
    overlay.id = 'customModal';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10001;
        animation: fadeIn 0.3s ease;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
        background: rgba(25, 35, 45, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 20px;
        padding: 30px 35px;
        max-width: 450px;
        width: 92%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
        animation: slideUp 0.3s ease;
        text-align: center;
        max-height: 90vh;
        overflow-y: auto;
    `;

    const titleEl = document.createElement('h2');
    titleEl.textContent = title;
    titleEl.style.cssText = `
        color: white;
        font-size: 1.3rem;
        margin: 0 0 8px 0;
        font-family: 'Segoe UI', sans-serif;
    `;
    modal.appendChild(titleEl);

    const msgEl = document.createElement('p');
    msgEl.textContent = message;
    msgEl.style.cssText = `
        color: #cccccc;
        font-size: 0.9rem;
        line-height: 1.5;
        margin: 0 0 16px 0;
        font-family: 'Segoe UI', sans-serif;
        white-space: pre-line;
    `;
    modal.appendChild(msgEl);

    let inputEl = null;
    let errorMsgEl = null;

    if (input) {
        errorMsgEl = document.createElement('p');
        errorMsgEl.style.cssText = `
            color: #ff6b6b;
            font-size: 0.8rem;
            margin: 0 0 10px 0;
            display: none;
            text-align: left;
            font-family: 'Segoe UI', sans-serif;
        `;
        modal.appendChild(errorMsgEl);

        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            display: flex;
            gap: 8px;
            align-items: center;
            margin-bottom: 18px;
            width: 100%;
        `;

        inputEl = document.createElement('input');
        inputEl.type = inputType === 'password' ? 'password' : inputType;
        inputEl.placeholder = inputPlaceholder;
        inputEl.style.cssText = `
            flex: 1;
            padding: 12px 16px;
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 12px;
            background: rgba(255,255,255,0.08);
            color: white;
            font-size: 1rem;
            outline: none;
            box-sizing: border-box;
            font-family: 'Segoe UI', sans-serif;
            text-align: left;
            letter-spacing: 1px;
        `;
        wrapper.appendChild(inputEl);

        if (inputType === 'password') {
            const toggleBtn = document.createElement('button');
            toggleBtn.type = 'button';
            toggleBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
            toggleBtn.style.cssText = `
                padding: 12px 14px;
                border: none;
                border-radius: 12px;
                background: rgba(255,255,255,0.08);
                color: white;
                cursor: pointer;
                font-size: 1rem;
                transition: 0.3s;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            toggleBtn.onmouseover = () => {
                toggleBtn.style.background = 'rgba(255,255,255,0.15)';
            };
            toggleBtn.onmouseout = () => {
                toggleBtn.style.background = 'rgba(255,255,255,0.08)';
            };
            toggleBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                const icon = this.querySelector('i');
                if (inputEl.type === 'password') {
                    inputEl.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    inputEl.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
                inputEl.focus();
            };
            wrapper.appendChild(toggleBtn);
        }

        modal.appendChild(wrapper);
        inputEl.focus();
        
        // Clear error when user types
        inputEl.addEventListener('input', function() {
            if (errorMsgEl) {
                errorMsgEl.style.display = 'none';
                this.style.borderColor = 'rgba(255,255,255,0.15)';
            }
        });
    }

    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = `
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
        width: 100%;
    `;

    // Resend button
    if (showResend) {
        const resendBtn = document.createElement('button');
        resendBtn.textContent = '🔄 Resend Code';
        resendBtn.style.cssText = `
            padding: 10px 20px;
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 12px;
            background: rgba(255,255,255,0.05);
            color: #aaa;
            font-size: 0.85rem;
            cursor: pointer;
            transition: 0.3s;
            font-weight: 600;
            font-family: 'Segoe UI', sans-serif;
            flex: 1;
            min-width: 80px;
        `;
        resendBtn.onmouseover = () => {
            resendBtn.style.background = 'rgba(255,255,255,0.12)';
            resendBtn.style.color = 'white';
        };
        resendBtn.onmouseout = () => {
            resendBtn.style.background = 'rgba(255,255,255,0.05)';
            resendBtn.style.color = '#aaa';
        };
        resendBtn.onclick = async function() {
            if (!currentModalEmail) {
                toastError('No email found. Please try again.');
                return;
            }
            
            this.textContent = '⏳ Sending...';
            this.disabled = true;
            
            try {
                const res = await fetch("/api/send-code", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: currentModalEmail })
                });
                
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || "Failed to resend code.");
                }
                
                toastSuccess('New verification code sent to your email!');
                this.textContent = '✅ Sent!';
                setTimeout(() => {
                    this.textContent = '🔄 Resend Code';
                    this.disabled = false;
                }, 3000);
                
            } catch (error) {
                toastError(error.message || 'Failed to resend code.');
                this.textContent = '🔄 Resend Code';
                this.disabled = false;
            }
        };
        btnContainer.appendChild(resendBtn);
    }

    let cancelBtn = null;
    if (showCancel) {
        cancelBtn = document.createElement('button');
        cancelBtn.textContent = cancelText;
        cancelBtn.style.cssText = `
            padding: 10px 25px;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 12px;
            background: rgba(255,255,255,0.08);
            color: #aaa;
            font-size: 0.9rem;
            cursor: pointer;
            transition: 0.3s;
            font-weight: 600;
            font-family: 'Segoe UI', sans-serif;
            flex: 1;
            min-width: 80px;
        `;
        cancelBtn.onmouseover = () => {
            cancelBtn.style.background = 'rgba(255,255,255,0.15)';
            cancelBtn.style.color = 'white';
        };
        cancelBtn.onmouseout = () => {
            cancelBtn.style.background = 'rgba(255,255,255,0.08)';
            cancelBtn.style.color = '#aaa';
        };
        cancelBtn.onclick = () => {
            overlay.remove();
            if (onCancel) onCancel();
            if (overlay._resolve) overlay._resolve(null);
        };
        btnContainer.appendChild(cancelBtn);
    }

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = confirmText;
    confirmBtn.style.cssText = `
        padding: 10px 25px;
        border: none;
        border-radius: 12px;
        background: #00bcd4;
        color: white;
        font-size: 0.9rem;
        cursor: pointer;
        transition: 0.3s;
        font-weight: 600;
        font-family: 'Segoe UI', sans-serif;
        flex: 1;
        min-width: 80px;
    `;
    confirmBtn.onmouseover = () => {
        confirmBtn.style.background = '#008ba3';
        confirmBtn.style.transform = 'scale(1.02)';
    };
    confirmBtn.onmouseout = () => {
        confirmBtn.style.background = '#00bcd4';
        confirmBtn.style.transform = 'scale(1)';
    };
    
    confirmBtn._modal = modal;
    confirmBtn._errorMsg = errorMsgEl;
    confirmBtn._input = inputEl;
    confirmBtn._stayOpen = stayOpenOnError;
    confirmBtn._overlay = overlay;
    confirmBtn._onConfirm = onConfirm;
    confirmBtn._onCancel = onCancel;
    confirmBtn._resolve = null;

    confirmBtn.onclick = function() {
        // If stayOpenOnError is true (verification modal), validate and stay open
        if (this._stayOpen && this._input) {
            const value = this._input.value.trim();
            if (!value || value.length < 4) {
                if (this._errorMsg) {
                    this._errorMsg.textContent = 'Please enter a valid 6-digit code.';
                    this._errorMsg.style.display = 'block';
                    this._input.style.borderColor = '#ff6b6b';
                }
                // Don't close modal - stay open
                return;
            }
            
            // Resolve with the code, but KEEP MODAL OPEN
            // The caller will verify and decide whether to close or keep open
            if (this._resolve) {
                this._resolve(value);
            }
            // Don't close modal here
            return;
        }
        
        // For non-stayOpen modals, get value and close
        const value = this._input ? this._input.value.trim() : true;
        if (this._overlay) this._overlay.remove();
        if (this._onConfirm) this._onConfirm(value);
        if (this._resolve) this._resolve(value);
    };

    btnContainer.appendChild(confirmBtn);
    modal.appendChild(btnContainer);

    // Close on outside click - only if not stayOpenOnError
    overlay.onclick = (e) => {
        if (e.target === overlay && !stayOpenOnError) {
            overlay.remove();
            if (onCancel) onCancel();
            if (overlay._resolve) overlay._resolve(null);
        }
    };

    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            confirmBtn.click();
        }
        if (e.key === 'Escape') {
            if (cancelBtn) cancelBtn.click();
        }
    });

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    return new Promise((resolve) => {
        overlay._resolve = resolve;
        confirmBtn._resolve = resolve;
    });
}

const modalStyles = document.createElement('style');
modalStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(modalStyles);

function showVerificationModal(email = null) {
    return showModal({
        title: '🔐 Verification Code',
        message: 'Enter the 6-digit code sent to your email.\n\nAlso check your SPAM/JUNK folder.',
        input: true,
        inputPlaceholder: 'Enter 6-digit code',
        inputType: 'text',
        confirmText: 'Verify',
        cancelText: 'Cancel',
        showCancel: true,
        stayOpenOnError: true,
        showResend: true,
        email: email
    });
}

function showConfirmModal(title, message, confirmText = 'Confirm', cancelText = 'Cancel') {
    return showModal({
        title: title,
        message: message,
        input: false,
        confirmText: confirmText,
        cancelText: cancelText,
        showCancel: true
    });
}

function showAlertModal(title, message, confirmText = 'OK') {
    return showModal({
        title: title,
        message: message,
        input: false,
        confirmText: confirmText,
        cancelText: '',
        showCancel: false
    });
}

window.showModal = showModal;
window.showVerificationModal = showVerificationModal;
window.showConfirmModal = showConfirmModal;
window.showAlertModal = showAlertModal;

console.log("✅ Modal system v52 loaded successfully!");
