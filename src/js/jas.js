import { DEFAULTS, NAVIGATION } from './modules/params.js'

export default class Jas {
  constructor(name, params = {}) {
    // merge user params with defaults
    this.config = { ...DEFAULTS, ...params }
    this.config.navigation = { ...NAVIGATION, ...params.navigation }
    // getting DOM elements
    this.slider = document.querySelector(name)
    this.wrapper = this.slider.querySelector('.jas-wrapper')
    this.slides = Array.from(this.wrapper.querySelectorAll('.jas-slide'))
    this.length = this.slides.length
    // align property could be 'start' / 'end' / 'index'
    this.align = 'index'
    // setting up variables for proper work of sliders' logic
    this.var = {
    }
    this.navigation = {}
    this.init()
  }

  init() {
    // update custom properties for slider
    this.config.gapToShow = Math.ceil(this.config.toShow) - 1
    this.updateProps(['toShow', 'toScroll', 'index', 'gapToShow', 'gap', 'speed', 'direction'])
    // set data-id to each slide
    this.slides.forEach((slide, index) => slide.dataset.id = index + 1)
    this.slider.style.overflow = this.config.overflow
    this.slider.style.position = 'relative'
    // setup navigation
    this.setupNavigation()
    this.checkIndex()
    this.updateHandlers()
    // resize observer
    let ro = new ResizeObserver(entries => this.setupSliderByIndex(this.config.index, false))
    ro.observe(this.wrapper)


  }

  updateProps(arr) {
    arr.forEach(prop => this.slider.style.setProperty(`--${prop}`, this.config[prop]))
  }

  setupNavigation() {
    // if buttons are default - we look up inside current slider otherwire inside document
    if (this.config.navigation.prev === '.jas-button-prev') {
      if (this.slider.querySelector('.jas-button-prev')) {
        this.navigation.prevEl = this.slider.querySelector('.jas-button-prev')
        this.navigation.prevEl.classList.add(this.config.direction)
      }
    } else {
      if (document.querySelector(this.config.navigation.prev))
        this.navigation.prevEl = document.querySelector(this.config.navigation.prev)
    }
    if (this.config.navigation.next === '.jas-button-next') {
      if (this.slider.querySelector(this.config.navigation.next)) {
        this.navigation.nextEl = this.slider.querySelector(this.config.navigation.next)
        this.navigation.nextEl.classList.add(this.config.direction)
      }
    } else {
      if (document.querySelector(this.config.navigation.next))
        this.navigation.nextEl = document.querySelector(this.config.navigation.next)
    }
    if (this.navigation.nextEl) {
      this.navigation.nextEl.addEventListener('click', this.nextElHandler.bind(this))
    }
    if (this.navigation.prevEl) {
      this.navigation.prevEl.addEventListener('click', this.prevElHandler.bind(this))
    }
  }

  setupSliderByPosition(animation = true) {
    if (!animation) {
      this.wrapper.style.transition = ''
    } else {
      this.wrapper.style.transition = 'transform var(--speed) ease'
    }
    this.wrapper.style.transform = `translateX(${this.config.position}px)`
  }

  setupSliderByIndex(index, animation = true) {
    if (this.align != 'end') {
      this.config.position = -this.wrapper.querySelector(`[data-id="${index}"`).offsetLeft
    } else {
      this.config.position = -this.slides.reduce((res, slide) => {
        return res + slide.offsetWidth
      }, 0) - (this.length - 1) * parseInt(this.config.gap) - 1 + this.wrapper.offsetWidth

    }
    this.slides.forEach(slide => {
      if (slide.dataset.id != this.config.index) {
        slide.classList.remove('active')
      } else {
        slide.classList.add('active')
      }
    })
    this.config.lastPosition = this.config.position
    this.setupSliderByPosition(animation)
  }

  // check index and correct if it's out of range dependgin on 'loop' value, disable navigation buttons
  checkIndex() {
    if (this.length <= Math.ceil(this.config.toShow)) {
      this.config.index = 1
      return
    }
    if (!this.config.loop) {
      if (this.config.index <= 1) {
        this.config.index = 1
        this.navigation.prevEl.classList.add(this.config.navigation.disableClass)
        this.align = 'index'
      } else {
        this.navigation.prevEl.classList.remove(this.config.navigation.disableClass)
        if (this.config.index > this.length - Math.floor(this.config.toShow)) {
          this.config.index = this.length - Math.floor(this.config.toShow) + 1
          this.align = 'end'
          this.navigation.nextEl.classList.add(this.config.navigation.disableClass)

        } else {
          this.align = 'index'
          this.navigation.nextEl.classList.remove(this.config.navigation.disableClass)

        }
      }
    }
  }

  updateHandlers() {
    if (!this.config.loop && this.navigation) {
      if (this.length <= Math.ceil(this.config.toShow)) {
        this.config.index = 1
        this.navigation.prevEl.classList.add(this.config.navigation.disableClass)
        this.navigation.nextEl.classList.add(this.config.navigation.disableClass)
        return
      }
      if (this.config.index === 1) {
        this.navigation.prevEl.classList.add(this.config.navigation.disableClass)
      } else {
        this.navigation.prevEl.classList.remove(this.config.navigation.disableClass)
        if (this.config.index > this.length - Math.floor(this.config.toShow)) {
          this.navigation.nextEl.classList.add(this.config.navigation.disableClass)
        } else {
          this.navigation.nextEl.classList.remove(this.config.navigation.disableClass)
        }
      }
    }
  }

  nextElHandler() {
    if (!this.config.loop) {
      this.config.index += this.config.toScroll
      this.checkIndex()
      this.setupSliderByIndex(this.config.index)
      console.log(this.config)
    }
  }

  prevElHandler() {
    if (!this.config.loop) {
      this.config.index -= this.config.toScroll
      this.checkIndex()
      this.setupSliderByIndex(this.config.index)
      console.log(this.config)
    }
  }
}