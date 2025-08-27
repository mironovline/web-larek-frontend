import { Form } from './Form';
import { Ibuyer } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Order extends Form<Partial<Ibuyer>> {
	protected _btnCash: HTMLButtonElement;
	protected _btnCard: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._btnCash = ensureElement<HTMLButtonElement>('.cash', this.container);
		this._btnCard = ensureElement<HTMLButtonElement>('.online', this.container);
		// Обработчики для кнопок способа оплаты
		this._btnCash.addEventListener('click', () => {
			this._btnCash.classList.add('button_alt-active');
			this._btnCard.classList.remove('button_alt-active');
			this.paymentChange('cash');
		});

		this._btnCard.addEventListener('click', () => {
			this._btnCard.classList.add('button_alt-active');
			this._btnCash.classList.remove('button_alt-active');
			this.paymentChange('online');
		});
	}
	protected paymentChange(value: string) {
		this.events.emit('order.payment:change', {
			field: 'payment',
			value: value,
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
	//метод для установки способа оплаты
	set payment(value: string) {
		if (value === 'cash') {
			this._btnCash.classList.add('button_alt-active');
			this._btnCard.classList.remove('button_alt-active');
		} else if (value === 'card') {
			this._btnCard.classList.add('button_alt-active');
			this._btnCash.classList.remove('button_alt-active');
		}
	}
}
