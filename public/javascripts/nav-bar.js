'use strict';

const nav = () => {
  const navBar = document.querySelector('.nav-bar li');
  navBar.addEventListener('click', function (event) {
    const selectedIcon = navBar.querySelector('.selected');
    if (selectedIcon) {
      selectedIcon.classList.remove('selected');
    }
    event.target.classList.toggle('selected');
  });
};

window.addEventListener('load', nav);
