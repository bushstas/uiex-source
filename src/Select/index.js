import React from 'react';
import {withStateMaster} from '../state-master';
import {UIEXBoxContainer, UIEXComponent} from '../UIEXComponent';
import {Input} from '../Input';
import {Icon} from '../Icon';
import {PopupMenu, PopupMenuItem} from '../PopupMenu';
import {SelectPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const PENDING_ERROR = [{title: 'Pending error', value: null}];
const PENDING_PLACEHOLDER = 'Pending...';
const INITIAL_STATE = {
	focused: false,
	placeholder: null
};

const PROPS_LIST = 'options';

class SelectComponent extends UIEXBoxContainer {
	static propTypes = SelectPropTypes;
	static className = 'select';
	static properChildren = 'SelectOption';
	static onlyProperChildren = true;
	static isControl = true;
	static displayName = 'Select';

	static getDerivedStateFromProps({add, changed, nextProps}) {
		if (changed) {
			let {options} = nextProps;
			if (typeof options == 'function') {
				options = options();
			} else if (options instanceof Promise) {
				add('placeholder', this.getPendingPlaceholder());
			}
			add('options', options);
		}
	}

	constructor(props) {
		super(props);
		this.selectHandler = this.handleSelect.bind(this);
		this.selectByArrowHandler = this.handleSelectByArrow.bind(this);
		this.enterHandler = this.handleEnter.bind(this);
		this.clickHandler = this.handleClick.bind(this);
	}

	componentWillUnmount() {
		this.pendingPromise = null;
		super.componentWillUnmount();
	}

	getTitle() {
		let {value} = this.props;
		if (value != null && value !== '') {
			if (value instanceof Array) {
				value = value[0];
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
		add('multi-valued', this.isMultiple() && value instanceof Array && value.length > 1);
	}

	getCustomProps() {
		return {
			onClick: this.clickHandler
		}
	}

	initRendering() {
		this.values = {};
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
		if (this.isMultiple() && this.props.value instanceof Array && this.props.value.length > 1) {
			const selectedCount = this.getSelectedCount();
			if (selectedCount) {
				const all = selectedCount === this.optionsTotalCount;
				return (
					<span className="uiex-quantity-label">
						{all ? 'all' : '+' + selectedCount}
					</span>
				)
			}
		}
	}

	getSelectedCount() {
		const {value} = this.props;
		let count = 0;
		for (let i = 0; i < value.length; i++) {
			if (this.values[value[i]] !== undefined) {
				count++;
			}
		}
		return count;
	}

	renderOptions() {
		const {focused, options} = this.state;
		const OptionComponent = this.getOptionComponent();
		const {value, name, empty, iconType, optionsShown, disabled, menuStyle, optionStyle} = this.props;
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
			} else if (options instanceof Array) {
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
		const reactChildren = this.renderChildren();
		if (reactChildren) {
			if (reactChildren instanceof Array) {
				items = items.concat(reactChildren);
			} else {
				items.push(reactChildren);
			}
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
				value={value}
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

	renderOption = (item) => {
		const OptionComponent = this.getOptionComponent();
		let value, title, icon, iconType, withTopDelimiter, withBottomDelimiter, single;
		if (typeof item == 'string' || typeof item == 'number') {
			value = item;
			title = item;
		} else if (item instanceof Object) {
			value = item.value;
			title = item.title;
			icon = item.icon;
			iconType = item.iconType;
			withTopDelimiter = item.withTopDelimiter;
			withBottomDelimiter = item.withBottomDelimiter;
			single = item.single;
		}
		this.values[value] = title;
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

	handlePromiseResolve = (options) => {
		if (!this.isUnmounted && this.pendingPromise == this.props.options) {
			this.setState({options, placeholder: null});
			this.fire('promiseResolve', options);
		}
	}

	handlePromiseReject = (error) => {
		if (!this.isUnmounted && this.pendingPromise == this.props.options) {
			this.setState({options: PENDING_ERROR, placeholder: null});
			this.fire('promiseReject', error);
		}
	}

	handleClick(e) {
		e.stopPropagation();
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
		this.fireChange(value);
	}

	handleSelectByArrow(value) {
		const {disabled, readOnly, name} = this.props;
		if (disabled || readOnly) {
			return;
		}
		this.fireChange(value);
		this.fire('select', value, name);
	}

	handleSelectOption = (index, option) => {
		const {name, disabled, readOnly} = this.props;
		if (disabled || readOnly) {
			return;
		}
		this.fire('selectOption', index, option, name);
	}

	fireChange(value) {
		if (value instanceof Array && this.isMultiple()) {
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

export const Select = withStateMaster(SelectComponent, PROPS_LIST, INITIAL_STATE, UIEXComponent);


export class SelectOption extends PopupMenuItem {
	static propTypes = PopupMenuItem.propTypes;
	static className = PopupMenuItem.className;
	static displayName = 'SelectOption';
}