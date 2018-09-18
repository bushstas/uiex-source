import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Radio} from '../Radio';
import {RadioGroupPropTypes} from './proptypes';
import {addStyleProperty, getNumberOrNull} from '../utils';

import '../style.scss';
import './style.scss';

export class RadioGroup extends UIEXComponent {
	static propTypes = RadioGroupPropTypes;
	static className = 'radio-group';
	static properChildren = 'Radio';
	static onlyProperChildren = true;
	static isControl = true;
	static displayName = 'RadioGroup';

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

	componentDidMount() {
		const {value, firstChecked, onChange, name} = this.props;
		if (firstChecked && this.firstValue != null && value == null && typeof onChange == 'function') {
			onChange(this.firstValue, name);
		}
	}

	initRendering() {
		this.firstValue = null;
	}

	addChildProps(child, props, idx) {
		let {value, multiline, onDisabledClick} = this.props;
		const {value: childValue} = child.props;
		if (!this.firstValue) {
			this.firstValue = childValue;
		}
		props.checked = value == childValue;
		if (typeof child.props.multiline != 'boolean') {
			props.multiline = multiline;
		}
		props.width = this.checkboxWidth;
		props.onChange = this.handleChange;
		props.onDisabledClick = onDisabledClick;
	}

	renderInternal() {
		this.renderContent();
		const TagName = this.getTagName();
		return (
			<TagName {...this.getProps()}>
				<div className="uiex-radio-group-controls uiex-scrollable" style={this.contentStyle}>
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

	renderOptions() {
		const {options} = this.props;
		if (options instanceof Array && options.length > 0) {
			return options.map(this.renderOption);
		}
		return [];
	}

	renderOption = (item, idx) => {
		const {value: currentValue, disabled, onDisabledClick, multiline} = this.props;
		let value, title;
		if (typeof item == 'string' || typeof item == 'number') {
			value = item;
			title = item;
		} else if (item instanceof Object) {
			value = item.value;
			title = item.title;
		}
		if (!this.firstValue) {
			this.firstValue = value;
		}
		const checked = currentValue == value;
		this.properChildrenCount++;
		return (
			<Radio 
				key={value}
				label={title}
				value={value}
				checked={checked}
				width={this.checkboxWidth}
				disabled={disabled}
				multiline={multiline}
				onChange={this.handleChange}
				onDisabledClick={onDisabledClick}
			/>
		)

	}

	handleClick = (e) => {
		e.stopPropagation();
	}

	handleChange = (radioName, radioValue) => {
		const {name, onChange, value} = this.props;
		if (value !== radioValue && typeof onChange == 'function') {
			onChange(radioValue, name);
		}
	}
}