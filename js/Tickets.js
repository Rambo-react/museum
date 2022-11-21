
//basic 20, 25, 40
//senior = 10, 
//senior = basic / 2


export function ticketsCalcOn() {

    const modalTicketType = document.querySelector('#modal-ticket-type');
    const ticketTypes = document.querySelectorAll('#ticket-type');
    const ticketBasicTypeCost = document.querySelector('#ticket-basic-type-cost');
    const ticketSeniorTypeCost = document.querySelector('#ticket-senior-type-cost');

    const ticketsTypeValue = document.querySelector('#tickets-type-value');

    //add listeners to ticket types
    modalTicketType.addEventListener('blur', () => {
        modalTicketType.classList.remove('drop');
    });
    modalTicketType.addEventListener('click', () => {
        modalTicketType.classList.toggle('drop');
    });

    for (let i = 0; i < ticketTypes.length; i++) {
        ticketTypes[i].addEventListener('click', (e) => changeTicketsType(e));
    }
    modalTicketType.addEventListener('change', (e) => changeTicketsType(e));

    function changeTicketsType(e) {

        if (e.target.id == 'ticket-type') {
            modalTicketType.value = e.target.value;
        }

        if (e.target.id == 'modal-ticket-type') {
            ticketTypes[e.target.value].checked = true;
        }

        ticketsTypeValue.innerHTML = modalTicketType.options[modalTicketType.selectedIndex].text;

        changeCostOfTickets(e.target.value);
        ticketsCalcCost();

    }

    function changeCostOfTickets(number) {
        switch (number) {
            case '0': ticketBasicTypeCost.innerHTML = 20;
                ticketSeniorTypeCost.innerHTML = 10;
                break;
            case '1': ticketBasicTypeCost.innerHTML = 25;
                ticketSeniorTypeCost.innerHTML = 12.5;
                break;
            case '2': ticketBasicTypeCost.innerHTML = 40;
                ticketSeniorTypeCost.innerHTML = 20;
                break;
            default: ticketBasicTypeCost.innerHTML = 20;
                ticketSeniorTypeCost.innerHTML = 10;
                break;
        }
    }

    //basic buttons add listeners

    const basicButtonsIncrement = document.querySelectorAll('#ticket-basic-increment');
    const basicButtonsDecrement = document.querySelectorAll('#ticket-basic-decrement');
    const seniorButtonsIncrement = document.querySelectorAll('#ticket-senior-increment');
    const seniorButtonsDecrement = document.querySelectorAll('#ticket-senior-decrement');


    for (let i = 0; i < basicButtonsIncrement.length; i++) {
        basicButtonsIncrement[i].addEventListener('click', () => { ticketsIncrement('basic') });
        seniorButtonsIncrement[i].addEventListener('click', () => { ticketsIncrement('senior') });
        basicButtonsDecrement[i].addEventListener('click', () => { ticketsDecrement('basic') });
        seniorButtonsDecrement[i].addEventListener('click', () => { ticketsDecrement('senior') });
    }

    function ticketsIncrement(type) {
        let tickets = document.querySelectorAll(`#ticket-${type}`);
        for (let i = 0; i < tickets.length; i++) {
            let item = tickets[i];
            let num = Number(item.innerHTML);
            item.innerHTML = num + 1;
        }
        ticketsCalcCost();
    }

    function ticketsDecrement(type) {
        let tickets = document.querySelectorAll(`#ticket-${type}`);
        if (+tickets[0].innerHTML > 0) {
            for (let i = 0; i < tickets.length; i++) {
                let item = tickets[i];
                let num = Number(item.innerHTML);
                item.innerHTML = num - 1;
            }
        }
        ticketsCalcCost();
    }

    function ticketsCalcCost() {

        let countBasic = Number(document.querySelector('#ticket-basic').innerHTML);
        let countSenior = Number(document.querySelector('#ticket-senior').innerHTML);
        let ticketTypes = document.querySelectorAll('#ticket-type');
        let totalCosts = document.querySelectorAll('#tickets-total');

        let type = 0;
        let costBasic = 0;
        let costSenior = 0;
        let totalCost = 0;

        //find checked type
        for (let i = 0; i < ticketTypes.length; i++) {
            if (ticketTypes[i].checked) {
                type = i;
                break;
            }
        }

        switch (type) {
            case 0: costBasic = countBasic * 20;
                break;
            case 1: costBasic = countBasic * 25;
                break;
            case 2: costBasic = countBasic * 40;
                break;
            default: costBasic = countBasic * 20;
                break;
        }

        switch (type) {
            case 0: costSenior = countSenior * 10;
                break;
            case 1: costSenior = countSenior * 12.5;
                break;
            case 2: costSenior = countSenior * 20;
                break;
            default: costSenior = countSenior * 10;
                break;
        }

        document.querySelector('#ticket-basic-total').innerHTML = costBasic;
        document.querySelector('#ticket-senior-total').innerHTML = costSenior;

        totalCost = costBasic + costSenior;

        for (let i = 0; i < totalCosts.length; i++) {
            totalCosts[i].innerHTML = totalCost;
        }

    }

}

export function ticketsTime() {

    let ticketsDate = document.querySelector('#tickets-date');
    let ticketsTime = document.querySelector('#tickets-time');
    let ticketsTimeValue = document.querySelector('#tickets-time-value');

    createMinDateForInput();

    ticketsDate.addEventListener('focus', (e) => e.target.type = 'date');
    ticketsDate.addEventListener('blur', (e) => { if (e.target.value == '') { e.target.type = 'text' } });
    ticketsDate.addEventListener('change', (e) => { ticketsDateChange(e) });

    ticketsTime.addEventListener('focus', () => { ticketsTime.type = 'time' });
    ticketsTime.addEventListener('blur', () => { if (ticketsTime.value == '') { ticketsTime.type = 'text' } });
    ticketsTime.addEventListener('change', (e) => { ticketsTimeChange(e) });

    function ticketsDateChange(e) {

        let selectedDate = new Date(e.target.value);
        let ticketsDateValue = document.querySelector('#tickets-date-value');

        function getWeekDay(date) {
            let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            return days[date.getDay()];
        }

        function getMonthName(date) {
            let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            return monthNames[date.getMonth()];
        }

        let day = String(selectedDate.getDate());
        let month = getMonthName(selectedDate);
        let weekday = getWeekDay(selectedDate);

        ticketsDateValue.innerHTML = `${weekday}, ${month} ${day}`;
    }

    function ticketsTimeChange(e) {
        ticketsTimeValue.innerHTML = e.target.value.replace(':', ' : ');
    }

    function createMinDateForInput() {

        function formatDate(date) {

            let dd = date.getDate();
            if (dd < 10) dd = '0' + dd;

            let mm = date.getMonth() + 1;
            if (mm < 10) mm = '0' + mm;

            let yyyy = date.getFullYear();

            return yyyy + '-' + mm + '-' + dd;
        }
        ticketsDate.setAttribute('min', formatDate(new Date()));
    }
}

export function cardNumberControls() {

    let cardMonth = document.querySelector('#card-month');
    let cardYear = document.querySelector('#card-year');
    cardMonth.value = new Date().getMonth();
    cardYear.value = new Date().getFullYear();

    document.querySelector('#card-month-increment').addEventListener('click', () => {
        cardMonth.value = Number(cardMonth.value) + 1;
        if (Number(cardMonth.value) > 12) {
            cardMonth.value = 1;
        }
    });
    document.querySelector('#card-month-decrement').addEventListener('click', () => {
        cardMonth.value = Number(cardMonth.value) - 1;
        if (Number(cardMonth.value) < 1) {
            cardMonth.value = 12;
        }
    });

    document.querySelector('#card-year-increment').addEventListener('click', () => {
        cardYear.value = Number(cardYear.value) + 1;
    });
    document.querySelector('#card-year-decrement').addEventListener('click', () => {
        if (Number(cardYear.value) > 0) {
            cardYear.value = Number(cardYear.value) - 1;
        }
    });

}

