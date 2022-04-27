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
    const newCard = createCard(newBook.title, newBook.author, newBook.pages, newBook.read);
    appendCard(newCard);
    return;
}

function displaySavedBooks() {
    bookContainer.innerHTML = "";
    bookContainer.classList.add('mainGrid');

    for (let book of myLibrary) {
        let newCard = createCard(book.title, book.author, book.pages, book.read);
        appendCard(newCard);
    }
}

function createCard(title, author, pages, read) {
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
    for (let i = 0; i < 4; i++) {
        inputElements[i].insertAdjacentText('afterbegin', arguments[i]);
    }

    return card;
}


function appendCard(card) {
    if (!hasBooks) {
        bookContainer.innerHTML = "";
        bookContainer.classList.add('mainGrid');
        hasBooks = true;
    }
    bookContainer.appendChild(card);
}

const bookContainer = document.getElementById('bookContainer');
let hasBooks = false;

if (myLibrary.length > 0) {
    displaySavedBooks();
    hasBooks = true;
}

const formCard = document.createElement('div');
formCard.classList.add('formCardContainer');
formCard.setAttribute("id", "formContainer");

formCard.insertAdjacentHTML('afterbegin', `
<form class="formCard" id="userInputForm">
    <legend><h1>Add your new book data</h1></legend>
    <p>
    <label for="title">
        <span>Book title: </span>
        <input type="text" id="title" name="bookTitle">
    </label>
    </p>
    <p>
    <label for="author">
        <span>Book author: </span>
        <input type="text" id="author" name="bookAuthorName">
    </label>
    </p>
    <p>
    <label for="pages">
        <span>Number of pages: </span>
        <input type="number" id="pages" name="bookTotalPages">
    </label>
    </p>
    <p>
    <label for="read">
        <span>Have you read this book? </span>
        <select name="bookHasBeenRead" id="read">
        <option value="true">Yes</option>
        <option value="false" selected="selected">No</option>
        </select>
    </label>
    </p>
    <p>
    <button type="button" id="saveBook">Save book</button>
    </p>
    <button type="button" id="exitForm">X</button>
</form>
`);


const formButtons = formCard.getElementsByTagName('button');
formButtons[0].addEventListener('click', saveInputs);
formButtons[1].addEventListener('click',closeInputForm);


function displayInputForm() {
    bookContainer.parentElement.appendChild(formCard);
    const formInputs = document.getElementById("userInputForm").elements;
    for (let input of formInputs) input.value = "";
}

function closeInputForm() {
    bookContainer.parentElement.lastChild.remove();
}

function saveInputs() {
    const form = document.getElementById("userInputForm").elements;
    const data = [form[0].value, form[1].value, form[2].value,form[3].value]
    addBookToLibrary(...data);
    closeInputForm();
}

const addButton = document.getElementById('addNewBook');
addButton.addEventListener('click', displayInputForm);