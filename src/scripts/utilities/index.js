/** Add CSS style to HTMLElement
  * @param {HTMLElement} el
  * @param {Object} styles
  */
export const addCSSStyle = (el, styles = {}) => {
  const element = el

  Object
    .keys(styles)
    .forEach((key) => {
      element.style[key] = styles[key]
    })
}

/** Test if element is function
  * @param {element} functionToCheck
  * @return {Bool}
  */
export const isFunction = functionToCheck => functionToCheck
  && {}.toString.call(functionToCheck) === '[object Function]'
