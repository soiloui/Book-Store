const SALE_art = document.getElementById("sale");
const ADD_btn = document.querySelector(".add_btn");
const SEARCH_input = document.querySelector('#search_input');
const BOOKS_ul = document.querySelector('#books');
const LIBRARY = [];
const INFORM_div = document.querySelector('.sys_information');
const YEAR_input = document.querySelector('#sale_year');

class Book {
    constructor(title, author, year, count) {
        this.title = title;
        this.author = author;
        this.year = year;
        this.count = count;
    }
    getInfo() {
        return `${this.title} book was written by ${this.author} in ${this.year} year`;
    }
}


add = e =>{
    let title = e.currentTarget.parentNode.firstElementChild;
    let author = title.nextElementSibling;
    let year = author.nextElementSibling;

    if(chceckBook(title, author, year)){
    
        let newBook = new Book(title.value, author.value, year.value, 1);
        LIBRARY.push(newBook);

        showBook();
        displayStatusChange('Book added', "rgba(150, 250, 150, .95)");
    }
    e.preventDefault();
}

showBook = () =>{
    const LIB_sort = LIBRARY
        .sort((a, b) => a.title > b.title ? 1 : -1)
        .map(book =>  `
        <li class='book'>
            <h3>${book.title}</h3>
            <p>Author: ${book.author}</p> 
            <p>Year: ${book.year}</p>
            <p class='p_magazine'>On magazine: ${book.count}</p>
            <div class='btns_div'>
                <button class='book_btn' id='remove_all'>Remove all copies</button>
                <button class='book_btn' id='magazine_plus'>+</button>
                <button class='book_btn' id='magazine_minus'>-</button>
            </div>
        </li>
        `)
        .join('');

        BOOKS_ul.innerHTML = LIB_sort;
        MAGAZINE_btns = document.querySelectorAll('.book_btn');
}

chceckBook = (title, author, year) =>{
    if(title.value != '' && author.value!='' && year.value!='') {
        
        let filtered = LIBRARY.filter(book => {
        return (book.title == title.value && book.author == author.value && book.year == year.value)});

        if (filtered.length>0)
            {
                displayStatusChange('Book already exist - moved to magaizne', "rgba(150, 150, 150, .95)");
                filtered[0].count++;
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

magazineDo = e =>{
    if(e.target.classList.contains('book_btn')){
        let btn = e.target.id;
        let title = e.target.parentNode.parentNode.firstElementChild;
        let author = title.nextElementSibling;
        let year = author.nextElementSibling;

        let bookMagazine = LIBRARY.filter(book =>{
            return(book.title == title.innerText && 'Author: '+book.author == author.innerText && 'Year: '+book.year == year.innerText);
        });

        if (bookMagazine.length>0){
            if(btn == 'magazine_plus'){
                bookMagazine[0].count++;
            }else if(btn == 'magazine_minus'){
                bookMagazine[0].count--;
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

deleteBook = bookMagazine =>{
    let indexBook = LIBRARY.indexOf(bookMagazine[0]);
    LIBRARY.splice(indexBook, 1);
    displayStatusChange('Book removed.', "rgba(250, 150, 150, .95)");
}

search = () =>{
    const typed = SEARCH_input.value;
    const regex = new RegExp(typed, 'gi');
    const search_filter = LIBRARY
        .filter(book => {
            return book.title.match(regex) || book.author.match(regex);
        })
        .sort((a, b) => a.title > b.title ? 1 : -1)
        .map(book =>{
            const hlTitle = book.title.replace(regex, `<span class='hl'>${typed}</span>`);
            const hlAuthor = book.author.replace(regex, `<span class='hl'>${typed}</span>`);
            return(
            `
            <li class='book'>
                <h3>${hlTitle}</h3>
                <p>Author: ${hlAuthor}</p> 
                <p>Year: ${book.year}</p>
                <p class='p_magazine'>On magazine: ${book.count}</p>
                <div class='btns_div'>
                    <button class='book_btn' id='remove_all'>Remove all copies</button>
                    <button class='book_btn' id='magazine_plus'>+</button>
                    <button class='book_btn' id='magazine_minus'>-</button>
                </div>
            </li>
            `)
        })
        .join('');
    BOOKS_ul.innerHTML = search_filter;
}

let timeoutInfo;
displayStatusChange = (status, color) =>{
    INFORM_div.innerHTML = `
    <span>${status}</span>
    </div>
    `;
    INFORM_div.classList.remove("hidden");
    INFORM_div.style.backgroundColor = color;
    clearInterval(timeoutInfo);
    timeoutInfo = 
        setTimeout(() => {
            INFORM_div.classList.add("hidden");
            }, 2300);
}


SEARCH_input.addEventListener('keyup', search);
ADD_btn.addEventListener('click', add);
YEAR_input.addEventListener('input', ()=>{
    YEAR_input.value = YEAR_input.value.replace(/\D/, '');
});
BOOKS_ul.addEventListener('click', magazineDo);