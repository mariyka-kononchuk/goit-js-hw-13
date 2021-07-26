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

//axios.defaults.headers.common.Authorization = apiKey;


const myFetch = getFetch();
const { setQuery, getImages, loadMore, resetPage, resetTotal, message } = myFetch;

let total = 0;

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
    more.classList.remove("is-hidden");
    setTimeout(() => {
        message();
  }, 300);
    form.reset();
});

loadMore(more);

function getFetch() {
    let page = 1;    
    let per_page = 8;
    let query = "";
    let hit = 0;
    function resetTotal() {
        return total=0;
    }

    function setPage() {
        console.log("страница",page);
        return page += 1;
    }
    function resetPage() {
        return page = 1;
    }
    function setQuery(value) {
       // console.log(query);
        return query = value;
    }
    //функция запроса
    //асинхронный код
    async function getImages() {
        let queryParams = `?key=${apiKey}&q=${query}&image_type=photo&per_page=${per_page}&page=${page}&orientation=horizontal&safesearch=true`;
        let url = baseUrl + queryParams;
        
        const response = await axios.get(url);
        const data = response.data;
        const photo = data.hits;
        const totalHits = data.totalHits;
        generateGallery(photo, totalHits);
        hit = totalHits;
    }

    function generateGallery(photo, totalHits) {
    const gallery = cardTpl(photo);
    
    total+= photo.length;
    console.log("total2",total);
    console.log(totalHits);
    console.log(photo.length);
    
    if (photo.length === 0) {
        more.classList.add("is-hidden");
        return Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');
    } else if (totalHits === total) {
        list.insertAdjacentHTML("beforeend", gallery);
        more.classList.add("is-hidden");
        return setTimeout(() => {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }, 300);
    }
   
    list.insertAdjacentHTML("beforeend", gallery);
    console.log(total);
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
            console.log("Загрузить больше");
            setPage();
            console.log(page);
            getImages();
        });
    }
        return { setQuery, loadMore, resetPage, getImages, message, resetTotal};
    }





 
    
   
   




