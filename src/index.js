import './index.html'
import './index.scss'
import './scss/jas.scss'

import Jas from './js/jas.js'

const slider = new Jas('.slider', {
  toShow: 1,
  index: 3,
  toScroll: 1,
  speed: '1000ms',
  gap: '10px',
  loop: false,
  direction: 'row',
  navigation: {
    prev: '.jas-button-prev',
    next: '.jas-button-next',
  }
})
