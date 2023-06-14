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
    this.navigation = {}
    // variables for application logic, depending on direction of slider
    this.var = {
      axis: this.config.direction === 'row' ? 'width' : 'height',
      offset: this.config.direction === 'row' ? 'offsetX' : 'offsetY',
      offsetProp: this.config.direction === 'row' ? 'offsetLeft' : 'offsetTop',
    }
    // flag used to disable buttons during transition
    this.inTransition = false
    this.position = 'active'
    this.init()
  }

  init() {
    // setup overflow for slider
    this.slider.style.overflow = this.config.overflow
    this.slider.style.position = 'relative'

    // check starting active / slidesToScroll conditions
    if (this.length > this.config.slidesToShow && this.length < Math.ceil(this.config.slidesToShow) + this.config.slidesToScroll) {
      this.config.slidesToScroll = this.length - Math.ceil(this.config.slidesToShow)
    }
    console.log(this.config.slidesToScroll)


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
    this.updateActiveSlide()
    this.updateActiveSlideIndex()
    this.updatePrevNextIndex()
    this.updateSlideWidth()
    this.updateWrapperProps(['gap', 'direction', 'speed', 'offsetX', 'offsetY'])
    this.updateSliderPosition(false)
    // setting up navigation
    this.setupNafigation()
  }

  setupNafigation() {
    this.navigation.prevEl = document.querySelector(this.config.navigation.prev)
    this.navigation.nextEl = document.querySelector(this.config.navigation.next)
    if (!this.config.loop && this.config.active == 1) this.navigation.prevEl.classList.add('disabled')
    if (this.length <= this.config.slidesToShow) this.navigation.nextEl.classList.add('disabled')
    if (this.navigation.prevEl.classList.contains('jas-button-prev')) this.navigation.prevEl.classList.add(this.config.direction)
    if (this.navigation.nextEl.classList.contains('jas-button-next')) this.navigation.nextEl.classList.add(this.config.direction)
    if (this.navigation.prevEl && this.navigation.nextEl) {
      this.navigation.nextEl.addEventListener('click', this.nextElHandler.bind(this))
      this.navigation.prevEl.addEventListener('click', this.prevElHandler.bind(this))
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

  updateSliderPosition(animation = true) {
    window.getComputedStyle(this.wrapper)
    if (!animation) {
      this.wrapper.style.setProperty('--speed', '0ms')
    }
    switch (this.position) {
      case 'active':
        this.config[this.var.offset] = -this.getSlideById(this.config.active)[this.var.offsetProp] + 'px'
        break
      case 'start':
        this.config[this.var.offset] = '0px'
        break
      case 'end':
        this.config[this.var.offset] = -(parseInt(this.config.slideWidth) * (this.length - this.config.slidesToShow) + parseInt(this.config.gap) * Math.floor((this.length - this.config.slidesToShow))) - 1 + 'px'
        break
    }

    this.updateWrapperProps([this.var.offset])
    if (!animation) {
      setTimeout(() => {
        this.updateWrapperProps(['speed'])
      }, 0);
    }
  }

  getSlideById(id) {
    return this.wrapper.querySelector(`[data-id="${id}"]`)
  }

  prevElHandler() {
    if (this.inTransition) return

    if (!this.config.loop) {
      this.navigation.nextEl.classList.remove('disabled')
      this.config.active -= this.config.slidesToScroll
      if (this.config.active <= 1) {
        this.config.active = 1
        this.position = 'start'
        this.navigation.prevEl.classList.add('disabled')
      } else this.position = 'active'

    } else {
      let active = this.getSlideById(this.config.active)
      let next = this.getSlideById(this.config.next)
      let prev = this.getSlideById(this.config.prev)
      this.setupPrevSlide()
      next.classList.remove('next')
      active.classList.add('next')
      prev.classList.remove('prev')
      this.config.active = this.config.prev
      this.updatePrevNextIndex()
    }
    this.updateActiveSlide()
    this.updateActiveSlideIndex()
    setTimeout(() => {
      this.updateSliderPosition()
    }, 0);
  }

  nextElHandler() {
    if (this.inTransition) return
    if (!this.config.loop) {
      this.navigation.prevEl.classList.remove('disabled')
      this.config.active += this.config.slidesToScroll
      if (this.config.active >= this.length - Math.floor(this.config.slidesToShow) + 1) {
        this.config.active = this.length - Math.floor(this.config.slidesToShow) + 1
        this.navigation.nextEl.classList.add('disabled')
        this.position = 'end'
      } else this.position = 'active'

    } else {
      let active = this.getSlideById(this.config.active)
      let next = this.getSlideById(this.config.next)
      let prev = this.getSlideById(this.config.prev)
      this.setupNextSlide()
      prev.classList.remove('prev')
      active.classList.remove('active')
      next.classList.remove('next')
      active.classList.add('prev')
      this.config.active = this.config.next
      this.updatePrevNextIndex()
    }
    this.updateActiveSlide()
    this.updateActiveSlideIndex()
    setTimeout(() => {
      this.updateSliderPosition()
    }, 0);
  }

  moveSlides(ind) {
    if (ind > 0) {
      while (ind > 0) {
        this.wrapper.append(this.wrapper.firstElementChild)
        ind--
      }
    } else {
      while (ind < 0) {
        this.wrapper.prepend(this.wrapper.lastElementChild)
        ind++
      }
    }
    this.updateSliderPosition(false)
    this.updateActiveSlideIndex()
  }

  updateActiveSlideIndex() {
    this.config.activeIndex = Array.from(this.wrapper.querySelectorAll('.jas-slide')).indexOf(this.getSlideById(this.config.active)) + 1
  }

  setupNextSlide() {
    if (this.wrapper.querySelector('.next')) return
    let offset = this.config.activeIndex + this.config.slidesToScroll + Math.floor(this.config.slidesToShow) - this.length
    if (offset > 0) this.moveSlides(offset)
    this.getSlideById(this.config.next).classList.add('next')
  }

  setupPrevSlide() {
    if (this.wrapper.querySelector('.prev')) return
    let offset = this.config.activeIndex - this.config.slidesToScroll - 1
    if (offset < 0) this.moveSlides(offset)
    this.getSlideById(this.config.prev).classList.add('prev')
  }

  updateActiveSlide() {
    if (this.wrapper.querySelector('.active')) this.wrapper.querySelector('.active').classList.remove('active')
    this.getSlideById(this.config.active).classList.add('active')
  }

  updatePrevNextIndex() {
    let next = this.config.active + this.config.slidesToScroll
    this.config.next = next > this.length ? next - this.length : next
    let prev = this.config.active - this.config.slidesToScroll
    this.config.prev = prev < 1 ? this.length + prev : prev
  }
}