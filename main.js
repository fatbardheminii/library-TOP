//Variables
//buttons
const addBookBtn = document.querySelector(".add-new-book");
const editBookBtn = document.querySelector(".edit-book");
const deleteBookBtn = document.querySelectorAll(".delete-book");
const checkReadBtn = document.querySelectorAll(".read-check");
const formBtn = document.getElementById("form-btn");
//rows
const myBooksRow = document.querySelector(".my-books-row");
const bestSellersRow = document.querySelector(".best-sellers-row");
const recommendationsRow = document.querySelector(".recommendations-row");
//nav-items
const myBooksNav = document.querySelector(".my-books-nav");
const bestSellersNav = document.querySelector(".best-sellers-nav");
const recommendationsNav = document.querySelector(".recommendations-nav");
//form
const formDiv = document.querySelector(".form");
const overlay = document.querySelector(".overlay");
const xIcon = document.querySelector(".fa-xmark");

const bookCard = document.querySelectorAll(".book-card");

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

let readMode = true;

function toggleReadStatus(checkBtn) {
  const bookCard = checkBtn.closest(".book-card");
  if (bookCard && readMode) {
    checkBtn.style.backgroundColor = "red";
    checkBtn.innerHTML = "Not read";
    bookCard.style.boxShadow = "3px 3px 10px red";
    readMode = false;
  } else if (bookCard && !readMode) {
    checkBtn.style.backgroundColor = "rgba(68, 197, 68, 0.61)";
    checkBtn.innerHTML = "Read";
    bookCard.style.boxShadow = "3px 3px 10px green";
    readMode = true;
  }
}

checkReadBtn.forEach((checkBtn) => {
  checkBtn.addEventListener("click", function () {
    toggleReadStatus(checkBtn);
  });
});

function deleteBook(event) {
  const bookItem = event.target.closest(".book-card");
  bookItem.remove();
}

deleteBookBtn.forEach((bookCard) => {
  bookCard.addEventListener("click", deleteBook);
});
