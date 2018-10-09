import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Icon} from '../Icon';
import {addClass, removeClass, addToArray, removeFromArray} from '../utils';
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

export class Checkbox extends UIEXComponent {
	static propTypes = CheckboxPropTypes;
	static styleNames = ['control', 'marker', 'label'];
	static properChildren = 'CheckboxGroup';
	static properChildrenMaxCount = 1;
	static isControl = true;
	static displayName = 'Checkbox';

	componentDidMount() {
		this.update();
	}

	componentDidUpdate() {
		this.update();
	}

	update() {
		if (this.hasChildGroup) {
			this.setChecked(this.checkedStatus);
		}
		this.fire('update', this);
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
		let {name, icon, iconType, multiline, onDisabledClick} = this.props;
		props.name = name;
		props.checkAll = false;
		props.maxHeight = null;
		props.icon = icon;
		props.iconType = iconType;
		if (typeof child.props.multiline != 'boolean') {
			props.multiline = multiline;
		}
		props.onChange = this.handleChildGroupChange;
		props.onDisabledClick = onDisabledClick;
		props.onUpdate = this.handleChildGroupUpdate;
		props.hasParentalCheckbox = true;
		props.getChecked = this.getChecked;
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

	handleChildGroupChange = (checked, value) => {
		if (this.props.hasParentalGroup) {
			this.fire('change', checked, value);
		} else {
			if (checked) {
				addToArray(this.checkedValues, value);
			} else {
				removeFromArray(this.checkedValues, value);
			}
			// value = false;
			// const {length} = this.checkedValues;
			// if (this.totalSubChecks == length) {
			// 	value = true;
			// } else if (length > 0) {
			// 	value = [...this.checkedValues];
			// }
			this.fire('change', [...this.checkedValues], this.props.name);
		}
	}

	handleChildGroupUpdate = (checkboxGroup) => {
		const {checkedStatus, checkedValues, allValues} = checkboxGroup;
		this.checkedStatus = checkedStatus;
		this.checkedValues = checkedValues;
		this.allValues = allValues;
	}

	setChecked(checked) {
		const {main} = this.refs;
		removeClass(main, 'uiex-checked');
		removeClass(main, 'uiex-undetermined');
		if (checked === null) {
			addClass(main, 'uiex-undetermined');
		} else if (checked) {
			addClass(main, 'uiex-checked');
		}
		this.checked = checked;
	}
}