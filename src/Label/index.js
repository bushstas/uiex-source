import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Icon} from '../Icon';
import {LabelPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export class Label extends UIEXComponent {
	static propTypes = LabelPropTypes;
	static displayName = 'Label';

	addClassNames(add) {
		add('removable', this.props.removable);
		add('with-gradient', this.props.gradient);
	}

	getCustomProps() {
		return {
			onClick: this.handleClick
		}
	}

	renderInternal() {
		let {children, removable} = this.props;
		const TagName = this.getTagName(); 
		return (
			<TagName {...this.getProps()}>				
				<span className="uiex-label-content">
					{children} 
					{removable &&
						<span className="uiex-label-close" onClick={this.handleRemove}>
							<Icon name="clear" fontSize="14"/>
						</span>
					}
				</span>				
			</TagName>
		)
	}

	handleClick = (e) => {
		const {onClick, value, disabled, onDisabledClick} = this.props;
		if (!disabled && typeof onClick == 'function') {
			e.stopPropagation();
			onClick(value);
		} else if (disabled && typeof onDisabledClick == 'function') {
			e.stopPropagation();
			onDisabledClick(value);
		}
	}

	handleRemove = (e) => {
		e.stopPropagation();
		const {onRemove, value, disabled} = this.props;
		if (!disabled && typeof onRemove == 'function') {
			onRemove(value);
		}
	}
}