import React from 'react';
import {UIEXBoxContainer} from '../UIEXComponent';
import {Input} from '../Input';
import {Icon} from '../Icon';
import {PopupMenu, PopupMenuItem} from '../PopupMenu';
import {isFunction, isNumber, isObject, isString, isArray} from '../utils';
import {clone} from '../_utils/clone';
import {SelectPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const PENDING_ERROR = [{title: 'Pending error', value: null}];
const PENDING_PLACEHOLDER = 'Pending...';

export class Select extends UIEXBoxContainer {
	static propTypes = SelectPropTypes;
	static className = 'select';
	static properChildren = 'SelectOption';
	static onlyProperChildren = true;
	static isControl = true;
	static displayName = 'Select';

	constructor(props) {
		super(props);
		this.selectHandler = this.handleSelect.bind(this);
		this.selectByArrowHandler = this.handleSelectByArrow.bind(this);
		this.enterHandler = this.handleEnter.bind(this);
		this.clickHandler = this.handleClick.bind(this);
		let {options} = props;
		if (isFunction(options)) {
			options = options();
		}
		this.state.options = options;
		if (options instanceof Promise) {
			this.state.placeholder = this.getPendingPlaceholder();
		}
		this.cached = {};
	}

	componentDidUpdate(prevProps) {
		let {options} = this.props;
		if (prevProps.options != options) {
			if (isFunction(options)) {
				options = options();
			}
			const newState = {options};
			if (options instanceof Promise) {
				newState.placeholder = this.getPendingPlaceholder();
			}
			this.setState(newState);
		}
	}

	componentWillUnmount() {
		this.pendingPromise = null;
		super.componentWillUnmount();
	}

	getCachedOption(option) {
		const {value} = option;
		if (isString(value) || isNumber(value)) {
			if (this.cached[value] === undefined) {
				delete option.single;
				delete option.icon;
				delete option.iconType;
				delete option.withTopDelimiter;
				delete option.withBottomDelimiter;
				if (!option.title && option.children) {
					option.title = option.children;
				}
				delete option.children;
				this.cached[value] = option;
			}
			return this.cached[value];
		}
		return option;
	}

	getTitle() {
		let {value} = this.props;
		if (value != null && value !== '') {
			if (isArray(value)) {
				value = value[0];
			}
			if (isObject(value)) {
				value = value.value;
			}
			if (this.values) {
				return this.values[value] || '';
			}
		}
		return '';
	}

	addClassNames(add) {
		const {focused} = this.state;
		const {value, disabled} = this.props;
		add('control');
		add('select-focused', focused && !disabled);
		add('without-options', !this.hasOptions);
		add('multi-valued', this.isMultiple() && isArray(value) && value.length > 1);
	}

	getCustomProps() {
		return {
			onClick: this.clickHandler
		}
	}

	initRendering() {
		this.values = {};
		this.options = [];
	}

	renderInternal() {
		const options = this.renderOptions();
		const TagName = this.getTagName();
		return (
			<TagName {...this.getProps()}>
				{this.renderInput()}
				{options}
				{this.renderArrowIcon()}
				{this.renderQuantityLabel()}
			</TagName>
		)
	}

	renderInput() {
		const {placeholder, disabled} = this.props;
		const {placeholder: statePlaceholder} = this.state
		return (
			<Input 
				value={this.getTitle()}
				placeholder={statePlaceholder || placeholder}
				disabled={disabled}
				onEnter={this.handleEnterInput}
				readOnly
			/>
		)
	}

	renderArrowIcon() {
		return (
			<div className="uiex-select-arrow-icon">
				<Icon 
					name="arrow_drop_down"
					disabled={this.props.disabled || !this.hasOptions}
				/>
			</div>
		)	
	}

	renderQuantityLabel() {
		if (this.isMultiple() && isArray(this.props.value) && this.props.value.length > 1) {
			const selectedCount = this.getSelectedCount();
			if (isNumber(selectedCount) && selectedCount - 1 > 0) {
				const all = selectedCount === this.optionsTotalCount;
				return (
					<span className="uiex-quantity-label">
						{all ? 'all' : '+' + (selectedCount - 1)}
					</span>
				)
			}
		}
	}

	getSelectedCount() {
		const {value} = this.props;
		let count = 0;
		for (let i = 0; i < value.length; i++) {
			let item = value[i];
			if (isObject(item) && item.value) {
				item = item.value;
			}
			if (this.values[item] !== undefined) {
				count++;
			}
		}
		return count;
	}

	renderOption = (item) => {
		const OptionComponent = this.getOptionComponent();
		let value, title, icon, iconType, withTopDelimiter, withBottomDelimiter, single;
		if (typeof item == 'string' || typeof item == 'number' || typeof item == 'boolean') {
			value = item;
			title = item.toString();
		} else if (item instanceof Object) {
			value = item.value;
			title = item.title || item.children;
			icon = item.icon;
			iconType = item.iconType;
			withTopDelimiter = item.withTopDelimiter;
			withBottomDelimiter = item.withBottomDelimiter;
			single = item.single;
		}
		if (isObject(value) && value.value) {
			if (!title) {
				title = value.title;
			}
			this.values[value.value] = title;
		} else {
			this.values[value] = title;
		}
		this.options.push(item);
		if (this.filterOption(value)) {
			return (
				<OptionComponent 
					key={value}
					className="uiex-select-option"
					value={value} 
					icon={icon}
					iconType={iconType}
					withTopDelimiter={withTopDelimiter}
					withBottomDelimiter={withBottomDelimiter}
					single={single}
				>
					{title}
				</OptionComponent>
			)
		}
	}

	renderChildOption = (child) => {
		return this.renderOption(child.props);
	}

	renderOptions() {
		const {focused, options} = this.state;
		const OptionComponent = this.getOptionComponent();
		const {
			value,
			name,
			empty,
			iconType,
			optionsShown,
			disabled,
			menuStyle,
			optionStyle,
			children
		} = this.props;
		let pending = false;
		let items = [];
		if (options && options instanceof Object) {
			if (options instanceof Promise) {
				this.pendingPromise = options;
				options.then(
					this.handlePromiseResolve,
					this.handlePromiseReject
				);
				const pendingPlaceholder = this.getPendingPlaceholder();
				const opt = this.renderOption({title: pendingPlaceholder, value: null});
				items.push(opt);
				pending = true;
			} else if (isArray(options)) {
				for (let i = 0; i < options.length; i++) {
					const opt = this.renderOption(options[i]);
					if (opt) {
						items.push(opt);
					}
				}
			} else {
				for (let k in options) {
					const opt = this.renderOption({value: k, title: options[k]});
					if (opt) {
						items.push(opt);
					}
				}
			}
		}

		if (isArray(children)) {
			items = items.concat(children.map(this.renderChildOption));
		} else if (children) {
			items.push(this.renderChildOption(children));
		}

		this.optionsTotalCount = items.length;
		this.hasOptions = this.optionsTotalCount > 0;
		if (!pending && this.hasEmptyOption()) {
			items.unshift(
				<OptionComponent 
					key=""
					className="uiex-empty-option"
					value={null}
				>
					{empty === true ? '.....' : empty}
				</OptionComponent>
			);
		}
		return (
			<PopupMenu 
				ref="popupMenu"
				name={name}
				style={menuStyle}
				optionStyle={optionStyle}
				iconType={iconType}
				multiple={this.isMultiple()}
				value={isObject(value) ? value.value : value}
				isOpen={optionsShown || focused}
				isInnerChild
				disabled={disabled}
				onSelect={this.selectHandler}
				onSelectOption={this.handleSelectOption}
				onSelectByArrow={this.selectByArrowHandler}
				onEnter={this.enterHandler}
				onEscape={this.handleEscape}
				onCollapse={this.handlePopupCollapse}
				{...this.getBoxProps()}
			>
				{items}
			</PopupMenu>
		)
	}

	getOptionComponent() {
		return SelectOption;
	}

	getPendingPlaceholder() {
		const {pendingPlaceholder} = this.props;
		if (pendingPlaceholder && typeof pendingPlaceholder == 'string') {
			return pendingPlaceholder;
		}
		return PENDING_PLACEHOLDER;
	}

	handlePromiseResolve = (options) => {
		if (!this.isUnmounted && this.pendingPromise == this.props.options) {
			this.setState({options, placeholder: null});
			this.fire('promiseResolve', options);
		}
	}

	handleEnterInput = () => {
		this.handleClick();
	}

	handlePromiseReject = (error) => {
		if (!this.isUnmounted && this.pendingPromise == this.props.options) {
			this.setState({options: PENDING_ERROR, placeholder: null});
			this.fire('promiseReject', error);
		}
	}

	handleClick(e) {
		if (e) e.stopPropagation();
		const {value, name, disabled, readOnly} = this.props;
		if (readOnly) {
			return;
		}
		const focused = this.isFocused();
		this.valueBeforeFocus = value;
		if (!disabled) {
			this.setState({focused});
			if (focused) {				
				this.fire('focus', value, name);
			} else {
				this.fire('blur', value, name);
			}
		} else {
			this.fire('disabledClick', name);
		}
	}

	handlePopupCollapse = () => {
		this.hidePopup();
	}

	handleEnter() {
		this.hidePopup();
	}

	handleEscape = () => {
		this.hidePopup();
		this.fireChange(this.valueBeforeFocus);
	}

	handleSelect(value) {
		const {disabled, readOnly} = this.props;
		if (disabled || readOnly) {
			return;
		}
		if (!this.isMultiple()) {
			this.hidePopup();
		}
		this.handleChange(value);
	}

	handleSelectByArrow(value) {
		const {disabled, readOnly, name} = this.props;
		if (disabled || readOnly) {
			return;
		}
		this.handleChange(value);
		this.fire('select', value, name);
	}

	handleChange = (value) => {
		const {optionAsValue} = this.props;
		if (!isObject(value) && optionAsValue) {
			if (!isObject(this.options[this.index])) {
				const option = this.getCachedOption({
					value,
					title: this.values[value]
				});
				return this.fireChange(option);
			}
			const optionValue = this.getCachedOption(clone(this.options[this.index]));
			return this.fireChange(optionValue);
		}
		this.fireChange(value);
	}

	handleSelectOption = (index, option) => {
		this.index = index;
		const {name, disabled, readOnly} = this.props;
		if (disabled || readOnly) {
			return;
		}
		this.fire('selectOption', option, index, name);
	}

	fireChange(value) {
		if (isArray(value) && this.isMultiple()) {
			const values = [];
			for (let i = 0; i < value.length; i++) {
				if (this.values[value[i]] !== undefined) {
					values.push(value[i]);
				}
			}
			value = values;
		}		
		this.fire('change', value, this.props.name);
	}

	hidePopup = () => {
		this.setState({focused: false});
		const {value, name} = this.props;
		this.fire('blur', value, name);
	}

	hasEmptyOption() {
		return this.props.empty;
	}

	isFocused() {
		return !this.state.focused;
	}

	isMultiple() {
		return this.props.multiple;
	}

	filterOption = () => {
		return true;
	}

	isPassive() {
		return false;
	}
}

export class SelectOption extends PopupMenuItem {
	static propTypes = PopupMenuItem.propTypes;
	static className = PopupMenuItem.className;
	static displayName = 'SelectOption';
}