import { Component } from './base/Component';
import { EventEmitter } from './base/events';
import { createElement, ensureElement } from '../utils/utils';
import { IBasketView } from '../types';

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
			this.setDisabled(this._button, true);
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
		this.setDisabled(this._button, false);
	}

	set total(total: number) {
		this.setText(this._total, String(total + ' синапсов'));
	}
}
