window.MembersController = {
    render(container) {
        container.innerHTML = `
             <div class="bg-white rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 border-b border-gray-100 flex items-center justify-between dark:border-gray-700">
                    <h2 class="text-xl font-bold text-gray-800 dark:text-white">${I18n.translate('members')}</h2>
                    <button onclick="MembersController.openModal()" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                        <i class="fa-solid fa-plus"></i> ${I18n.translate('add_new')}
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                        <thead class="bg-gray-50 text-gray-800 font-semibold uppercase dark:bg-gray-700 dark:text-gray-200">
                            <tr>
                                <th class="px-6 py-4">Nom</th>
                                <th class="px-6 py-4">Email</th>
                                <th class="px-6 py-4">Téléphone</th>
                                <th class="px-6 py-4">Date d'inscription</th>
                                <th class="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="members-list" class="divide-y divide-gray-100 dark:divide-gray-700"></tbody>
                    </table>
                </div>
            </div>

            <!-- Modal -->
            <div id="member-modal" class="fixed inset-0 bg-black/50 z-50 hidden flex items-center justify-center backdrop-blur-sm">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 dark:bg-gray-800">
                    <h3 class="text-xl font-bold mb-4 dark:text-white" id="m-modal-title">Ajouter Adhérent</h3>
                    <form id="member-form" class="space-y-4">
                        <input type="hidden" id="member-id">
                        <div>
                            <label class="block text-sm font-medium mb-1 dark:text-gray-300">Nom Complet</label>
                            <input type="text" id="m-name" required class="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1 dark:text-gray-300">Email</label>
                            <input type="email" id="m-email" required class="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1 dark:text-gray-300">Téléphone</label>
                            <input type="tel" id="m-phone" required class="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div>
                             <label class="block text-sm font-medium mb-1 dark:text-gray-300">Date Inscription</label>
                             <input type="date" id="m-joinDate" required class="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div class="flex justify-end gap-3 mt-6">
                            <button type="button" onclick="MembersController.closeModal()" class="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">${I18n.translate('cancel')}</button>
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
        document.getElementById('member-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveMember();
        });
    },

    renderList() {
        const members = Storage.get('db_members');
        const list = document.getElementById('members-list');

        list.innerHTML = members.map(m => `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">${m.name}</td>
                <td class="px-6 py-4">${m.email}</td>
                <td class="px-6 py-4">${m.phone}</td>
                <td class="px-6 py-4">${Utils.formatDate(m.joinDate)}</td>
                <td class="px-6 py-4 text-right">
                    <button onclick="MembersController.editMember(${m.id})" class="text-blue-600 hover:text-blue-800 mr-3"><i class="fa-solid fa-pen"></i></button>
                    <button onclick="MembersController.deleteMember(${m.id})" class="text-red-600 hover:text-red-800"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    },

    openModal(member = null) {
        document.getElementById('member-modal').classList.remove('hidden');
        if (member) {
            document.getElementById('m-modal-title').textContent = "Modifier Adhérent";
            document.getElementById('member-id').value = member.id;
            document.getElementById('m-name').value = member.name;
            document.getElementById('m-email').value = member.email;
            document.getElementById('m-phone').value = member.phone;
            document.getElementById('m-joinDate').value = member.joinDate;
        } else {
            document.getElementById('m-modal-title').textContent = "Ajouter Adhérent";
            document.getElementById('member-form').reset();
            document.getElementById('member-id').value = '';
            document.getElementById('m-joinDate').valueAsDate = new Date();
        }
    },

    closeModal() {
        document.getElementById('member-modal').classList.add('hidden');
    },

    saveMember() {
        const id = document.getElementById('member-id').value;
        const newMem = {
            id: id ? Number(id) : Date.now(),
            name: document.getElementById('m-name').value,
            email: document.getElementById('m-email').value,
            phone: document.getElementById('m-phone').value,
            joinDate: document.getElementById('m-joinDate').value
        };

        const members = Storage.get('db_members');
        if (id) {
            const idx = members.findIndex(m => m.id == id);
            if (idx !== -1) members[idx] = newMem;
        } else {
            members.push(newMem);
        }

        Storage.set('db_members', members);
        this.closeModal();
        this.renderList();
        Utils.showToast('success', 'Adhérent enregistré');
    },

    deleteMember(id) {
        if (confirm(I18n.translate('confirm_delete'))) {
            const members = Storage.get('db_members').filter(m => m.id != id);
            Storage.set('db_members', members);
            this.renderList();
            Utils.showToast('success', 'Adhérent supprimé');
        }
    },

    editMember(id) {
        const m = Storage.get('db_members').find(x => x.id == id);
        if (m) this.openModal(m);
    }
};
