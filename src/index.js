import './index.html'
import './index.scss'
import './scss/jas.scss'

import Jas from './js/jas.js'

const slider = new Jas('.slider', {
  slidesToShow: 1,
  active: 3,
  speed: '1500ms'
})