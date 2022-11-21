
export function ramboSliderOn(NAME_ELEMENT = '.video-slider', swipeOn, _itemNum = '') {

    /*==========structure HTML============*/
    /*
    NAME_ELEMENT = 'video-slider'

    NAME_ELEMENT-container  
                NAME_ELEMENT-line-container
                            NAME_ELEMENT-line-container-img * 5

    NAME_ELEMENT-pagination-container                              
                NAME_ELEMENT-control [data-slide="prev"]
                NAME_ELEMENT-pagination  [data-slide-to="0"] 
                ...
                NAME_ELEMENT-pagination  [data-slide-to="4"]
                NAME_ELEMENT-control [data-slide="next"]
    */
    let refresh = true;
    let itemNumElement;

    if (_itemNum) {
        itemNumElement = document.querySelector(_itemNum);
    }

    const CLASS_INDICATOR_ACTIVE = 'active';
    const CLASS_ITEM_ACTIVE = 'active';
    const CONTROL_CLASS = NAME_ELEMENT.replace('.', '') + '-control';
    const SLIDER_ROOT_CLASS = NAME_ELEMENT + '-carousel';
    const SLIDER_TRANSITION_OFF = 'slider_disable-transition';

    // элементы слайдера 
    const ROOT = document.querySelector(SLIDER_ROOT_CLASS);

    const SLIDER_CONTAINER = document.querySelector(NAME_ELEMENT + '-container');
    const SLIDER_LINE = document.querySelector(NAME_ELEMENT + '-line-container');
    const SLIDER_ITEMS = document.querySelectorAll(NAME_ELEMENT + '-line-container-img');
    const SLIDER_PAGINATION_ITEMS = document.querySelectorAll(NAME_ELEMENT + '-pagination');

    let SLIDER_WIDTH = SLIDER_CONTAINER.offsetWidth;
    const COUNT_ITEMS = SLIDER_ITEMS.length;
    let ITEM_WIDTH = SLIDER_ITEMS[0].offsetWidth;
    let ITEMS_IN_VISIBLE_AREA = Math.round(SLIDER_WIDTH / ITEM_WIDTH);
    let TRANSFORM_STEP = 100 / ITEMS_IN_VISIBLE_AREA;

    // экстремальные значения слайдов
    let _minOrder = 0;
    let _maxOrder = 0;
    let _itemByMinOrder = 0;
    let _itemByMaxOrder = 0;
    let _itemWithMinOrder = null;
    let _itemWithMaxOrder = null;
    let _minTranslate = 0;
    let _maxTranslate = 0;
    // направление смены слайдов (по умолчанию)
    let _direction = 'next';
    // determines whether the position of item needs to be determined
    let _balancingItemsFlag = false;
    let _activeItems = [];
    // текущее значение трансформации
    let _transform = 0;
    // swipe параметры
    let _hasSwipeState = false;
    let _swipeStartPos = 0;


    //функция при инициализации окна браузера и на изменение размера окна, для создания констант
    function init() {

        // Настройки order и translate для элементов
        for (let i = 0; i < COUNT_ITEMS; i++) {
            SLIDER_ITEMS[i].dataset.index = i;
            SLIDER_ITEMS[i].dataset.order = i;
            SLIDER_ITEMS[i].dataset.translate = 0;
            if (i < ITEMS_IN_VISIBLE_AREA) {
                _activeItems.push(i);
            }
        }

        // перемещаем последний слайд перед первым
        let count = COUNT_ITEMS - 1;
        let translate = -COUNT_ITEMS * 100; // -500 если 5 элементов
        SLIDER_ITEMS[count].dataset.order = -1;
        SLIDER_ITEMS[count].dataset.translate = translate;
        SLIDER_ITEMS[count].style.transform = 'translateX(' + translate + '%)';

        refreshExtremeValues(); //расставляет order по элементам
        setActiveClass(); //устанавливает / удаляет класс active элементам
        if (_itemNum) {
            setItemNum();
        }
        addEventListeners(); // вешает слушателей 
        updateIndicators();
        //
    }

    //расставляет order по элементам
    function refreshExtremeValues() {
        _minOrder = +SLIDER_ITEMS[0].dataset.order;
        _maxOrder = _minOrder;
        _itemByMinOrder = SLIDER_ITEMS[0];
        _itemByMaxOrder = SLIDER_ITEMS[0];
        _minTranslate = +SLIDER_ITEMS[0].dataset.translate;
        _maxTranslate = _minTranslate;
        for (let i = 0; i < COUNT_ITEMS; i++) {
            let item = SLIDER_ITEMS[i];
            let order = +item.dataset.order;
            if (order < _minOrder) {
                _minOrder = order;
                _itemByMinOrder = item;
                _minTranslate = +item.dataset.translate;
            } else if (order > _maxOrder) {
                _maxOrder = order;
                _itemByMaxOrder = item;
                _minTranslate = +item.dataset.translate;
            }
        }
    }

    //считает какой по номеру слайд активный (для слайдера с одним видимым элементом)
    function setItemNum() {
        if (_itemNum !== '') {
            let activeNum = 0;
            for (let i = 0; i < SLIDER_ITEMS.length; i++) {
                if (SLIDER_ITEMS[i].classList.contains(CLASS_ITEM_ACTIVE)) {
                    activeNum = ++i;
                }
            }
            itemNumElement.innerHTML = (activeNum < 10) ? '0' + activeNum : activeNum;
        }
    }

    //устанавливает / удаляет класс active элементам 
    function setActiveClass() {
        let activeItems = _activeItems;

        for (let i = 0; i < COUNT_ITEMS; i++) {
            let item = SLIDER_ITEMS[i];
            let index = +item.dataset.index;
            if (activeItems.indexOf(index) > -1) {
                item.classList.add(CLASS_ITEM_ACTIVE);
            } else {
                item.classList.remove(CLASS_ITEM_ACTIVE);
            }
        }
    }

    // подключения обработчиков событий для слайдера
    function addEventListeners() {

        function onClick(e) {

            let target = e.target;

            if (target.classList.contains(CONTROL_CLASS)) {
                e.preventDefault();
                _direction = target.dataset.slide;
                move();
            } else if (target.dataset.slideTo) {
                let index = parseInt(target.dataset.slideTo);
                moveTo(index);
            }

        }

        function onTransitionStart() {
            if (_balancingItemsFlag) {
                return;
            }
            _balancingItemsFlag = true;
            window.requestAnimationFrame(balancingItems);
        }

        function onTransitionEnd() {
            _balancingItemsFlag = false;
        }

        function onResize() {
            window.requestAnimationFrame(doRefresh);
        }

        function onSwipeStart(e) {

            let event = e.type.search('touch') === 0 ? e.touches[0] : e;
            _swipeStartPos = event.clientX;
            _hasSwipeState = true;
        }
        function onSwipeEnd(e) {
            if (!_hasSwipeState) {
                return;
            }
            let event = e.type.search('touch') === 0 ? e.changedTouches[0] : e;
            let diffPos = _swipeStartPos - event.clientX;
            if (diffPos > 50) {
                _direction = 'next';
                move();
            } else if (diffPos < -50) {
                _direction = 'prev';
                move();
            }
            _hasSwipeState = false;

        }
        function onDragStart(e) {
            e.preventDefault();
        }

        ROOT.addEventListener('click', onClick);

        // on resize
        if (refresh) {
            window.addEventListener('resize', onResize);
        }

        // on transitionstart and transitionend
        SLIDER_LINE.addEventListener('transition-start', onTransitionStart);
        SLIDER_LINE.addEventListener('transitionend', onTransitionEnd);

        if (swipeOn) {
            ROOT.addEventListener('touchstart', onSwipeStart);
            ROOT.addEventListener('mousedown', onSwipeStart);
            document.addEventListener('touchend', onSwipeEnd);
            document.addEventListener('mouseup', onSwipeEnd);
        }

        ROOT.addEventListener('dragstart', onDragStart);

    }


    // обновить индикаторы (точки)
    function updateIndicators() {
        if (!SLIDER_PAGINATION_ITEMS.length) {
            return;
        }
        for (let index = 0; index < COUNT_ITEMS; index++) {
            let item = SLIDER_ITEMS[index];
            if (item.classList.contains(CLASS_ITEM_ACTIVE)) {
                SLIDER_PAGINATION_ITEMS[index].classList.add(CLASS_ITEM_ACTIVE);
            } else {
                SLIDER_PAGINATION_ITEMS[index].classList.remove(CLASS_ITEM_ACTIVE);
            }
        }
    }


    function doRefresh() {
        let itemList = SLIDER_ITEMS;
        let widthItem = SLIDER_ITEMS[0].offsetWidth;
        let widthWrapper = SLIDER_CONTAINER.offsetWidth;
        let itemsInVisibleArea = Math.round(widthWrapper / widthItem);

        if (itemsInVisibleArea === ITEMS_IN_VISIBLE_AREA) {
            return;
        }

        SLIDER_LINE.classList.add(SLIDER_TRANSITION_OFF);
        SLIDER_LINE.style.transform = 'translateX(0)';

        // после reset
        ITEM_WIDTH = widthItem;
        SLIDER_WIDTH = widthWrapper;
        ITEMS_IN_VISIBLE_AREA = itemsInVisibleArea;
        _transform = 0;
        TRANSFORM_STEP = 100 / itemsInVisibleArea;
        _balancingItemsFlag = false;
        _activeItems = [];

        // настройка order и translate элементов после перезагрузки
        for (let i = 0, length = itemList.length; i < length; i++) {
            let item = itemList[i];
            let position = i;
            item.dataset.index = position;
            item.dataset.order = position;
            item.dataset.translate = 0;
            item.style.transform = 'translateX(0)';
            if (position < itemsInVisibleArea) {
                _activeItems.push(position);
            }
        }

        setActiveClass();
        if (_itemNum) {
            setItemNum();
        }
        updateIndicators();
        window.requestAnimationFrame(
            function () {
                SLIDER_LINE.classList.remove(SLIDER_TRANSITION_OFF);
            }
        );

        // переместить последний итем перед первым
        let count = SLIDER_ITEMS.length - 1;
        let translate = -SLIDER_ITEMS.length * 100;
        SLIDER_ITEMS[count].dataset.order = -1;
        SLIDER_ITEMS[count].dataset.translate = -SLIDER_ITEMS.length * 100;
        SLIDER_ITEMS[count].style.transform = 'translateX('.concat(translate, '%)');
        // обновить значения
        refreshExtremeValues();

    }

    // перемещение слайдов
    function move() {
        let step = _direction ===
            'next' ? -TRANSFORM_STEP : TRANSFORM_STEP;
        let transform = _transform + step;

        let activeIndex = [];
        let i = 0;
        let length;
        let index;
        let newIndex;
        if (_direction === 'next') {
            for (i = 0, length = _activeItems.length; i < length; i++) {
                index = _activeItems[i];
                newIndex = ++index;
                if (newIndex > SLIDER_ITEMS.length - 1) {
                    newIndex -= SLIDER_ITEMS.length;
                }
                activeIndex.push(newIndex);
            }
        } else {
            for (i = 0, length = _activeItems.length; i < length; i++) {
                index = _activeItems[i];
                newIndex = --index;
                if (newIndex < 0) {
                    newIndex += SLIDER_ITEMS.length;
                }
                activeIndex.push(newIndex);
            }
        }
        _activeItems = activeIndex;
        setActiveClass();
        if (_itemNum) {
            setItemNum();
        }
        updateIndicators();
        _transform = transform;
        SLIDER_LINE.style.transform = 'translateX(' + transform + '%)';
        SLIDER_LINE.dispatchEvent(new CustomEvent('transition-start', { bubbles: true }));
    }

    // обновляет позицию элементов
    function balancingItems() {
        if (!_balancingItemsFlag) {
            return;
        }
        let wrapper = SLIDER_CONTAINER; // video-slider-container> video-slider-line-container > (video-slider-line-container-img >) x 5
        let wrapperClientRect = wrapper.getBoundingClientRect(); //возвращает координаты в контексте окна для минимального по размеру прямоугольника, который заключает в себе элемент elem
        let widthHalfItem = wrapperClientRect.width / ITEMS_IN_VISIBLE_AREA / 2; //ширина половины элемента
        let count = SLIDER_ITEMS.length; //количество элементов
        let translate;
        let clientRect;
        if (_direction === 'next') {
            let wrapperLeft = wrapperClientRect.left; //отступ от левого края 
            let min = _itemByMinOrder; //элемент с минимальным ордером
            translate = _minTranslate; //смещение у элемента с минимальным ордером
            clientRect = min.getBoundingClientRect(); // квадрат элемента с минимальным ордером 
            // если элемент который находится справа от отображаемой рамки, уходит влево на половину ширины элемента
            // то увеличиваем ему ордер и смещение, что бы переместить его справа от видимой рамки
            if (clientRect.right < wrapperLeft - widthHalfItem) {
                min.dataset.order = _minOrder + count;
                translate += count * 100;
                min.dataset.translate = translate;
                min.style.transform = 'translateX('.concat(translate, '%)');
                // обновляем максимальный и минимальный ордер и смещение
                refreshExtremeValues();
            }
        } else {
            let wrapperRight = wrapperClientRect.right;
            let max = _itemByMaxOrder;
            translate = _maxTranslate;
            clientRect = max.getBoundingClientRect();
            if (clientRect.left > wrapperRight + widthHalfItem) {
                max.dataset.order = _maxOrder - count;
                translate -= count * 100;
                max.dataset.translate = translate;
                max.style.transform = 'translateX('.concat(translate, '%)');
                // обновляем максимальный и минимальный ордер и смещение
                refreshExtremeValues();
            }
        }
        //если есть возможность между анимациями выполняется опять балансировка
        requestAnimationFrame(balancingItems);
    }

    // перейти к элементу
    function moveTo(index) {
        let indicatorList = SLIDER_PAGINATION_ITEMS;
        let nearestIndex = null;
        let diff = null;
        let i;
        let length;
        for (i = 0, length = indicatorList.length; i < length; i++) {
            let indicator = indicatorList[i];
            if (indicator.classList.contains(CLASS_INDICATOR_ACTIVE)) {
                let slideTo = +indicator.dataset.slideTo;
                if (diff === null) {
                    nearestIndex = slideTo;
                    diff = Math.abs(index - nearestIndex);
                } else {
                    if (Math.abs(index - slideTo) < diff) {
                        nearestIndex = slideTo;
                        diff = Math.abs(index - nearestIndex);
                    }
                }
            }
        }

        diff = index - nearestIndex;
        if (diff === 0) {
            return;
        }
        _direction = diff > 0 ? 'next' : 'prev';
        for (i = 1; i <= Math.abs(diff); i++) {
            move();
        }
    }

    init();


}

export function addPaddingOnResizeSlides() {
    window.addEventListener('resize', () => {
        addPaddingOnResizeWindow();
    });

    function addPaddingOnResizeWindow() {
        // debugger;
        let slide = document.querySelector('.video-slider-line-container-img iframe');
        let slides = document.querySelectorAll('.video-slider-line-container-img');
        let videoSliderContainer = document.querySelector('.video-slider-container').offsetWidth;
        let countSlides = videoSliderContainer > 950 ? 3 : 2;


        let remaningSpace = videoSliderContainer - (slide.offsetWidth * countSlides);
        let paddingAround = (remaningSpace / countSlides) / 2;
        if (remaningSpace > 0) {
            for (let i = 0; i < slides.length; i++) {
                slides[i].style.paddingLeft = paddingAround + 'px';
                slides[i].style.paddingRight = paddingAround + 'px';
            }
        }
    }

    addPaddingOnResizeWindow();
}

// export default ramboSliderOn;