import { select, classNames, templates, settings } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Product {
  constructor(id, data) {
    this.id = id;
    this.data = data;
    this.renderInMenu();
    this.getElements();
    this.initAccordion();
    this.initOrderForm();
    this.initAmountWidget();
    this.processOrder();
  }

  renderInMenu() {
    const generatedHTML = templates.menuProduct(this.data);
    this.element = utils.createDOMFromHTML(generatedHTML);

    const menuContainer = document.querySelector(select.containerOf.menu);

    menuContainer.appendChild(this.element);
  }

  getElements() {
    this.dom = {
      accordionTrigger: this.element.querySelector(select.menuProduct.clickable),
      form: this.element.querySelector(select.menuProduct.form),
      formInputs: this.element.querySelector(select.menuProduct.form).querySelectorAll(select.all.formInputs),
      cartButton: this.element.querySelector(select.menuProduct.cartButton),
      priceElem: this.element.querySelector(select.menuProduct.priceElem),
      imageWrapper: this.element.querySelector(select.menuProduct.imageWrapper),
      amountWidgetElem: this.element.querySelector(select.menuProduct.amountWidget),
    };
  }

  initAccordion() {
    this.dom.accordionTrigger.addEventListener('click', event => {
      event.preventDefault();

      const activeProducts = document.querySelectorAll(select.all.menuProductsActive);

      for (let activeProduct of activeProducts) {
        if (activeProduct !== this.element) {
          activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
        }
      }

      this.element.classList.toggle(classNames.menuProduct.wrapperActive);
    });
  }

  initOrderForm() {
    this.dom.form.addEventListener('submit', event => {
      event.preventDefault();
      this.processOrder();
    });

    for (let input of this.dom.formInputs) {
      input.addEventListener('change', () => {
        this.processOrder();
      });
    }

    this.dom.cartButton.addEventListener('click', event => {
      event.preventDefault();
      this.processOrder();
      this.addToCart();
    });
  }

  processOrder() {
    const formData = utils.serializeFormToObject(this.dom.form);

    let price = this.data.price;

    for (let paramId in this.data.params) {
      const param = this.data.params[paramId];

      for (let optionId in param.options) {
        const option = param.options[optionId];
        const selected = formData[paramId] && formData[paramId].includes(optionId);

        if (selected) {
          if (!option.default) {
            price += option.price;
          }
        } else if (option.default) {
          price -= option.price;
        }

        const image = this.dom.imageWrapper.querySelector(`.${paramId}-${optionId}`);
        if (image) {
          if (selected) {
            image.classList.add(classNames.menuProduct.imageVisible);
          } else {
            image.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
      }
    }
    this.priceSingle = price;

    price *= this.amountWidget.value;
    this.dom.priceElem.innerHTML = price;

    this.prepareCartProductParams();
  }

  initAmountWidget() {
    this.amountWidget = new AmountWidget(this.dom.amountWidgetElem, settings.amountWidget.defaultValue);

    this.dom.amountWidgetElem.addEventListener('updated', () => {
      this.processOrder();
    });
  }

  addToCart() {
    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: this.prepareCartProducts(),
      },
    });

    this.element.dispatchEvent(event);
  }

  prepareCartProductParams() {
    const formData = utils.serializeFormToObject(this.dom.form);
    const productParams = {};

    for (let paramId in this.data.params) {
      const param = this.data.params[paramId];

      for (let optionId in param.options) {
        const option = param.options[optionId];
        const selected = formData[paramId] && formData[paramId].includes(optionId);

        if (selected) {
          if (!productParams[paramId]) {
            productParams[paramId] = {
              label: param.label,
              options: {},
            };
          }
          productParams[paramId].options[optionId] = option.label;
        }
      }
    }
    return productParams;
  }

  prepareCartProducts() {
    const productSummary = {
      id: this.id,
      name: this.data.name,
      amount: this.amountWidget.value,
      priceSingle: this.priceSingle,
      price: this.priceSingle * this.amountWidget.value,
      params: this.prepareCartProductParams(),
    };
    return productSummary;
  }
}

export default Product;
