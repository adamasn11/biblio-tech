const App = {
    init() {
        // Initialize Auth FIRST
        Auth.init();

        // Listen for Hash Changes
        window.addEventListener('hashchange', () => this.router());

        // Setup Sidebar Toggle
        document.getElementById('sidebar-toggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('hidden');
            document.getElementById('sidebar').classList.toggle('absolute');
            document.getElementById('sidebar').classList.toggle('z-30');
            document.getElementById('sidebar').classList.toggle('h-full');
        });

        // Setup Dark Mode
        this.setupTheme();

        // Initial Route
        this.renderSidebar();

        // Populate I18n UI
        document.getElementById('current-lang').textContent = I18n.lang.toUpperCase();

        // If logged in, go to dashboard if on root
        if (Auth.isLoggedIn() && (!location.hash || location.hash === '#')) {
            location.hash = '#dashboard';
        } else if (!Auth.isLoggedIn()) {
            // Auth.init() handles showing login form
        } else {
            this.router();
        }
    },

    setLanguage(lang) {
        I18n.setLanguage(lang);
    },

    setupTheme() {
        const btn = document.getElementById('theme-toggle');
        const icon = btn.querySelector('i');

        // Check Saved Theme
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            document.documentElement.classList.remove('dark');
        }

        btn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            if (document.documentElement.classList.contains('dark')) {
                localStorage.theme = 'dark';
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                localStorage.theme = 'light';
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });
    },

    routes: {
        'dashboard': { controller: 'DashboardController', label: 'dashboard', icon: 'fa-chart-pie' },
        'books': { controller: 'BooksController', label: 'books', icon: 'fa-book' },
        'members': { controller: 'MembersController', label: 'members', icon: 'fa-users' },
        'loans': { controller: 'LoansController', label: 'loans', icon: 'fa-hand-holding-hand' },
        'authors': { controller: 'AuthorsController', label: 'authors', icon: 'fa-pen-nib' },
        'categories': { controller: 'CategoriesController', label: 'categories', icon: 'fa-tags' },
    },

    renderSidebar() {
        const nav = document.querySelector('nav');
        nav.innerHTML = '';

        Object.entries(this.routes).forEach(([hash, route]) => {
            const link = document.createElement('a');
            link.href = `#${hash}`;
            link.className = `flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-primary-600 transition-colors mb-1 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-primary-400`;
            link.innerHTML = `
                <i class="fa-solid ${route.icon} w-5"></i>
                <span class="font-medium">${I18n.translate(route.label)}</span>
            `;

            if (location.hash === `#${hash}`) {
                link.classList.add('bg-primary-50', 'text-primary-600', 'dark:bg-gray-800', 'dark:text-primary-400');
            }

            nav.appendChild(link);
        });
    },

    async router() {
        if (!Auth.isLoggedIn()) return;

        const hash = location.hash.slice(1) || 'dashboard';
        const route = this.routes[hash];
        const appContent = document.getElementById('app-content');

        if (route) {
            // Update Sidebar Active State
            this.renderSidebar();

            // Update Title
            document.getElementById('page-title').textContent = I18n.translate(route.label);

            // Show Loading
            appContent.innerHTML = `
                <div class="h-full flex items-center justify-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            `;

            try {
                // Dynamically Load Controller if not exists
                if (!window[route.controller]) {
                    // In a real module system we import. Here we assume we might need to load script or it is already loaded?
                    // For simplicity in this single-file setup approach, we will bundle everything or ensure it's loaded.
                    // But to follow the plan, let's lazy load or just check.

                    // We will just assume all controllers are loaded for now or load them on demand.
                    // Since I haven't written them yet, I'll handle the "Missing Controller" case.

                    // Attempt to load script dynamically
                    await this.loadScript(`assets/js/controllers/${hash}.js`);
                }

                if (window[route.controller]) {
                    window[route.controller].render(appContent);
                } else {
                    appContent.innerHTML = `<div class="text-center text-red-500">Controller ${route.controller} not found</div>`;
                }

            } catch (e) {
                console.error(e);
                appContent.innerHTML = `<div class="text-center text-red-500">Error loading module: ${e.message}</div>`;
            }

        } else {
            location.hash = '#dashboard';
        }
    },

    loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load ${src}`));
            document.body.appendChild(script);
        });
    }
};

// Start
document.addEventListener('DOMContentLoaded', () => {
    window.app = App; // Expose
    App.init();
});
