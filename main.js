//Variables
//buttons
const addBookBtn = document.querySelector(".add-new-book");
const deleteBookBtn = document.querySelectorAll(".delete-book");
const checkReadBtn = document.querySelectorAll(".read-check");
const formBtn = document.getElementById("form-btn");
//rows
const myBooksRow = document.querySelector(".my-books-row");
const bestSellersRow = document.querySelector(".best-sellers-row");
const recommendationsRow = document.querySelector(".recommendations-row");
//aside
const totalBooksNum = document.querySelector('.total-books');
const readBooksNum = document.querySelector(".read-books-num");
const notReadBooksNum = document.querySelector(".unread-books-num");
const totalPagesNum = document.querySelector(".total-pages");
const aside = document.querySelector('aside');
const asideInfoIcon = document.querySelector(".fa-circle-info");
const xIconDivAside = document.querySelector(".x-icon-div-aside");
const xIconAside = document.querySelector("#x-icon-aside");
//form
const formDiv = document.querySelector(".form");
const overlay = document.querySelector(".overlay");
const xIcon = document.querySelector("#x-icon-form");

const bookCard = document.querySelectorAll(".book-card");
//display and hide Form functions, and eventListeners attached to addBookBtn and xIcon
function displayForm(event) {
  formDiv.style.display = "block";
  overlay.style.display = "block";
}

function hideForm() {
  formDiv.style.display = "none";
  overlay.style.display = "none";
}

addBookBtn.addEventListener("click", () => displayForm());
xIcon.addEventListener("click", () => hideForm());
//(only when form is displayed) if we click outside of form or the close btn(X-icon) -> hideForm
document.body.addEventListener("click", function (event) {
  const clickedInsideForm = formDiv.contains(event.target);
  const clickedAddBookBtn = event.target.closest(".add-new-book");
  if (
    !clickedAddBookBtn &&
    !clickedInsideForm &&
    formDiv.style.display === "block"
  ) {
    hideForm();
  }
});

function toggleReadStatus(checkBtn) {
  const bookCard = checkBtn.closest(".book-card");
  if (bookCard) {
    const isRead = checkBtn.textContent === "Read"; // Check if book is marked as read
    const titleElement = bookCard.querySelector(".p-title");
    const book = myLibrary.find(
      (book) => book.title === titleElement.textContent
    ); // Find the corresponding book object in myLibrary array

    if (isRead) {
      checkBtn.style.backgroundColor = "red";
      checkBtn.textContent = "Not Read";
      bookCard.style.boxShadow = "3px 3px 10px red";
      book.isRead = false; // Update isRead property of the book object
      updateAsideData();
    } else {
      checkBtn.style.backgroundColor = "rgba(68, 197, 68, 0.61)";
      checkBtn.textContent = "Read";
      bookCard.style.boxShadow = "3px 3px 10px green";
      book.isRead = true; // Update isRead property of the book object
      updateAsideData();
    }
  }
}


//deleteBtn clicked -> delete bookCard
function deleteBook(event) {
  //target the bookCard via closest
  const bookCard = event.target.closest(".book-card");
  if (bookCard) {
    const titleElement = bookCard.querySelector(".p-title");
    const book = myLibrary.find(
      (book) => book.title === titleElement.textContent
    ); // Find corresponding book object in myLibrary array
    if( book.targetRowClass === 'my-books') {
      const rowArrayIndex = myBooksArray.findIndex(
        (book) => book.title === titleElement.textContent
      );
      myBooksArray.splice(rowArrayIndex, 1);
    } else if (book.targetRowClass === 'best-sellers') {
      const rowArrayIndex = bestSellersArray.findIndex(
        (book) => book.title === titleElement.textContent
      );
      bestSellersArray.splice(rowArrayIndex, 1);
    } else if (book.targetRowClass === 'recommendations') {
      const rowArrayIndex = recommendationsArray.findIndex(
        (book) => book.title === titleElement.textContent
      );
      recommendationsArray.splice(rowArrayIndex, 1);
    }
    const myLibraryIndex = myLibrary.findIndex(
      (book) => book.title === titleElement.textContent
    ); // Find the index of corresponding book object in myLibrary array
    bookCard.remove(); //remove from display
    myLibrary.splice(myLibraryIndex, 1); //remove object from array
    updateAsideData();
  }
}

deleteBookBtn.forEach((bookCard) => {
  bookCard.addEventListener("click", deleteBook);
});

const myBooksArray = [];
const bestSellersArray = [];
const recommendationsArray = [];
const myLibrary = [];

//Function refactored to class
class BookCard {
  constructor(title, author, pages, genre, isRead, targetRowClass) {
  // Assign parameters to 'this' object for access within the function
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.genre = genre;
  this.isRead = isRead;
  this.targetRowClass = targetRowClass;

  // Use the specified targetRowClass to determine the target row
  //targetArray used to push the new created books to arrays
  //targetRow used to display the new created books to each row in webpage
  let targetRow;
  let targetArray;
  if (targetRowClass === "my-books") {
    targetRow = myBooksRow;
    targetArray = myBooksArray;
  } else if (targetRowClass === "best-sellers") {
    targetRow = bestSellersRow;
    targetArray = bestSellersArray;
  } else if (targetRowClass === "recommendations") {
    targetRow = recommendationsRow;
    targetArray = recommendationsArray;
  } else {
    console.error("Invalid target row class:", targetRowClass);
    return; // Exit function if invalid target row class is provided
  }

  // Construct the HTML content using template literals
  const bookCardHTML = `
    <div class="book-card">
      <div class="title">
        <span class="span-title">Title:</span>
        <p class="p-title">${this.title}</p>
      </div>
      <div class="author">
        <span class="span-author">Author:</span>
        <p class="p-author">${this.author}</p>
      </div>
      <div class="pages">
        <span class="span-pages">Pages:</span>
        <p class="p-pages">${this.pages}</p>
      </div>
      <div class="genre">
        <span class="span-genre">Genre:</span>
        <p class="p-genre">${this.genre}</p>
      </div>
      <div class="button-read">
        <button class="read-check">${isRead ? "Read" : "Not Read"}</button>
      </div>
      <div class="delete-box">
        <button class="delete-book"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    </div>
  `;

  // Append the bookCard HTML content to the specified target row
  targetRow.insertAdjacentHTML("beforeend", bookCardHTML);

  // Get the newly created book card element
  const newBookCard = targetRow.lastElementChild;

  // Get the read-check button and add event listener
  const checkReadBtn = newBookCard.querySelector(".read-check");
  checkReadBtn.addEventListener("click", function () {
      toggleReadStatus(checkReadBtn);
  });

  // Get the delete-book button and add event listener
  const deleteBtn = newBookCard.querySelector(".delete-book");
  deleteBtn.addEventListener("click", deleteBook);

  if (isRead) {
    // Book is marked as read
    checkReadBtn.style.backgroundColor = "rgba(68, 197, 68, 0.61)";
    newBookCard.style.boxShadow = "3px 3px 10px green";
  } else {
    // Book is not marked as read
    checkReadBtn.style.backgroundColor = "red";
    newBookCard.style.boxShadow = "3px 3px 10px red";
  }
  //books are pushed whenever new object is created(func CreateBookCard is called), through console of form
  pushBookToArray(this, targetArray);
  //aside data are updated whenever new object is created(func CreateBookCard is called), through console of form
  updateAsideData();
  }
}

function pushBookToArray(book, row) {
  myLibrary.push(book);
  row.push(book);
}

// Function to handle form submission
function handleFormSubmit(event) {
   const form = event.target;
   if (!form.checkValidity()) {
     // If form validation fails, let the browser handle it
     return;
   }
  event.preventDefault(); // Prevent default form submission behavior

  // Get form input values
  const title = document.getElementById("title-form").value;
  const author = document.getElementById("author-form").value;
  //convert pages value from string to number-- necessary for updateAsideData
  const pages = parseInt(document.getElementById("pages-form").value, 10);
  const genre = document.getElementById("genre-form").value;
  const isRead = document.getElementById("read-check-form").checked;
  const category = document.getElementById("category").value;

  // Create new book card using existing CreateBookCard function
  const newFormBook = new BookCard(title, author, pages, genre, isRead, category);

  let targetRow;
  if (category === "my-books") {
    targetRow = myBooksArray;
  } else if (category === "best-sellers") {
    targetRow = bestSellersArray;
  } else if (category === "recommendations") {
    targetRow = recommendationsArray;
  }

  // Reset form fields after submission
  form.reset();
  hideForm();
}

// Add event listener to form submit button
formDiv.addEventListener('submit', handleFormSubmit);
//formBtn.addEventListener("click", hideForm);


//ADD BOOKS
// Create books using CreateBookCard function with abbreviated names
// Refactor: from Factory Function to Classes.. new Books created using class
const killBird = new BookCard("To Kill a Mockingbird", "Harper Lee", 281, "Fiction", false, "my-books");
const n1984 = new BookCard("1984", "George Orwell", 328, "Dystopian Fiction", true, "my-books");
const greatGatsby = new BookCard("The Great Gatsby", "F. Scott Fitzgerald", 180, "Classic Literature", false, "my-books");
const prideAndPrejudice = new BookCard("Pride and Prejudice", "Jane Austen", 279, "Romance, Classic Literature", false, "best-sellers");
const catcherInRye = new BookCard("The Catcher in the Rye", "J.D. Salinger", 277, "Coming-of-Age Fiction", false, "best-sellers");
const theHobbit = new BookCard("The Hobbit", "J.R.R. Tolkien", 310, "Fantasy", true, "best-sellers");
const harryPotter = new BookCard("Harry Potter and the Philosopher's Stone", "J.K. Rowling", 223, "Fantasy, Young Adult", false, "recommendations");
const daVinciCode = new BookCard("The Da Vinci Code", "Dan Brown", 454, "Mystery, Thriller", false, "recommendations");
const romeoJulia = new BookCard("Romeo and Julia", "William Shakespeare", 480, "Tragedy", true, "recommendations");

//aside data
function updateAsideData() {
  totalBooksNum.textContent = myLibrary.length;
  readBooksNum.textContent = myLibrary.filter((book) => book.isRead === true).length;
  notReadBooksNum.textContent = myLibrary.filter((book) => book.isRead === false).length;
  totalPagesNum.textContent = myLibrary.reduce((accumulator, book) => {
    return accumulator += book.pages; 
  }, 0);
}

//show hide aside when info icon clicked
function displayAside() {
    aside.style.cssText =
      "display: block; position: fixed; right: 0; top: 0x; height: 100%; z-index: 10";
    xIconAside.style.display = "inline-block";
    xIconDivAside.style.cssText = "display: flex; justify-content: flex-end";
    overlay.style.display = 'block';
}

function hideAside (){
  aside.style.display = 'none';
  overlay.style.display = 'none';
}
//call display/hideAside when infoIcon or xIconAside are clicked
asideInfoIcon.addEventListener("click", displayAside);
xIconAside.addEventListener("click", () => hideAside());
//(only on smaller screens, after infoIcon clicked: aside gets position: absolute) if we click outside of aside or the close btn(X-icon) -> hideAside
document.body.addEventListener("click", function (event) {
  const clickedInsideAside = aside.contains(event.target);
  const clickedInfoIcon = event.target.closest(".fa-circle-info");
  if (
    !clickedInfoIcon &&
    !clickedInsideAside &&
    aside.style.position === "fixed"
  ) {
    hideAside();
  }
});

updateAsideData();







