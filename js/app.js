let myLibrary = [];

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.info = function () {
    return `${this.title} by ${this.author}, ${this.pages}, ${this.read ? "already read" : "not read yet"}`;
}

function addBookToLibrary(title, author, pages, read) {
    const newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
    return;
}

function displayBooks() {
    for (let book of myLibrary) {
        console.log(book.info());
    }
}

function createCard(title, author, content = "", pages, read) {
    const card = document.createElement('div');
    card.classList.add("card");

    const figure = document.createElement('figure');
    figure.classList.add("cardImgContainer");
    card.appendChild(figure);

    const img = document.createElement('img');
    img.classList.add("bookImg");
    img.setAttribute('src', "./img/pexels-heather-mckeen-582070.jpg");
    img.setAttribute('alt', "book image");
    figure.appendChild(img);

    const cardData = document.createElement('div');
    cardData.classList.add('cardData');
    card.appendChild(cardData);

    const titleSpan = document.createElement('span');
    titleSpan.classList.add("bookTitle");
    titleSpan.textContent = title;
    cardData.append(titleSpan);

    const authorContainer = document.createElement('p');
    authorContainer.textContent = "by ";
    const authorName = document.createElement('span');
    authorName.classList.add("bookAuthor");
    authorName.textContent = author;
    authorContainer.appendChild(authorName);
    cardData.append(authorContainer);

    const bookSummary = document.createElement('p');
    bookSummary.classList.add('bookSummary');
    bookSummary.textContent = content;
    cardData.appendChild(bookSummary);
    
    const pagesContainer = document.createElement('p');
    pagesContainer.textContent = "Pages: ";
    const pagesNumber = document.createElement('span');
    pagesNumber.classList.add("bookPages");
    pagesNumber.textContent = pages;
    pagesContainer.appendChild(pagesNumber);
    cardData.appendChild(pagesContainer);

    const toggleButton = document.createElement('button');
    toggleButton.classList.add("readButton");
    toggleButton.textContent = read ? "Already read" : "Mark as read" ;
    cardData.appendChild(toggleButton);

    return card;
}