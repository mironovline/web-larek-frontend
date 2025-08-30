import { ensureElement } from '../utils/utils';
import { IBasketItem, IBasketView, IAction } from '../types';
import { CardMain } from './CardMain';

export class BasketItem extends CardMain<IBasketItem> {
	protected _index: HTMLElement;
	protected _buttonDelete: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: IAction) {
		super(container, actions);
		this._index = ensureElement<HTMLElement>('.basket__item-index', container);
		this._buttonDelete = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			container
		);
		if (actions?.onClick) {
			this._buttonDelete.addEventListener('click', actions.onClick);
		}
	}

	set index(value: number) {
		this.setText(this._index, value);
	}
}