window.BooksController = {
    render(container) {
        container.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                <!-- Header -->
                <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 dark:border-gray-700">
                    <h2 class="text-xl font-bold text-gray-800 dark:text-white">${I18n.translate('books')}</h2>
                    <div class="flex flex-col md:flex-row gap-3">
                        <div class="relative">
                            <input type="text" id="search-books" placeholder="${I18n.translate('search')}" 
                                class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 w-full md:w-64 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <i class="fa-solid fa-search absolute left-3 top-3 text-gray-400"></i>
                        </div>
                        <button onclick="BooksController.openModal()" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
                            <i class="fa-solid fa-plus"></i> ${I18n.translate('add_new')}
                        </button>
                    </div>
                </div>

                <!-- Filters -->
                <div class="p-4 bg-gray-50 flex gap-4 overflow-x-auto dark:bg-gray-900/50">
                    <select id="filter-category" class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option value="">Toutes les catégories</option>
                        <!-- Loaded dynamically -->
                    </select>
                    <select id="filter-status" class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option value="">Tous les statuts</option>
                        <option value="Available">${I18n.translate('status_available')}</option>
                        <option value="Borrowed">${I18n.translate('status_borrowed')}</option>
                    </select>
                </div>

                <!-- Table -->
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                        <thead class="bg-gray-50 text-gray-800 font-semibold uppercase tracking-wider dark:bg-gray-700 dark:text-gray-200">
                            <tr>
                                <th class="px-6 py-4">Titre</th>
                                <th class="px-6 py-4">Auteur</th>
                                <th class="px-6 py-4">Catégorie</th>
                                <th class="px-6 py-4">Status</th>
                                <th class="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="books-list" class="divide-y divide-gray-100 dark:divide-gray-700">
                            <!-- Rendered rows -->
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="p-4 border-t border-gray-100 flex justify-between items-center dark:border-gray-700" id="pagination">
                    <!-- Logic to be added if many items -->
                    <span class="text-sm text-gray-500" id="showing-count">Showing all</span>
                </div>
            </div>

            <!-- Modal -->
            <div id="book-modal" class="fixed inset-0 bg-black/50 z-50 hidden flex items-center justify-center backdrop-blur-sm">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 transform transition-all p-6 dark:bg-gray-800">
                    <h3 class="text-xl font-bold mb-4 dark:text-white" id="modal-title">Ajouter Livre</h3>
                    <form id="book-form" class="space-y-4">
                        <input type="hidden" id="book-id">
                        
                        <div>
                            <label class="block text-sm font-medium mb-1 dark:text-gray-300">Titre</label>
                            <input type="text" id="titre" required class="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium mb-1 dark:text-gray-300">Auteur</label>
                                <select id="authorId" required class="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1 dark:text-gray-300">Catégorie</label>
                                <select id="categoryId" required class="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></select>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium mb-1 dark:text-gray-300">Année</label>
                                <input type="number" id="year" required class="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1 dark:text-gray-300">Copies</label>
                                <input type="number" id="copies" required min="1" class="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            </div>
                        </div>

                        <div class="flex justify-end gap-3 mt-6">
                            <button type="button" onclick="BooksController.closeModal()" class="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">${I18n.translate('cancel')}</button>
                            <button type="submit" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">${I18n.translate('save')}</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        this.attachEvents();
        this.loadFilters();
        this.renderList();
    },

    attachEvents() {
        document.getElementById('search-books').addEventListener('input', (e) => this.renderList(e.target.value));
        document.getElementById('filter-category').addEventListener('change', () => this.renderList());
        document.getElementById('filter-status').addEventListener('change', () => this.renderList());

        document.getElementById('book-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveBook();
        });
    },

    loadFilters() {
        const categories = Storage.get('db_categories');
        const authors = Storage.get('db_authors');

        const catSelect = document.getElementById('filter-category');
        const modalCat = document.getElementById('categoryId');
        const modalAuth = document.getElementById('authorId');

        categories.forEach(c => {
            catSelect.innerHTML += `<option value="${c.id}">${c.name}</option>`;
            modalCat.innerHTML += `<option value="${c.id}">${c.name}</option>`;
        });

        authors.forEach(a => {
            modalAuth.innerHTML += `<option value="${a.id}">${a.name}</option>`;
        });
    },

    getFilteredBooks(searchTerm = '') {
        let books = Storage.get('db_books');
        const catFilter = document.getElementById('filter-category').value;
        const statusFilter = document.getElementById('filter-status').value;

        if (catFilter) books = books.filter(b => b.categoryId == catFilter);
        if (statusFilter) books = books.filter(b => b.status === statusFilter);
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            books = books.filter(b => b.title.toLowerCase().includes(term));
        }

        return books;
    },

    renderList(searchTerm = '') {
        const list = document.getElementById('books-list');
        const books = this.getFilteredBooks(searchTerm);
        const categories = Storage.get('db_categories');
        const authors = Storage.get('db_authors');

        list.innerHTML = books.map(book => {
            const catName = categories.find(c => c.id == book.categoryId)?.name || '-';
            const authName = authors.find(a => a.id == book.authorId)?.name || '-';
            const statusClass = book.status === 'Available'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';

            return `
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                    <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">${book.title}</td>
                    <td class="px-6 py-4">${authName}</td>
                    <td class="px-6 py-4"><span class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs dark:bg-gray-700 dark:text-gray-300">${catName}</span></td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 rounded-full text-xs font-semibold ${statusClass}">
                            ${I18n.translate(book.status === 'Available' ? 'status_available' : 'status_borrowed')}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <div class="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                            <button onclick="BooksController.viewDetails(${book.id})" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg dark:hover:bg-blue-900/30" title="Details"><i class="fa-solid fa-eye"></i></button>
                            <button onclick="BooksController.editBook(${book.id})" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700" title="Edit"><i class="fa-solid fa-pen"></i></button>
                            <button onclick="BooksController.deleteBook(${book.id})" class="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/30" title="Delete"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        if (books.length === 0) {
            list.innerHTML = `<tr><td colspan="5" class="text-center py-8 text-gray-500">Aucun livre trouvé</td></tr>`;
        }

        document.getElementById('showing-count').textContent = `Affichage de ${books.length} livres`;
    },

    openModal(book = null) {
        const modal = document.getElementById('book-modal');
        const title = document.getElementById('modal-title');

        modal.classList.remove('hidden');
        if (book) {
            title.textContent = "Modifier Livre";
            document.getElementById('book-id').value = book.id;
            document.getElementById('titre').value = book.title;
            document.getElementById('authorId').value = book.authorId;
            document.getElementById('categoryId').value = book.categoryId;
            document.getElementById('year').value = book.publishedYear;
            document.getElementById('copies').value = book.copies;
        } else {
            title.textContent = "Ajouter Livre";
            document.getElementById('book-form').reset();
            document.getElementById('book-id').value = '';
        }
    },

    closeModal() {
        document.getElementById('book-modal').classList.add('hidden');
    },

    saveBook() {
        const id = document.getElementById('book-id').value;
        const newBook = {
            id: id ? Number(id) : Date.now(),
            title: document.getElementById('titre').value,
            authorId: Number(document.getElementById('authorId').value),
            categoryId: Number(document.getElementById('categoryId').value),
            publishedYear: Number(document.getElementById('year').value),
            copies: Number(document.getElementById('copies').value),
            status: 'Available' // Default
        };

        const books = Storage.get('db_books');

        if (id) {
            const index = books.findIndex(b => b.id == id);
            if (index !== -1) {
                newBook.status = books[index].status; // Keep status
                books[index] = newBook;
            }
        } else {
            books.push(newBook);
        }

        Storage.set('db_books', books);
        this.closeModal();
        this.renderList();
        Utils.showToast('success', 'Livre enregistré avec succès');

        // Refresh dashboard charts if needed (handled by logic reloading)
    },

    deleteBook(id) {
        Swal.fire({
            title: I18n.translate('confirm_delete'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: I18n.translate('delete'),
            cancelButtonText: I18n.translate('cancel')
        }).then((result) => {
            if (result.isConfirmed) {
                const books = Storage.get('db_books').filter(b => b.id != id);
                Storage.set('db_books', books);
                this.renderList();
                Utils.showToast('success', 'Livre supprimé');
            }
        });
    },

    editBook(id) {
        const book = Storage.get('db_books').find(b => b.id == id);
        if (book) this.openModal(book);
    },

    viewDetails(id) {
        const book = Storage.get('db_books').find(b => b.id == id);
        const categories = Storage.get('db_categories');
        const authors = Storage.get('db_authors');
        const catName = categories.find(c => c.id == book.categoryId)?.name;
        const authName = authors.find(a => a.id == book.authorId)?.name;

        Swal.fire({
            title: `<span class="text-2xl font-bold">${book.title}</span>`,
            html: `
                <div class="text-left bg-gray-50 p-6 rounded-lg dark:bg-gray-700 dark:text-white">
                    <p class="mb-2"><strong>Auteur:</strong> ${authName}</p>
                    <p class="mb-2"><strong>Catégorie:</strong> ${catName}</p>
                    <p class="mb-2"><strong>Année:</strong> ${book.publishedYear}</p>
                    <p class="mb-2"><strong>Copies:</strong> ${book.copies}</p>
                    <p class="mb-2"><strong>Statut:</strong> ${I18n.translate(book.status === 'Available' ? 'status_available' : 'status_borrowed')}</p>
                </div>
            `,
            showCloseButton: true,
            showDenyButton: true,
            denyButtonText: '<i class="fa-solid fa-file-pdf"></i> PDF',
            confirmButtonText: 'Fermer'
        }).then((result) => {
            if (result.isDenied) {
                this.generatePDF(book, authName, catName);
            }
        });
    },

    generatePDF(book, authName, catName) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text("Fiche Livre - BiblioTech", 20, 20);

        doc.setFontSize(12);
        doc.text(`Titre: ${book.title}`, 20, 40);
        doc.text(`Auteur: ${authName}`, 20, 50);
        doc.text(`Catégorie: ${catName}`, 20, 60);
        doc.text(`Année: ${book.publishedYear}`, 20, 70);
        doc.text(`Copies: ${book.copies}`, 20, 80);

        doc.save(`Livre_${book.title}.pdf`);
        Utils.showToast('success', 'PDF Téléchargé');
    }
};
