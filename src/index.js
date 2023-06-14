import './index.html'
import './index.scss'
import './scss/jas.scss'

import Jas from './js/jas.js'

const slider = new Jas('.slider', {
  slidesToShow: 3.5,
  active: 1,
  slidesToScroll: 3,
  speed: '500ms',
  // gap: '40px',
  loop: true,
})