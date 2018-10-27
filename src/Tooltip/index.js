import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Popup} from '../Popup';
import {TooltipPropTypes} from './proptypes';
import {getNumericProp} from '../utils';

import '../style.scss';
import './style.scss';

const DEFAULT_SIZE = 22;
const MIN_SIZE = 18;
const MAX_SIZE = 60;
const RATIO = .64;
const MAX_DELAY = 2000;
const DEFAULT_TEXT = '?';

export class Tooltip extends UIEXComponent {
	static propTypes = TooltipPropTypes;
	static displayName = 'Tooltip';
	static propsToCheck = ['size'];

	constructor(props) {
		super(props);
		this.state = {
			popupShown: props.popupShown
		};
		this.tooltipRef = React.createRef();
	}

	addClassNames(add) {
		const {type} = this.props;
		add('tooltip-' + type, type);
	}

	getCustomStyle() {
		const size = getNumericProp(this.props.size, DEFAULT_SIZE, MIN_SIZE, MAX_SIZE);
		return {
			width: size,
			height: size
		};
	}

	getCustomProps() {
		return {
			onMouseEnter: this.handleMouseEnter,
			onMouseLeave: this.handleMouseLeave
		};
	}

	getBgStyle() {
		const {type} = this.props;
		const size = getNumericProp(this.props.size, DEFAULT_SIZE, MIN_SIZE, MAX_SIZE);
		if (type == 'triangle') {
			return {
				width: Math.round(size * RATIO),
				height: Math.round(size * RATIO),
				top: -Math.round(size / 20)
			}
		}
		return null;
	}

	getInnerStyle() {
		const {type} = this.props;
		const size = getNumericProp(this.props.size, DEFAULT_SIZE, MIN_SIZE, MAX_SIZE);
		const style = {
			fontSize: Math.round(size / 1.5) + 'px'
		};
		if (type == 'triangle') {
			style.paddingTop = Math.round(size / 10) + 'px';
		}
		return style;
	}

	getText() {
		const {text} = this.props;
		if (!text || typeof text != 'string') {
			return DEFAULT_TEXT;
		}
		return text;
	}

	renderInternal() {
		const {
			children,
			nowrap,
			position,
			popupStyle,
			popupWidth,
			animation
		} = this.props;
		const text = this.getText();
		const TagName = this.getTagName(); 
		return (
			<TagName {...this.getProps()}>
				<div 
					className={this.getClassName('bg')}
					style={this.getBgStyle()}
				/>
				<div 
					ref={this.tooltipRef}
					className={this.getClassName('inner')}
					style={this.getInnerStyle()}
				>
					{text}
				</div>
				<Popup
					className={this.getClassName('popup')}
					isOpen={this.getProp('popupShown')}
					target={this.tooltipRef.current}
					nowrap={nowrap}
					position={position}
					animation={animation}
					width={popupWidth}
					style={popupStyle}
					inPortal
				>
					{children}
				</Popup>
			</TagName>
		)
	}

	handleMouseEnter = () => {
		const {popupShown, disabled} = this.props;
		if (!popupShown && !disabled) {
			const delay = getNumericProp(this.props.delay, 0, 0, MAX_DELAY);
			clearTimeout(this.timeout);
			this.timeout = setTimeout(() => {
				this.firePropChange('togglePopup', 'popupShown', [true], true);
			}, delay);
		}
	}

	handleMouseLeave = () => {
		const {popupFrozen, disabled} = this.props;
		if (!popupFrozen && !disabled) {
			clearTimeout(this.timeout);
			this.firePropChange('togglePopup', 'popupShown', [false], false);
		}
	}
}