function initComparisons() {
    let x, i;
    /*ищем все элементы с классом img-comp-overlay*/
    x = document.querySelectorAll('.img-comp-overlay');
    for (i = 0; i < x.length; i++) {
      /*для каждого элемента выполняем функцию и передаем его в качестве аргумента*/
      compareImages(x[i]);
    }

    function compareImages(img) {
      let slider, w, h, clicked = 0; 
      /*получаем ширину и высоту элемента (картинки)*/
      let containerSlider = document.querySelector('.explore-slider');
      w  = containerSlider.offsetWidth;
      h  = containerSlider.offsetHeight;
      // w = img.offsetWidth;
      // h = img.offsetHeight;
      /*устанавливаем ширину элемента(картинки) 50%:*/
      img.style.width = (w / 2) + "px";
      /*создаем ползунок :*/
      slider = document.createElement("DIV");
      slider.setAttribute("class", "img-comp-slider");
      /*вставляем ползунок перед дивом с картинкой с классом  img-comp-overlay*/
      img.parentElement.insertBefore(slider, img);
      /*определям позицию слайреда по центру*/
      slider.style.top = (h / 2) - (slider.offsetHeight / 2) + "px";
      slider.style.left = (w / 2) - (slider.offsetWidth / 2) + "px";
      /*вешаем обработчики событий*/
      slider.addEventListener("mousedown", slideReady);
      window.addEventListener("mouseup", slideFinish);
      slider.addEventListener("touchstart", slideReady);
      window.addEventListener("touchstop", slideFinish);

      function slideReady(e) {
        /*предотвращаем любые другие действия пр перемещении по изображению*/
        e.preventDefault();
        /*на ползунок нажали и он готов к перемещению*/
        clicked = 1;
        /*выполнить функции при перемещении ползунка*/
        window.addEventListener("mousemove", slideMove);
        window.addEventListener("touchmove", slideMove);
      }

      function slideFinish() {
        /*ползунок больше не задействован(не нажимается)*/
        clicked = 0;
      }

      function slideMove(e) {
        let pos;
        /*если ползунок больше не нажимается то выйти из этой функции*/
        if (clicked == 0) return false;
        /*получаем позицию курсора по Х относительно картинки*/
        pos = getCursorPos(e)
        /*ограничиваем выход за рамки изображения ползунка*/
        if (pos < 0) pos = 0;
        if (pos > w) pos = w;
        /*выполняем функцию, которая изменит размер наложенного изображения в соответствии с курсором*/
        slide(pos);
      }

      function getCursorPos(e) {
        let a, x = 0;
        /* window.event - возвращает Event который в настоящее время обрабатывается с помощью кода сайта*/
        e = e || window.event;
        /*получаем позицию картинки по Х, для этого берем обьект- прямоугольник изображения*/
        a = img.getBoundingClientRect();
        /*вычислить координату Х курсора относительно изображения:*/
        x = e.pageX - a.left;
        /*вычитаем прокрутку страницы, если есть*/
        x = x - window.pageXOffset;
        return x;
      }

      function slide(x) {
        /*изменяем размер изображения*/
        img.style.width = x + "px";
        /*меячнем позицию ползунка*/
        slider.style.left = img.offsetWidth - (slider.offsetWidth / 2) + "px";
      }
    }
  }

  export default initComparisons;