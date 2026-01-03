window.DashboardController = {
    render(container) {
        container.innerHTML = `
            <div class="space-y-6">
                <!-- KPI Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    ${this.renderKPICard('fa-book', I18n.translate('stats_books'), this.getBooksCount(), 'bg-blue-500')}
                    ${this.renderKPICard('fa-users', I18n.translate('stats_members'), this.getMembersCount(), 'bg-purple-500')}
                    ${this.renderKPICard('fa-hand-holding-hand', I18n.translate('stats_loans'), this.getActiveLoansCount(), 'bg-orange-500')}
                    ${this.renderKPICard('fa-coins', I18n.translate('stats_revenue'), '12,450 MAD', 'bg-green-500')}
                </div>

                <!-- Charts Section -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Books by Category -->
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Répartition des Livres</h3>
                        <div class="chart-container">
                            <canvas id="chart-categories"></canvas>
                        </div>
                    </div>

                    <!-- Loans Trend -->
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Activité des Prêts</h3>
                        <div class="chart-container">
                            <canvas id="chart-loans"></canvas>
                        </div>
                    </div>
                    
                    <!-- Book Status -->
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                         <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">État de la Bibliothèque</h3>
                         <div class="chart-container">
                             <canvas id="chart-status"></canvas>
                         </div>
                    </div>

                     <!-- Top Authors -->
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                         <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Top Auteurs</h3>
                         <div class="chart-container">
                             <canvas id="chart-authors"></canvas>
                         </div>
                    </div>
                </div>
            </div>
        `;

        this.initCharts();
    },

    renderKPICard(icon, title, value, colorClass) {
        return `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
                <div class="${colorClass} w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl shadow-lg">
                    <i class="fa-solid ${icon}"></i>
                </div>
                <div class="ml-4">
                    <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">${title}</h4>
                    <span class="text-2xl font-bold text-gray-800 dark:text-white">${value}</span>
                </div>
            </div>
        `;
    },

    getBooksCount() {
        return Storage.get('db_books').length;
    },

    getMembersCount() {
        return Storage.get('db_members').length;
    },

    getActiveLoansCount() {
        return Storage.get('db_loans').filter(l => !l.returnDate).length;
    },

    initCharts() {
        // Prepare Data
        const books = Storage.get('db_books');
        const categories = Storage.get('db_categories');
        const authors = Storage.get('db_authors');

        // 1. Categories (Pie)
        const catCounts = {};
        books.forEach(b => {
            const catName = categories.find(c => c.id === b.categoryId)?.name || 'Unknown';
            catCounts[catName] = (catCounts[catName] || 0) + 1;
        });

        new Chart(document.getElementById('chart-categories'), {
            type: 'doughnut',
            data: {
                labels: Object.keys(catCounts),
                datasets: [{
                    data: Object.values(catCounts),
                    backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
                    borderWidth: 0
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        // 2. Loans (Line) - Mock Trend
        new Chart(document.getElementById('chart-loans'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Prêts',
                    data: [12, 19, 3, 5, 2, 3],
                    borderColor: '#4f46e5',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(79, 70, 229, 0.1)'
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        // 3. Status (Pie)
        const statusCounts = { Available: 0, Borrowed: 0 };
        books.forEach(b => statusCounts[b.status] = (statusCounts[b.status] || 0) + 1);

        new Chart(document.getElementById('chart-status'), {
            type: 'pie',
            data: {
                labels: [I18n.translate('status_available'), I18n.translate('status_borrowed')],
                datasets: [{
                    data: [statusCounts.Available, statusCounts.Borrowed],
                    backgroundColor: ['#10b981', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        // 4. Authors (Bar)
        const authCounts = {};
        books.forEach(b => {
            const authName = authors.find(a => a.id === b.authorId)?.name || 'Unknown';
            authCounts[authName] = (authCounts[authName] || 0) + 1;
        });

        new Chart(document.getElementById('chart-authors'), {
            type: 'bar',
            data: {
                labels: Object.keys(authCounts),
                datasets: [{
                    label: 'Livres',
                    data: Object.values(authCounts),
                    backgroundColor: '#0ea5e9',
                    borderRadius: 5
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
};
