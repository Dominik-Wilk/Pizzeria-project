import { select, settings } from '../settings.js';

class AmountWidget {
  constructor(element) {
    this.value = settings.amountWidget.defaultValue;

    this.getElements(element);
    this.setValue(this.input.value);
    this.initActions();
  }

  getElements(element) {
    this.element = element;
    this.input = this.element.querySelector(select.widgets.amount.input);
    this.linkDecrease = this.element.querySelector(select.widgets.amount.linkDecrease);
    this.linkIncrease = this.element.querySelector(select.widgets.amount.linkIncrease);
  }

  setValue(value) {
    const newValue = parseInt(value);

    if (
      this.value !== newValue &&
      !isNaN(newValue) &&
      newValue <= settings.amountWidget.defaultMax + 1 &&
      newValue >= settings.amountWidget.defaultMin - 1
    ) {
      this.value = newValue;
      this.announce();
    }

    this.input.value = this.value;
  }

  initActions() {
    this.input.addEventListener('change', () => {
      this.setValue(this.input.value);
    });
    this.linkDecrease.addEventListener('click', e => {
      e.preventDefault();
      this.setValue(this.value - 1);
    });
    this.linkIncrease.addEventListener('click', e => {
      e.preventDefault();
      this.setValue(this.value + 1);
    });
  }

  announce() {
    const event = new CustomEvent('updated', {
      bubbles: true,
    });
    this.element.dispatchEvent(event);
  }
}

export default AmountWidget;
