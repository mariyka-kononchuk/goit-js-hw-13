import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "regenerator-runtime";
import { onOpenModal} from "./modal";
import cardTpl from '../templates/gallery.hbs';
import refs from "./refs.js";
const { form, list, galleryList, more} = refs;


const baseUrl = "https://pixabay.com/api/";
axios.defaults.baseURL = baseUrl;
const apiKey = "22651538-53630abe578d2561aeb41817a";

const myFetch = getFetch();
const { setQuery, getImages, loadMore, resetPage, resetTotal, message } = myFetch;

form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    let query = evt.target.elements.searchQuery.value.trim()
    if (query === "") {
         return;
    };
    //зачищаем список отрисовки
    list.innerHTML = "";
    //сбрасываем параметр страницы
    resetPage();
    //обнуляем значение total
    resetTotal();
    //записываем полученное значение из инпута в свойство объекта с запросом
    setQuery(query);
    //делаем запрос по значению из инпута и отрисовываем первый ответ
    getImages();
    //выводим сообщение о том, сколько нашли изображений
    setTimeout(() => {
        message();
    }, 300);
    //открываем кнопку загрузки
    more.classList.remove("is-hidden");
    //зачищаем инпут
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
        const photo = data.hits;
        const totalHits = data.totalHits;

        generateGallery(photo, totalHits);
        hit = totalHits;
    }

    function generateGallery(photo, totalHits) {
        const gallery = cardTpl(photo);
        //общее к-во выведенных картинок
        total += photo.length;
        //если ничего не нашли по запросу (получили пустой массив)
        if (photo.length === 0) {
            more.classList.add("is-hidden");
            return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        }
        //если к-во отображенных картинок стало равно общему к-ву найденных по запросу картинок
            else if (totalHits === total) {
                list.insertAdjacentHTML("beforeend", gallery);
                more.classList.add("is-hidden");
                return setTimeout(() => {
                    Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
                }, 300);
        }
        //вставляем шаблон в разметку с заполенными параметрами
        list.insertAdjacentHTML("beforeend", gallery);
        //КЛАССИЧЕСКАЯ МОДАЛКА: переход между картинками реализован с помощью индекса массива изображений
        //galleryList.addEventListener('click', onOpenModal);

        //МОДАЛКА ИЗ БИБЛИОТЕКИ Simplelightbox
        openSimpleLightboxModal();
        //плавная прокрутка
        pageScroll()
        return total;
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

    function openSimpleLightboxModal() {
        const lightbox = new SimpleLightbox('.gallery a', {elements: '.gallery a'} );
        lightbox.on('show.simplelightbox', function () {
            galleryList.addEventListener('click', evt => evt.preventDefault());
        });
    }

    function pageScroll() {
            const { height: cardHeight } = document
                .querySelector('.gallery')
                .firstElementChild.getBoundingClientRect();
                window.scrollBy({
                    top: cardHeight * 2,
                    behavior: 'smooth',
                });
    }
    
    return { setQuery, loadMore, resetPage, getImages, message, resetTotal};
}


    


 
   




