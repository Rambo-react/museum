function galleryOn() {

    function createGallery() {
        const pictureInnerContainer = document.querySelector('.picture-inner-container');
        const arrayImages = [];
    
        for (let i = 1; i <= 15; i++) {
            arrayImages.push(i);
        }
    
        shuffle(arrayImages);
    
        arrayImages.map((item) => {
            let img = `<img class="gallery-img" src="./assets/img/galery/galery${item}.jpg" alt="galery${item}">`;
            pictureInnerContainer.innerHTML += img;
        });
    
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
    }
    
    function animateGallery() {
        const animItems = document.querySelectorAll('.gallery-img');
    
        if (animItems.length > 0) {
            window.addEventListener('scroll', animOnScroll);
            function animOnScroll() {
                for (let index = 0; index < animItems.length; index++) {
                    const animItem = animItems[index];
                    const animItemHeight = animItem.offsetHeight;
                    //на сколько обьект находится ниже чем верх страницы
                    const animItemOffset = offset(animItem).top;
                    //коофициент старта анимации 
                    const animStart = 6;
    
                    let animItemPoint = window.innerHeight - animItemHeight / animStart;
    
                    if (animItemHeight > window.innerHeight) {
                        animItemPoint = window.innerHeight - window.innerHeight / animStart;
                    }
    
                    if ((window.pageYOffset > animItemOffset - animItemPoint) && window.pageYOffset < (animItemOffset + animItemHeight)) {
                        animItem.classList.add('gallery-img_active');
                        animItem.classList.add('gallery-img_no-hide');
                    } else {
                        if (!animItem.classList.contains('gallery-img_no-hide')) {
                            animItem.classList.remove('gallery-img_active');
                        }
                    }
    
                }
            }
            function offset(el) {
                const rect = el.getBoundingClientRect(),
                    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
            }
            setTimeout(() => {animOnScroll()}
                , 2000);
        }
    }
    
    
    createGallery();
    animateGallery();
    
}

export default galleryOn;