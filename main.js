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
//form
const formDiv = document.querySelector(".form");
const overlay = document.querySelector(".overlay");
const xIcon = document.querySelector(".fa-xmark");

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
//style bookCard based on read Status, attach eventListener to each of them
function toggleReadStatus(checkBtn) {
  const bookCard = checkBtn.closest(".book-card");
  if (bookCard) {
    const isRead = checkBtn.textContent === "Read"; // Check if book is marked as read
    if (isRead) {
      checkBtn.style.backgroundColor = "red";
      checkBtn.textContent = "Not Read";
      bookCard.style.boxShadow = "3px 3px 10px red";
    } else {
      checkBtn.style.backgroundColor = "rgba(68, 197, 68, 0.61)";
      checkBtn.textContent = "Read";
      bookCard.style.boxShadow = "3px 3px 10px green";
    }
  }
}


checkReadBtn.forEach((checkBtn) => {
  checkBtn.addEventListener("click", function () {
    toggleReadStatus(checkBtn);
  });
});
//deleteBtn clicked -> delete bookCard
function deleteBook(event) {
  //target the bookCard via closest
  const bookItem = event.target.closest(".book-card");
  bookItem.remove();
}

deleteBookBtn.forEach((bookCard) => {
  bookCard.addEventListener("click", deleteBook);
});

const myBooksArray = [];
const bestSellersArray = [];
const recommendationsArray = [];
const myLibrary = [];

function CreateBookCard(title, author, pages, genre, isRead, targetRowClass) {
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

function pushBookToArray(book, row) {
  myLibrary.push(book);
  row.push(book);
}

// Function to handle form submission
function handleFormSubmit(event) {
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
  const newFormBook = new CreateBookCard(title, author, pages, genre, isRead, category);

  let targetRow;
  if (category === "my-books") {
    targetRow = myBooksArray;
  } else if (category === "best-sellers") {
    targetRow = bestSellersArray;
  } else if (category === "recommendations") {
    targetRow = recommendationsArray;
  }

  // Reset form fields after submission
  const form = document.getElementById("form");
  form.reset();
}

// Add event listener to form submit button
formBtn.addEventListener('click', handleFormSubmit);
formBtn.addEventListener("click", hideForm);


//ADD BOOKS
// Create books using CreateBookCard function with abbreviated names
const killBird = new CreateBookCard("To Kill a Mockingbird", "Harper Lee", 281, "Fiction", false, "my-books");
const n1984 = new CreateBookCard("1984", "George Orwell", 328, "Dystopian Fiction", true, "my-books");
const greatGatsby = new CreateBookCard("The Great Gatsby", "F. Scott Fitzgerald", 180, "Classic Literature", false, "my-books");
const prideAndPrejudice = new CreateBookCard("Pride and Prejudice", "Jane Austen", 279, "Romance, Classic Literature", false, "best-sellers");
const catcherInRye = new CreateBookCard("The Catcher in the Rye", "J.D. Salinger", 277, "Coming-of-Age Fiction", false, "best-sellers");
const theHobbit = new CreateBookCard("The Hobbit", "J.R.R. Tolkien", 310, "Fantasy", true, "best-sellers");
const harryPotter = new CreateBookCard("Harry Potter and the Philosopher's Stone", "J.K. Rowling", 223, "Fantasy, Young Adult", false, "recommendations");
const daVinciCode = new CreateBookCard("The Da Vinci Code", "Dan Brown", 454, "Mystery, Thriller", false, "recommendations");
const daVinciCodes = new CreateBookCard("The Da Vinci Code", "Dan Brown", 454, "Mystery, Thriller", true, "recommendations");

//aside data
function updateAsideData() {
  totalBooksNum.textContent = myLibrary.length;
  readBooksNum.textContent = myLibrary.filter((book) => book.isRead === true).length;
  notReadBooksNum.textContent = myLibrary.filter((book) => book.isRead === false).length;
  totalPagesNum.textContent = myLibrary.reduce((accumulator, book) => {
    return accumulator += book.pages; 
  }, 0);
}

updateAsideData();







