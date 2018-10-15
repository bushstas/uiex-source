import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Checkbox} from '../Checkbox';
import {CheckboxGroupPropTypes} from './proptypes';
import {getNumberOrNull, addToArray, removeFromArray, getNumber} from '../utils';
import {commonGetChecked, getProperValue, changeValueChecked} from '../Checkbox';

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
		this.checkedValues = {};
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

	componentWillUnmount() {
		if (this.props.hasParentalCheckbox) {
			this.fire('unmount');
		}
		super.componentWillUnmount();
	}

	update() {		
		if (this.props.hasParentalCheckbox) {
			this.fire('update', this);
		}
	}

	addClassNames(add) {
		const {noBorder, linked, hasParentalCheckbox} = this.props;
		add('control');
		add('without-border', noBorder);
		add('with-columns', this.checkboxWidth);
		add('sublevel-group', hasParentalCheckbox);
		add('linked', linked);
	}

	addChildProps(child, props) {
		let {icon, iconType, multiline, onDisabledClick, getChecked, readOnly, disabled} = this.props;
		props.value = this.getChecked(child.props.name);
		props.icon = icon;
		props.iconType = iconType;
		props.readOnly = readOnly;
		props.disabled = disabled;
		if (typeof child.props.multiline != 'boolean') {
			props.multiline = multiline;
		}
		props.width = this.checkboxWidth;
		props.onChange = this.handleCheckboxChange;
		props.onDisabledClick = onDisabledClick;
		props.onMount = this.handleCheckboxMount;
		props.onUpdate = this.handleCheckboxUpdate;
		props.onUnmount = this.handleCheckboxUnmount;
		props.hasParentalGroup = true;
		props.getChecked = typeof getChecked == 'function' ? getChecked : this.getChecked;
	}

	getInnerStyle() {
		const maxHeight = getNumber(this.props.maxHeight);
		if (this.isCachedPropsChanged('maxHeight')) {
			this.cachedInnerStyle = null;
			if (maxHeight) {
				this.cachedInnerStyle = {maxHeight};
			}
		}
		return this.cachedInnerStyle;		
	}

	renderInternal() {
		this.renderContent();
		const TagName = this.getTagName();
		return (
			<TagName {...this.getProps()}>
				{this.renderTopFunctional()}
				<div 
					className={this.getClassName('controls', 'uiex-scrollable')} 
					style={this.getInnerStyle()}
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
					value={this.getCheckedAllStatus()}
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
					onMount={this.handleCheckboxMount}
					onUpdate={this.handleCheckboxUpdate}
					onUnmount={this.handleCheckboxUnmount}
					hasParentalGroup
				>
					{children instanceof Array && 
						<CheckboxGroup options={children}/>
					}
				</Checkbox>
			)
		}
	}

	getChecked = (name) => {
		if (this.props.value === null) {
			return false;
		}
		return commonGetChecked.call(this, name);
	}

	getCheckedAllStatus() {
		const {value} = this.props;
		if (typeof value == 'boolean') {
			return value;
		}
		if (value == null) {
			return false;
		}
		return null;
	}

	handleClick = (e) => {
		e.stopPropagation();
	}

	handleCheckboxChange = (checked, value) => {
		const {name, radioMode, hasParentalCheckbox} = this.props;
		if (hasParentalCheckbox) {
			this.fire('change', checked, value);
		} else {
			if (radioMode) {
				if (!checked) {
					value = false;	
				}
			} else {
				changeValueChecked(checked, value, this.checkedValues);
				value = getProperValue(this.checkedValues, this.allValues);
			}
			this.fire('change', value, name);
		}
	}

	handleChangeCheckAll = (checked) => {
		this.fire('change', checked, this.props.name);
	}

	handleCheckboxMount = (checkbox) => {
		this.initCheckedStatus(checkbox);
		this.initCheckedValues(checkbox);
		const {props: {name}, allValues} = checkbox;
		addToArray(this.allValues, allValues == null ? name : allValues);	
	}

	handleCheckboxUpdate = (checkbox) => {
		this.initCheckedStatus(checkbox);
		this.initCheckedValues(checkbox);
	}

	initCheckedStatus(checkbox) {
		const {checked} = checkbox;
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
		if (this.uncheckedCount == 0 && this.undeterminedCount == 0) {
			this.checkedStatus = true;
		} else if (this.undeterminedCount == 0 && this.checkedCount == 0) {
			this.checkedStatus = false;
		} else {
			this.checkedStatus = null;
		}
	}

	initCheckedValues(checkbox) {
		const values = this.getCheckboxValues(checkbox);
		const {checked} = checkbox;
		
		if (!(values instanceof Object)) {
			this.checkedValues[values] = checked;
		} else {
			for (let k in values) {
				this.checkedValues[k] = values[k];
			}
		}		
	}

	handleCheckboxUnmount = (checkbox) => {
		const {props: {name}, allValues} = checkbox;
		removeFromArray(this.allValues, allValues == null ? name : allValues);
	}

	getCheckboxValues(checkbox) {
		let {props: {name}, hasChildGroup, checkedValues} = checkbox;
		return hasChildGroup ? checkedValues : name;
	}

	filterOption() {
		return true;
	}
}