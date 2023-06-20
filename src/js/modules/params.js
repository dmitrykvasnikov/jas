const DEFAULTS = {
  toShow: 1,
  toScroll: 1,
  gap: '0px',
  loop: false,
  direction: 'row',
  active: 1,
  lastActive: 1,
  next: 1,
  prev: 1,
  speed: '500ms',
  translate: 0,
  overflow: 'hidden',
  flex: 'calc((100% - var(--gap) * var(--gapToShow)) / var(--toShow))',
  align: 'index',
  navigation: {
    prev: '.jas-button-prev',
    next: '.jas-button-next',
    disableClass: 'disabled',
  }
}

export default DEFAULTS