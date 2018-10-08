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
		this.checkedCount = 0;
		this.checkedValues = [];
		this.checkedStatus = false;
	}

	componentDidMount() {
		this.update();
	}

	componentDidUpdate() {
		this.update();
	}

	update() {
		if (this.props.hasParentalCheckbox) {
			this.fire('update', this);
		}
	}

	addClassNames(add) {
		add('control');
		add('without-border', this.props.noBorder);
		add('with-columns', this.checkboxWidth);
	}

	addChildProps(child, props) {
		let {value, icon, iconType, multiline, onDisabledClick} = this.props;
		props.value = value;		
		props.icon = icon;
		props.iconType = iconType;
		if (typeof child.props.multiline != 'boolean') {
			props.multiline = multiline;
		}
		props.width = this.checkboxWidth;
		props.onChange = this.handleCheckboxChange;
		props.onDisabledClick = onDisabledClick;
		props.onUpdate = this.handleCheckboxUpdate;
		props.hasParentalGroup = true;
	}

	renderInternal() {
		this.renderContent();
		const TagName = this.getTagName();
		return (
			<TagName {...this.getProps()}>
				{this.renderTopFunctional()}
				<div 
					className={this.getClassName('controls', 'uiex-scrollable')} 
					style={this.getStyle('content')}
				>
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
					onChange={this.handleCheckboxChange}
					onDisabledClick={onDisabledClick}
					onUpdate={this.handleCheckboxUpdate}
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

	handleCheckboxChange = (checked, value) => {
		if (this.props.hasParentalCheckbox) {
			this.fire('change', checked, value);
		} else {
			if (checked) {
				this.checkedValues.push(value);	
			} else {
				const index = this.checkedValues.indexOf(value);
				if (index > -1) {
					this.checkedValues.splice(index, 1);
				}
			}			
			this.fire('change', this.checkedValues, this.props.name);
		}
	}

	handleChangeCheckAll = (checked) => {
		let {value: currentValue, name, mapped} = this.props;
		if (currentValue instanceof Object) {
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

	handleCheckboxUpdate = (checkbox) => {
		const {checked, props: {name}} = checkbox;
		if (name) {
			const index = this.checkedValues.indexOf(name);
			if (checked) {
				if (index == -1) {
					this.checkedValues.push(name);
				}
			} else {
				if (index > -1) {
					this.checkedValues.splice(index, 1);
				}
			}
			this.checkedCount = this.checkedValues.length;
			if (this.checkedCount == this.properChildrenCount) {
				this.checkedStatus = true;	
			} else {
				this.checkedStatus = this.checkedCount > 0 ? null : false;
			}
		}
	}

	filterOption() {
		return true;
	}
}