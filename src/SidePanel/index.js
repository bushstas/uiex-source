import React from 'react';
import {UIEXPopup} from '../UIEXComponent';
import {inPercent, getSizeInPercentageOfWindow} from '../utils';
import {SidePanelPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const DEFAULT_SPEED = 'normal';
const DEFAULT_SIZE = 300;

export class SidePanel extends UIEXPopup {
	static propTypes = SidePanelPropTypes;
	static className = 'side-panel';
	static displayName = 'SidePanel';
	static additionalClassName = 'popup';

	static defaultProps = {
		queueName: 'side_panel',
		inPortal: true
	};

	componentDidUpdate(prevProps) {
		super.componentDidUpdate(prevProps);
		if (prevProps.isOpen != this.props.isOpen) {
			if (!this.props.isOpen) {
				this.setSize();
			} else {
				clearTimeout(this.timeout);
			}
			this.animate(this.props.isOpen);
		}
	}

	addClassNames(add) {
		super.addClassNames(add);
		const {side, animation, effect} = this.props;
		add('side-' + side, side);
		if (animation) {
			add('animated');
			add('animation-' + animation);
		}
		add('effect-' + effect, effect);
	}

	changeStyles(isOpen) {		
		if (isOpen) {
			this.setSize();
			this.showAllStyles();
		} else {
			this.hideStyles();
		}
	}

	showAllStyles = () => {
		this.showStyles();
		this.showOverflowStyles();
	}

	showStyles = () => {
		const {main} = this.refs;
		main.style.visibility = 'visible';
		main.style.opacity = '1';
	}

	hideStyles = () => {
		const {main} = this.refs;
		main.style.visibility = 'hidden';
		main.style.overflow = 'hidden';
		main.style.opacity = '0';
		main.style.width = '0';
		main.style.height = '0';
	}

	showOverflowStyles = () => {
		const {main} = this.refs;
		main.style.overflow = 'visible';
	}

	setSize = () => {
		const {main} = this.refs;
		main.style[this.getSizeAttr()] = this.getSize();
		main.style[this.getOppositeSizeAttr()] = '';
	}

	getSize() {
		return this.getIntSize() + 'px';
	}

	getIntSize() {
		return this.refs.inner.getBoundingClientRect()[this.getSizeAttr()];
	}

	getSizeAttr() {
		const {side} = this.props;
		if (side == 'top' || side == 'bottom') {
			return 'height';
		}
		return 'width';
	}

	getOppositeSizeAttr() {
		const attr = this.getSizeAttr();
		return attr == 'width' ? 'height' : 'width';
	}

	animate(isOpen) {		
		this.animating = true;
		let {animation, noHideAnimation} = this.props;
		const {main} = this.refs;
		const callback = () => {
			this.animating = false;
		};
		if (!isOpen && noHideAnimation) {
			animation = false;
		}
		if (animation) {
			main.style.transitionDuration = this.getSpeed() / 10 + 's';
			const delay = this.getDelay();
			setTimeout(callback, delay);
		} else {
			main.style.transitionDuration = '';
			callback();
		}
		if (isOpen) {
			this.processShowAnimation();
		} else {
			this.processHideAnimation();
		}
	}

	processShowAnimation() {
		const delay = this.getDelay();
		switch (this.props.animation) {
			case 'roll':
			case 'fade-roll':
				this.showStyles();
				this.setSize();
				setTimeout(this.showOverflowStyles, delay);
			break;

			default:
				this.setSize();
				this.showAllStyles();
		}
	}

	processHideAnimation() {
		const {main} = this.refs;
		const delay = this.getDelay();
		switch (this.props.animation) {
			case 'fade':
				main.style.opacity = '0';
				setTimeout(this.hideStyles, delay);
			break;

			case 'fade-roll':
				main.style.opacity = '0';
				main.style[this.getSizeAttr()] = '0';
				main.style.overflow = 'hidden';
				setTimeout(this.hideStyles, delay);
			break;

			case 'roll':
				main.style[this.getSizeAttr()] = '0';
				main.style.overflow = 'hidden';
				setTimeout(this.hideStyles, delay);
			break;

			default:
				this.hideStyles();
		}
	}

	getWidthProp() {
		const {width} = this.props;
		if (inPercent(width)) {
			return getSizeInPercentageOfWindow(width, 'width');
		}
		return width;
	}

	getHeightProp() {
		const {height} = this.props;
		if (inPercent(height)) {
			return getSizeInPercentageOfWindow(height, 'height');
		}
		return height;
	}

	getPopupPosition() {
		return 'fixed';
	}
}