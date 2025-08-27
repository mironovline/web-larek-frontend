import { Component } from './base/Component';
import { Iproduct, IAction } from '../types/index';
import { ensureElement, bem } from '../utils/utils';

export class Card<T> extends Component<Iproduct> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _description?: HTMLElement;
	protected _buttonModal?: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: IAction
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = ensureElement<HTMLImageElement>(
			`.${blockName}__image`,
			container
		);
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
		this._category = container.querySelector(`.${blockName}__category`);
		this._buttonModal = container.querySelector(`.${blockName}__button`);
		this._description = container.querySelector(`.${blockName}__text`);

		if (actions?.onClick) {
			if (this._buttonModal) {
				this._buttonModal.textContent = 'Купить';
				this._buttonModal.addEventListener('click', actions.onClick);
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

	set description(value: string | string[]) {
		if (Array.isArray(value)) {
			this._description.replaceWith(
				...value.map((str) => {
					const descTemplate = this._description.cloneNode() as HTMLElement;
					this.setText(descTemplate, str);
					return descTemplate;
				})
			);
		} else {
			this.setText(this._description, value);
		}
	}

	set category(value: string) {
		const modifier = {
			'софт-скил': 'soft',
			'хард-скил': 'hard',
			кнопка: 'button',
			другое: 'other',
			дополнительное: 'additional',
		}[value];

		if (modifier) {
			const className = bem(this.blockName, 'category', modifier).name;
			this.setText(this._category, value);
			this.toggleClass(this._category, className, true);
		}
	}

	set price(value: number) {
		if (value === null || isNaN(value)) {
			this.setText(this._price, 'Бесценно');
			this.setDisabled(this._buttonModal, true);
			this.setText(this._buttonModal, 'Недоступно');
		} else {
			this.setText(this._price, `${value} синапсов`);
			this.setDisabled(this._buttonModal, false);
		}
	}

	set image(value: string) {
		this.setImage(this._image, value);
	}
}
