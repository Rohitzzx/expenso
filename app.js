// Initialize local storage if empty
if (!localStorage.getItem('users')) localStorage.setItem('users', JSON.stringify([]));
if (!localStorage.getItem('expenses')) localStorage.setItem('expenses', JSON.stringify([]));

// --- Auth Functions ---
function getLoggedInUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}

function requireAuth() {
  if (!getLoggedInUser()) {
    window.location.href = 'login.html';
  }
}

function requireNoAuth() {
  if (getLoggedInUser()) {
    window.location.href = 'dashboard.html';
  }
}

// Make logout function globally available
window.logout = function() {
  localStorage.removeItem('currentUser');
  showNotification('Logged out successfully', 'success');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
}

// --- Expense Functions ---
function getUserExpenses() {
  const user = getLoggedInUser();
  if (!user) return [];
  const allExpenses = JSON.parse(localStorage.getItem('expenses'));
  return allExpenses.filter(exp => exp.userEmail === user.email);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// --- Notification System ---
function showNotification(message, type = 'info') {
  const existingNotification = document.querySelector('.notification-toast');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');
  notification.className = `notification-toast fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-500 translate-x-0 ${
    type === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' :
    type === 'error' ? 'bg-red-50 text-red-800 border-l-4 border-red-500' :
    'bg-blue-50 text-blue-800 border-l-4 border-blue-500'
  }`;
  
  notification.innerHTML = `
    <div class="flex items-center space-x-2">
      <span class="text-lg">
        ${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
      </span>
      <span class="font-medium">${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

// Update Navbar Links for Auth State dynamically
document.addEventListener("DOMContentLoaded", () => {
  updateNavbar();
});

window.updateNavbar = function() {
  const authLinksContainer = document.getElementById('auth-links');
  if (authLinksContainer) {
    if (getLoggedInUser()) {
      const user = getLoggedInUser();
      authLinksContainer.innerHTML = `
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600 hidden lg:inline">${user.name}</span>
          <button onclick="window.logout()" class="text-gray-500 hover:text-red-600 font-medium transition-colors">
            <i class="fa-solid fa-arrow-right-from-bracket mr-1.5"></i>Logout
          </button>
        </div>
      `;
    } else {
      authLinksContainer.innerHTML = `
        <div class="flex items-center space-x-2">
          <a href="login.html" class="text-gray-500 hover:text-gray-900 font-medium transition-colors">Login</a>
          <a href="register.html" class="bg-primary-gradient text-white px-4 py-2 rounded-lg hover:shadow-md transition-all font-medium text-sm">
            Get Started
          </a>
        </div>
      `;
    }
  }
}