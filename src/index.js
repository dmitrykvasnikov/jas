import './index.html'
import './index.scss'
import './scss/jas.scss'

import Jas from './js/jas.js'

const slider = new Jas('.slider', {
  slidesToShow: 2.5,
  active: 2,
  slidesToScroll: 2,
  speed: '500ms',
  // gap: '40px',
  loop: true,
})