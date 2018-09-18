import React from 'react';
import {UIEXButtons} from '../UIEXComponent';
import {ButtonGroupPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export class ButtonGroup extends UIEXButtons {
	static propTypes = ButtonGroupPropTypes;
	static className = 'button-group';
	static properChildren = 'Button';
	static displayName = 'ButtonGroup';
	
	addChildProps(child, props) {
		this.addCommonButtonsProps(child, props);
		if (typeof child.props.onClick != 'function') {
			props.onClick = this.props.onClick;
		}
		if (typeof child.props.onDisabledClick != 'function') {
			props.onDisabledClick = this.props.onDisabledClick;
		}
	}

	renderInternal() {
		const TagName = this.getTagName();
		return (
			<TagName {...this.getProps()}>
				<div className="uiex-button-group-inner">
					{this.renderChildren()}
				</div>
			</TagName>
		)
	}
}