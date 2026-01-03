const Storage = {
    get(key, defaultVal = []) {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : defaultVal;
    },

    set(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    },

    init() {
        // Seed initial data if empty
        if (!localStorage.getItem('db_books')) {
            this.seed();
        }
    },

    seed() {
        console.log("Seeding Database...");

        const authors = [
            { id: 1, name: "Victor Hugo", bio: "Ecrivain romantique français." },
            { id: 2, name: "J.K. Rowling", bio: "Autrice de Harry Potter." },
            { id: 3, name: "George Orwell", bio: "Auteur de 1984." },
        ];

        const categories = [
            { id: 1, name: "Roman" },
            { id: 2, name: "Science-Fiction" },
            { id: 3, name: "Fantastique" },
            { id: 4, name: "Histoire" },
        ];

        const books = [
            { id: 101, title: "Les Misérables", authorId: 1, categoryId: 1, publishedYear: 1862, copies: 5, status: "Available" },
            { id: 102, title: "Harry Potter à l'école des sorciers", authorId: 2, categoryId: 3, publishedYear: 1997, copies: 3, status: "Borrowed" },
            { id: 103, title: "1984", authorId: 3, categoryId: 2, publishedYear: 1949, copies: 8, status: "Available" },
        ];

        const members = [
            { id: 1, name: "Jean Dupont", email: "jean@example.com", phone: "0601020304", joinDate: "2024-01-15" },
            { id: 2, name: "Sarah Connor", email: "sarah@sky.net", phone: "0699887766", joinDate: "2024-02-20" },
        ];

        const loans = [
            { id: 1, bookId: 102, memberId: 1, loanDate: "2025-10-01", returnDate: null },
        ];

        this.set('db_authors', authors);
        this.set('db_categories', categories);
        this.set('db_books', books);
        this.set('db_members', members);
        this.set('db_loans', loans);
    }
};

Storage.init();
