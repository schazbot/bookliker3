//server
const apiHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}

function get(url) {
    return fetch(url).then(resp => resp.json())
}

function patch(url, id, data) {
    return fetch(`${url}/${id}`, {
        method: 'PATCH',
        headers: apiHeaders,
        body: JSON.stringify(data)
    })
}

//const
const API = { get, patch }
const booksUrl = "http://localhost:3000/books/"
const currentUser = { "id": 1, "username": "pouros" }
const listPanel = document.querySelector("#list")
const showPanel = document.querySelector("#show-panel")


//functions - don't forget to invoke your master call!

function getAllBooks() {
    API.get(booksUrl).then(books => books.forEach(book => appendBookPreveiw(book)))
}

function appendBookPreveiw(book) {
    const previewLi = document.createElement('li')
    previewLi.innerText = book.title
    previewLi.addEventListener('click', () => expandBook(book))
    listPanel.appendChild(previewLi)
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
    ul.id = "users-ul"


    const readButton = document.createElement('button')
    if (hasUserReadThisbook(book)) { readButton.innerText = "UnRead Me" } else { readButton.innerText = "Read Me" }

    readButton.addEventListener('click', () => handleButtonClick(book))

    book.users.forEach(bookUser => {
        const li = document.createElement('li')
        li.innerText = bookUser.username
        li.id = `user-${bookUser.id}`
        ul.append(li)
    })
    showPanel.append(h2, p, img, ul, readButton)
}

function handleButtonClick(book) {
    if (!hasUserReadThisbook(book)) {
        book.users.push(currentUser)
        API.patch(booksUrl, book.id, book)
            const li = document.createElement('li')
            li.innerText = currentUser.username
            li.id = `user-${currentUser.id}`
            ul = document.querySelector('#users-ul')
            ul.append(li)
            document.querySelector('button').innerText = "UnReadMe"
    } else {
        book.users = book.users.filter(bookUsr => bookUsr.id !== currentUser.id)
        let foundLi = document.querySelector(`#user-${currentUser.id}`)
        foundLi.remove()

        API.patch(booksUrl, book.id, book).then(
            document.querySelector('button').innerText = "ReadMe"
        )
    }
}



function hasUserReadThisbook(book) {
    return book.users.find(bookUsr => bookUsr.id == currentUser.id)
}



getAllBooks()