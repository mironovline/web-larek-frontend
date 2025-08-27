import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { ISuccess, IAction } from '../types';

export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected _total: HTMLElement;

	constructor(container: HTMLElement, actions: IAction) {
		super(container);

		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}
	set total(total: number) {
		let currentText;
		if (total === 1) {
			currentText = 'синапс';
		} else if (total >= 2 && total < 5) {
			currentText = 'синапса';
		} else {
			currentText = 'синапсов';
		}

		this.setText(this._total, `Списано ${total} ${currentText}`);
	}
}
