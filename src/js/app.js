import { settings, select } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';

const app = {
  initData: function () {
    this.data = {};
    const url = settings.db.url + '/' + settings.db.products;

    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(parsedResponse => {
        this.data.products = parsedResponse;
        this.initMenu();
      });
  },

  initMenu: function () {
    for (let productData in this.data.products) {
      new Product(this.data.products[productData].id, this.data.products[productData]);
    }
  },

  init: function () {
    this.initData();

    this.initCart();
  },

  initCart() {
    const cartElem = document.querySelector(select.containerOf.cart);
    this.cart = new Cart(cartElem);

    this.productList = document.querySelector(select.containerOf.menu);

    this.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product);
    });
  },
};

app.init();

export default app;
