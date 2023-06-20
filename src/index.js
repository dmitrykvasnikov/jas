import './index.html'
import './index.scss'
import './scss/jas.scss'

import Jas from './js/jas.js'

const slider = new Jas('.slider', {
  toShow: 2.7,
  toScroll: 2,
  gap: '10px',
  active: 1,
  speed: '250ms',
  // direction: 'column'
})
