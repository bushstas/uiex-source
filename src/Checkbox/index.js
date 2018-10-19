import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Icon} from '../Icon';
import {addClass, removeClass} from '../utils';
import {CheckboxPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export const commonGetChecked = function(name) {
	const {getChecked, value} = this.props;
	if (typeof getChecked == 'function') {
		return getChecked(name);
	}
	if (value === undefined) {
		return false;
	}
	if (value === null) {
		return null;
	}
	if (value instanceof Array) {
		return value.indexOf(name) > -1;
	}
	if (typeof value == 'boolean') {
		return value;
	}
	return value === name;
};

export const getProperValue = function(valueObj, allValues) {	
	const keys = Object.keys(valueObj);
	const checkedValues = keys.filter(key => valueObj[key] === true);
	if (allValues.length == checkedValues.length) {
		return true;
	}
	if (checkedValues.length > 0) {
		return checkedValues;
	}
	return false;
};

export const setChecked = function(checked, element) {
	removeClass(element, 'uiex-checked');
	removeClass(element, 'uiex-undetermined');
	if (checked === null) {
		addClass(element, 'uiex-undetermined');
	} else if (checked) {
		addClass(element, 'uiex-checked');
	}
	this.checked = checked;
};

export const changeValueChecked = function(checked, value, checkedValues) {
	if (value instanceof Array) {
		for (let v of value) {
			checkedValues[v] = checked;
		}
	} else {
		checkedValues[value] = checked;
	}
}

export class Checkbox extends UIEXComponent {
	static propTypes = CheckboxPropTypes;
	static styleNames = ['control', 'marker', 'label'];
	static properChildren = 'CheckboxGroup';
	static properChildrenMaxCount = 1;
	static isControl = true;
	static displayName = 'Checkbox';

	componentDidMount() {
		this.fireUpdate(true);
	}

	componentDidUpdate() {
		this.fireUpdate();
	}

	componentWillUnmount() {
		if (this.props.hasParentalGroup) {
			this.fire('unmount', this);
		}
		super.componentWillUnmount();
	}

	fireUpdate(isMount = false) {
		if (this.hasChildGroup) {
			setChecked.call(this, this.checkedStatus, this.refs.main);
		}
		if (this.props.hasParentalGroup) {
			this.fire(isMount ? 'mount' : 'update', this);
		}
	}

	initRendering() {
		this.checked = this.getChecked(this.props.name);
	}

	addClassNames(add) {		
		let {icon, multiline, readOnly} = this.props;
		add('control');
		add('with-icon', icon);
		add('multilined', multiline);
		add('read-only', readOnly);		
		if (this.hasChildGroup) {
			add('with-child-group');
			if (this.checkedStatus === null) {
				add('undetermined');
			} else {
				add('checked', this.checkedStatus);
			}
		} else {
			add('checked', this.checked);
			add('undetermined', this.checked === null);
		}
	}

	addChildProps(child, props) {
		let {name, icon, iconType, multiline, onDisabledClick, getChecked, readOnly, disabled} = this.props;
		props.ref = 'group';
		props.name = name;
		props.checkAll = false;
		props.maxHeight = null;
		props.icon = icon;
		props.readOnly = readOnly;
		props.disabled = disabled;
		props.iconType = iconType;
		if (typeof child.props.multiline != 'boolean') {
			props.multiline = multiline;
		}
		props.onChange = this.handleChildGroupChange;
		props.onDisabledClick = onDisabledClick;
		props.onUpdate = this.handleChildGroupUpdate;
		props.onUnmount = this.handleChildGroupUnmount;
		props.hasParentalCheckbox = true;
		if (typeof getChecked != 'function') {
			getChecked = this.getChecked;
		}
		if (!this.props.hasParentalGroup && this.props.value === null) {
			props.getChecked = this.getUnchecked;
		} else {
			props.getChecked = getChecked;
		}
	}

	renderInternal() {
		let {iconType, label} = this.props;
		let {icon} = this.props;
		if (icon && typeof icon != 'string') {
			icon = 'check';
		}
		const content = this.renderChildren();
		this.hasChildGroup = this.properChildrenCount > 0;
		let additionalContent;
		if (!label) {
			label = content;
		} else {
			additionalContent = content;
		}
		const TagName = this.getTagName();
		return (
			<TagName {...this.getProps()}>
				<div className={this.getClassName('main-content')}>
					<div className={this.getClassName('vertical-line')} />
					<div className={this.getClassName('horizontal-line')} />
					<span 
						className={this.getClassName('control')}
						onClick={this.handleClick}
						style={this.getStyle('control')}
					>
						<span 
							className={this.getClassName('marker')}
							style={this.getStyle('marker')}
						>
							{icon &&
								<Icon name={icon} type={iconType}/>
							}
						</span>
					</span>
					{label &&
						<div 
							className={this.getClassName(['label', 'content'])}
							style={this.getStyle('label')}
						>
							<span onClick={this.handleClick}>
								{label}
							</span>
						</div>
					}
				</div>
				<div className="uiex-clear" />
				{additionalContent && 
					<div 
						className={this.getClassName(['content', 'additional-content'])}
						style={this.getStyle('content')}
					>
						{additionalContent}
					</div>
				}
			</TagName>
		)
	}

	handleClick = (e) => {
		e.stopPropagation();
		const {name, readOnly, uncontrolled, disabled} = this.props;
		if (readOnly) {
			return;
		}
		if (disabled) {
			this.fire('disabledClick', name);
		} else {
			const checked = !this.checked;
			if (this.hasChildGroup) {
				this.fire('change', checked, this.allValues);
			} else {
				this.fire('change', checked, name);
			}
		}
	}

	getChecked = (name) => {
		return commonGetChecked.call(this, name);
	}

	getUnchecked = () => {
		return false;
	}

	handleChildGroupChange = (checked, value) => {
		if (this.props.hasParentalGroup) {
			this.fire('change', checked, value);
		} else {
			changeValueChecked(checked, value, this.checkedValues);
			this.fire('change', getProperValue(this.checkedValues, this.allValues), this.props.name);
		}
	}

	handleChildGroupUpdate = (checkboxGroup) => {
		const {checkedStatus, checkedValues, allValues} = checkboxGroup;
		this.checkedStatus = checkedStatus;
		this.checkedValues = checkedValues;
		this.allValues = allValues;
	}

	handleChildGroupUnmount = () => {
		this.checkedStatus = undefined;
		this.checkedValues = null;
		this.allValues = null;
	}
}