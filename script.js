const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const MOVED_EVENT = "moved-book";
const DELETED_EVENT = "deleted-book";
const STORAGE_KEY = "BOOKSHELF_APPS";
const books = [];

// Web Storage Check

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Your browser doesn't support web storage");
    return false;
  }
  return true;
}

const checkBox = document.getElementById("isRead");
checkBox.addEventListener("click", function () {
  if (checkBox.checked) {
    document.getElementById("bookSubmit").innerText = "Save to Read Books Shelf";
  } else {
    document.getElementById("bookSubmit").innerText = "Save to Unread Books Shelf";
  }
});

document.addEventListener(RENDER_EVENT, renderFunction);
document.addEventListener(SAVED_EVENT, savedFunction);
document.addEventListener(MOVED_EVENT, movedFunction);
document.addEventListener(DELETED_EVENT, deletedFunction);

// Function Declaration

function renderFunction() {
  const unfinishedBook = document.getElementById("unreadBooks");
  unfinishedBook.innerHTML = "";

  const finishedBook = document.getElementById("readBooks");
  finishedBook.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBookElement(bookItem);
    if (!bookItem.isComplete) {
      unfinishedBook.append(bookElement);
    } else {
      finishedBook.append(bookElement);
    }
  }
}

function savedFunction() {
  const elementCustomAlert = document.createElement("div");
  elementCustomAlert.classList.add("alert");
  elementCustomAlert.innerText = "Book has been saved";

  document.body.insertBefore(elementCustomAlert, document.body.children[0]);
  setTimeout(function () {
    elementCustomAlert.remove();
  }, 2000);
}

function movedFunction() {
  const elementCustomAlert = document.createElement("div");
  elementCustomAlert.classList.add("alert");
  elementCustomAlert.innerText = "Book has been moved";

  document.body.insertBefore(elementCustomAlert, document.body.children[0]);
  setTimeout(function () {
    elementCustomAlert.remove();
  }, 2000);
}

function deletedFunction() {
  const elementCustomAlert = document.createElement("div");
  elementCustomAlert.classList.add("alert");
  elementCustomAlert.innerText = "Book has been deleted";

  document.body.insertBefore(elementCustomAlert, document.body.children[0]);
  setTimeout(function () {
    elementCustomAlert.remove();
  }, 2000);
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function moveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(MOVED_EVENT));
  }
}

function deleteData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(DELETED_EVENT));
  }
}

function addBook() {
  const bookTitle = document.getElementById("title").value;
  const bookAuthor = document.getElementById("author").value;
  const bookYear = document.getElementById("year").value;
  const bookHasFinished = document.getElementById("isRead").checked;
  let bookStatus;

  if (bookHasFinished != false) {
    bookStatus = true;
  } else {
    bookStatus = false;
  }

  books.push({
    id: +new Date(),
    title: bookTitle,
    author: bookAuthor,
    year: Number(bookYear),
    isComplete: bookStatus,
  });

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function makeBookElement(bookObject) {
  const elementBookTitle = document.createElement("p");
  elementBookTitle.classList.add("item-title");
  elementBookTitle.innerHTML = `${bookObject.title} <span>(${bookObject.year})</span>`;

  const elementBookAuthor = document.createElement("p");
  elementBookAuthor.classList.add("item-writer");
  elementBookAuthor.innerText = bookObject.author;

  const descContainer = document.createElement("div");
  descContainer.classList.add("item-desc");
  descContainer.append(elementBookTitle, elementBookAuthor);

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("item-action");

  const container = document.createElement("div");
  container.classList.add("item");
  container.append(descContainer);
  container.setAttribute("id", `book-${bookObject.id}`);

  if (bookObject.isComplete) {
    const returnBtn = document.createElement("button");
    returnBtn.classList.add("restore-btn");
    returnBtn.innerHTML = `<i class='bx bx-undo'></i>`;

    returnBtn.addEventListener("click", function () {
      returnBookFromFinished(bookObject.id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = `<i class='bx bx-trash'></i>`;

    deleteBtn.addEventListener("click", function () {
      deleteBook(bookObject.id);
    });

    actionContainer.append(returnBtn, deleteBtn);
    container.append(actionContainer);
  } else {
    const finishBtn = document.createElement("button");
    finishBtn.classList.add("finished-btn");
    finishBtn.innerHTML = `<i class='bx bx-check'></i>`;

    finishBtn.addEventListener("click", function () {
      addBookToFinished(bookObject.id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = `<i class='bx bx-trash'></i>`;

    deleteBtn.addEventListener("click", function () {
      deleteBook(bookObject.id);
    });

    actionContainer.append(finishBtn, deleteBtn);
    container.append(actionContainer);
  }

  return container;
}

function addBookToFinished(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  moveData();
}

function returnBookFromFinished(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  moveData();
}

function deleteBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  deleteData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function loadDataFromStorage() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (data !== null) {
    for (const item of data) {
      books.push(item);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

//

document.addEventListener("DOMContentLoaded", function () {
  if (isStorageExist()) {
    loadDataFromStorage();
  }

  const saveForm = document.getElementById("bookItemForm");
  saveForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById("searchForm");
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

  const resetBtn = document.getElementById("reset-btn");
  resetBtn.addEventListener("click", function () {
    document.getElementById("search").value = "";
    searchBook();
  });
});

// Search Book Transition

const searchButton = document.getElementById("searchButton");
const searchBox = document.getElementById("searchContainer");
const closeSearchBox = document.getElementById("cancel");

searchButton.addEventListener("click", function () {
  searchBox.classList.toggle("search__container-open");
});
closeSearchBox.addEventListener("click", function () {
  searchBox.style.transition = "1s";
  searchBox.classList.toggle("search__container-open");
});

// Search Section

function searchBook() {
  const searchInput = document.getElementById("search").value.toLowerCase();
  const bookItems = document.getElementsByClassName("item");

  for (let i = 0; i < bookItems.length; i++) {
    const itemTitle = bookItems[i].querySelector(".item-title");
    if (itemTitle.textContent.toLowerCase().includes(searchInput)) {
      bookItems[i].style.backgroundColor = "#f0d0ff";
    } else {
      bookItems[i].style.backgroundColor = "";
    }
  }
}
