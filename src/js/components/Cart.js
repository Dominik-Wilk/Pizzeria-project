import { select, classNames, templates, settings } from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';

class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initActions();
  }

  getElements(element) {
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;
    thisCart.dom.arrow = element.querySelector('.fa-chevron-down');
    thisCart.dom.toggleTrigger = element.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = element.querySelector(select.cart.productList);

    thisCart.dom.deliveryFee = element.querySelector(select.cart.deliveryFee);
    thisCart.dom.subtotalPrice = element.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = element.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.totalNumber = element.querySelector(select.cart.totalNumber);

    thisCart.dom.form = element.querySelector(select.cart.form);
    thisCart.dom.phone = element.querySelector(select.cart.phone);
    thisCart.dom.address = element.querySelector(select.cart.address);
  }

  initActions() {
    const thisCart = this;
    let angle = 0;

    thisCart.dom.toggleTrigger.addEventListener('click', function () {
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);

      // extra functionality ;)
      angle += 180;
      thisCart.dom.arrow.style.setProperty('transform', `rotate(${angle}deg)`);
      thisCart.dom.arrow.style.setProperty('transition', 'transform 0.5s');
    });

    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function () {
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function (e) {
      e.preventDefault();

      thisCart.sendOrder();
    });
  }

  sendOrder() {
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.orders;

    thisCart.payload = {};
    thisCart.payload.address = thisCart.dom.address.value;
    thisCart.payload.phone = thisCart.dom.phone.value;
    thisCart.payload.totalPrice = thisCart.totalPrice;
    thisCart.payload.subtotalPrice = thisCart.subtotalPrice;
    thisCart.payload.totalNumber = thisCart.totalNumber;
    thisCart.payload.deliveryFee = thisCart.deliveryFee;
    thisCart.payload.products = [];

    for (let prod of thisCart.products) {
      thisCart.payload.products.push(prod.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(thisCart.payload),
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
    const thisCart = this;
    const indexOfProduct = thisCart.products.indexOf(cartProduct);

    // remove from HTML
    cartProduct.dom.wrapper.remove();

    // remove from array thisCart.products
    thisCart.products.splice(indexOfProduct, 1);

    // call update
    thisCart.update();
  }

  add(menuProduct) {
    const thisCart = this;

    const generatedHTML = templates.cartProduct(menuProduct);

    const generatedDOM = utils.createDOMFromHTML(generatedHTML);

    thisCart.dom.productList.appendChild(generatedDOM);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));

    thisCart.update();
  }

  update() {
    const thisCart = this;

    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.totalPrice = 0;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;
    for (const product of thisCart.products) {
      thisCart.totalNumber += product.amount;
      thisCart.subtotalPrice += product.price;
    }
    thisCart.totalPrice;

    if (thisCart.totalNumber !== 0) {
      thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
      thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
    } else {
      thisCart.totalPrice = 0;
      thisCart.dom.deliveryFee.innerHTML = 0;
    }
    thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;

    thisCart.dom.totalPrice.forEach(function (element) {
      element.innerHTML = thisCart.totalPrice;
    });
  }
}

export default Cart;
