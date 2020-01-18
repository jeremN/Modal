import '../sass/style.scss';
import Modal from './modules';

document.addEventListener('DOMContentLoaded', () => {
  const toggleModal = new Modal()

  document.addEventListener('click', (event) => {
    const { target } = event

    if (target.classList.contains('js__launchDemoModal')) {
      toggleModal.onOpen({
        modalTitle: 'This is a title',
        modalContent: `
          <h4>Some title content</h4>
          <input type="text" name="test" />
          <button type="button">Some button</button>
        `
      })
    } else if (target.classList.contains('js__launchDemoModal--morphing')){
      const closeIcon = `
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
          </svg>
        `

      const options = {
        trigger: target,
        isMorphing: true,
        addListener: () => {
          document.querySelector('.js__customModalClose').addEventListener('click', () => {
            toggleModal.onClose()
          }, false)
        },
        template: `
          <div class="stan__c__modal is__hidden"
            role="dialog"
            aria-labelledby="stan__c__modal__title"
            aria-hidden="true">
            <div class="stan__c__modal__container">
              <div class="stan__c__modal__header">
                <h2 class="stan__c__modal__title">Modal title</h2>
                <button class="stan__c__modal__close js__btnCloseModal" type="button">${closeIcon}</button>
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
      toggleModal.onOpen(options)
    }
  })
})