const Auth = {
    user: null,

    init() {
        const storedUser = localStorage.getItem('auth_user');
        if (storedUser) {
            this.user = JSON.parse(storedUser);
            this.updateHeaderProfile();
        } else {
            this.renderLogin();
        }
    },

    login(email, password) {
        // Mock Credentials
        const validUsers = [
            { id: 1, name: "Admin", email: "admin@app.com", password: "admin123", role: "admin" },
            { id: 2, name: "User", email: "user@app.com", password: "user123", role: "user" }
        ];

        const user = validUsers.find(u => u.email === email && u.password === password);

        if (user) {
            // Success
            this.user = user;
            localStorage.setItem('auth_user', JSON.stringify(user));

            // Hide Overlay
            document.getElementById('auth-overlay').classList.add('hidden');

            // Update UI
            this.updateHeaderProfile();

            // Redirect
            location.hash = '#dashboard';

            Utils.showToast('success', `${I18n.translate('welcome')}, ${user.name}`);
        } else {
            // Error
            Utils.showToast('error', 'Email ou mot de passe incorrect');
        }
    },

    logout() {
        this.user = null;
        localStorage.removeItem('auth_user');
        location.hash = ''; // Clear hash
        this.renderLogin();
        Utils.showToast('info', 'Déconnexion réussie');
    },

    isLoggedIn() {
        return !!this.user;
    },

    updateHeaderProfile() {
        const avatar = document.getElementById('user-avatar');
        const name = document.getElementById('user-name');
        const role = document.getElementById('user-role');

        if (this.user) {
            avatar.textContent = this.user.name.substring(0, 2).toUpperCase();
            name.textContent = this.user.name;
            role.textContent = this.user.role === 'admin' ? 'Administrator' : 'Librarian';

            // Setup Logout Listener
            document.getElementById('logout-btn').onclick = () => this.logout();
        }
    },

    renderLogin() {
        const overlay = document.getElementById('auth-overlay');
        overlay.classList.remove('hidden');
        overlay.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600 text-2xl">
                        <i class="fa-solid fa-book-open-reader"></i>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">${I18n.translate('login_title')}</h2>
                    <p class="text-gray-500 text-sm mt-2 dark:text-gray-400">admin@app.com / admin123</p>
                </div>

                <form id="login-form" class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">${I18n.translate('email')}</label>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <i class="fa-solid fa-envelope"></i>
                            </span>
                            <input type="email" id="email" required 
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value="admin@app.com">
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">${I18n.translate('password')}</label>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <i class="fa-solid fa-lock"></i>
                            </span>
                            <input type="password" id="password" required 
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value="admin123">
                        </div>
                    </div>

                    <button type="submit" 
                        class="w-full bg-gradient-to-r from-primary-600 to-secondary text-white font-semibold py-2.5 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                        ${I18n.translate('login_btn')}
                    </button>
                </form>
            </div>
        `;

        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const pass = document.getElementById('password').value;
            this.login(email, pass);
        });
    }
};
