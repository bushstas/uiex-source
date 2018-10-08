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

	handleClick = () => {
		const {value, disabled} = this.props;
		if (!disabled) {
			this.fire('click', value);
		} else {
			this.fire('disabledClick', value);
		}
	}

	handleRemove = (e) => {
		e.stopPropagation();
		const {value, disabled} = this.props;
		if (!disabled) {
			this.fire('remove', value);
		}
	}
}