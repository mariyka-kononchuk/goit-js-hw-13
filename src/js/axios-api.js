import axios from "axios";
import "regenerator-runtime";
import cardTpl from '../templates/gallery.hbs';
import refs from "./refs.js";
const { form, list, card, more } = refs;
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";

const baseUrl = "https://pixabay.com/api/";
axios.defaults.baseURL = baseUrl;
const apiKey = "22651538-53630abe578d2561aeb41817a";
//плавная прокрутка
// const { height: cardHeight } = document
//   .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();
// console.log(document.querySelector('.gallery').firstElementChild.getBoundingClientRect());

// window.scrollBy({
//     top: cardHeight * 2,
//   behavior: 'smooth',
// });

const myFetch = getFetch();
const { setQuery, getImages, loadMore, resetPage, resetTotal, message } = myFetch;

//let total = 0;

form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    let query = evt.target.elements.searchQuery.value.trim()
    if (query === "") {
         return;
     };
     list.innerHTML = "";
    resetPage();
    resetTotal();
    setQuery(query);
    getImages();
    setTimeout(() => {
        message();
    }, 300);
    more.classList.remove("is-hidden");
    form.reset();
});

loadMore(more);

function getFetch() {
    let page = 1;    
    let per_page = 40;
    let query = "";
    let hit = 0;
    let total = 0;

    function resetTotal() {
        return total=0;
    }
    function setPage() {
        return page += 1;
    }
    function resetPage() {
        return page = 1;
    }
    function setQuery(value) {
        return query = value;
    }
    //функция запроса
    //асинхронный код
    async function getImages() {
        let queryParams = `?key=${apiKey}&q=${query}&image_type=photo&per_page=${per_page}&page=${page}&orientation=horizontal&safesearch=true`;
        let url = baseUrl + queryParams;
        
        const response = await axios.get(url);
        const data = response.data;
        console.log(data);
        const photo = data.hits;
        const totalHits = data.totalHits;
        generateGallery(photo, totalHits);
        hit = totalHits;
    }

    function generateGallery(photo, totalHits) {
        const gallery = cardTpl(photo);  
        total+= photo.length;
    
        if (photo.length === 0) {
            more.classList.add("is-hidden");
            return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        } else if (totalHits === total) {
            list.insertAdjacentHTML("beforeend", gallery);
            more.classList.add("is-hidden");
            return setTimeout(() => {
                Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
    }, 300);
    }
        list.insertAdjacentHTML("beforeend", gallery);
        
        return  total;
}
    function message() {
        if (hit === 0) {
            return;
        }
        return Notiflix.Notify.info(`Hooray! We found ${hit} images.`);
    }

    function loadMore(button) {
        button.addEventListener("click", () => {
            setPage();
            getImages();
        });
    }
        return { setQuery, loadMore, resetPage, getImages, message, resetTotal};
    }





 
 //библиотека SimpleLightbox
//    let gallery = new SimpleLightbox('.image', { sourceAttr });
// var lightbox = ('.gallery a').simpleLightbox({ /* options */ });
// gallery.on('show.simplelightbox', function () {
//     console.log("библиотека");
// });
// gallery.open();
   




