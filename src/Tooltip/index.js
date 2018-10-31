import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Hint} from '../Hint';
import {TooltipPropTypes} from './proptypes';
import {getNumericProp} from '../utils';

import '../style.scss';
import './style.scss';

const DEFAULT_SIZE = 22;
const MIN_SIZE = 18;
const MAX_SIZE = 60;
const RATIO = .64;
const DEFAULT_TEXT = '?';

export class Tooltip extends UIEXComponent {
	static propTypes = TooltipPropTypes;
	static displayName = 'Tooltip';
	static propsToCheck = ['size'];

	constructor(props) {
		super(props);
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
			popupShown,
			uncontrolled,
			height,
			children,
			nowrap,
			position,
			popupStyle,
			popupWidth,
			animation,
			transparency,
			popupColorTheme,
			popupColor,
			textColor,
			popupFrozen,
			disabled,
			delay,
			withArrow,
			withBorder,
			withShadow
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
				<Hint
					isOpen={popupShown}
					target={this.tooltipRef}
					position={position}
					animation={animation}
					width={popupWidth}
					height={height}
					style={popupStyle}
					nowrap={nowrap}
					transparency={transparency}
					colorTheme={popupColorTheme}
					color={popupColor}
					textColor={textColor}
					uncontrolled={uncontrolled}
					isFrozen={popupFrozen}
					disabled={disabled}
					delay={delay}
					withArrow={withArrow}
					withBorder={withBorder}
					withShadow={withShadow}
					withMouseEventHandlers
					onToggleShown={this.handleHintToggleShown}
				>
					{children}
				</Hint>
			</TagName>
		)
	}

	handleHintToggleShown = (shown) => {
		this.firePropChange('togglePopup', 'popupShown', [shown], shown);
	}
}