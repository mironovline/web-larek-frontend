import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { IAction } from '../types/index';

export class CardMain<T> extends Component<T> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _isInBasket: boolean = false;

	constructor(container: HTMLElement, actions?: IAction) {
		super(container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = container.querySelector('.card__button');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}
	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number | null) {
		if (value === null || isNaN(value)) {
			this.setText(this._price, 'Бесценно');
			this.toggleButton(true);
			this.setText(this._button, 'Недоступно');
		} else {
			this.setText(this._price, `${value} синапсов`);
			this.toggleButton(false);
		}
	}

	set buttonText(value: string) {
		if (this._button) {
			this.setText(this._button, value);
		}
	}
	get isInBasket(): boolean {
		return this._isInBasket;
	}

	set isInBasket(value: boolean) {
		this._isInBasket = value;
		this.buttonText = value ? 'В корзину' : 'Купить';
	}

	toggleButton(state: boolean) {
		this.setDisabled(this._button, state);
	}
}
