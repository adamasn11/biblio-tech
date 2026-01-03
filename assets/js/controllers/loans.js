window.LoansController = {
    render(container) {
        container.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 border-b border-gray-100 flex items-center justify-between dark:border-gray-700">
                    <h2 class="text-xl font-bold text-gray-800 dark:text-white">${I18n.translate('loans')}</h2>
                    <button onclick="LoansController.openModal()" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                        <i class="fa-solid fa-plus"></i> Nouveau Prêt
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                        <thead class="bg-gray-50 text-gray-800 font-semibold uppercase dark:bg-gray-700 dark:text-gray-200">
                            <tr>
                                <th class="px-6 py-4">Livre</th>
                                <th class="px-6 py-4">Adhérent</th>
                                <th class="px-6 py-4">Date Prêt</th>
                                <th class="px-6 py-4">Date Retour</th>
                                <th class="px-6 py-4">Statut</th>
                                <th class="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="loans-list" class="divide-y divide-gray-100 dark:divide-gray-700"></tbody>
                    </table>
                </div>
            </div>

            <!-- Modal -->
            <div id="loan-modal" class="fixed inset-0 bg-black/50 z-50 hidden flex items-center justify-center backdrop-blur-sm">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 dark:bg-gray-800">
                    <h3 class="text-xl font-bold mb-4 dark:text-white">Nouveau Prêt</h3>
                    <form id="loan-form" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1 dark:text-gray-300">Livre (Disponible)</label>
                            <select id="l-bookId" required class="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></select>
                            <p class="text-xs text-gray-500 mt-1" id="no-books-msg"></p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1 dark:text-gray-300">Adhérent</label>
                            <select id="l-memberId" required class="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></select>
                        </div>
                        <div>
                             <label class="block text-sm font-medium mb-1 dark:text-gray-300">Date Prêt</label>
                             <input type="date" id="l-loanDate" required class="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div class="flex justify-end gap-3 mt-6">
                            <button type="button" onclick="LoansController.closeModal()" class="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">${I18n.translate('cancel')}</button>
                            <button type="submit" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">${I18n.translate('save')}</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        this.attachEvents();
        this.renderList();
    },

    attachEvents() {
        document.getElementById('loan-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createLoan();
        });
    },

    renderList() {
        const loans = Storage.get('db_loans');
        const books = Storage.get('db_books');
        const members = Storage.get('db_members');

        loans.sort((a, b) => new Date(b.loanDate) - new Date(a.loanDate)); // Newest first

        document.getElementById('loans-list').innerHTML = loans.map(l => {
            const book = books.find(b => b.id == l.bookId) || { title: 'Unknown' };
            const member = members.find(m => m.id == l.memberId) || { name: 'Unknown' };
            const isActive = !l.returnDate;
            const statusBadge = isActive
                ? `<span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">En cours</span>`
                : `<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Retourné</span>`;

            return `
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">${book.title}</td>
                    <td class="px-6 py-4">${member.name}</td>
                    <td class="px-6 py-4">${Utils.formatDate(l.loanDate)}</td>
                    <td class="px-6 py-4">${Utils.formatDate(l.returnDate)}</td>
                    <td class="px-6 py-4">${statusBadge}</td>
                    <td class="px-6 py-4 text-right">
                        ${isActive ? `
                        <button onclick="LoansController.returnBook(${l.id})" class="text-green-600 hover:text-green-800 text-sm font-medium bg-green-50 px-3 py-1 rounded hover:bg-green-100 transition-colors">
                            <i class="fa-solid fa-rotate-left mr-1"></i> Retourner
                        </button>` : ''}
                    </td>
                </tr>
            `;
        }).join('');
    },

    openModal() {
        document.getElementById('loan-modal').classList.remove('hidden');
        document.getElementById('loan-form').reset();
        document.getElementById('l-loanDate').valueAsDate = new Date();

        // Load Available Books Only
        const books = Storage.get('db_books').filter(b => b.status === 'Available');
        const bookSelect = document.getElementById('l-bookId');
        bookSelect.innerHTML = books.map(b => `<option value="${b.id}">${b.title}</option>`).join('');

        if (books.length === 0) {
            document.getElementById('no-books-msg').textContent = "Aucun livre disponible!";
            bookSelect.disabled = true;
        } else {
            document.getElementById('no-books-msg').textContent = "";
            bookSelect.disabled = false;
        }

        // Load Members
        const members = Storage.get('db_members');
        document.getElementById('l-memberId').innerHTML = members.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
    },

    closeModal() {
        document.getElementById('loan-modal').classList.add('hidden');
    },

    createLoan() {
        const bookId = document.getElementById('l-bookId').value;
        const memberId = document.getElementById('l-memberId').value;

        if (!bookId) {
            Utils.showToast('error', 'Aucun livre sélectionné');
            return;
        }

        const loans = Storage.get('db_loans');
        const books = Storage.get('db_books');

        // Create Loan
        loans.push({
            id: Date.now(),
            bookId: Number(bookId),
            memberId: Number(memberId),
            loanDate: document.getElementById('l-loanDate').value,
            returnDate: null
        });

        // Update Book Status
        const bookIndex = books.findIndex(b => b.id == bookId);
        if (bookIndex !== -1) {
            books[bookIndex].status = 'Borrowed';
        }

        Storage.set('db_loans', loans);
        Storage.set('db_books', books);

        this.closeModal();
        this.renderList();
        Utils.showToast('success', 'Prêt enregistré');
    },

    returnBook(loanId) {
        Swal.fire({
            title: 'Confirmer le retour',
            text: "Marquer ce livre comme retourné ?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Oui, retourner'
        }).then((result) => {
            if (result.isConfirmed) {
                const loans = Storage.get('db_loans');
                const books = Storage.get('db_books');

                const loanIndex = loans.findIndex(l => l.id == loanId);
                if (loanIndex !== -1) {
                    // Update Loan
                    loans[loanIndex].returnDate = new Date().toISOString().split('T')[0];

                    // Update Book Status
                    const bookIndex = books.findIndex(b => b.id == loans[loanIndex].bookId);
                    if (bookIndex !== -1) {
                        books[bookIndex].status = 'Available';
                    }

                    Storage.set('db_loans', loans);
                    Storage.set('db_books', books);

                    this.renderList();
                    Utils.showToast('success', 'Livre retourné avec succès');
                }
            }
        });
    }
};
