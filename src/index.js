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

// let startX
// let delta

// const d = document.querySelector('.test')
// d.addEventListener('touchstart', e => {
//   startX = e.touches[0].clientX
//   console.log(e)
// })

// d.addEventListener('touchmove', e => {
//   delta = startX - e.touches[0].clientX
//   d.style.setProperty('--offset', -delta + 'px')
//   if (delta > 50) {
//     console.log('hey!')

//   }
// })

// d.addEventListener('touchend', e => console.log(delta))