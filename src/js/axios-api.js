import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "regenerator-runtime";
import cardTpl from '../templates/gallery.hbs';
import refs from "./refs.js";
const { form, list, galleryList, more, imageModal,divModal, buttonModal,overlayModal} = refs;


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
    let per_page = 5;
    let query = "";
    let hit = 0;
    let total = 0;

    function resetTotal() {
        return total = 0;
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

        //console.log(data.hits[i]);
        generateGallery(photo, totalHits);
        hit = totalHits;
    }

    function generateGallery(photo, totalHits) {
       
        //photo.forEach(element => console.log(element));
        //photo.indexOf(1);
        const gallery = cardTpl(photo);
        total += photo.length;
        console.log("массив", photo);
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

        galleryList.addEventListener('click', onOpenModal);
        
        const images = document.querySelectorAll('.image');
        console.log(images);
        for (const image of images) {
        image.dataset.index = 1;
        }
        return total;
    }
        

    
    function onOpenModal(evt) {
//         var lightbox = new SimpleLightbox({
//     elements: document.querySelectorAll('.gallery-list')
// });
//         lightbox.show();
        
        if (evt.target.nodeName !== "IMG") {
            return;
        }
        evt.preventDefault();
        divModal.classList.add('is-open');
        imageModal.src = evt.target.dataset.source;
        imageModal.alt = evt.target.alt;
        
        buttonModal.addEventListener('click', onCloseModal);
        overlayModal.addEventListener('click', onCloseModal);
        window.addEventListener('keydown', onArrow);
            
        function onArrow(evt) {
            const photosEl = document.querySelectorAll(".image");
            for (let i = 0; i < photosEl.length; i += 1) {
                if (photosEl[i].dataset.source === imageModal.src) {
                    if (evt.code === "ArrowLeft") {
                        if (i === 0) {
                             return;
                        };
                        console.log("ok");
                        console.log("ura", i);
                        imageModal.src = photosEl[i - 1].dataset.source;
                        imageModal.alt = photosEl[i - 1].alt;
                        return;
                    }
                    if (evt.code === "ArrowRight") {
                        console.log("ok");
                        if (i === photosEl.length - 1) {
                            return;
                        };
                        console.log("ura",i);
                        imageModal.src = photosEl[i + 1].dataset.source;
                        imageModal.alt = photosEl[i + 1].alt;
                        return;
                    };
                }
            };  
        };
        
        document.addEventListener('keydown', event => {
            if (event.code === "Escape") {
                onCloseModal();
            };
        })
    }

    function onCloseModal() {
        divModal.classList.remove('is-open');
        divModal.classList.add('is-close');
        imageModal.src = "";
        buttonModal.removeEventListener('click', onCloseModal);
        overlayModal.removeEventListener('click', onCloseModal);
        window.removeEventListener('keydown', onArrowRight);
        window.removeEventListener('keydown', onArrowLeft);
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
    
        return { setQuery, loadMore, resetPage, getImages, message, resetTotal, onCloseModal };
    }


    


 
 //библиотека SimpleLightbox
//    let gallery = new SimpleLightbox('.image', { sourceAttr });
// var lightbox = ('.gallery a').simpleLightbox({ /* options */ });
// gallery.on('show.simplelightbox', function () {
//     console.log("библиотека");
// });
// gallery.open();
   




