let myLibrary = [];

if (localStorage.getItem('myBooks')) {
    loadStorage();
}

function updateStorage() {
    localStorage.setItem('myBooks', JSON.stringify(myLibrary));
}

function loadStorage() {
    const loadedBooks = JSON.parse(localStorage.getItem('myBooks'));
    for (let book of loadedBooks) {
        const restoredBook = convertBook(book);
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

function convertBook(props) {
    let restoredBook = new Book();
    for (var key in props) {
        if (props.hasOwnProperty(key)) {
            restoredBook[key] = props[key];
        }
    }
    return restoredBook;
}

function addBookToLibrary(title, author, summary, pages, read, index = undefined) {
    const newBook = new Book(title, author, summary, pages, read);
    if (index) {
        myLibrary[index] = newBook;
        updateStorage();
        displaySavedBooks();
        return;
    }
    const newIndex = myLibrary.push(newBook) - 1;
    updateStorage();
    const newCard = createCard(newBook.title, newBook.author, "", newBook.pages, newBook.read, newIndex);
    appendCard(newCard);
    return;
}

function displaySavedBooks() {
    bookContainer.innerHTML = "";
    bookContainer.classList.add('mainGrid');

    for (let book of myLibrary) {
        const index = myLibrary.indexOf(book);
        const newCard = createCard(book.title, book.author, "", book.pages, book.read, index);
        appendCard(newCard);
    }
}

function createCard(title, author, summary, pages, read, index) {
    const card = document.createElement('div');
    card.classList.add("card");
    card.setAttribute('data-index', index);
    card.addEventListener('click', e => showBookInfo(card.dataset.index));

    card.insertAdjacentHTML('afterbegin', `
    <figure class="cardImgContainer">
        <img class="bookImg" src="./img/pexels-heather-mckeen-582070.jpg" alt="book image">
    </figure>
    <div class="cardData"><span class="bookTitle userInput"></span>
        <p class="authorData">by <span class="bookAuthor userInput"></span></p>
        <p class="bookSummary userInput"></p>
        <p class="pagesData">Pages: <span class="bookPages userInput"></span></p>
        <button class="readButton userInput"></button>
    </div>
    `);

    const inputElements = card.getElementsByClassName("userInput");
    for (let i = 0; i < 5; i++) {
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

const bookCard = document.createElement('div');
bookCard.classList.add('bookCardContainer');
bookCard.setAttribute("id", "bookInfoContainer");

bookCard.insertAdjacentHTML('afterbegin', `
<div class="formCard">
  <h1>Selected book info</h1>
  <div class="bookCardHead">
    <div>
      <h2>Title</h2>
      <p class="userData"></p>
    </div>
    <div>
      <h2>Author</h2>
      <p class="userData"></p>
    </div>
    <div class="right">
      <img class="bookImg" src="./img/pexels-heather-mckeen-582070.jpg" alt="book image">
    </div>
  </div>
  <div>
    <h2>Summary</h2>
    <p class="userData"></p>
  </div>
  <div class="bookInfoFooter">
    <div>
      <h2>Pages</h2>
      <p class="userData"></p>
    </div>
    <div>
      <h2>Have you read it?</h2>
      <p class="userData"></p>
    </div>
  </div>
  <div class="bookCardButtons">
    <button type="button" class="editButton">Edit</button>
    <button type="button" class="deleteButton">Delete</button>
    <button type="button" class="exitForm">X</button>
  </div>
</div>
`);

const bookInfoButtons = bookCard.querySelectorAll('.bookCardButtons button');
bookInfoButtons[0].addEventListener('click', editInputs);
bookInfoButtons[1].addEventListener('click', deleteBook);
bookInfoButtons[2].addEventListener('click', closeInputForm);

const formButtons = formCard.getElementsByTagName('button');
formButtons[0].addEventListener('click', saveInputs);
formButtons[1].addEventListener('click', closeInputForm);


function displayInputForm() {
    bookContainer.parentElement.appendChild(formCard);
    document.querySelector('#userInputForm span').value = undefined;
    const formInputs = document.getElementById("userInputForm").elements;
    for (let input of formInputs) input.value = "";
}

function displayBookInfo() {
    bookContainer.parentElement.appendChild(bookCard);
}

function closeInputForm() {
    bookContainer.parentElement.lastChild.remove();
}

function saveInputs() {
    const index = document.querySelector('#userInputForm span').value;
    const form = document.getElementById("userInputForm").elements;
    const data = [form[0].value, form[1].value, form[2].value, form[3].value, form[4].value];
    addBookToLibrary(...data, +index);
    closeInputForm();
}

function showBookInfo(index) {
    displayBookInfo();
    const dataOutputs = document.getElementsByClassName("userData");
    const bookData = myLibrary[index];
    const keys = Object.keys(bookData);
    // Display values on elements
    for (let i = 0; i < keys.length; i++) {
        dataOutputs[i].textContent = bookData[keys[i]];
    }
    dataOutputs[0].value = index; // Set index in title element to retrieve it later
}

function editInputs() {
    const data = document.querySelector(".formCard p.userData");
    closeInputForm();
    displayInputForm();
    const formInputs = document.getElementById("userInputForm").elements;
    const bookData = myLibrary[+data.value];
    const keys = Object.keys(bookData);
    for (let i = 0; i < keys.length; i++) {
        formInputs[i].value = bookData[keys[i]];
    }
    document.querySelector('#userInputForm span').value = data.value;
}

function deleteBook() {
    const data = document.querySelector(".formCard p.userData");
    myLibrary.splice(+data.value, 1);
    updateStorage();
    closeInputForm();
    displaySavedBooks();
}

const addButton = document.getElementById('addNewBook');
addButton.addEventListener('click', displayInputForm);