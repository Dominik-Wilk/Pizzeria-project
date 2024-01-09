import { select, classNames, templates, settings } from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';

class Cart {
  constructor(element) {
    this.products = [];

    this.getElements(element);
    this.initActions();
  }

  getElements(element) {
    this.dom = {};

    this.dom.wrapper = element;
    this.dom.arrow = element.querySelector('.fa-chevron-down');
    this.dom.toggleTrigger = element.querySelector(select.cart.toggleTrigger);
    this.dom.productList = element.querySelector(select.cart.productList);

    this.dom.deliveryFee = element.querySelector(select.cart.deliveryFee);
    this.dom.subtotalPrice = element.querySelector(select.cart.subtotalPrice);
    this.dom.totalPrice = element.querySelectorAll(select.cart.totalPrice);
    this.dom.totalNumber = element.querySelector(select.cart.totalNumber);

    this.dom.form = element.querySelector(select.cart.form);
    this.dom.phone = element.querySelector(select.cart.phone);
    this.dom.address = element.querySelector(select.cart.address);
  }

  initActions() {
    let angle = 0;

    this.dom.toggleTrigger.addEventListener('click', () => {
      this.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);

      // extra functionality ;)
      angle += 180;
      this.dom.arrow.style.setProperty('transform', `rotate(${angle}deg)`);
      this.dom.arrow.style.setProperty('transition', 'transform 0.5s');
    });

    this.dom.productList.addEventListener('updated', () => {
      this.update();
    });

    this.dom.productList.addEventListener('remove', () => {
      this.remove(event.detail.cartProduct);
    });

    this.dom.form.addEventListener('submit', e => {
      e.preventDefault();

      this.sendOrder();
    });
  }

  sendOrder() {
    const url = settings.db.url + '/' + settings.db.orders;

    this.payload = {};
    this.payload.address = this.dom.address.value;
    this.payload.phone = this.dom.phone.value;
    this.payload.totalPrice = this.totalPrice;
    this.payload.subtotalPrice = this.subtotalPrice;
    this.payload.totalNumber = this.totalNumber;
    this.payload.deliveryFee = this.deliveryFee;
    this.payload.products = [];

    for (let prod of this.products) {
      this.payload.products.push(prod.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.payload),
    };

    fetch(url, options)
      .then(function (response) {
        return response.json();
      })
      .then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);
      });
  }

  remove(cartProduct) {
    const indexOfProduct = this.products.indexOf(cartProduct);

    cartProduct.dom.wrapper.remove();

    this.products.splice(indexOfProduct, 1);

    this.update();
  }

  add(menuProduct) {
    const generatedHTML = templates.cartProduct(menuProduct);

    const generatedDOM = utils.createDOMFromHTML(generatedHTML);

    this.dom.productList.appendChild(generatedDOM);

    this.products.push(new CartProduct(menuProduct, generatedDOM));

    this.update();
  }

  update() {
    this.deliveryFee = settings.cart.defaultDeliveryFee;
    this.totalPrice = 0;
    this.totalNumber = 0;
    this.subtotalPrice = 0;
    for (const product of this.products) {
      this.totalNumber += product.amount;
      this.subtotalPrice += product.price;
    }
    this.totalPrice;

    if (this.totalNumber !== 0) {
      this.totalPrice = this.subtotalPrice + this.deliveryFee;
      this.dom.deliveryFee.innerHTML = this.deliveryFee;
    } else {
      this.totalPrice = 0;
      this.dom.deliveryFee.innerHTML = 0;
    }
    this.dom.subtotalPrice.innerHTML = this.subtotalPrice;
    this.dom.totalNumber.innerHTML = this.totalNumber;

    this.dom.totalPrice.forEach(element => {
      element.innerHTML = this.totalPrice;
    });
  }
}

export default Cart;
