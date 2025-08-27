import { Component } from './base/Component';
import { EventEmitter } from './base/events';
import { createElement, ensureElement } from '../utils/utils';
import { IBasketItem, IBasketView, IAction } from '../types';

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}
	get items(): HTMLElement[] {
		if (this._list.childElementCount === 0) {
			return [
				createElement<HTMLParagraphElement>('p', {
					textContent: `Корзина пуста`,
				}),
			];
		}
		return Array.from(this._list.children) as HTMLElement[];
	}

	set selected(items: string[]) {
		if (items.length) {
			this.setDisabled(this._button, false);
		} else {
			this.setDisabled(this._button, true);
		}
	}

	set total(total: number) {
		this.setText(this._total, String(total + ' синапсов'));
	}
}

export class BasketItem extends Component<IBasketItem> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _buttonDelete: HTMLButtonElement;

	constructor(container: HTMLElement, action?: IAction) {
		super(container);

		this._index = ensureElement<HTMLElement>('.basket__item-index', container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._buttonDelete = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			container
		);

		if (action?.onClick) {
			this._buttonDelete.addEventListener('click', action.onClick);
		}
	}

	set index(value: number) {
		this.setText(this._index, value);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		this.setText(this._price, value + ' синапсов');
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}
}
