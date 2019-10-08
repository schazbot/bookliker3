//server

const apiHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json"
}

function get(url) {
    return fetch(url)
        .then(resp => resp.json())
}

function patch(url, id, bookdata) {
    return fetch(`${url}${id}`,
        {
            method: "PATCH",
            headers: apiHeaders,
            body: JSON.stringify(bookdata)
        })
}

const API = { get, patch }

//const
const currentUser = { "id": 1, "username": "pouros" }
const booksUrl = "http://localhost:3000/books/"
const listUl = document.querySelector("#list")
const showDiv = document.querySelector("#show-panel")


//functions

function getAllBooks() {
    return API.get(booksUrl)
        .then(books => books.forEach(book => appendBookLi(book)))
}

function appendBookLi(book) {
    let bookLi = document.createElement('li')
    bookLi.innerText = book.title
    bookLi.addEventListener('click', () => expandBook(book))
    listUl.append(bookLi)
}

function expandBook(book) {

    while (showDiv.firstChild) showDiv.removeChild(showDiv.firstChild)

    const h2 = document.createElement('h2')
    h2.innerText = book.title

    const p = document.createElement('p')
    p.innerText = book.description

    const img = document.createElement('img')
    img.src = book.img_url

    const button = document.createElement('button')
    button.innerText = 'Read Me'
    button.addEventListener('click', () => handleclick(book))

    const usersUl = document.createElement('ul')
    usersUl.id = "users-ul"
    book.users.forEach(bkUser => {
        let userLi = document.createElement('li')
        userLi.innerText = bkUser.username
        usersUl.append(userLi)
    })
    showDiv.append(h2, p, img, usersUl, button)

    // if (!hasUserReadTheBook(book)) {
    //     book.users.push(currentUser)

    //     API.patch(booksUrl, book.id, book)

    //     let userLi = document.createElement('li')
    //     userLi.innerText = currentUser.username
    //     userLi.id = `user-${currentUser.id}`
    //     usersUl.append(userLi)
    //     button.innerText = 'UNRead Me'

    // } else {
    //     book.users = book.users.filter(user => user.id !== currentUser.id)
    //     foundUserLi = document.querySelector(`#user-${currentUser.id}`)
    //     API.patch(booksUrl, book.id, book)
    //     foundUserLi.remove()
    //     button.innerText = 'Read ME'

    // }
}

function handleclick(book) {
    if (!hasUserReadTheBook(book)) {
        book.users.push(currentUser)

        API.patch(booksUrl, book.id, book)

        let userLi = document.createElement('li')
        const usersUl = document.querySelector('#users-ul')
        document.querySelector('button').innerText = 'UNRead Me'


        userLi.innerText = currentUser.username
        userLi.id = `user-${currentUser.id}`
        usersUl.append(userLi)
        
    } else {
        book.users = book.users.filter(user => user.id !== currentUser.id)
        foundUserLi = document.querySelector(`#user-${currentUser.id}`)
        foundUserLi.remove()

        API.patch(booksUrl, book.id, book).then(
            document.querySelector('button').innerText = 'Read ME'
        )
        

    }
}


function hasUserReadTheBook(book) {
    return book.users.find(user => user.id === currentUser.id)
}

getAllBooks()