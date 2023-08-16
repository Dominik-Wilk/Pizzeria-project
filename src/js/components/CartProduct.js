import { select } from '../settings.js';
import AmountWidget from './AmountWidget.js';

class CartProduct {
  constructor(menuProduct, element) {
    this.id = menuProduct.id;
    this.amount = menuProduct.amount;
    this.name = menuProduct.name;
    this.params = menuProduct.params;
    this.price = menuProduct.price;
    this.priceSingle = menuProduct.priceSingle;

    this.getElements(element);
    this.initAmountWidget();
    this.initActions();
  }

  getElements(element) {
    this.dom = {};

    this.dom.wrapper = element;
    this.dom.amountWidget = element.querySelector(select.cartProduct.amountWidget);
    this.dom.price = element.querySelector(select.cartProduct.price);
    this.dom.edit = element.querySelector(select.cartProduct.edit);
    this.dom.remove = element.querySelector(select.cartProduct.remove);
  }
  getData() {
    const orderSummary = {
      id: this.id,
      name: this.name,
      amount: this.amount,
      price: this.price,
      priceSingle: this.priceSingle,
      params: this.params,
    };

    return orderSummary;
  }

  initAmountWidget() {
    this.amountWidget = new AmountWidget(this.dom.amountWidget);

    this.dom.amountWidget.addEventListener('updated', () => {
      this.recalculate();
    });
  }
  recalculate() {
    this.amount = this.amountWidget.value;
    this.price = this.amountWidget.value * this.priceSingle;
    this.dom.price.innerHTML = this.price;
  }

  remove() {
    const event = new CustomEvent('remove', {
      bubbles: true,
      detail: {
        cartProduct: this,
      },
    });

    this.dom.wrapper.dispatchEvent(event);
  }

  initActions() {
    this.dom.edit.addEventListener('click', e => {
      e.preventDefault();
    });
    this.dom.remove.addEventListener('click', e => {
      e.preventDefault();
      this.remove();
    });
  }
}

export default CartProduct;
