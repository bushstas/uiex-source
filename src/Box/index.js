import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Button} from '../Button';
import {getTransitionDuration} from '../utils';
import {BoxPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const DEFAULT_SPEED = 'normal';
const BOTTOM_PADDING_STYLE = {width: '1px', height: '15px'};

export class Box extends UIEXComponent {
	static propTypes = BoxPropTypes;
	static displayName = 'Box';

	constructor(props) {
		super(props);
		if (props.uncontrolled) {
			this.state = {
				isOpen: props.isOpen
			};
		}
	}

	addClassNames(add) {
		const {animation, effect, buttonUnder} = this.props;		
		if (animation) {
			add('animated');
			add('animation-' + animation);
			add('effect-' + effect, effect);
		} else {
			add('not-animated');
		}
		add('box-button-under', buttonUnder);
	}

	componentDidMount() {
		const isOpen = this.getProp('isOpen');		
		this.changeStyles(isOpen);
	}

	componentDidUpdate(prevProps) {
		const {isOpen, uncontrolled} = this.props;
		if (!uncontrolled && Boolean(isOpen) != Boolean(prevProps.isOpen)) {
			this.update();
		}
	}
	

	componentWillUnmount() {
		clearTimeout(this.mainTimeout);
		clearTimeout(this.timeout);
		super.componentWillUnmount();
	}

	update = () => {
		const isOpen = this.getProp('isOpen');
		if (!isOpen) {
			this.setHeight();
		}
		this.animate(isOpen);
	}

	changeStyles(isOpen) {
		if (isOpen) {
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
		const {outer} = this.refs;
		outer.style.visibility = 'visible';
		outer.style.opacity = '1';
		outer.style.paddingTop = '';
		outer.style.paddingBottom = '';
		outer.style.marginTop = '';
		outer.style.marginBottom = '';
		outer.style.borderTop = '';
		outer.style.borderBottom = '';
		outer.style.boxShadow = '';
	}

	showOverflowStyles = () => {
		this.refs.outer.style.overflow = 'visible';
	}

	hideStyles = () => {
		const {outer} = this.refs;
		outer.style.visibility = 'hidden';
		outer.style.overflow = 'hidden';
		outer.style.opacity = '0';
		outer.style.height = '0';
		outer.style.paddingTop = '0';
		outer.style.paddingBottom = '0';
		outer.style.marginTop = '0';
		outer.style.marginBottom = '0';
		outer.style.borderTop = '0';
		outer.style.borderBottom = '0';
		outer.style.boxShadow = 'none';
	}

	resetHeight = () => {
		this.refs.outer.style.height = '';
	}

	setHeight = () => {
		this.refs.outer.style.height = this.getHeight();
	}

	isWithFading() {
		const {animation} = this.props;
		return animation == 'fade' || 
			   animation == 'fade-fall' ||
			   animation == 'fade-roll';
	}

	animate(isOpen) {
		this.animating = true;
		let {animation, noHideAnimation} = this.props;
		const callback = () => {
			if (!isOpen) {
				this.fire('hide');
			}
			this.animating = false;
		};
		if (!isOpen && noHideAnimation) {
			animation = false;
		}
		if (animation) {
			this.refs.outer.style.transitionDuration = this.getSpeed() / 10 + 's';
			const delay = this.getDelay();
			clearTimeout(this.mainTimeout);
			this.mainTimeout = setTimeout(callback, delay);
		} else {
			this.refs.outer.style.transitionDuration = '';
			callback();
		}
		if (isOpen) {
			this.processShowAnimation();
		} else {
			this.processHideAnimation(animation);
		}
	}

	processShowAnimation() {
		const delay = this.getDelay();
		clearTimeout(this.timeout);
		switch (this.props.animation) {
			case 'fall':
			case 'roll':
			case 'fade-fall':
			case 'fade-roll':
				this.showStyles();
				this.setHeight();
				this.timeout = setTimeout(() => {
					this.showOverflowStyles();
					this.resetHeight();
				}, delay);
			break;

			default:
				this.setHeight();
				this.showAllStyles();
		}
	}

	processHideAnimation(animation) {
		const {outer} = this.refs;
		const delay = this.getDelay();
		clearTimeout(this.timeout);
		switch (animation) {
			case 'fade':
				outer.style.opacity = '0';
				this.timeout = setTimeout(this.hideStyles, delay);
			break;

			case 'fade-fall':
			case 'fade-roll':
				outer.style.opacity = '0';
				outer.style.height = '0';
				outer.style.overflow = 'hidden';
				this.timeout = setTimeout(this.hideStyles, delay);
			break;

			case 'fall':
			case 'roll':
				outer.style.height = '0';
				outer.style.overflow = 'hidden';
				this.timeout = setTimeout(this.hideStyles, delay);
			break;

			default:
				this.hideStyles();
		}
	}

	getHeightProp() {
		return null;
	}

	getIntHeight() {
		return this.refs.inner.getBoundingClientRect().height;
	}

	getHeight() {
		return this.getIntHeight() + 'px';
	}

	getSpeed() {
		let {speed, animation} = this.props;
		if (typeof speed != 'string') {
			speed = DEFAULT_SPEED;
		}
		const height = this.getIntHeight();
		return getTransitionDuration(speed, height, animation);
	}

	getDelay() {
		return this.getSpeed() * 100;
	}

	renderInternal() {
		const {
			button,
			buttonUnder,
		} = this.props;
		const TagName = this.getTagName();
		const withButton = button && typeof button == 'string';
		if (withButton) {
			return (
				<TagName className="uiex-box-container">
					{withButton && !buttonUnder && this.renderButton()}
					{this.renderBox()}
					{withButton && buttonUnder && this.renderButton()}
				</TagName>
			)
		}
		return this.renderBox();
	}

	renderBox() {
		return (
			<div {...this.getProps()} ref="outer">
				<div className="uiex-box-inner" ref="inner">
					{this.props.children}
					<div style={BOTTOM_PADDING_STYLE} />
				</div>
			</div>
		)
	}

	renderButton() {
		const {disabled, onDisabledClick} = this.props;
		const isOpen = this.getProp('isOpen');
		return (
			<Button 
				className="uiex-box-button"
				onClick={this.handleToggle}
				iconAtRight
				icon={!isOpen ? 'expand_more' : 'expand_less'}
				iconSize={30}
				disabled={disabled}
				onDisabledClick={onDisabledClick}
			>
				{this.getButtonTitle()}
			</Button>
		)
	}

	getButtonTitle() {
		const isOpen = this.getProp('isOpen');
		const {button} = this.props;
		const parts = button.split('/');
		if (isOpen && parts[1]) {
			return parts[1].trim();
		}
		return (parts[0] || parts[1]).trim();
	}

	handleToggle = () => {
		const isOpen = !this.getProp('isOpen');
		const {disabled, uncontrolled} = this.props;
		if (!disabled && !this.animating) {
			if (uncontrolled) {
				this.setState({isOpen}, this.update);
			}
			this.fire('toggle', isOpen);
		}
	}
}