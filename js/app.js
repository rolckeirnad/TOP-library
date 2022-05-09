let myLibrary = [];
// App status
let app = {
    hasBooks: false,
    showingCard: false,
    showingIndex: null,
    showingForm: false,
    formIndex: null,
    bookGrid: null,
    backgroundElement: null,
    formElement: null,
}

function updateStorage() {
    localStorage.setItem('myBooks', JSON.stringify(myLibrary));
}

function loadStorage() {
    const loadedBooks = JSON.parse(localStorage.getItem('myBooks'));
    for (let book of loadedBooks) {
        const restoredBook = restoreBook(book);
        myLibrary.push(restoredBook);
    }
}
function Book(title, author, summary = "", pages, read) {
    this.title = title;
    this.author = author;
    this.summary = summary;
    this.pages = pages;
    this.read = read;
}

Book.prototype.info = function () {
    return `${this.title} by ${this.author}, ${this.pages}, ${this.read ? "already read" : "not read yet"}`;
}

function restoreBook(props) {
    let restoredBook = new Book();
    for (var key in props) {
        if (props.hasOwnProperty(key)) {
            restoredBook[key] = props[key];
        }
    }
    return restoredBook;
}

function addBookToLibrary(title, author, summary, pages, read, index = null) {
    const newBook = new Book(title, author, summary, pages, read);
    if (index != null) {
        myLibrary[index] = newBook;
        updateStorage();
        displaySavedBooks();
    } else {
        const newIndex = myLibrary.push(newBook) - 1;
        updateStorage();
        const newCard = createCard(newBook.title, newBook.author, newBook.summary, newBook.pages, newBook.read, newIndex);
        appendCard(newCard);
    }
    return;
}

function displaySavedBooks() {
    app.bookGrid.innerHTML = "";
    app.bookGrid.classList.add('mainGrid');

    for (let book of myLibrary) {
        const index = myLibrary.indexOf(book);
        const newCard = createCard(book.title, book.author, book.summary, book.pages, book.read, index);
        appendCard(newCard);
    }
}

function disableScroll(container) {
    // Get the current page scroll position
    scrollTop = window.pageYOffset || container.scrollTop;
    scrollLeft = window.pageXOffset || container.scrollLeft,

        // if any scroll is attempted, set this to the previous value
        container.onscroll = function () {
            container.scrollTo(scrollLeft, scrollTop);
        };
}

function enableScroll(container) {
    container.onscroll = function () { };
}

function createBackground() {
    app.backgroundElement = document.createElement('div');
    app.backgroundElement.classList.add('bookCardContainer');
    app.backgroundElement.setAttribute("id", "bookInfoContainer");
    app.backgroundElement.addEventListener('click', closeBookInfo);
}

function createCard(title, author, summary, pages, read, index) {
    const card = document.createElement('div');
    card.classList.add("card");
    card.setAttribute('data-index', index);
    card.addEventListener('click', e => displayBookInfo(card.dataset.index), true);

    card.insertAdjacentHTML('afterbegin', `
    <figure class="cardImgContainer">
  <img class="bookImg" src="./img/pexels-heather-mckeen-582070.jpg" alt="book image">
</figure>
<div class="cardData">
  <p class="bookTitle">
    <span class="bold initial">Title: </span>
    <span class="userInput"></span>
  </p>
  <p class="authorData">
    <span class="bold initial">Author: </span>
    by <span class="bookAuthor userInput"></span>
  </p>
  <p class="bookSummary userInput initial"></p>
  <p class="pagesData initial">Pages: <span class="bookPages userInput"></span></p>
  <p class="wasRead initial">Have you read this book?: <span class="wasRead userInput"></span></p>
  <div class="buttonContainer initial">
    <button class="readButton">${read ? "Mark as unread" : "Mark as read"}</button>
    <button class="editButton">Edit Book Info</button>
    <button class="deleteButton">Delete this book</button>
  </div>
</div>
    `);

    if (read) {
        card.querySelector('.buttonContainer .readButton').classList.add('unread');
    }

    const inputElements = card.getElementsByClassName("userInput");
    for (let i = 0; i < 4; i++) {
        inputElements[i].insertAdjacentText('afterbegin', arguments[i]);
    }
    inputElements[4].insertAdjacentText('afterbegin', read ? "Yes, already read" : "No, not read yet");

    const button = card.querySelectorAll('.buttonContainer button');
    button[0].addEventListener('click', toggleRead);//Mark as read/unread
    button[1].addEventListener('click', editInputs);//Edit book info
    button[2].addEventListener('click', deleteBook);//Delete this book

    return card;
}

function appendCard(card) {
    if (!app.hasBooks) {
        /** 
         ** This removes the empty initial message and add grid class to display book
         ** cards when there is no book in storage and we are adding our first book.
         */
        app.bookGrid.innerHTML = "";
        app.bookGrid.classList.add('mainGrid');
        app.hasBooks = true;
    }
    app.bookGrid.appendChild(card);
}

function createForm() {
    app.formElement = document.createElement('div');
    app.formElement.classList.add('formCardContainer');
    app.formElement.setAttribute("id", "formContainer");

    app.formElement.insertAdjacentHTML('afterbegin', `
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
        <label for="summary">
        <span>Book summary: </span>
        <textarea id="summary" name="bookSummary" rows="10" cols="50"> </textarea>
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
        <button type="button" class="saveButton">Save book</button>
        </p>
        <button type="button" class="exitForm">X</button>
        </form>
        `);
    const formButtons = app.formElement.getElementsByTagName('button');
    formButtons[0].addEventListener('click', saveInputs);
    formButtons[1].addEventListener('click', closeInputForm);
}

function displayInputForm() {
    app.bookGrid.parentElement.appendChild(app.formElement);
    const formInputs = document.getElementById("userInputForm").elements;
    for (let input of formInputs) input.value = "";
    return formInputs;
}

function closeInputForm() {
    app.bookGrid.parentElement.lastChild.remove();
    app.showingForm = false;
    app.formIndex = null;
}

function displayBookInfo(index) {
    if (!app.showingCard && !app.showingForm) {
        app.showingIndex = +index;
        app.showingCard = true;
        app.bookGrid.parentElement.appendChild(app.backgroundElement);
        const card = document.querySelector(`div[data-index='${index}']`);
        const cardImage = card.querySelector('.card .cardImgContainer .bookImg');
        card.querySelector('.cardData').classList.add('expanded');
        const hiddenData = card.querySelectorAll('.cardData>.initial');
        for (let element of hiddenData) element.classList.add('display');
        card.classList.add('expanded');
        cardImage.classList.add('display');
        const cardData = card.getBoundingClientRect();
        card.style.setProperty('--left-padding', `${(window.innerWidth - cardData.width) / 2 - cardData.x}px`);
        card.style.setProperty('--top-padding', `${(window.innerHeight - cardData.height) / 2 - cardData.y}px`);
        disableScroll(app.bookGrid);
    }
}

function closeBookInfo() {
    const index = app.showingIndex;
    app.bookGrid.parentElement.lastChild.remove();
    const card = document.querySelector(`div[data-index='${index}']`);
    const cardImage = card.querySelector('.card .cardImgContainer .bookImg');
    card.querySelector('.cardData').classList.remove('expanded');
    const hiddenData = card.querySelectorAll('.cardData>.initial');
    for (let element of hiddenData) element.classList.remove('display');
    card.classList.remove('expanded');
    cardImage.classList.remove('display');
    card.style.removeProperty('--left-padding');
    card.style.removeProperty('--top-padding');
    app.showingIndex = null;
    app.showingCard = false;
    enableScroll(app.bookGrid);
}

function toggleRead() {
    myLibrary[app.showingIndex].read = !myLibrary[app.showingIndex].read;
    updateStorage();
    refreshCard();
}

function refreshCard() {
    const targetCard = document.querySelector('.card.expanded');
    const inputElements = targetCard.getElementsByClassName("userInput");
    const bookKeys = Object.keys(myLibrary[app.showingIndex]);
    for (let i = 0; i < bookKeys.length - 1; i++) {
        inputElements[i].textContent = "";
        inputElements[i].insertAdjacentText('afterbegin', myLibrary[app.showingIndex][bookKeys[i]]);
    }
    inputElements[4].textContent = "";
    inputElements[4].insertAdjacentText('afterbegin', myLibrary[app.showingIndex].read ? "Yes, already read" : "No, not read yet");
    const readButton = targetCard.querySelector('.buttonContainer .readButton');
    readButton.classList.toggle('unread');
    readButton.textContent = myLibrary[app.showingIndex].read ? "Mark as unread" : "Mark as read";
}

function editInputs() {
    app.formIndex = app.showingIndex;
    app.showingForm = true;
    closeBookInfo();
    const formInputs = displayInputForm();
    const bookData = myLibrary[app.formIndex];
    const keys = Object.keys(bookData);
    for (let i = 0; i < keys.length; i++) {
        formInputs[i].value = bookData[keys[i]];
    }
}

function saveInputs() {
    const formInputs = document.getElementById("userInputForm").elements;
    const wasRead = formInputs[4].value == 'true' ? true : false;        // Get string and return boolean
    const data = [formInputs[0].value, formInputs[1].value, formInputs[2].value, formInputs[3].value, wasRead];
    addBookToLibrary(...data, app.formIndex);
    closeInputForm();
}

function deleteBook() {
    const tempIndex = app.showingIndex;
    closeBookInfo();
    myLibrary.splice(tempIndex, 1);
    updateStorage();
    displaySavedBooks();
}



function initialize() {
    app.bookGrid = document.getElementById('bookContainer');
    if (localStorage.getItem('myBooks')) {
        loadStorage();
    }
    if (myLibrary.length > 0) {
        displaySavedBooks();
        app.hasBooks = true;
    }
    createBackground();
    createForm();
    const addButton = document.getElementById('addNewBook');
    addButton.addEventListener('click', displayInputForm);
}

initialize();
