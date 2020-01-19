'use strict'
const SALE_art = document.querySelector("#sale");
const ADD_btn = document.querySelector("#add_btn");
const SEARCH_input = document.querySelector('#search_input');
const BOOKS_ul = document.querySelector('#books');
const LIBRARY = [];
const INFORM_div = document.querySelector('#INFORM_div');
const YEAR_input = document.querySelector('#sale_year');
const COUNT_input = document.querySelector('#sale_count');

class Book {
    constructor(title, author, year, count) {
        this.title = title;
        this.author = author;
        this.year = year;
        this.count = count;
    }
}


function add(e){
    let title = e.currentTarget.parentNode.firstElementChild;
    let author = title.nextElementSibling;
    let year = author.nextElementSibling;
    let count = year.nextElementSibling.value;
    if(count == ''){
        count = 1;
    }

    if(chceckBook(title, author, year, count)){
    
        let newBook = new Book(title.value, author.value, year.value, count);
        LIBRARY.push(newBook);

        showBook();
        displayStatusChange('Book added', "rgba(150, 250, 150, .95)");
    }
    e.preventDefault();
}

function showBook(){
    const LIB_sort = LIBRARY
        .sort((a, b) => a.year > b.year ? 1 : -1)
        .sort((a, b) => a.title > b.title ? 1 : -1)
        .map(book =>  `
        <li class='sale__ul_li'>
            <div class='sale__ul_li--book'>
                <h3>${book.title}</h3>
                <p>Author: ${book.author}</p> 
                <p>Year: ${book.year}</p>
                <p class='sale__ul_li--magazine'>On magazine: ${book.count}</p>
            </div>
            <div class='sale__ul_li__div'>
                <button class='sale__ul_li__div--btn book_btn' id='remove_all'>Remove all copies</button>
                <button class='sale__ul_li__div--btn book_btn' id='magazine_plus'>+</button>
                <button class='sale__ul_li__div--btn book_btn' id='magazine_minus'>-</button>
            </div>
        </li>
        `)
        .join('');

        BOOKS_ul.innerHTML = LIB_sort;
}


async function fetchData(){
    const res = await fetch('https://my-json-server.typicode.com/soiloui/Book-Store/Book')
    const data = await res.json();
    data.forEach(book => {
        LIBRARY.push(book);
    });
    showBook();
}
fetchData()
    .catch(error=>{
        console.log(error);
    });


function chceckBook(title, author, year, CNT){
    if(title.value != '' && author.value!='' && year.value!='') {
        
        let filtered = LIBRARY.filter(book => {
        return (book.title == title.value && book.author == author.value && book.year == year.value)});

        if (filtered.length>0)
            {
                displayStatusChange('Book already exist - moved to magaizne', "rgba(150, 150, 150, .95)");
                filtered[0].count+=parseInt(CNT);
                showBook();

                return false;
            }else{
                return true;
            }
                
    }else{
        displayStatusChange('Please fill in entire form.', "rgba(250, 150, 150, .95)");
        return false;
    }
}

function magazineDo(e){
    if(e.target.classList.contains('book_btn')){
        let btn = e.target.id;
        let title = e.target.parentNode.parentNode.firstElementChild;
        let author = title.nextElementSibling;
        let year = author.nextElementSibling;

        let bookMagazine = LIBRARY.filter(book =>{
            const regexTitle = new RegExp(title.innerText, 'gi');

            return(regexTitle.test(book.title) && 'Author: '+book.author == author.innerText && 'Year: '+book.year == year.innerText);
        });

        if (bookMagazine.length>0){
            if(btn == 'magazine_plus'){
                bookMagazine[0].count++;
                displayStatusChange('Book amount increased.', "rgba(150, 250, 150, .95)");
            }else if(btn == 'magazine_minus'){
                bookMagazine[0].count--;
                displayStatusChange('Book amount decreased.', "rgba(250, 150, 150, .95)");
                if(bookMagazine[0].count <= 0){
                    deleteBook(bookMagazine);
                }
            }else if(btn == 'remove_all'){
                deleteBook(bookMagazine);
            }
        }
        showBook();
    }
}

function deleteBook(bookMagazine){
    let indexBook = LIBRARY.indexOf(bookMagazine[0]);
    LIBRARY.splice(indexBook, 1);
    displayStatusChange('Book removed.', "rgba(250, 150, 150, .95)");
}

function search(){
    const typed = SEARCH_input.value;
    const regex = new RegExp(typed, 'gi');
    const search_filter = LIBRARY
        .filter(book => {
            return book.title.match(regex) || book.author.match(regex);
        })
        .sort((a, b) => a.year > b.year ? 1 : -1)
        .sort((a, b) => a.title > b.title ? 1 : -1)
        .map(book =>{
            const hlTitle = book.title.replace(regex, `<span class='hl'>${typed}</span>`);
            const hlAuthor = book.author.replace(regex, `<span class='hl'>${typed}</span>`);
            return(
            `
            <li class='sale__ul_li'>
                <h3>${hlTitle}</h3>
                <p>Author: ${hlAuthor}</p> 
                <p>Year: ${book.year}</p>
                <p class='sale__ul_li--magazine'>On magazine: ${book.count}</p>
                <div class='sale__ul_li__div'>
                    <button class='sale__ul_li__div--btn book_btn' id='remove_all'>Remove all copies</button>
                    <button class='sale__ul_li__div--btn book_btn' id='magazine_plus'>+</button>
                    <button class='sale__ul_li__div--btn book_btn' id='magazine_minus'>-</button>
                </div>
            </li>
            `)
        })
        .join('');
    BOOKS_ul.innerHTML = search_filter;
}

let timeoutInfo;
function displayStatusChange(status, color){
    INFORM_div.innerHTML = `
    <span>${status}</span>
    </div>
    `;
    INFORM_div.classList.remove("sale__information--hidden");
    INFORM_div.style.backgroundColor = color;
    clearInterval(timeoutInfo);
    timeoutInfo = 
        setTimeout(() => {
            INFORM_div.classList.add("sale__information--hidden");
            }, 2300);
}


SEARCH_input.addEventListener('keyup', search);
ADD_btn.addEventListener('click', add);
BOOKS_ul.addEventListener('click', magazineDo);

YEAR_input.addEventListener('input', ()=>{
    YEAR_input.value = YEAR_input.value.replace(/\D/, '');
});
COUNT_input.addEventListener('input', ()=>{
    COUNT_input.value = COUNT_input.value.replace(/\D/, '');
});