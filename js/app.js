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

    card.insertAdjacentHTML('afterbegin', `
    <figure class="cardImgContainer">
        <img class="bookImg" src="./img/pexels-heather-mckeen-582070.jpg" alt="book image">
    </figure>
    <div class="cardData"><span class="bookTitle userInput"></span>
        <p>by <span class="bookAuthor userInput"></span></p>
        <p class="bookSummary userInput"></p>
        <p>Pages: <span class="bookPages userInput"></span></p>
        <button class="readButton userInput"></button>
    </div>
    `);

    const inputElements = card.getElementsByClassName("userInput");
    for (let i = 0; i < 5; i++){
        inputElements[i].insertAdjacentText('afterbegin', arguments[i]);
    }

    return card;
}
