//api

const apiHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json"
};

const get = url => {
  return fetch(url).then(resp => resp.json());
};

const patch = (url, id, bookData) => {
  return fetch(url + id, {
    method: "PATCH",
    headers: apiHeaders,
    body: JSON.stringify(bookData)
  }).then(resp => resp.json());
};

const API = { get, patch };

//consts
const booksUrl = "http://localhost:3000/books/";
const listPanel = document.querySelector("#list");
const showPanel = document.querySelector("#show-panel");
const currentUser = { id: 1, username: "pouros" };

//functions

const getAllBooks = () => {
  API.get(booksUrl).then(books => books.forEach(book => makeBookPreview(book)));
};

const makeBookPreview = book => {
  let li = document.createElement("li");
  li.innerText = book.title;
  listPanel.append(li);
  li.addEventListener("click", () => makeBookDetail(book));
};

const makeBookDetail = book => {
  while (showPanel.firstChild) showPanel.removeChild(showPanel.firstChild);
  const h1 = document.createElement("h1");
  h1.innerText = book.title;

  const img = document.createElement("img");
  img.src = book.img_url;

  const p = document.createElement("p");
  p.innerText = book.description;

  const ul = document.createElement("ul");
  ul.id = "users-ul";

  book.users.forEach(bkUsr => {
    let li = document.createElement("li");
    li.id = `user-${bkUsr.id}`;
    li.innerText = bkUsr.username;
    ul.append(li);
  });

  const btn = document.createElement("button");
  btn.innerText = "Like Me";
  btn.addEventListener("click", () => handleButtonClick(book));

  showPanel.append(h1, img, p, ul, btn);
};

const handleButtonClick = book => {
  if (!hasUserReadThisBook(book)) {
    book.users.push(currentUser);
    API.patch(booksUrl, book.id, book);
    const userLi = document.createElement("li");
    userLi.innerText = currentUser.username;
    userLi.id = `user-${currentUser.id}`;
    const ul = document.querySelector("#users-ul");
    ul.append(userLi);
  } else {
      book.users = book.users.filter(bookUsr => bookUsr.id !== currentUser.id)
      API.patch(booksUrl, book.id, book)
      foundLi = document.querySelector(`#user-${currentUser.id}`)
      foundLi.remove()
  }
};

const hasUserReadThisBook = book => {
  return book.users.find(bkUser => bkUser.id === currentUser.id);
};

getAllBooks();
