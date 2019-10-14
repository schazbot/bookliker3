const headers = {
    "Content-Type": "application/json",
    Accept: "application/json"
}
function get(url) {
    return fetch(url)
        .then(resp => resp.json())
}
function patch(url, id, bookData) {
    return fetch(`${url}/${id}`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(bookData)
    }).then(resp => resp.json())
}

const API = { get, patch }
const listPanel = document.querySelector('#list')
const showPanel = document.querySelector('#show-panel')
const currentUser = { "id": 1, "username": "pouros" }
const booksUrl = "http://localhost:3000/books/"

function getAllBooks() {

    API.get(booksUrl).then(books => books.forEach(book => renderBookPreview(book)))
}

function renderBookPreview(book) {
    const li = document.createElement('li')
    li.innerText = book.title
    li.addEventListener('click', () => {
        expandBook(book)
    })
    listPanel.append(li)
}

function expandBook(book) {
    while (showPanel.firstChild) showPanel.removeChild(showPanel.firstChild)

    const bookDiv = document.createElement('div')
    const h2 = document.createElement('h2')
    h2.innerText = book.title

    const p = document.createElement('p')
    p.innerText = book.description

    const img = document.createElement('img')
    img.src = book.img_url

    const ul = document.createElement('ul')
    ul.id = "user-ul"
    book.users.forEach(bookUser => {
        let userLi = document.createElement('li')
        userLi.id = `user-${bookUser.id}`
        userLi.innerText = bookUser.username
        ul.append(userLi)
    })

    const readBtn = document.createElement('button')
    if (!book.users.find(bookUsr => bookUsr.id === currentUser.id)) { readBtn.innerText = 'Read Me' }
    else { readBtn.innerText = 'UNRead Me' }
    readBtn.addEventListener('click', () => handleClick(book))
    bookDiv.append(h2, img, p, ul, readBtn)
    showPanel.append(bookDiv)
}

function handleClick(book) {
    if (!hasUserReadThisBook(book)) {
        book.users.push(currentUser)
        API.patch(booksUrl, book.id, book)
        let userLi = document.createElement('li')
        userLi.id = `user-${currentUser.id}`
        userLi.innerText = currentUser.username
        const ul = document.querySelector("#user-ul")
        ul.append(userLi)
        document.querySelector('button').innerText = 'Unread Me'
    } else {
        book.users = book.users.filter(bookUser => bookUser.id !== currentUser.id)
        let foundLi = document.querySelector(`#user-${currentUser.id}`)
        foundLi.remove()
        API.patch(booksUrl, book.id, book).then(
            document.querySelector('button').innerText = 'READ ME'
        )
    }
}

function hasUserReadThisBook(book) {
    return book.users.find(user => user.id == currentUser.id)
}

getAllBooks()