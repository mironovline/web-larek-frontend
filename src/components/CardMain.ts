import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { IAction } from '../types/index';

export abstract class CardMain<T> extends Component<T> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button?: HTMLButtonElement;

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

	set price(value: number) {
		if (value === null || isNaN(value)) {
			this.setText(this._price, 'Бесценно');
			this.toggleButton(true);
			this.setText(this._button, 'Недоступно');
		} else {
			this.setText(this._price, `${value} синапсов`);
			this.toggleButton(false);
		}
	}
	toggleButton(state: boolean) {
		this.setDisabled(this._button, state);
	}
}
