export default function modalWindowOn() {
let modalWindowWrapper = document.querySelector('.booking-tickets');
let modalWindow = document.querySelector('.booking-tickets__container');  
let buttonShowModal = document.querySelector('#button-show-modal');
let buttonCloseModal = document.querySelector('#button-close-modal');

    buttonCloseModal.addEventListener('click', (e)=>{
        e.preventDefault();
        modalWindowWrapper.classList.add('booking-tickets_hidden');
        modalWindow.classList.add('booking-tickets__container_hidden');
    });

    buttonShowModal.addEventListener('click', (e)=>{
        e.preventDefault();
        modalWindowWrapper.classList.remove('booking-tickets_hidden');
        modalWindow.classList.remove('booking-tickets__container_hidden');
    });
}