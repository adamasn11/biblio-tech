window.CategoriesController = {
    render(container) {
        container.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 border-b border-gray-100 flex items-center justify-between dark:border-gray-700">
                    <h2 class="text-xl font-bold text-gray-800 dark:text-white">${I18n.translate('categories')}</h2>
                    <button onclick="CategoriesController.openModal()" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                        <i class="fa-solid fa-plus"></i> ${I18n.translate('add_new')}
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                        <thead class="bg-gray-50 text-gray-800 font-semibold uppercase dark:bg-gray-700 dark:text-gray-200">
                            <tr>
                                <th class="px-6 py-4">Nom de la catégorie</th>
                                <th class="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="categories-list" class="divide-y divide-gray-100 dark:divide-gray-700"></tbody>
                    </table>
                </div>
            </div>

            <div id="category-modal" class="fixed inset-0 bg-black/50 z-50 hidden flex items-center justify-center backdrop-blur-sm">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6 dark:bg-gray-800">
                    <h3 class="text-xl font-bold mb-4 dark:text-white" id="c-modal-title">Ajouter Catégorie</h3>
                    <form id="category-form" class="space-y-4">
                        <input type="hidden" id="category-id">
                        <div>
                            <label class="block text-sm font-medium mb-1 dark:text-gray-300">Nom</label>
                            <input type="text" id="c-name" required class="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div class="flex justify-end gap-3 mt-6">
                            <button type="button" onclick="CategoriesController.closeModal()" class="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">${I18n.translate('cancel')}</button>
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
        document.getElementById('category-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCategory();
        });
    },

    renderList() {
        const categories = Storage.get('db_categories');
        document.getElementById('categories-list').innerHTML = categories.map(c => `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">${c.name}</td>
                <td class="px-6 py-4 text-right">
                    <button onclick="CategoriesController.editCategory(${c.id})" class="text-blue-600 hover:text-blue-800 mr-3"><i class="fa-solid fa-pen"></i></button>
                    <button onclick="CategoriesController.deleteCategory(${c.id})" class="text-red-600 hover:text-red-800"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    },

    openModal(cat = null) {
        document.getElementById('category-modal').classList.remove('hidden');
        if (cat) {
            document.getElementById('c-modal-title').textContent = "Modifier Catégorie";
            document.getElementById('category-id').value = cat.id;
            document.getElementById('c-name').value = cat.name;
        } else {
            document.getElementById('c-modal-title').textContent = "Ajouter Catégorie";
            document.getElementById('category-form').reset();
            document.getElementById('category-id').value = '';
        }
    },

    closeModal() {
        document.getElementById('category-modal').classList.add('hidden');
    },

    saveCategory() {
        const id = document.getElementById('category-id').value;
        const newCat = {
            id: id ? Number(id) : Date.now(),
            name: document.getElementById('c-name').value
        };

        const categories = Storage.get('db_categories');
        if (id) {
            const idx = categories.findIndex(c => c.id == id);
            if (idx !== -1) categories[idx] = newCat;
        } else {
            categories.push(newCat);
        }

        Storage.set('db_categories', categories);
        this.closeModal();
        this.renderList();
        Utils.showToast('success', 'Catégorie enregistrée');
    },

    editCategory(id) {
        const c = Storage.get('db_categories').find(x => x.id == id);
        if (c) this.openModal(c);
    },

    deleteCategory(id) {
        // Optional: Check if used in books
        if (confirm(I18n.translate('confirm_delete'))) {
            const items = Storage.get('db_categories').filter(x => x.id != id);
            Storage.set('db_categories', items);
            this.renderList();
            Utils.showToast('success', 'Catégorie supprimée');
        }
    }
};
