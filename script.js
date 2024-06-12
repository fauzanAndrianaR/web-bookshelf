document.addEventListener('DOMContentLoaded', () => {
    const inputBookForm = document.getElementById('input-book');
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('CompleteBookshelfList');
    const searchBookForm = document.getElementById('searchBook');
    const searchBookTitle = document.getElementById('searchBookTitle');

    let books = JSON.parse(localStorage.getItem('books')) || [];

    const saveBooksToLocalStorage = () => localStorage.setItem('books', JSON.stringify(books));

    inputBookForm.addEventListener('submit',  (e) => {
        e.preventDefault();
        const inputBookTitle = document.getElementById('Book-title').value;
        const inputBookAuthor = document.getElementById('Book-author').value;
        const inputBookYear = Number(document.getElementById('Book-year').value);
        const inputBookIsComplete = document.getElementById('inputBookIsComplete').checked;

        if (books.some(book => book.title === inputBookTitle)) {
            alert('Buku dengan judul yang sama sudah ada dalam daftar.');
            return;
        }

        books.push({
            id: Date.now(),
            title: inputBookTitle,
            author: inputBookAuthor,
            year: inputBookYear,
            isComplete: inputBookIsComplete,
        });
        saveBooksToLocalStorage();
        updateBookshelf();
        inputBookForm.reset();
    });

    const updateBookshelf = () => {
        incompleteBookshelfList.innerHTML = '';
        completeBookshelfList.innerHTML = '';
        books.forEach(book => {
            const bookItem = createBookItem(book);
            (book.isComplete ? completeBookshelfList : incompleteBookshelfList).appendChild(bookItem);
        });
    };

    const removeBook = id => {
        books = books.filter(book => book.id !== id);
        saveBooksToLocalStorage();
        updateBookshelf();
    };

    const toggleIsComplete = id => {
        const book = books.find(book => book.id === id);
        if (book) {
            book.isComplete = !book.isComplete;
            saveBooksToLocalStorage();
            updateBookshelf();
        }
    };

    searchBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchBookTitle.value.toLowerCase().trim();
        const searchResults = books.filter(book =>
            [book.title, book.author, book.year.toString()].some(field => field.toLowerCase().includes(query))
        );
        updateSearchResults(searchResults);
    });

    const updateSearchResults = results => {
        incompleteBookshelfList.innerHTML = '';
        completeBookshelfList.innerHTML = '';
        results.forEach(book => {
            const bookItem = createBookItem(book);
            (book.isComplete ? completeBookshelfList : incompleteBookshelfList).appendChild(bookItem);
        });
    };

    const createBookItem = book => {
        const bookItem = document.createElement('article');
        bookItem.className = 'book_item';
        bookItem.style.margin = '5px';

        const title = createElement('h3', book.title, { color: 'black', marginBottom: '3px' });
        const author = createElement('p', 'Penulis: ' + book.author, { color: 'black', marginBottom: '3px' });
        const year = createElement('p', 'Tahun: ' + book.year, { color: 'black', marginBottom: '3px' });

        const actionButtons = document.createElement('div');
        actionButtons.className = 'action';

        const removeButton = createActionButton('Hapus buku', 'red', () => removeBook(book.id));
        const toggleButton = createActionButton(
            book.isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca',
            book.isComplete ? 'black' : 'white',
            () => toggleIsComplete(book.id)
        );

        actionButtons.append(toggleButton, removeButton);
        bookItem.append(title, author, year, actionButtons);

        return bookItem;
    };

    const createElement = (tag, textContent, style = {}) => {
        const element = document.createElement(tag);
        element.textContent = textContent;
        Object.assign(element.style, style);
        return element;
    };

    const createActionButton = (text, className, clickHandler) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add(className);
        Object.assign(button.style, {
            padding: '8px',
            margin: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
            border: '0',
            backgroundColor: '#A67B5B',
            color: 'white',
            fontWeight: 'bold'
        });
        button.addEventListener('click', clickHandler);
        return button;
    };

    updateBookshelf();
});
