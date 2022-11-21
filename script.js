import {progressAddListener,videoPlayerOn} from './js/Video-player.js'
import {ramboSliderOn , addPaddingOnResizeSlides} from './js/Rambo-slider.js'
import initComparisons from './js/Image-comparison-slider.js'
import createMap from './js/Map-box.js'
import {ticketsCalcOn, ticketsTime, cardNumberControls} from './js/Tickets.js'
import galleryOn from './js/Gallery.js'
import modalWindowOn from './js/Modal.js'

//GALLERY
galleryOn();

//WELCOME
ramboSliderOn('.welcome-slider', true, '.slide-num');

//EXPLORE
initComparisons();

//VIDEO
addPaddingOnResizeSlides();
progressAddListener('.control-panel__progress_time');
progressAddListener('.control-panel__progress_volume');
ramboSliderOn('.video-slider', true);
videoPlayerOn();

//TICKETS
ticketsTime();
ticketsCalcOn();
cardNumberControls();

//CONTACTS
createMap();

//Modal window
modalWindowOn();