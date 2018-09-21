import React from 'react';
import {withStateMaster} from '../state-master';
import {UIEXComponent} from '../UIEXComponent';
import {Popup} from '../Popup';
import {getTransitionDuration, getNumber, inPercent, getSizeInPercentageOfWindow} from '../utils';
import {SidePanelPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const DEFAULT_SPEED = 'normal';
const DEFAULT_SIZE = 300;
const PROPS_LIST = 'isOpen';

class SidePanelComponent extends UIEXComponent {
	static propTypes = SidePanelPropTypes;
	static className = 'side-panel';
	static displayName = 'SidePanel';

	componentDidMount() {
		this.changeStyles(this.props.isOpen);
	}
	
	componentDidUpdate(prevProps) {
		if (prevProps.isOpen != this.props.isOpen) {
			if (!this.props.isOpen) {
				this.setSize();
			} else {
				clearTimeout(this.timeout);
			}
			this.animate(this.props.isOpen);
		}
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
		const outer = this.getOuterContainer();
		outer.style.visibility = 'visible';
		outer.style.opacity = '1';
	}

	hideStyles = () => {
		const outer = this.getOuterContainer();
		outer.style.visibility = 'hidden';
		outer.style.overflow = 'hidden';
		outer.style.opacity = '0';
		outer.style.width = '0';
		outer.style.height = '0';
	}

	showOverflowStyles = () => {
		const outer = this.getOuterContainer();
		outer.style.overflow = 'visible';
	}

	setSize = () => {
		const outer = this.getOuterContainer();
		outer.style[this.getSizeAttr()] = this.getSize();
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

	animate(isOpen) {		
		this.animating = true;
		let {animation, noHideAnimation} = this.props;
		const outer = this.getOuterContainer();
		const callback = () => {
			if (!isOpen) {
				this.fireClose();
			}
			this.animating = false;
		};
		if (!isOpen && noHideAnimation) {
			animation = false;
		}
		if (animation) {
			outer.style.transitionDuration = this.getSpeed() / 10 + 's';
			const delay = this.getDelay();
			setTimeout(callback, delay);
		} else {
			outer.style.transitionDuration = '';
			callback();
		}
		if (isOpen) {
			this.processShowAnimation();
		} else {
			this.processHideAnimation();
		}
	}

	fireClose = () => {
		const {onClose} = this.props;
		if (typeof onClose == 'function') {
			onClose();
		}
	}

	processShowAnimation() {
		const outer = this.getOuterContainer();
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
		const outer = this.getOuterContainer();
		const delay = this.getDelay();
		switch (this.props.animation) {
			case 'fade':
				outer.style.opacity = '0';
				setTimeout(this.hideStyles, delay);
			break;

			case 'fade-roll':
				outer.style.opacity = '0';
				outer.style[this.getSizeAttr()] = '0';
				outer.style.overflow = 'hidden';
				setTimeout(this.hideStyles, delay);
			break;

			case 'roll':
				outer.style[this.getSizeAttr()] = '0';
				outer.style.overflow = 'hidden';
				setTimeout(this.hideStyles, delay);
			break;

			default:
				this.hideStyles();
		}
	}

	getSpeed() {
		let {speed, side, width, height, animation} = this.props;
		if (typeof speed != 'string') {
			speed = DEFAULT_SPEED;
		}
		let size = DEFAULT_SIZE;
		if (!side || side == 'left' || side == 'right') {
			if (inPercent(width)) {
				width = getSizeInPercentageOfWindow(width, 'width');
			}
			size = getNumber(width);
		} else {
			if (inPercent(height)) {
				height = getSizeInPercentageOfWindow(height, 'height');
			}
			size = getNumber(height);
		}
		return getTransitionDuration(speed, size, animation);
	}

	getDelay() {
		return this.getSpeed() * 100;
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

	renderInternal() {
		let {children, side, isOpen, animation, effect, unclosable, tagName} = this.props;
		let className = 'uiex-side-panel-outer'
		if (side) {
			className += ' uiex-side-' +  side;
		}
		if (animation) {
			className += ' uiex-animated';
			className += ' uiex-animation-' +  animation;
		}
		if (effect) {
			className += ' uiex-effect-' + effect;
		}
		return (
			<Popup 
				ref="popup"
				tagName={tagName}
				className={className}
				isOpen={isOpen && !unclosable}
				onCollapse={this.handlePopupCollapse}
			>
				<div {...this.getProps()} ref="inner">
					{children}
				</div>
			</Popup>
		)
	}

	handlePopupCollapse = () => {
		this.timeout = setTimeout(() => this.fireClose(), 10);
	}

	getOuterContainer() {
		return this.refs.popup.refs.main;
	}
}

export const SidePanel = withStateMaster(SidePanelComponent, PROPS_LIST, null, UIEXComponent);