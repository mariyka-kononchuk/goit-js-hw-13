
import refs from "./refs.js";
const { 
        imageModal,
        divModal,
        buttonModal,
        overlayModal,
        arrowRightModal,
        arrowLeftModal
} = refs;
export function onOpenModal(evt) {
        if (evt.target.nodeName !== "IMG") {
            return;
        }
        evt.preventDefault();
        divModal.classList.add('is-open');
        imageModal.src = evt.target.dataset.source;
    imageModal.alt = evt.target.alt;
    console.log("ok");
        
        buttonModal.addEventListener('click', onCloseModal);
        overlayModal.addEventListener('click', onCloseModal);
        document.addEventListener('keydown', event => {
            if (event.code === "Escape") {
                onCloseModal();
            };
        })
        arrowRightModal.addEventListener('click', onClickArrowIconRight);
        arrowLeftModal.addEventListener('click', onClickArrowIconLeft);
        window.addEventListener('keydown', onArrow);
    
    function onClickArrowIconLeft() {
        const photosElg = document.querySelectorAll(".image");
        for (let i = 0; i < photosElg.length; i += 1) {
            if (photosElg[i].dataset.source === imageModal.src) {
                    if (i === 0) {
                        return;
                    };
                    imageModal.src = photosElg[i - 1].dataset.source;
                    imageModal.alt = photosElg[i - 1].alt;
                    return;
            }
        };
    };
    function onClickArrowIconRight() {
        const photosElk = document.querySelectorAll(".image");
        for (let i = 0; i < photosElk.length; i += 1) {
            if (photosElk[i].dataset.source === imageModal.src) {
                    if (i === photosElk.length - 1) {
                            return;
                        };
                    imageModal.src = photosElk[i + 1].dataset.source;
                    imageModal.alt = photosElk[i + 1].alt;
                    return;
            }
        };
    };


    function onArrow(evt) {
        const photosEl = document.querySelectorAll(".image");
        for (let i = 0; i < photosEl.length; i += 1) {
            if (photosEl[i].dataset.source === imageModal.src) {
                if (evt.code === "ArrowLeft") {
                    if (i === 0) {
                        return;
                    };
                    imageModal.src = photosEl[i - 1].dataset.source;
                    imageModal.alt = photosEl[i - 1].alt;
                    return;
                }
                if (evt.code === "ArrowRight") {
                        if (i === photosEl.length - 1) {
                            return;
                        };
                    imageModal.src = photosEl[i + 1].dataset.source;
                    imageModal.alt = photosEl[i + 1].alt;
                    return;
                };
            }
        };
    };
    
    function onCloseModal() {
        divModal.classList.remove('is-open');
        divModal.classList.add('is-close');
        imageModal.src = "";
        buttonModal.removeEventListener('click', onCloseModal);
        overlayModal.removeEventListener('click', onCloseModal);
        window.removeEventListener('keydown', onArrow);
    }
    }

    