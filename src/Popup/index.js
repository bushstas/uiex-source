import React from 'react';
import {UIEXPopup} from '../UIEXComponent';
import {PopupPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const SIDE_MARGIN = 12;

export class Popup extends UIEXPopup {
	static propTypes = PopupPropTypes;
	static displayName = 'Popup';

	addClassNames(add) {
		super.addClassNames(add);
		add('nowrap', this.props.nowrap);
	}

	handlePopupShown() {
		this.setPositionByTarget(this.props.target);
	}

	setPositionByTarget(target) {
		if (target instanceof Object && target.current instanceof Element) {
			target = target.current;
		}
		if (target instanceof Element) {
			const {main} = this.refs;
			const {left, top, width, height} = target.getBoundingClientRect();
			const {width: ownWidth, height: ownHeight} = main.getBoundingClientRect();
			let x, y;
			const {position} = this.props;
			switch (position) {
				case 'right-above':
					y = top - ownHeight;
					x = left + width + SIDE_MARGIN;
				break;

				case 'right-center':
					y = top + height / 2 - ownHeight / 2;
					x = left + width + SIDE_MARGIN;
				break;

				case 'right-top':
					y = top + height - ownHeight;
					x = left + width + SIDE_MARGIN;
				break;

				case 'right-under':
					y = top + height;
					x = left + width + SIDE_MARGIN;
				break;

				case 'left-above':
					y = top - ownHeight;
					x = left - ownWidth - SIDE_MARGIN;
				break;

				case 'left-center':
					y = top + height / 2 - ownHeight / 2;
					x = left - ownWidth - SIDE_MARGIN;
				break;

				case 'left-top':
					y = top + height - ownHeight;
					x = left - ownWidth - SIDE_MARGIN;
				break;

				case 'left-under':
					y = top + height;
					x = left - ownWidth - SIDE_MARGIN;
				break;

				case 'left-bottom':
					y = top;
					x = left - ownWidth - SIDE_MARGIN;
				break;

				case 'bottom-right':
					y = top + height + SIDE_MARGIN;
					x = left;
				break;

				case 'bottom-center':
					y = top + height + SIDE_MARGIN;
					x = left + width / 2 - ownWidth / 2;
				break;

				case 'bottom-left':
					y = top + height + SIDE_MARGIN;
					x = left + width - ownWidth;
				break;

				case 'top-right':
					y = top - ownHeight - SIDE_MARGIN;
					x = left;
				break;

				case 'top-center':
					y = top - ownHeight - SIDE_MARGIN;
					x = left + width / 2 - ownWidth / 2;
				break;

				case 'top-left':
					y = top - ownHeight - SIDE_MARGIN;
					x = left + width - ownWidth;
				break;

				default:
					y = top;
					x = left + width + SIDE_MARGIN;
			}			
			main.style.top = y + 'px';
			main.style.left = x + 'px';
		}
	}
}