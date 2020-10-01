import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Icon} from '../Icon';
import {isFunction, isString} from '../utils';
import {getProperColor, isColorDark, modifyColor} from '../_utils/color';
import {ButtonPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export class Button extends UIEXComponent {
	static propTypes = ButtonPropTypes;
	static displayName = 'Button';
	static propsToCheck = ['color', 'gradient'];
	
	addClassNames(add) {
		const {
			iconAtRight,
			icon,
			children,
			gradient,
			colorPreset,
			onClick,
			color,
			disabled
		} = this.props;		
		add('icon-at-right', iconAtRight && children);
		add('icon-button', icon && typeof icon == 'string' && !children);

		this.properColor = getProperColor(color);

		if (!this.properColor) {
			add('with-gradient', gradient);
			if (colorPreset) {
				add('colored');
				if (onClick && !disabled) {
					add('color-hover');
				}
				add('color-' + colorPreset);
			}
		} else {
			const isDark = isColorDark(this.properColor, 160);
			add('dark', isDark);
		}
	}

	getCustomStyle() {
		const {gradient} = this.props;
		const {properColor} = this;
		if (properColor) {
			const borderColor = modifyColor(properColor, -60);
			const gradientColor = gradient ? modifyColor(properColor, -30) : null;
			const style = {
				backgroundColor: properColor,
				border: `1px solid ${borderColor}`
			};
			if (gradient) {
				style.backgroundImage = `linear-gradient(${properColor}, ${gradientColor})`;
				style.borderBottomColor = modifyColor(properColor, -80);
			}
			return style;
		}
		return undefined;
	}

	getCustomProps() {
		return {
			onClick: this.handleClick
		}
	}

	handleClick = (e) => {
		const {value, disabled, href, onClick} = this.props;
		if (isFunction(onClick)) {
			e.stopPropagation();
		}
		if (!disabled) {
			this.fire('click', value);
		} else {
			this.fire('disabledClick', value);
			if (typeof href == 'string') {
				e.preventDefault();
				return false;
			}
		}
	}

	renderInternalChildren() {
		return this.props.children;
	}

	renderInternal() {
		const {
			href,
			target,
			icon,
			iconAtRight,
			iconSize,
			iconType
		} = this.props;

		const TagName = typeof href == 'string' ? 'a' : this.getTagName();
		const props = typeof href == 'string' ? {href, target} : null;		

		return (
			<TagName tabIndex="0" {...this.getProps(props)}>
				{icon && !iconAtRight &&
					<Icon name={icon} fontSize={iconSize} type={iconType}/>
				}
				<div className="uiex-button-content">
					{this.renderInternalChildren()}
				</div>
				{icon && iconAtRight &&
					<Icon name={icon} fontSize={iconSize} type={iconType}/>
				}
			</TagName>
		)		
	}
}