
import SimpleLightbox from "simplelightbox";



// gallery.open();
let gallery = new SimpleLightbox('.image');
gallery.on('show.simplelightbox', function () {
    console.log("библиотека");
});
gallery.open();