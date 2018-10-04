import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Checkbox} from '../Checkbox';
import {CheckboxGroupPropTypes} from './proptypes';
import {addStyleProperty, getNumberOrNull} from '../utils';

import '../style.scss';
import './style.scss';

const DEFAULT_CHECK_ALL = 'Check all';

export class CheckboxGroup extends UIEXComponent {
	static propTypes = CheckboxGroupPropTypes;
	static properChildren = 'Checkbox';
	static className = 'checkbox-group';
	static onlyProperChildren = true;
	static isControl = true;
	static displayName = 'CheckboxGroup';

	static flatten(obj) {

	}

	static toArray(obj) {

	}

	static toObject(arr) {

	}

	constructor(props) {
		super(props);
		this.initMaxHeight(props.maxHeight);
		this.itemValues = [];
		this.hasChildGroups = 0;
	}

	addClassNames(add) {
		add('control');
		add('without-border', this.props.noBorder);
		add('with-columns', this.checkboxWidth);
	}

	initMaxHeight(maxHeight) {
		this.contentStyle = addStyleProperty(maxHeight, 'maxHeight');
	}

	componentWillReceiveProps(nextProps) {
		super.componentWillReceiveProps(nextProps);
		const {maxHeight} = nextProps;
		if (maxHeight !== this.props.maxHeight) {
			this.initMaxHeight(maxHeight);
		}
	}

	initRendering() {
		this.checkedCount = 0;
		this.undeterminedCount = 0;
		this.checkedStatuses = {};
	}

	addChildProps(child, props) {
		let {icon, iconType, multiline, onDisabledClick} = this.props;
		const value = this.getValue();
		const {onChange, value: childValue} = child.props;
		const checked = this.getChecked(childValue, value);
		props.icon = icon;
		props.iconType = iconType;
		props.checked = checked;
		if (typeof child.props.multiline != 'boolean') {
			props.multiline = multiline;
		}
		props.width = this.checkboxWidth;
		props.onChange = this.handleChange;
		props.onDisabledClick = onDisabledClick;
		props.name = childValue;
		props.value = this.getChildValue(childValue, value);
		props.onMount = this.handleCheckboxMount;
		props.onUnmount = this.handleCheckboxUnmount;
		props.onUpdateStatus = this.handleCheckboxUpdateStatus;
		this.initCheckStatus(checked, childValue);
	}

	initCheckStatus(checked, name) {
		if (checked) {
			this.checkedCount++;
		} else if (checked === null) {
			this.checkedCount++;
			this.undeterminedCount++;
		}
		this.checkedStatuses[name] = checked;
	}

	renderInternal() {
		this.renderContent();
		const TagName = this.getTagName();
		return (
			<TagName {...this.getProps()}>
				{this.renderTopFunctional()}
				<div className="uiex-checkbox-group-controls uiex-scrollable" style={this.contentStyle}>
					{this.options}
				</div>
			</TagName>
		)
	}

	getCustomProps() {
		return {
			onClick: this.handleClick
		}
	}

 	renderContent() {
 		this.checkboxWidth = undefined;
 		let {columns} = this.props;
 		columns = getNumberOrNull(columns);
 		if (columns > 1) {
 			this.checkboxWidth = Math.floor(100 / columns) + '%';
 		}
 		const children = this.renderChildren();
		this.options = this.renderOptions().concat(children);
	}

	renderTopFunctional() {
		const {checkAll} = this.props;
		if (checkAll) {
			return (
				<div className="uiex-checkbox-group-top">
					{checkAll && this.renderCheckAll()}
				</div>
			)
		}
	}

	renderCheckAll() {
		let {checkAll, icon, iconType} = this.props;
		if (typeof checkAll != 'string') {
			checkAll = DEFAULT_CHECK_ALL;
		}
		return (
			<div className="uiex-checkbox-group-checkall">
				<Checkbox 
					ref="checkAll"
					checked={this.isCheckedAll()}
					icon={icon}
					iconType={iconType}
					onChange={this.handleChangeCheckAll}
				>
					{checkAll}
				</Checkbox>
			</div>
		)
	}

	isCheckedAll() {
		if (this.undeterminedCount > 0) {
			return null;
		}
		if (this.checkedCount >= this.properChildrenCount) {
			return true;
		}
		if (this.checkedCount > 0) {
			return null;
		}
		return false;
	}

	renderOptions() {
		const {options} = this.props;
		if (options instanceof Array && options.length > 0) {
			return options.map(this.renderOption);
		}
		return [];
	}

	getValue() {
		let {value, mapped} = this.props;
		if (typeof value == 'string' || typeof value == 'number') {
			return [value];
		}
		if (value instanceof Object) {
			return value;
		}
		return mapped ? {} : [];
	}

	renderOption = (item) => {
		const {icon, iconType, disabled, onDisabledClick, multiline} = this.props;
		const currentValue = this.getValue();
		let value, title, children, readOnly = false;
		if (typeof item == 'string' || typeof item == 'number') {
			value = item;
			title = item;
		} else if (item instanceof Object) {
			value = item.value;
			title = item.title;
			children = item.children;
			readOnly = item.readOnly;
		}
		const name = value;
		if (this.filterOption(value)) {
			const checked = this.getChecked(value, currentValue);
			this.initCheckStatus(checked, value);
			this.properChildrenCount++;
			return (
				<Checkbox 
					key={value}
					name={name}
					label={title}
					value={this.getChildValue(value, currentValue)}
					checked={checked}
					icon={icon}
					iconType={iconType}
					readOnly={readOnly}
					width={this.checkboxWidth}
					disabled={disabled}
					multiline={multiline}
					onChange={this.handleChange}
					onDisabledClick={onDisabledClick}
					onMount={this.handleCheckboxMount}
					onUnmount={this.handleCheckboxUnmount}
					onUpdateStatus={this.handleCheckboxUpdateStatus}
				>
					{children instanceof Array && 
						<CheckboxGroup options={children}/>
					}
				</Checkbox>
			)
		}
	}

	getChildValue(itemValue, groupValue) {
		if (groupValue instanceof Object && groupValue[itemValue] instanceof Object) {
			return groupValue[itemValue];
		}
		return itemValue;
	}

	getChecked(itemValue, groupValue) {
		let checked = false;
		if (groupValue instanceof Array) {
			checked = itemValue && groupValue.indexOf(itemValue) > -1;
		} else if (groupValue instanceof Object) {
			const value = groupValue[itemValue];
			if (!(value instanceof Object)) {
				checked = !!value;
			}
		}
		return checked;
	}

	handleClick = (e) => {
		e.stopPropagation();
	}

	handleChange = (checked, checkboxName, checkboxValue) => {
		let {name, mapped, radioMode} = this.props;
		if (radioMode && !this.hasChildGroups) {
			return this.fire('change', checkboxValue, name);
		}
		let value = this.getValue();
		if (this.hasChildGroups || (value && !(value instanceof Array))) {
			mapped = true;
		}
		if (mapped && value instanceof Array) {
			let objValue = {};
			for (let i = 0; i < value.length; i++) {
				objValue[value[i]] = true;
			}
			value = objValue;
		}
		let newValue;
		
		if (checked === true || checked === null) {
			if (!value) {
				if (mapped) {
					if (checkboxValue instanceof Object) {
						newValue = {[checkboxName]: checkboxValue};
					} else {
						newValue = {[checkboxValue]: true};
					}
				} else {
					newValue = [checkboxValue];
				}
			} else {
				if (mapped) {
					if (checkboxValue instanceof Object) {
						value[checkboxName] = checkboxValue;
					} else {
						value[checkboxValue] = true;
					}
					newValue = {...value}
				} else {
					value.push(checkboxValue);
					newValue = [...value]
				}
			}
		} else {
			if (mapped) {
				if (checkboxValue instanceof Object) {
					delete value[checkboxName];
				} else {
					delete value[checkboxValue];
				}
				newValue = {...value}
			} else {
				const index = value.indexOf(checkboxValue);
				if (index > -1) {
					value.splice(index, 1);
					newValue = [...value]
				}
			}
		}
		this.fire('change', newValue, name);
	}

	handleChangeCheckAll = (checked) => {
		let {value: currentValue, name, mapped} = this.props;
		if (this.hasChildGroups || currentValue instanceof Object) {
			mapped = true;
		}
		let value;
		if (checked) {				
			if (mapped) {
				value = {};
				this.fillValues(this.itemValues, value);
			} else {
				value = this.itemValues;
			}
		} else {
			value = mapped ? {} : [];
		}
		this.fire('change', value, name, checked);
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

	handleCheckboxMount = (checkbox) => {
		const {itemValues} = checkbox;
		const {name} = checkbox.props;
		if (!itemValues) {
			this.itemValues.push(name);
		} else {
			this.hasChildGroups++;
			this.itemValues.push({value: name, items: itemValues});
		}
	}

	handleCheckboxUnmount = (checkbox) => {
		const {itemValues} = checkbox;
		const {name} = checkbox.props;
		if (itemValues) {
			this.hasChildGroups--;
		}
		const newValues = [];
		for (let item of this.itemValues) {
			if (item instanceof Object) {
				if (item.value == name) {
					continue;	
				}
			} else if (item == name) {
				continue;
			}
			newValues.push(item);
		}
		this.itemValues = newValues;
	}

	handleCheckboxUpdateStatus = (checked, checkbox) => {
		const {name} = checkbox.props;
		this.checkedStatuses[name] = checked;		
		this.checkedCount = 0;
		this.undeterminedCount = 0;
		for (let k in this.checkedStatuses) {
			if (this.checkedStatuses[k] === true) {
				this.checkedCount++;
			} else if (this.checkedStatuses[k] === null) {
				this.undeterminedCount++;
			}
		}
		if (this.refs.checkAll) {
			this.refs.checkAll.setState({checked: this.isCheckedAll()});
		}
		this.fire('update', this);
	}

	filterOption() {
		return true;
	}
}