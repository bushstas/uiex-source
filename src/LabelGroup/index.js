import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {LabelGroupPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export class LabelGroup extends UIEXComponent {
	static propTypes = LabelGroupPropTypes;
	static className = 'label-group';
	static properChildren = 'Label';
	static onlyProperChildren = true;
	static displayName = 'LabelGroup';
	
	addChildProps(child, props) {
		const {
			labelColor,
			labelWidth,
			labelHeight,
			labelStyle,			
			gradient,
			removable
		} = this.props;

		if (gradient && typeof child.props.gradient == 'undefined') {
			props.gradient = true;
		}
		if (removable && typeof child.props.removable == 'undefined') {
			props.removable = true;
		}
		if (labelColor && !child.props.color) {
			props.color = labelColor;
		}
		if (labelWidth && !child.props.width) {
			props.width = labelWidth;
		}
		if (labelHeight && !child.props.height) {
			props.height = labelHeight;
		}
		if (labelStyle instanceof Object) {
			if (child.props.style instanceof Object) {
				props.style = {
					...labelStyle,
					...child.props.style
				};
			} else {
				props.style = labelStyle;
			}
		}		
		if (typeof child.props.onClick != 'function') {
			props.onClick = this.props.onClickLabel;
		}
		if (typeof child.props.onDisabledClick != 'function') {
			props.onDisabledClick = this.props.onDisabledClick;
		}
		if (removable || child.props.removable) {
			props.onRemove = this.props.onRemoveLabel;
		}
	}

	renderInternal() {
		const TagName = this.getTagName();
		return (
			<TagName {...this.getProps()}>
				<div className="uiex-label-group-inner">
					{this.renderChildren()}
				</div>
			</TagName>
		)
	}
}