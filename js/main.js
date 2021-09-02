//---------------------------
// dom items (in variables)
//---------------------------
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-btn');
const numberOfResults = document.getElementById('num-of-results');
const spinner = document.getElementById('spinner');
const alertBox = document.getElementById('alert');
const searchResultsContainer = document.getElementById('search-results');

//--------------------------
// html generator functions
//--------------------------
const generateHtml = book => {
    const card = document.createElement('div');
    // card.classList.add('card');
    card.classList.add('col-12');
    card.classList.add('col-md-4');
    card.innerHTML =`
        <div class="card">
            <div class="image-container">
                <img src="https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg" class="card-img-top img-fluid" alt="${book.title}">
            </div>
            <div class="card-body">
                <h4 class="card-title">${book.title}</h4>
                <p class="card-text">by <b>${book.author_name ? book.author_name[0] : ''}</b></p>
                <p class="card-text">Publisher: <b>${book.publisher ? book.publisher[0] : ''}</b></p>
                <p class="card-text">First published on: <b>${book.publish_year ? book.publish_year[0] : ''}</b></p>
            </div>
        </div>`;
    return card;
};

//----------------------------
// book list iterator function
//----------------------------
const loopBookList = (books, providedBookName, numFound) => {

    books.forEach(book => {
        // generate html if book cover available
        if(book.cover_i){
            const bookCard = generateHtml(book);
            // hide spinner
            spinner.classList.add('d-none'); //hide spinner
            // hide alert
            alertBox.classList.add('d-none');
            // set number of results
            numberOfResults.innerText = `${numFound}: Results for "${providedBookName}"`;
            searchResultsContainer.appendChild(bookCard);
        }
    });
}

//----------------
// event handlers
//----------------
const searchBook = async (event) => {
    // hide alert
    alertBox.classList.add('d-none');
    // get input value
    const providedBookName = searchInput.value;
    // return if no book name is provided
    if(!providedBookName) return;
    // erasing input value
    searchInput.value = '';
    // erasing search field container
    searchResultsContainer.innerText = '';
    // erasing search result count
    numberOfResults.innerText = '';
    // show spinner
    spinner.classList.remove('d-none');
    // call for data
    const url = `https://openlibrary.org/search.json?q=${providedBookName}`;
    try {
        const results = await fetch(url);
        const data = await results.json();

        // slice first 50 results
        if(data.numFound >= 50) {
            const books = await data.docs.slice(0, 50);
            loopBookList(books, providedBookName, data.numFound);
        } else if (data.numFound === 0) {
            // hide spinner
            spinner.classList.add('d-none');
            // set number of results
            numberOfResults.innerText = `${data.numFound}: Results for "${providedBookName}"`;
            // show alert
            alertBox.innerText = `no results found for "${providedBookName}"`;
            alertBox.classList.remove('d-none');
        } else {
            loopBookList(data.docs, providedBookName, data.numFound);
        }
    } catch (error) {
        console.log(error)
        // hide spinner
        spinner.classList.add('d-none');
        // show alert
        alertBox.innerText = `Something went wrong!`;
        alertBox.classList.remove('d-none');
    }
};

//-----------------
// event listener
//-----------------
searchButton.addEventListener('click', searchBook);
