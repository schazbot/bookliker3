//api

const apiHeaders
    = {
    "Content-Type": "application/json",
    Accept: "application/json"
}

function get(url) {
    return fetch(url).then(resp => resp.json())
}

function patch(url, id, bookData) {
    return fetch(`${url}${id}`, {
        method: 'PATCH',
        headers: apiHeaders,
        body: JSON.stringify(bookData)
    }).then(resp => resp.json())
}

const API = { get, patch }


//consts
const booksUrl = "http://localhost:3000/books/"
const currentUser = { "id": 1, "username": "pouros" }
const listPanel = document.querySelector("#list")
const showPanel = document.querySelector("#show-panel")

//functions - dont' forget to invoke the master function

function getAllBooks() {
    API.get(booksUrl).then(books => books.forEach(book => appendBookPreview(book)))
}

function appendBookPreview(book) {
    const li = document.createElement('li')
    li.innerText = book.title
    li.addEventListener('click', () => expandBook(book))
    listPanel.append(li)
}

function expandBook(book) {
    while (showPanel.firstChild) showPanel.removeChild(showPanel.firstChild)

    const h2 = document.createElement('h2')
    h2.innerText = book.title

    const p = document.createElement('p')
    p.innerText = book.description

    const img = document.createElement('img')
    img.src = book.img_url

    const ul = document.createElement('ul')
    ul.id = "users-list"

    book.users.forEach(bookUser => {
        const userLi = document.createElement('li')
        userLi.innerText = bookUser.username
        userLi.id = `user-${bookUser.id}`
        ul.append(userLi)
    })

    const readBtn = document.createElement('button')
    readBtn.addEventListener('click', () => handleButtonClick(book))

    if (hasUserReadThisBook(book)) { readBtn.innerText = "Unread Me" } else { readBtn.innerText = "Read Me" }


    showPanel.append(h2, img, p, readBtn, ul)
}

function handleButtonClick(book) {
    if (!hasUserReadThisBook(book)) {
        book.users.push(currentUser)
        API.patch(booksUrl, book.id, book)
        const userLi = document.createElement('li')
        const ul = document.querySelector("#users-list")
        userLi.innerText = currentUser.username
        userLi.id = `user-${currentUser.id}`
        ul.append(userLi)
        const readBtn = document.querySelector('button')
        readBtn.innerText = 'UnRead Me'
    } else {
        book.users = book.users.filter(bookUser => bookUser.id !== currentUser.id)
        API.patch(booksUrl, book.id, book)
        const foundLi = document.querySelector(`#user-${currentUser.id}`)
        foundLi.remove()
        const readBtn = document.querySelector('button')
        readBtn.innerText = 'Read Me'
    }

}

function hasUserReadThisBook(book) {
    return book.users.find(bookUsr => bookUsr.id === currentUser.id)
}

getAllBooks()