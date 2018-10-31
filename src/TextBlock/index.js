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
	static propsToCheck = ['fontSize', 'lineHeight', 'textColor', 'padding', 'margin', 'border', 'borderRadius', 'boxShadow', 'textShadow'];

	addClassNames(add) {
		const {bold, italic, noselect, justify, nowrap, withEllipsis} = this.props;
		add('bold', bold);
		add('italic', italic);
		add('noselect', noselect);
		add('justify', justify);
		add('nowrap', nowrap);
		add('ellipsis', withEllipsis);
	}

	getCustomStyle() {
		let {
			fontSize,
			lineHeight,
			textColor,
			padding,
			margin,
			border,
			borderRadius,
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
		if (borderRadius != null) {
			style.borderRadius = getNumberInPxOrPercent(borderRadius);
		}
		if (border != null) {
			style.border = border;
		}
		if (boxShadow != null) {
			style.boxShadow = boxShadow;
		}
		if (textShadow != null) {
			style.textShadow = textShadow;
		}
		return style;
	}

	getBgStyle() {
		let {bgColor, borderRadius} = this.props;
		const transparency = this.getTransparency();
		const style = this.cachedStyle || {};
		if (!bgColor || typeof bgColor != 'string') {
			bgColor = style.backgroundColor;
		}
		if (!borderRadius) {
			borderRadius = style.borderRadius;
		}
		if (
			!this.cachedBgStyle ||
			bgColor != this.cachedBgStyle.backgroundColor ||
			transparency != this.cachedBgStyle.opacity ||
			borderRadius != this.cachedBgStyle.borderRadius
		) {
			this.cachedBgStyle = {
				backgroundColor: bgColor,
				opacity: transparency,
				borderRadius
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

	renderInternal() {
		let {children} = this.props;
		const props = this.getProps();
		const TagName = this.getTagName(); 
		return (
			<TagName {...props}>				
				<div 
					className={this.getClassName('background')}
					style={this.getBgStyle()}
				/>
				<div className={this.getClassName('content')}>
					{children}
				</div>
			</TagName>
		)
	}
}