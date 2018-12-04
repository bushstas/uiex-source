import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Arrow} from '../Arrow';
import {Popup} from '../Popup';
import {TextBlock} from '../TextBlock';
import {HintPropTypes} from './proptypes';
import {getNumericProp, getMergedClassName} from '../utils';
import {COLOR_HEXES, TEXT_COLOR_HEXES, BORDER_COLOR_HEXES} from '../consts';

import '../style.scss';
import './style.scss';

const DEFAULT_BG_COLOR = '#555';
const DEFAULT_TEXT_COLOR = '#FFF';
const MAX_DELAY = 2000;
const ARROW_SIZE = 15;
const ARROW_LENGTH_RATIO = 100;
const DEFAULT_BORDER_OPACITY = 4;

export class Hint extends UIEXComponent {
	static propTypes = HintPropTypes;
	static displayName = 'Hint';

	constructor(props) {
		super(props);
		this.state = {
			isOpen: props.isOpen
		};
	}

	componentDidMount() {
		const {withMouseEventHandlers} = this.props;
		if (withMouseEventHandlers) {
			setTimeout(() => {
				let {target} = this.props;
				if (target instanceof Object) {
					if (target.current instanceof Element) {
						target = target.current;
					}
					if (target instanceof Element) {
						this.target = target;
						target.addEventListener('mouseenter', this.handleMouseEnter, false);
						target.addEventListener('mouseleave', this.handleMouseLeave, false);
					}
				}
			}, 100);
		}
	}

	componentWillUnmount() {
		const {withMouseEventHandlers} = this.props;
		if (withMouseEventHandlers && this.target instanceof Element) {
			this.target.removeEventListener('mouseenter', this.handleMouseEnter, false);
			this.target.removeEventListener('mouseleave', this.handleMouseLeave, false);
			this.target = null;
		}
	}

	getText() {
		const {text} = this.props;
		if (!text || typeof text != 'string') {
			return DEFAULT_TEXT;
		}
		return text;
	}

	getBgColor() {
		let {color, colorTheme} = this.props;
		if (!color || typeof color != 'string') {
			if (colorTheme) {
				color = COLOR_HEXES[colorTheme];
			}
			if (!color) {
				color = DEFAULT_BG_COLOR;
			}			
		}
		return color;
	}

	getTextColor() {
		let {colorTheme, textColor} = this.props;
		if (!textColor) {
			if (colorTheme) {
				textColor = TEXT_COLOR_HEXES[colorTheme];
			}
			if (!textColor) {
				textColor = DEFAULT_TEXT_COLOR;
			}
		}
		return textColor;
	}

	getPopupClassName() {
		const {withArrow, position} = this.props;
		return getMergedClassName(
			this.getClassName(),
			withArrow ? 'uiex-with-arrow' : null,
			position ? `uiex-position-${position}` : null
		);
	}

	getArrowDirection() {
		const {position} = this.props;
		switch (position) {
			case 'right-above':
				return 'down-left';

			case 'right-under':
				return 'up-left';

			case 'left-above':
				return 'down-right';

			case 'left-under':
				return 'up-right';

			case 'left-top':
			case 'left-center':
			case 'left-bottom':
				return 'right';

			case 'bottom-left':
			case 'bottom-center':
			case 'bottom-right':
				return 'up';

			case 'top-left':
			case 'top-center':
			case 'top-right':
				return 'down';

			default:
				return 'left';
		}
	}

	getArrowLengthRatio() {
		const {position} = this.props;
		switch (position) {
			case 'right-above':
			case 'right-under':
			case 'left-above':
			case 'left-under':
				return ARROW_LENGTH_RATIO;

			default:
				return;
		}
	}

	renderInternal() {
		const {
			isFrozen,
			target,
			height,
			children,
			nowrap,
			position,
			style,
			width,
			animation,
			transparency,
			withArrow,
			border,
			boxShadow
		} = this.props;
		const bgColor = this.getBgColor();
		return (
			<Popup
				className={this.getPopupClassName()}
				isOpen={this.getProp('isOpen') || isFrozen}
				target={target}
				position={position}
				animation={animation}
				width={width}
				inPortal
			>
				{withArrow && 
					<Arrow
						size={ARROW_SIZE}
						lengthRatio={this.getArrowLengthRatio()}
						direction={this.getArrowDirection()}
						color={bgColor}
					/>
				}
				<TextBlock
					fontSize={12}
					lineHeight={16}
					textColor={this.getTextColor()}
					bgColor={bgColor}
					border={border}
					boxShadow={boxShadow}
					borderOpacity={DEFAULT_BORDER_OPACITY}
					borderRadius={3}
					padding="6px 10px"
					height={height}
					transparency={transparency}
					style={style}
					nowrap={nowrap}
				>
					{children}
				</TextBlock>
			</Popup>
		)
	}

	handleMouseEnter = () => {
		const {disabled} = this.props;
		const isOpen = this.getProp('isOpen');
		if (!isOpen && !disabled) {
			const delay = getNumericProp(this.props.delay, 0, 0, MAX_DELAY);
			clearTimeout(this.timeout);
			this.timeout = setTimeout(() => {
				this.firePropChange('toggleShown', 'isOpen', [true], true);
			}, delay);
		}
	}

	handleMouseLeave = () => {
		const {disabled} = this.props;
		const isOpen = this.getProp('isOpen');
		if (isOpen && !disabled) {
			clearTimeout(this.timeout);
			this.firePropChange('toggleShown', 'isOpen', [false], false);
		}
	}
}