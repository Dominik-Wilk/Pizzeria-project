import { settings, select, classNames } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';

const app = {
  initPages: function () {
    this.pages = document.querySelector(select.containerOf.pages).children;
    this.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = this.pages[0].id;

    for (let page of this.pages) {
      if (page.id === idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }
    this.activatePage(pageMatchingHash);

    for (let link of this.navLinks) {
      link.addEventListener('click', e => {
        const clickedElement = e.currentTarget;

        e.preventDefault();

        // get page id from HREF attribute

        const id = clickedElement.getAttribute('href').replace('#', '');
        // run this.activatePage with that id
        this.activatePage(id);

        // change URL hash

        window.location.hash = `#/${id}`;
      });
    }
  },

  activatePage: function (pageId) {
    // add class "active" to matchinh pages, remove from non-matching
    for (let page of this.pages) {
      page.classList.toggle(classNames.pages.active, page.id === pageId);
    }

    // add class "active" to matchinh links, remove from non-matching
    for (let link of this.navLinks) {
      link.classList.toggle(classNames.nav.active, link.getAttribute('href') === `#${pageId}`);
    }
  },

  handlerBtns: function () {
    const homePage = document.querySelector('#home');
    const homeLink = document.querySelector('#homeLink');

    document.querySelector('.box--left').addEventListener('click', function () {
      document.querySelector('#order').classList.add('active');
      document.querySelector('#orderLink').classList.add('active');
      homePage.classList.remove('active');
      homeLink.classList.remove('active');
    });
    document.querySelector('.box--right').addEventListener('click', function () {
      document.querySelector('#booking').classList.add('active');
      document.querySelector('#bookingLink').classList.add('active');
      homePage.classList.remove('active');
      homeLink.classList.remove('active');
    });
  },

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
    this.initPages();
    this.initCart();
    this.initBooking();
    this.handlerBtns();
  },

  initCart() {
    const cartElem = document.querySelector(select.containerOf.cart);
    this.cart = new Cart(cartElem);

    this.productList = document.querySelector(select.containerOf.menu);

    this.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product);
    });
  },
  initBooking() {
    const container = document.querySelector(select.containerOf.booking);
    this.booking = new Booking(container);
  },
};

app.init();

export default app;
