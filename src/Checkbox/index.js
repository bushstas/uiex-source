import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Icon} from '../Icon';
import {CheckboxPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export class Checkbox extends UIEXComponent {
	static propTypes = CheckboxPropTypes;
	static styleNames = ['control', 'marker', 'label'];
	static properChildren = 'CheckboxGroup';
	static properChildrenMaxCount = 1;
	static isControl = true;
	static displayName = 'Checkbox';

	constructor(props) {
		super(props);
		this.state = {
			checked: props.checked
		};
	}

	componentDidUpdate(prevProps) {
		const {uncontrolled, checked} = this.props;
		if (!uncontrolled && prevProps.checked !== checked) {
			this.setState({checked});
		}
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
		//props.maxHeight = null;
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
		let {iconType, label} = this.props;
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
		const {value, name, readOnly, uncontrolled, disabled} = this.props;		
		if (readOnly) {
			return;
		}
		const checked = !this.state.checked;
		let changedValue = value;
		if (this.properChildrenCount > 0) {
			const objectValue = {};
			this.fillValues(this.itemValues, objectValue);
			changedValue = objectValue;
		}
		if (disabled) {
			return this.fire('disabledClick', checked, name, changedValue);
		}
		if (uncontrolled) {
			this.setState({checked});
		}
		this.fire('change', checked, name, changedValue);
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
		const {name} = this.props;
		let isCheckedAll = false;
		const count = groupValue instanceof Array ? groupValue.length : Object.keys(groupValue).length;
		if (count > 0) {
			isCheckedAll = null;
			if (count == this.itemValues.length) {
				isCheckedAll = true;
			}
		}
		this.fire('change', isCheckedAll, name, groupValue);
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
		this.fire('updateStatus', checked, this);
	}
}