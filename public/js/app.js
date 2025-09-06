// API utility functions
const API_BASE = '/api';

// Token management
const TokenManager = {
    get: () => localStorage.getItem('token'),
    set: (token) => localStorage.setItem('token', token),
    remove: () => localStorage.removeItem('token'),
    decode: (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    }
};

// API request wrapper
const api = {
    async request(endpoint, options = {}) {
        const token = TokenManager.get();
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }
        
        return data;
    },
    
    get: (endpoint) => api.request(endpoint),
    post: (endpoint, body) => api.request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    patch: (endpoint, body) => api.request(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (endpoint) => api.request(endpoint, { method: 'DELETE' })
};

// Auth functions
const Auth = {
    async signup(userType, userData) {
        const response = await api.post(`/auth/signup/${userType}`, userData);
        TokenManager.set(response.token);
        return response;
    },
    
    async login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        TokenManager.set(response.token);
        return response;
    },
    
    logout() {
        TokenManager.remove();
        window.location.href = '/';
    },
    
    getCurrentUser() {
        const token = TokenManager.get();
        if (!token) return null;
        return TokenManager.decode(token);
    },
    
    isAuthenticated() {
        const token = TokenManager.get();
        if (!token) return false;
        const decoded = TokenManager.decode(token);
        return decoded && decoded.exp > Date.now() / 1000;
    }
};

// Service Request functions
const ServiceRequests = {
    async create(requestData) {
        return await api.post('/service-request', requestData);
    },
    
    async getByCustomer(customerId) {
        return await api.get(`/service-request/customer/${customerId}`);
    },
    
    async getByMechanic(mechanicId) {
        return await api.get(`/service-request/mechanic/${mechanicId}`);
    },
    
    async updateStatus(requestId, status, question = null) {
        const body = { status };
        if (question) body.question = question;
        return await api.patch(`/service-request/${requestId}`, body);
    }
};

// List functions
const Lists = {
    async getMechanics() {
        return await api.get('/list/mechanics');
    },
    
    async getCustomers() {
        return await api.get('/list/customers');
    }
};

// Utility functions
const Utils = {
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    },
    
    showError(message) {
        this.showNotification(message, 'error');
    },
    
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString();
    },
    
    capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    
    redirectToDashboard(userType) {
        switch (userType) {
            case 'customer':
                window.location.href = '/customer-dashboard.html';
                break;
            case 'mechanic':
                window.location.href = '/mechanic-dashboard.html';
                break;
            case 'admin':
                window.location.href = '/admin-dashboard.html';
                break;
            default:
                window.location.href = '/';
        }
    }
};

// Auth guard for protected pages
const requireAuth = () => {
    if (!Auth.isAuthenticated()) {
        window.location.href = '/';
        return false;
    }
    return true;
};

// Initialize navigation
const initNavigation = () => {
    const user = Auth.getCurrentUser();
    const navElement = document.querySelector('.nav');
    
    if (!navElement) return;
    
    if (user) {
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        userInfo.innerHTML = `
            Welcome, ${user.userType}! 
            <button class="btn" onclick="Auth.logout()">Logout</button>
        `;
        navElement.appendChild(userInfo);
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
});