window.AuthorsController = {
    render(container) {
        container.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 border-b border-gray-100 flex items-center justify-between dark:border-gray-700">
                    <h2 class="text-xl font-bold text-gray-800 dark:text-white">${I18n.translate('authors')}</h2>
                    <button onclick="AuthorsController.openModal()" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                        <i class="fa-solid fa-plus"></i> ${I18n.translate('add_new')}
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                        <thead class="bg-gray-50 text-gray-800 font-semibold uppercase dark:bg-gray-700 dark:text-gray-200">
                            <tr>
                                <th class="px-6 py-4">Nom</th>
                                <th class="px-6 py-4">Biographie</th>
                                <th class="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="authors-list" class="divide-y divide-gray-100 dark:divide-gray-700"></tbody>
                    </table>
                </div>
            </div>

            <div id="author-modal" class="fixed inset-0 bg-black/50 z-50 hidden flex items-center justify-center backdrop-blur-sm">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 dark:bg-gray-800">
                    <h3 class="text-xl font-bold mb-4 dark:text-white" id="a-modal-title">Ajouter Auteur</h3>
                    <form id="author-form" class="space-y-4">
                        <input type="hidden" id="author-id">
                        <div>
                            <label class="block text-sm font-medium mb-1 dark:text-gray-300">Nom</label>
                            <input type="text" id="a-name" required class="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1 dark:text-gray-300">Biographie</label>
                            <textarea id="a-bio" rows="3" class="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                        </div>
                        <div class="flex justify-end gap-3 mt-6">
                            <button type="button" onclick="AuthorsController.closeModal()" class="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">${I18n.translate('cancel')}</button>
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
        document.getElementById('author-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveAuthor();
        });
    },

    renderList() {
        const authors = Storage.get('db_authors');
        document.getElementById('authors-list').innerHTML = authors.map(a => `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">${a.name}</td>
                <td class="px-6 py-4 truncate max-w-xs">${a.bio}</td>
                <td class="px-6 py-4 text-right">
                    <button onclick="AuthorsController.editAuthor(${a.id})" class="text-blue-600 hover:text-blue-800 mr-3"><i class="fa-solid fa-pen"></i></button>
                    <button onclick="AuthorsController.deleteAuthor(${a.id})" class="text-red-600 hover:text-red-800"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    },

    openModal(author = null) {
        document.getElementById('author-modal').classList.remove('hidden');
        if (author) {
            document.getElementById('a-modal-title').textContent = "Modifier Auteur";
            document.getElementById('author-id').value = author.id;
            document.getElementById('a-name').value = author.name;
            document.getElementById('a-bio').value = author.bio;
        } else {
            document.getElementById('a-modal-title').textContent = "Ajouter Auteur";
            document.getElementById('author-form').reset();
            document.getElementById('author-id').value = '';
        }
    },

    closeModal() {
        document.getElementById('author-modal').classList.add('hidden');
    },

    saveAuthor() {
        const id = document.getElementById('author-id').value;
        const newAuth = {
            id: id ? Number(id) : Date.now(),
            name: document.getElementById('a-name').value,
            bio: document.getElementById('a-bio').value
        };

        const authors = Storage.get('db_authors');
        if (id) {
            const idx = authors.findIndex(a => a.id == id);
            if (idx !== -1) authors[idx] = newAuth;
        } else {
            authors.push(newAuth);
        }

        Storage.set('db_authors', authors);
        this.closeModal();
        this.renderList();
        Utils.showToast('success', 'Auteur enregistré');
    },

    editAuthor(id) {
        const a = Storage.get('db_authors').find(x => x.id == id);
        if (a) this.openModal(a);
    },

    deleteAuthor(id) {
        if (confirm(I18n.translate('confirm_delete'))) {
            const items = Storage.get('db_authors').filter(x => x.id != id);
            Storage.set('db_authors', items);
            this.renderList();
            Utils.showToast('success', 'Auteur supprimé');
        }
    }
};
