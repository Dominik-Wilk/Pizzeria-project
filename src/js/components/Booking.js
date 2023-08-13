import { select, templates } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Booking {
  constructor(element) {
    this.render(element);
    this.initWidgets();
  }

  render(element) {
    const generatedHTML = templates.bookingWidget();
    this.element = utils.createDOMFromHTML(generatedHTML);

    this.dom = {};
    this.dom.wrapper = element;
    this.dom.peopleAmount = this.element.querySelector(select.booking.peopleAmount);
    this.dom.hoursAmount = this.element.querySelector(select.booking.hoursAmount);

    this.dom.wrapper.appendChild(this.element);
  }

  initWidgets() {
    this.peopleWidget = new AmountWidget(this.dom.peopleAmount);
    this.hoursWidget = new AmountWidget(this.dom.hoursAmount);

    this.dom.peopleAmount.addEventListener('updated', () => {});

    this.dom.hoursAmount.addEventListener('updated', () => {});
  }
}

export default Booking;
