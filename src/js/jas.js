import { DEFAULTS, NAVIGATION } from './modules/params.js'

export default class Jas {
  constructor(name, params = {}) {


    // getting elements from DOM
    this.slider = document.querySelector(name)
    this.wrapper = this.slider.querySelector('.jas-wrapper')
    this.slides = this.slider.querySelectorAll('.jas-slide')
    this.length = this.slides.length
    this.slideWidth = '0px'
    this.config = { ...DEFAULTS, ...params }
    this.config.navigation = { ...NAVIGATION, ...params.navigation }
    // variables for application logic, depending on direction of slider
    this.var = {
      axis: this.config.direction === 'row' ? 'width' : 'height',
      offset: this.config.direction === 'row' ? 'offsetX' : 'offsetY',
      offsetProp: this.config.direction === 'row' ? 'offsetLeft' : 'offsetTop',
    }
    // flag used to disable buttons during transition
    this.inTransition = false
    this.init()
  }

  init() {
    // setup overflow for slider
    this.slider.style.overflow = this.config.overflow
    this.slider.style.position = 'relative'

    // setting up resize observer for wrapper
    const ro = new ResizeObserver((entries) => {
      this.updateSlideWidth()
    })
    ro.observe(this.wrapper)

    this.wrapper.addEventListener('transitionstart', () => this.inTransition = true)
    this.wrapper.addEventListener('transitionend', () => this.inTransition = false)

    // setting data-attributes
    let ind = 1
    this.slides.forEach(slide => slide.dataset['id'] = ind++)
    this.getSlideById(this.config.active).classList.add('active')
    this.updateSlideWidth()
    this.updateWrapperProps(['gap', 'direction', 'speed', 'offsetX', 'offsetY'])
    this.setupActiveSlide(false)

    // setting up navigation
    this.setupNafigation()
    this.moveSlides(-2)
  }

  setupNafigation() {
    const prevEl = document.querySelector(this.config.navigation.prev)
    const nextEl = document.querySelector(this.config.navigation.next)
    if (prevEl && nextEl) {
      nextEl.addEventListener('click', () => {
        if (this.inTransition) return
        this.getSlideById(this.config.active).classList.remove('active')
        this.config.active += 1
        this.getSlideById(this.config.active).classList.add('active')
        this.setupActiveSlide()
      })
      prevEl.addEventListener('click', () => {
        if (this.inTransition) return
        this.getSlideById(this.config.active).classList.remove('active')
        this.config.active -= 1
        this.getSlideById(this.config.active).classList.add('active')
        this.setupActiveSlide()
      })

    }
  }

  updateWrapperProps(props) {
    props.forEach(prop => {
      this.wrapper.style.setProperty(`--${prop}`, this.config[prop])
    })
  }

  updateSlideWidth() {
    this.config.slideWidth = (this.wrapper.getBoundingClientRect()[this.var.axis] - parseInt(this.config.gap) * Math.ceil(this.config.slidesToShow - 1)) / this.config.slidesToShow + 'px'
    this.updateWrapperProps(['slideWidth'])
  }

  setupActiveSlide(animation = true) {
    if (!animation) {
      this.wrapper.style.setProperty('--speed', '0ms')
    }
    this.config[this.var.offset] = -this.getSlideById(this.config.active)[this.var.offsetProp] + 'px'
    this.updateWrapperProps([this.var.offset])
    setTimeout(() => {
      if (!animation) {
        this.updateWrapperProps(['speed'])
      }
    }, 0);
  }

  getSlideById(id) {
    console.log(id)
    return this.wrapper.querySelector(`[data-id="${id}"]`)
  }

  moveSlides(ind) {
    if (ind > 0) {
      while (ind > 0) {
        this.wrapper.append(this.wrapper.firstElementChild)
        this.setupActiveSlide(false)
        ind--
      }
    } else {
      while (ind < 0) {
        this.wrapper.prepend(this.wrapper.lastElementChild)
        this.setupActiveSlide(false)
        ind++
      }
    }
  }
}