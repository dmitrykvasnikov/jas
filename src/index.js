import './index.html'
import './index.scss'
import './scss/jas.scss'

import Jas from './js/jas.js'

const slider = new Jas('.slider', {
  toShow: 3.5,
  toScroll: 3,
  gap: '10px',
  active: 1,
  speed: '600ms',
})
