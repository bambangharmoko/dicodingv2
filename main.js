const books = []
const RENDER_EVENT = 'render-event'

const submit = document.getElementById('inputBook')

submit.addEventListener('submit', function (e) {
  e.preventDefault()
  addBook()
})

document.addEventListener(RENDER_EVENT, function () {
  console.log('dispatched-event')
  const unreadedBook = document.getElementById('incompleteBookshelfList')
  unreadedBook.innerHTML = ''

  const readedBook = document.getElementById('completeBookshelfList')
  readedBook.innerHTML = ''

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem)
    console.log(bookElement)
    if (!bookItem.isComplete) {
      unreadedBook.append(bookElement)
    } else {
      readedBook.append(bookElement)
    }
  }
})

function makeBook(bookObject) {
  const textTitle = document.createElement('h3')
  textTitle.innerText = bookObject.title

  const textAuthor = document.createElement('p')
  textAuthor.innerText = bookObject.author

  const textYear = document.createElement('p')
  textYear.innerText = bookObject.year

  const container = document.createElement('article')
  container.classList.add('book_item')
  container.append(textTitle, textAuthor, textYear)

  container.setAttribute('id', `book-${bookObject.id}`)

  const containerAction = document.createElement('div')
  containerAction.classList.add('action')
  if (bookObject.isComplete) {
    const undoButton = document.createElement('button')
    undoButton.classList.add('green')
    undoButton.innerText = "Belum selesai di Baca"

    undoButton.addEventListener('click', function () {
      undoBookFromCompleete(bookObject.id)
    })

    const deleteButton = document.createElement('button')
    deleteButton.classList.add('red')
    deleteButton.innerText = 'Hapus Buku'

    deleteButton.addEventListener('click', function () {
      removeBook(bookObject.id)
    })


    containerAction.append(undoButton, deleteButton)
  }
  else {
    const checkBook = document.createElement('button')
    checkBook.classList.add('green')
    checkBook.innerText = "Selesai dibaca"

    checkBook.addEventListener('click', function () {
      addBookToComplete(bookObject.id)
    })
    containerAction.append(checkBook)
  }
  container.append(containerAction)
  return container
}

function addBook() {
  const title = document.getElementById('inputBookTitle').value
  const author = document.getElementById('inputBookAuthor').value
  const year = document.getElementById('inputBookYear').value

  const generateID = generateId()
  const bookObj = generateObject(generateID, title, author, year, false)
  books.push(bookObj)

  console.log(books)
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
}

function generateId() {
  return +new Date()
}

function generateObject(id, title, author, year, isComplete) {
  return { id, title, author, year, isComplete }
}

function addBookToComplete(id) {
  const bookTarget = findBook(id)
  if (bookTarget == null) return

  bookTarget.isComplete = true
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
}

function findBook(id) {
  for (const bookItem of books) {
    if (bookItem.id === id) {
      return bookItem
    }
  }
  return null
}

function removeBook(id) {
  const bookTarget = findBook(id)
  if (bookTarget === -1) return

  books.splice(bookTarget, 1)
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
}

function undoBookFromCompleete(id) {
  const bookTarget = findBook(id)
  if (bookTarget == null) return
  bookTarget.isComplete = false
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
}

const SAVED_EVENT = 'saved-event'
const STORAGE_KEY = 'BOOKS-APPS'

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books)
    localStorage.setItem(STORAGE_KEY, parsed)
    document.dispatchEvent(new Event(SAVED_EVENT))
  }
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung web storage')
    return false
  }
  else {
    return true
  }
}
const loadDataFromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY)
  let data = JSON.parse(serializedData)

  if (data !== null) {
    for (const book of data) {
      books.push(book)
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT))
}

if (isStorageExist()) {
  loadDataFromStorage()
}