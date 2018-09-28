'use strict';

const slides = document.querySelectorAll('#slides .slide');
const skip = document.querySelector('.skip-link');
const slider = document.querySelector('.slider');
let currentSlide = 0;
const slideInterval = setInterval(nextSlide, 3000);

function nextSlide () {
  slides[currentSlide].className = 'slide';
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].className = 'slide showing';
}

skip.addEventListener('click', destroyScreen);

function destroyScreen (e) {
  if (e) {
    slider.remove();
  }
}
