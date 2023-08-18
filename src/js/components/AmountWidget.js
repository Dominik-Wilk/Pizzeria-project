import { select, settings } from '../settings.js';
import BaseWidget from './BaseWidget.js';
class AmountWidget extends BaseWidget {
  constructor(element) {
    super(element, settings.amountWidget.defaultValue);

    this.getElements(element);
    this.initActions();
    this.dom.input.value = settings.amountWidget.defaultValue;
  }

  getElements() {
    this.dom.input = this.dom.wrapper.querySelector(select.widgets.amount.input);
    this.dom.linkDecrease = this.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    this.dom.linkIncrease = this.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }

  isValid(value) {
    return !isNaN(value) && value <= settings.amountWidget.defaultMax + 1 && value >= settings.amountWidget.defaultMin;
  }
  renderValue() {
    this.dom.input.value = this.value;
  }

  initActions() {
    this.dom.input.addEventListener('change', () => {
      this.setValue(this.dom.input.value);
    });
    this.dom.linkDecrease.addEventListener('click', e => {
      e.preventDefault();
      this.setValue(this.value - 1);
    });
    this.dom.linkIncrease.addEventListener('click', e => {
      e.preventDefault();
      this.setValue(this.value + 1);
    });
  }
}

export default AmountWidget;
