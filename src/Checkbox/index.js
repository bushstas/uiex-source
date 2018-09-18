import React from 'react';
import {withStateMaster} from '../state-master';
import {UIEXComponent} from '../UIEXComponent';
import {Icon} from '../Icon';
import {CheckboxPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const PROPS_LIST = 'checked';

class CheckboxComponent extends UIEXComponent {
	static propTypes = CheckboxPropTypes;
	static styleNames = ['control', 'marker', 'label'];
	static properChildren = 'CheckboxGroup';
	static properChildrenMaxCount = 1;
	static isControl = true;
	static displayName = 'Checkbox';

	static getDerivedStateFromProps({addIfChanged}) {
		addIfChanged('checked');
	}

	addClassNames(add) {
		let {icon, multiline, readOnly} = this.props;
		const {checked} = this.state;
		add('control');
		add('with-icon', icon);
		add('multilined', multiline);
		add('read-only', readOnly);
		if (checked) {
			add('checked');
		} else if (checked === null) {
			add('undetermined');
		}
		add('with-child-groups', this.properChildrenCount > 0);
	}

	addChildProps(child, props) {
		let {value, icon, iconType, multiline, onDisabledClick} = this.props;
		props.checkAll = false;
		props.maxHeight = null;
		props.icon = icon;
		props.iconType = iconType;
		if (typeof child.props.multiline != 'boolean') {
			props.multiline = multiline;
		}
		props.onChange = this.handleChangeChildGroup;
		props.onDisabledClick = onDisabledClick;
		props.mapped = true;
		props.onMount = this.handleChildGroupMount;
		props.onUnmount = this.handleChildGroupUnmount;
		props.onUpdate = this.handleChildGroupUpdate;
		props.name = value;
		if (value instanceof Object) {
			props.name = this.props.name;
			props.value = value;
		}
	}

	renderInternal() {
		let {children, iconType, label} = this.props;
		let {icon} = this.props;
		if (icon && typeof icon != 'string') {
			icon = 'check';
		}

		const content = this.renderChildren();
		let additionalContent;
		if (!label) {
			label = content;
		} else {
			additionalContent = content;
		}
		const TagName = this.getTagName();
		return (
			<TagName {...this.getProps()}>
				<span 
					className="uiex-checkbox-control"
					onClick={this.handleClick}
					style={this.getStyle('control')}
				>
					<span 
						className="uiex-checkbox-marker"
						style={this.getStyle('marker')}
					>
						{icon &&
							<Icon name={icon} type={iconType}/>
						}
					</span>
				</span>
				{label &&
					<div 
						className="uiex-checkbox-label uiex-checkbox-content"
						style={this.getStyle('label')}
					>
						<span onClick={this.handleClick}>
							{label}
						</span>
					</div>
				}
				{additionalContent && 
					<div className="uiex-checkbox-content">
						{additionalContent}
					</div>
				}
			</TagName>
		)
	}

	handleClick = (e) => {
		e.stopPropagation();
		const {
			value,
			name,
			onChange,
			readOnly
		} = this.props;
		if (readOnly) {
			return;
		}
		const {checked} = this.state;

		if (typeof onChange == 'function') {
			if (this.properChildrenCount > 0) {
				const objectValue = {};
				this.fillValues(this.itemValues, objectValue);
				onChange(!checked, name, objectValue);
			} else {
				onChange(!checked, name, value);
			}
		}
	}

	fillValues(items, value) {
		for (let item of items) {
			if (item instanceof Object) {
				const filledValue = {};
				this.fillValues(item.items, filledValue);
				value[item.value] = filledValue;
			} else {
				value[item] = true;
			}
		}
	}

	handleChangeChildGroup = (groupValue, groupName) => {
		const {
			value,
			name,
			onChange
		} = this.props;
		if (typeof onChange == 'function') {
			let isCheckedAll = false;
			const count = groupValue instanceof Array ? groupValue.length : Object.keys(groupValue).length;
			if (count > 0) {
				isCheckedAll = null;
				if (count == this.itemValues.length) {
					isCheckedAll = true;
				}
			}
			onChange(isCheckedAll, name, groupValue);
		}
	}

	handleChildGroupMount = (checkboxGroup) => {
		const {itemValues} = checkboxGroup;
		this.itemValues = itemValues;
		this.changeCheckedStatus(checkboxGroup.isCheckedAll());
	}

	handleChildGroupUpdate = (checkboxGroup) => {
		this.changeCheckedStatus(checkboxGroup.isCheckedAll());
	}

	handleChildGroupUnmount = () => {
		this.itemValues = [];
		let isCheckedAll = this.state.checked;
		this.changeCheckedStatus(isCheckedAll || isCheckedAll === null);
	}

	changeCheckedStatus(checked) {
		this.setState({checked});
		const {onUpdateStatus} = this.props;
		if (typeof onUpdateStatus == 'function') {
			onUpdateStatus(checked, this);
		}		
	}
}

export const Checkbox = withStateMaster(CheckboxComponent, PROPS_LIST, null, UIEXComponent);