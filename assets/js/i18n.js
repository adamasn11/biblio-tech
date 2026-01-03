const translations = {
    fr: {
        app_name: "BiblioTech",
        dashboard: "Tableau de bord",
        books: "Livres",
        members: "Adhérents",
        authors: "Auteurs",
        categories: "Catégories",
        loans: "Prêts",
        logout: "Déconnexion",
        search: "Rechercher...",
        add_new: "Ajouter nouveau",
        actions: "Actions",
        save: "Enregistrer",
        cancel: "Annuler",
        delete: "Supprimer",
        edit: "Modifier",
        confirm_delete: "Êtes-vous sûr de vouloir supprimer cet élément ?",
        welcome: "Bienvenue",
        login_title: "Connexion à BiblioTech",
        login_btn: "Se connecter",
        email: "Email",
        password: "Mot de passe",
        stats_books: "Total Livres",
        stats_members: "Total Adhérents",
        stats_loans: "Prêts Actifs",
        stats_revenue: "Revenus (Fictif)",
        status_available: "Disponible",
        status_borrowed: "Emprunté",
        lang_fr: "Français",
        lang_en: "Anglais",
        lang_ar: "Arabe"
    },
    en: {
        app_name: "BiblioTech",
        dashboard: "Dashboard",
        books: "Books",
        members: "Members",
        authors: "Authors",
        categories: "Categories",
        loans: "Loans",
        logout: "Logout",
        search: "Search...",
        add_new: "Add New",
        actions: "Actions",
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        confirm_delete: "Are you sure you want to delete this item?",
        welcome: "Welcome",
        login_title: "Login to BiblioTech",
        login_btn: "Sign In",
        email: "Email",
        password: "Password",
        stats_books: "Total Books",
        stats_members: "Total Members",
        stats_loans: "Active Loans",
        stats_revenue: "Revenue (Mock)",
        status_available: "Available",
        status_borrowed: "Borrowed",
        lang_fr: "French",
        lang_en: "English",
        lang_ar: "Arabic"
    },
    ar: {
        app_name: "مكتبة تك",
        dashboard: "لوحة التحكم",
        books: "الكتب",
        members: "الأعضاء",
        authors: "المؤلفون",
        categories: "التصنيفات",
        loans: "الإعارات",
        logout: "تسجيل الخروج",
        search: "بحث...",
        add_new: "إضافة جديد",
        actions: "إجراءات",
        save: "حفظ",
        cancel: "إلغاء",
        delete: "حذف",
        edit: "تعديل",
        confirm_delete: "هل أنت متأكد من حذف هذا العنصر؟",
        welcome: "مرحباً",
        login_title: "تسجيل الدخول",
        login_btn: "دخول",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        stats_books: "إجمالي الكتب",
        stats_members: "إجمالي الأعضاء",
        stats_loans: "إعارات نشطة",
        stats_revenue: "الإيرادات",
        status_available: "متاح",
        status_borrowed: "مُعار",
        lang_fr: "الفرنسية",
        lang_en: "الإنجليزية",
        lang_ar: "العربية"
    }
};

const I18n = {
    lang: localStorage.getItem('app_lang') || 'fr',
    
    translate(key) {
        return translations[this.lang][key] || key;
    },

    setLanguage(lang) {
        this.lang = lang;
        localStorage.setItem('app_lang', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        location.reload(); 
    }
};
