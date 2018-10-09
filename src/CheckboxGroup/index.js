import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Checkbox} from '../Checkbox';
import {CheckboxGroupPropTypes} from './proptypes';
import {getNumberOrNull, addToArray, removeFromArray} from '../utils';
import {commonGetChecked} from '../Checkbox';

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

	constructor(props) {
		super(props);
		this.checkedValues = [];
		this.allValues = [];
		this.checkedStatus = false;
		this.checkedCount = 0;
		this.uncheckedCount = 0;
		this.undeterminedCount = 0;
		this.statusesMap = new Map();
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
		let {icon, iconType, multiline, onDisabledClick, getChecked} = this.props;
		props.value = this.getChecked(child.props.name);
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
		props.getChecked = getChecked;
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
				<div className={this.getClassName('top')}>
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
			<div className={this.getClassName('checkall')}>
				<Checkbox 
					ref="checkAll"
					checked={true}
					icon={icon}
					iconType={iconType}
					onChange={this.handleChangeCheckAll}
				>
					{checkAll}
				</Checkbox>
			</div>
		)
	}

	renderOptions() {
		const {options} = this.props;
		if (options instanceof Array && options.length > 0) {
			return options.map(this.renderOption);
		}
		return [];
	}

	renderOption = (item) => {
		const {icon, iconType, disabled, onDisabledClick, multiline, value} = this.props;
		let name, title, children, readOnly = false;
		if (typeof item == 'string' || typeof item == 'number') {
			name = item;
			title = item;
		} else if (item instanceof Object) {
			name = item.value;
			title = item.title;
			children = item.children;
			readOnly = item.readOnly;
		}
		if (this.filterOption(name)) {
			this.properChildrenCount++;
			return (
				<Checkbox 
					key={name}
					name={name}
					label={title}
					value={value}
					icon={icon}
					iconType={iconType}
					readOnly={readOnly}
					width={this.checkboxWidth}
					disabled={disabled}
					multiline={multiline}
					onChange={this.handleCheckboxChange}
					onDisabledClick={onDisabledClick}
					onUpdate={this.handleCheckboxUpdate}
					hasParentalGroup
				>
					{children instanceof Array && 
						<CheckboxGroup options={children}/>
					}
				</Checkbox>
			)
		}
	}

	getChecked(name) {
		return commonGetChecked.call(this, name);
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

	// handleChangeCheckAll = (checked) => {
	// 	let {value: currentValue, name, mapped} = this.props;
	// 	if (currentValue instanceof Object) {
	// 		mapped = true;
	// 	}
	// 	let value;
	// 	if (checked) {				
	// 		if (mapped) {
	// 			value = {};
	// 			this.fillValues(this.itemValues, value);
	// 		} else {
	// 			value = this.itemValues;
	// 		}
	// 	} else {
	// 		value = mapped ? {} : [];
	// 	}
	// 	this.fire('change', value, name, checked);
	// }

	handleCheckboxUpdate = (checkbox) => {
		let {checked, props: {name}, hasChildGroup, checkedValues} = checkbox;
		if (hasChildGroup) {
			name = checkedValues;
		}
		if (name != null) {			
			const currentChecked = this.statusesMap.get(checkbox);
			if (currentChecked !== checked) {
				if (currentChecked !== undefined) {
					if (currentChecked) {
						this.checkedCount--;
					} else if (currentChecked === null) {
						this.undeterminedCount--;
					} else {
						this.uncheckedCount--;
					}
				}
				if (checked) {
					this.checkedCount++;
				} else if (checked === null) {
					this.undeterminedCount++;
				} else {
					this.uncheckedCount++;
				}
			}
			this.statusesMap.set(checkbox, checked);

			if (checked) {
				addToArray(this.checkedValues, name);
			} else {
				removeFromArray(this.checkedValues, name);
			}
			if (this.uncheckedCount == 0 && this.undeterminedCount == 0) {
				this.checkedStatus = true;
			} else if (this.undeterminedCount == 0 && this.checkedCount == 0) {
				this.checkedStatus = false;
			} else {
				this.checkedStatus = null;
			}
			addToArray(this.allValues, name);
		}
	}

	filterOption() {
		return true;
	}
}