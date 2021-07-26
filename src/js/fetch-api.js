import cardTpl from '../templates/gallery.hbs';
import refs from "./refs.js";
const { form, list, card, more } = refs;
import Notiflix from "notiflix";

form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    //зачищаем список отрисовки
    list.innerHTML = "";
    //сбрасываем параметр страницы
    fetchObject.resetPage();
    console.log(evt.target.elements.searchQuery.value);
    let query = evt.target.elements.searchQuery.value.trim();
    //записываем полученное значение из инпута в свойство объекта с запросом
    fetchObject.setQuery(query);
    //делаем запрос по значению из инпута и отрисовываем первый ответ
    fetchObject.getFetch();
    //открываем кнопку загрузки
    more.classList.remove("is-hidden");
    //зачищаем инпут
    form.reset();
})
// function generateGallery(array, place) {
//     const items = array.map((photo) => {
//         return `<li><img src=${photo.src.tiny} alt=${photo.src.photographer}></li>`
//     }).join("");
//     place.insertAdjacentHTML("beforeend", items);
//     card.innerHTML = cardTpl(items);
// }
let total = 0;
function generateGallery(photo, hit) {
    const gallery = cardTpl(photo);
    
    total+= photo.length;
    
    console.log(hit);
    console.log(photo.length);
    
    if (photo.length === 0) {
        return Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');
    } else if (hit === total) {
        
        list.insertAdjacentHTML("beforeend", gallery);
        more.classList.add("is-hidden");
        return Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
    
    list.insertAdjacentHTML("beforeend", gallery);
    console.log(total);
    return total;
}

const fetchObject = {
    //ключ, полученный при регистрации у pexels.com
    apiKey: "22651538-53630abe578d2561aeb41817a", //22644701-27c25a1ec01fdb795c4f20639
    //статическая неизменяемая часть строки запроса
    baseUrl: "https://pixabay.com/api/",
    //переменная хранит значение, по которому мы ищем картинки

    //console.log(evt.target.elements.search.value);
    //переменная, указывающая порядковый номер набора картинок, который мы сейчас получаем
    page: 1,
    //переменная, указывающая на количество найденных элементов по запросу на одной странцие
    per_page: 4, //позже сделать 40
    //метод изменения страницы
    query: "",
    setQuery(value) {
        return this.query = value;
    },
    setPage() {
        return this.page += 1;
    },
    resetPage() {
        return this.page = 1;
    },
    getFetch() {
        let queryParams = `?key=${this.apiKey}&q=${this.query}&image_type=photo&per_page=${this.per_page}&page=${this.page}`;
        //готовая строка запроса
        let url = this.baseUrl + queryParams;
        //собственно запрос, который будем обрабатывать методами then, потому что он возвращает промис
        fetch(url).then((response) => {
            //console.log(response);
            return response.json();
        }).then((hits) => {
            console.log(hits);
            let image = hits.hits;
            let hit = hits.totalHits;
            console.log(image);
            console.log(hit);
            return { image, hit };
        }).then(({image, hit}) => {
            console.log(image);
            console.log(hit);
            generateGallery(image, hit);
        })
    },
    loadMore(button) {
        button.addEventListener("click", () => {
            console.log('загрузить больше');
            this.setPage();
            console.log(this.page);
            this.getFetch();
        });
    },
    //вторая изменяемая часть строки запроса, содержащая параметры согласно документации
};

fetchObject.loadMore(more);