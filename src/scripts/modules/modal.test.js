import Modal from './index.js'

describe('Render modal', () => {
  let modal = null
  let config = {}

  beforeEach(() => {
    modal = new Modal()
    config = {
      modalTitle: 'Modal title',
      modalContent: `
        <h4>Modal content</h4>
        <input type="text" name="test">
        <button class="stan__c__button" type="button">Button</button>
      `,
      modalFooter: 'Modal footer',
    }
  })

  afterEach(() => {
    document.body.innerHTML = ''
    modal = null
    config = {}
  })

  it('should render modal correctly and add it to the DOM', () => {
    modal.onOpen(config)

    expect(document.querySelector('.js__modal')).not.toBeUndefined()
    expect(document.querySelector('.stan__c__modal__title').innerHTML).toBe('Modal title')
    expect(document.querySelector('.stan__c__modal__body').innerHTML).toContain(config.modalContent)
    expect(document.querySelector('.js__modal')).toMatchSnapshot()
  })

  it('should make body unscrollable', () => {
    modal.onOpen(config)

    expect(document.body.classList).toContain('is__noScroll')
  })

  it('should render custom template correctly', () => {
    const customConfig = {
      template: `
        <div class="stan__c__modal is__hidden"
          role="dialog"
          aria-labelledby="stan__c__modal__title"
          aria-hidden="true">
          <div class="stan__c__modal__container">
            <div class="stan__c__modal__header">
              <h2 class="stan__c__modal__title">Modal title</h2>
              <button class="stan__c__modal__close js__btnCloseModal" type="button">x</button>
            </div>
            <div class="stan__c__modal__body">
              <h3>Lorem ipsum</h3>
              <p>Dolor sit amet, consectetur adipiscing elit. Nulla velit leo, sodales ut leo pharetra, lobortis imperdiet magna.
              Fusce vel est lorem. <br> Aenean tristique, purus sed scelerisque tincidunt, ligula dolor vulputate lorem, vitae suscipit dolor purus nec lorem.</p>
            </div>
            <div class="stan__c__modal__footer">
              <button class="stan__c__button js__customModalClose">Fermer</button>
            </div>
          </div>
        </div>
      `,
    }
    modal.onOpen(customConfig)

    expect(document.querySelector('.js__modal')).toMatchSnapshot()
  })
})
