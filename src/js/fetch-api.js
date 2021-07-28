import cardTpl from '../templates/gallery.hbs';
import refs from "./refs.js";
const { form, list, galleryList, more } = refs;
import { onOpenModal} from "./modal";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";

form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    //зачищаем список отрисовки
    list.innerHTML = "";
    //сбрасываем параметр страницы
    fetchObject.resetPage();
    let query = evt.target.elements.searchQuery.value.trim();
    //обнуляем значение total
    fetchObject.resetTotal();
    //записываем полученное значение из инпута в свойство объекта с запросом
    fetchObject.setQuery(query);
    //делаем запрос по значению из инпута и отрисовываем первый ответ
    fetchObject.getFetch();
    //выводим сообщение о том, сколько нашли изображений
    setTimeout(() => {
        fetchObject.message();
  }, 300);
    //открываем кнопку загрузки
    more.classList.remove("is-hidden");
    //зачищаем инпут
    form.reset();
})

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
    //КЛАССИЧЕСКАЯ МОДАЛКА: переход между картинками реализован с помощью индекса массива изображений
    //galleryList.addEventListener('click', onOpenModal);

    //МОДАЛКА ИЗ БИБЛИОТЕКИ Simplelightbox
    openSimpleLightboxModal();
    
    return  total;
}

const fetchObject = {
    //ключ, полученный при регистрации у pexels.com
    apiKey: "22651538-53630abe578d2561aeb41817a", //22644701-27c25a1ec01fdb795c4f20639
    //статическая неизменяемая часть строки запроса
    baseUrl: "https://pixabay.com/api/",
    //переменная, указывающая порядковый номер набора картинок, который мы сейчас получаем
    page: 1,
    //переменная, указывающая на количество найденных элементов по запросу на одной странцие
    per_page: 40, 
    query: "",
    hit: 0,
    total:0,
    resetTotal() {
        return total=0;
    },
    setQuery(value) {
        return this.query = value;
    },
    //метод изменения страницы
    setPage() {
        return this.page += 1;
    },
    resetPage() {
        return this.page = 1;
    },
    //синхронный код
    // getFetch() {
        
    //     let queryParams = `?key=${this.apiKey}&q=${this.query}&image_type=photo&per_page=${this.per_page}&page=${this.page}&orientation=horizontal&safesearch=true`;
    //     //готовая строка запроса
    //     let url = this.baseUrl + queryParams;
    //     //собственно запрос, который будем обрабатывать методами then, потому что он возвращает промис
    //     fetch(url).then((response) => {
    //         //console.log(response);
    //         return response.json();
    //     }).then((hits) => {
    //         console.log(hits);
    //         let image = hits.hits;
    //         let totalHits = hits.totalHits;
    //         console.log(image);
    //         console.log(totalHits);
    //         return { image, totalHits };
    //     }).then(({ image, totalHits }) => {
    //         console.log(image);
    //         console.log(totalHits);
    //         generateGallery(image, totalHits);
    //         this.hit = totalHits;
    //         console.log("кол-во картинок", totalHits)
    //         console.log("хит",this.hit);
    //         return this.hit = totalHits;
            
    //     })
    // },
//асинхронный код
     async getFetch() {
        
        let queryParams = `?key=${this.apiKey}&q=${this.query}&image_type=photo&per_page=${this.per_page}&page=${this.page}&orientation=horizontal&safesearch=true`;
        //готовая строка запроса
        let url = this.baseUrl + queryParams;
        //собственно запрос, который будем обрабатывать методами then, потому что он возвращает промис
        
         const response = await fetch(url);
         const hits = await response.json();
         const image = hits.hits;
         const totalHits = hits.totalHits;
         generateGallery(image, totalHits);
         return this.hit = totalHits;
    },
    message() {
        if (this.hit === 0) {
            return;
        }
        return Notiflix.Notify.info(`Hooray! We found ${this.hit} images.`);
    },
    loadMore(button) {
        button.addEventListener("click", () => {
            console.log('загрузить больше');
            this.setPage();
            console.log(this.page);
            this.getFetch();
        });
    },
    openSimpleLightboxModal() {
        const lightbox = new SimpleLightbox('.gallery a', {elements: '.gallery a'} );
        lightbox.on('show.simplelightbox', function () {
            galleryList.addEventListener('click', evt => evt.preventDefault());
        });
    }
};

fetchObject.loadMore(more);

