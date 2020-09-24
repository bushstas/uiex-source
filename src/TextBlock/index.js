import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {getNumericProp, getNumberInPxOrPercent} from '../utils';
import {TextBlockPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const DEFAULT_LINE_HEIGHT = 18;
const MIN_LINE_HEIGHT = 10;
const MAX_LINE_HEIGHT = 100;
const DEFAULT_FONT_SIZE = 14;
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 90;
const MIN_TRANSPARENCY = 0.5;
const MAX_TRANSPARENCY = 10;

export class TextBlock extends UIEXComponent {
	static propTypes = TextBlockPropTypes;
	static displayName = 'TextBlock';
	static className = 'text-block';
	static propsToCheck = ['fontSize', 'lineHeight', 'textColor', 'padding', 'margin', 'textShadow', 'boxShadow'];

	addClassNames(add) {
		const {
			bold,
			italic,
			noselect,
			justify,
			nowrap,
			withEllipsis,
			underlined,
			smaller,
			larger
		} = this.props;
		add('bold', bold);
		add('italic', italic);
		add('noselect', noselect);
		add('justify', justify);
		add('nowrap', nowrap);
		add('ellipsis', withEllipsis);
		add('underlined', underlined);
		add('smaller', smaller);
		add('larger', larger);
	}

	getCustomStyle() {
		let {
			fontSize,
			lineHeight,
			textColor,
			padding,
			margin,
			boxShadow,
			textShadow
		} = this.props;	
		const style = {};
		if (fontSize != null) {
			fontSize = this.getFontSize();
			style.fontSize = `${fontSize}px`;
		}
		if (lineHeight != null) {
			lineHeight = this.getLineHeight(); 
			style.lineHeight = `${lineHeight}px`;
		}
		if (textColor != null) {
			style.color = textColor;
		}
		if (padding != null) {
			style.padding = getNumberInPxOrPercent(padding);
		}
		if (margin != null) {
			style.margin = getNumberInPxOrPercent(margin);
		}
		if (textShadow != null) {
			style.textShadow = textShadow;
		}
		return style;
	}

	getBgStyle() {
		let {bgColor, borderRadius, boxShadow} = this.props;
		const transparency = this.getTransparency();
		const style = this.cachedStyle || {};
		if (!bgColor || typeof bgColor != 'string') {
			bgColor = style.backgroundColor;
		}
		if (!borderRadius) {
			borderRadius = style.borderRadius;
		}
		if (!boxShadow) {
			boxShadow = style.boxShadow;
		}
		if (
			!this.cachedBgStyle ||
			bgColor != this.cachedBgStyle.backgroundColor ||
			transparency != this.cachedBgStyle.opacity ||
			boxShadow != this.cachedBgStyle.boxShadow ||
			borderRadius != this.cachedBgStyle.borderRadius
		) {
			this.cachedBgStyle = {
				backgroundColor: bgColor,
				opacity: transparency,
				borderRadius: getNumberInPxOrPercent(borderRadius),
				boxShadow
			};
		}
		return this.cachedBgStyle;
	}

	getTransparency() {
		return getNumericProp(this.props.transparency, MAX_TRANSPARENCY, MIN_TRANSPARENCY, MAX_TRANSPARENCY) / 10;
	}

	getFontSize() {
		return getNumericProp(this.props.fontSize, DEFAULT_FONT_SIZE, MIN_FONT_SIZE, MAX_FONT_SIZE);
	}

	getLineHeight() {
		return getNumericProp(this.props.lineHeight, DEFAULT_LINE_HEIGHT, MIN_LINE_HEIGHT, MAX_LINE_HEIGHT);
	}

	getBorderOpacity() {
		return getNumericProp(this.props.borderOpacity, MAX_TRANSPARENCY, MIN_TRANSPARENCY, MAX_TRANSPARENCY) / 10;
	}

	getBorderStyle() {
		let {border, borderRadius} = this.props;
		const borderOpacity = this.getBorderOpacity();
		const style = this.cachedStyle || {};
		if (!border || typeof border != 'string') {
			border = style.border;
		}
		if (!borderRadius) {
			borderRadius = style.borderRadius;
		}
		if (
			!this.cachedBorderStyle ||
			border != this.cachedBorderStyle.border ||
			borderOpacity != this.cachedBorderStyle.opacity ||
			borderRadius != this.cachedBorderStyle.borderRadius
		) {
			this.cachedBorderStyle = {
				border,
				opacity: borderOpacity,
				borderRadius: getNumberInPxOrPercent(borderRadius)
			};
		}
		return this.cachedBorderStyle;
	}

	renderInternal() {
		let {children} = this.props;
		const props = this.getProps();
		const TagName = this.getTagName();
		const borderStyle = this.getBorderStyle();
		return (
			<TagName {...props}>				
				<div
					className={this.getClassName('background')}
					style={this.getBgStyle()}
				/>
				{borderStyle &&
					<div
						className={this.getClassName('border')}
						style={borderStyle}
					/>
				}
				<div className={this.getClassName('content')}>
					{children}
				</div>
			</TagName>
		)
	}
}