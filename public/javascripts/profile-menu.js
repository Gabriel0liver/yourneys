'use strict'

const wrapper = document.getElementById('wrapper')
const menuTrigger = document.getElementById('menu_trigger')
const menu = document.getElementById('menu')
menuTrigger.addEventListener('click', () => {
  menuTrigger.classList.toggle('open')
  menu.classList.toggle('open')
  wrapper.classList.toggle('pushed')
})
