import { isFunction, addCSSStyle } from '../utilities'

const focusableElementsArray = [
  '[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
]

/* Modal
*  @param {ClassName} defaultClass - classe de la modal (c__modal par défaut)
*  @param {ClassName} morphingClass - modifier en cas de morphing (c__modal--morphing par défaut)
*  @param {Array} jsClass - classe js ([ 'js__modal', 'js__morphingModal'] par défaut)
*  @param {String} modalTitle
*  @param {String || Template string} modalContent
*  @param {String || Template string} modalFooter
*  @param {Template string} template
*  @param {ClassName} modalSizeClass
*  @param {HTMLElement} trigger
*  @param {Svg || HTML special char} closeIcon
*  @param {Bool} isMorphing
*  @param {Function} addListener
*  @param {Function} addAction
*  @param {Function} onRemove
*/
export default class Modal {
  constructor() {
    this.modal = null
    this.body = document.body
    this.container = null
    this.closeBtn = null
    this.options = null
    this.template = null
    this.initialProps = null
    this.focusablesElements = []
    this.firstFocusableEl = null
    this.lastFocusableEl = null
  }

  listener() {
    this.modal.addEventListener('click', (evt) => {
      const { target } = evt

      if (target === this.modal
        || target === this.closeBtn
        || target.closest('.js__btnCloseModal') === this.closeBtn) this.onClose(target)
    })

    document.addEventListener('keydown', (evt) => {
      const e = evt || window.event
      if (e.keyCode === 27 || e.key === 'Escape') this.onClose()
    })

    if (this.options.addListener() && isFunction(this.options.addListener)) {
      this.options.addListener().bind(this)
    }
  }

  defaultTemplate() {
    return `
      <div id="dialog"
        class="${this.options.defaultClass} is__hidden"
        role="dialog"
        aria-labelledby="dialog-title"
        aria-modal="true"
        aria-hidden="true"
        tabindex="-1">
        <div role="document" class="stan__c__modal__container">
          <div class="stan__c__modal__header">
            <h2 id="dialog-title" class="stan__c__modal__title">${this.options.modalTitle}</h2>
            <button
              class="stan__c__modal__close js__btnCloseModal"
              type="button"
              aria-label="Close">
              ${this.options.closeIcon}
            </button>
          </div>
          ${!this.options.modalContent ? '' : `<div class="stan__c__modal__body">
            ${this.options.modalContent}
          </div>`}

          ${!this.options.modalFooter ? '' : `
          <div class="stan__c__modal__footer">
            ${this.options.modalFooter}
          </div>
          `}
        </div>
      </div>
    `
  }

  listenFocusablesElements() {
    this.firstFocusableEl.focus()
    if (this.focusableElements && this.focusableElements.length) {
      this.focusableElements.forEach((focusable) => {
        if (focusable.addEventListener) {
          focusable.addEventListener('keydown', evt => this.focusablesListener(evt))
        }
      })
    }
  }

  focusablesListener(evt) {
    if (!evt.keyCode === 9) return
    if (evt.shiftKey) {
      if (evt.target === this.firstFocusableEl) {
        evt.preventDefault()
        this.lastFocusableEl.focus()
      } else if (evt.target === this.lastFocusableEl) {
        evt.preventDefault()
        this.firstFocusableEl.focus()
      }
    }
  }

  appendModal() {
    this.template = this.options.template || this.defaultTemplate()
    this.body.insertAdjacentHTML('beforeend', this.template)

    const jsClass = this.options.isMorphing ? this.options.jsClass[1] : this.options.jsClass[0]
    document.querySelector(`.${this.options.defaultClass}`).classList.add(`${jsClass}`)

    this.modal = document.querySelector(`.${jsClass}`)
    this.container = this.modal.querySelector('.stan__c__modal__container')
    this.closeBtn = this.container.querySelector('.js__btnCloseModal')
    this.focusablesElements = this.container.querySelectorAll(focusableElementsArray)
    const [firstEl] = this.focusablesElements
    this.firstFocusableEl = firstEl
    this.lastFocusableEl = this.focusablesElements[this.focusablesElements.length - 1]

    if (this.options.isMorphing) {
      this.modal.classList.add(`${this.options.morphingClass}`)
      addCSSStyle(this.container, {
        top: `${this.initialProps.top}px`,
        left: `${this.initialProps.left}px`,
        width: `${this.initialProps.width}px`,
        height: `${this.initialProps.height}px`,
      })
    }
    if (this.options.modalSizeClass) {
      this.modal.classList.add(this.options.modalSizeClass)
    }
  }

  removeModal() {
    this.modal.remove()

    if (this.options.onRemove && isFunction(this.options.onRemove)) {
      this.options.onRemove()
    }
  }

  onOpen(options = {}) {
    if (options) {
      this.options = this.constructor.defaultOptions(options)
    }

    if (this.options.isMorphing) {
      if (!this.options.trigger) throw new Error('No trigger defined')
      this.initialProps = this.options.trigger.getBoundingClientRect()
    }

    this.appendModal()
    this.body.classList.add('is__noScroll')
    this.modal.setAttribute('aria-hidden', false)
    this.body.setAttribute('aria-hidden', true)

    if (this.options.isMorphing) {
      this.isMorph(true)
    } else {
      this.isFade(true)
    }

    this.listener()
    if (!this.firstFocusableEl) return
    window.setTimeout(() => {
      this.listenFocusablesElements()
    }, 400)
  }

  onClose(trigger) {
    this.modal.setAttribute('aria-hidden', true)
    this.body.setAttribute('aria-hidden', false)

    if (this.options.isMorphing) {
      this.isMorph()
    } else {
      this.isFade()
    }

    const focusedEl = document.activeElement
    if (this.options.trigger) this.options.trigger.focus()
    if (trigger) trigger.focus()
    if (focusedEl) focusedEl.blur()

    this.body.classList.remove('is__noScroll')
  }

  isFade(isOpen = false) {
    if (isOpen) {
      this.modal.classList.add('is__animated', 'js__fadeIn')
      this.modal.classList.remove('is__hidden')
      this.container.classList.add('is__animated', 'js__fadeInUp')
    } else {
      this.container.classList.replace('js__fadeInUp', 'js__fadeOutDown')

      setTimeout(() => {
        this.modal.classList.remove('is__animated', 'js__fadeIn')
        this.container.classList.remove('is__animated', 'js__fadeOutDown')
        this.modal.classList.add('is__hidden')
        this.removeModal()
      }, 450)
    }
  }

  isMorph(isExpanded = false) {
    if (isExpanded) {
      this.modal.classList.remove('is__hidden')

      setTimeout(() => {
        this.container.classList.add('is__open')
      }, 10)
    } else {
      this.body.classList.remove('is__noScroll')
      this.container.classList.remove('is__open')

      setTimeout(() => {
        this.modal.classList.add('is__hidden')
        this.removeModal()
      }, 410)
    }
  }

  static defaultOptions(options) {
    return Object.assign({}, {
      defaultClass: 'stan__c__modal',
      morphingClass: 'stan__c__modal--morphing',
      jsClass: ['js__modal', 'js__morphingModal'],
      modalSizeClass: '',
      modalTitle: '',
      modalContent: '',
      modalFooter: '',
      template: '',
      trigger: '',
      closeIcon: `
        <svg xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="img"
          viewBox="0 0 352 512"
          width="20"
          height="20">
          <path
            d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19
            0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28
            75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28
            12.28-12.28 32.19 0 44.48L109.28 256
            9.21 356.07c-12.28 12.28-12.28 32.19 0
            44.48l22.24 22.24c12.28 12.28 32.2 12.28
            44.48 0L176 322.72l100.07 100.07c12.28
            12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19
            0-44.48L242.72 256z"/>
        </svg>`,
      isMorphing: false,
      addListener: () => {},
      onToggle: () => {},
      onRemove: () => {},
    }, options)
  }
}
