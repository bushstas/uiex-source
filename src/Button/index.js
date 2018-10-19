import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Icon} from '../Icon';
import {ButtonPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export class Button extends UIEXComponent {
	static propTypes = ButtonPropTypes;
	static displayName = 'Button';
	
	addClassNames(add) {
		const {iconAtRight, icon, children, gradient, color, onClick} = this.props;		
		add('icon-at-right', iconAtRight && children);
		add('icon-button', icon && typeof icon == 'string' && !children);
		add('with-gradient', gradient);
		if (color) {
			add('colored');
			if (onClick) {
				add('color-hover');
			}
			add('color-' + color);
		}
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
			<TagName {...this.getProps(props)}>
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

	renderInternalChildren() {
		return this.props.children;
	}

	getCustomProps() {
		return {
			onClick: this.handleClick
		}
	}

	handleClick = (e) => {
		e.stopPropagation();
		const {value, disabled, href} = this.props;
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
}