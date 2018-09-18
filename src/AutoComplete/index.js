import React from 'react';
import {withStateMaster} from '../state-master';
import {Select} from '../Select';
import {Input} from '../Input';
import {Icon} from '../Icon';
import {regexEscape} from '../utils';
import {PopupMenuItem} from '../PopupMenu';
import {AutoCompletePropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const PROPS_LIST = ['value', 'focused'];

class AutoCompleteComponent extends Select {
	static propTypes = AutoCompletePropTypes;
	static className = 'auto-complete';
	static properChildren = 'AutoCompleteOption';
	static onlyProperChildren = true;
	static isControl = true;
	static displayName = 'AutoComplete';

	static getDerivedStateFromProps({add, isChanged, nextProps, isInitial, call}) {
		if (!isInitial && isChanged('focused') && !nextProps.disabled) {
			call(() => {
				if (nextProps.focused) {
					this.focus();
				} else {
					this.blur();
				}
			});
			add('focused');
		}
		if (isChanged('value')) {
			if (nextProps.value !== this.selectedValue) {
				this.selectedValue = null;
				this.inputedValue = nextProps.value;
			}
			if (!nextProps.dynamic && nextProps.passive) {
				if (!nextProps.value) {
					add('focused', false);
				} else if (this.optionsTotalCount > 0) {
					add('focused', true);
				}
			}
		}
	}

	componentDidMount() {
		if (this.props.focused) {
			this.focus();
			this.setState({focused: true});
		}
	}

	addClassNames(add) {
		super.addClassNames(add);
		add('select');
		add('without-icon', this.props.withoutIcon);
	}

	renderInput() {
		const {value, placeholder, disabled, readOnly} = this.props;
		const {placeholder: statePlaceholder} = this.state
		return (
			<Input 
				ref="input"
				value={value}
				placeholder={statePlaceholder || placeholder}
				disabled={disabled}
				readOnly={readOnly}
				onChange={this.handleInputValueChange}
				onFocus={this.handleFocus}
				onBlur={this.handleBlur}
				onEnter={this.handleInputEnter}
			/>
		)
	}

	renderArrowIcon() {
		const {withoutIcon} = this.props
		if (!withoutIcon) {
			return (
				<div className="uiex-select-arrow-icon">
					<Icon 
						name="more_vert"
						disabled={this.props.disabled || !this.hasOptions}
						onClick={this.handleIconClick}
					/>
				</div>
			)
		}
	}

	handleClick(e) {
		e.stopPropagation();
		const {name, disabled, onDisabledClick} = this.props;
		if (disabled && typeof onDisabledClick == 'function') {
			onDisabledClick(name);
		}
	}

	handleFocus = (value, name) => {
		const {onFocus} = this.props;		
		this.valueBeforeFocus = value;		
		if (!this.isPassive()) {
			this.setState({focused: true});
		}
		if (typeof onFocus == 'function') {
			onFocus(value, name);
		}
	}

	handleBlur = () => {
		const {value, name, onBlur} = this.props;		
		if (typeof onBlur == 'function') {
			onBlur(value, name);
		}
	}

	handleInputValueChange = (value) => {
		this.selectedValue = null;
		const {name, onChange, onInput} = this.props;
		if (typeof onChange == 'function') {
			onChange(value, name);
		}
		if (typeof onInput == 'function') {
			onInput(value, name);
		}
	}

	handleSelect(value) {
		const {disabled, readOnly} = this.props;
		if (disabled || readOnly) {
			return;
		}
		this.selectedValue = value;
		this.inputedValue = '';
		super.handleSelect(value);
		const {onPick} = this.props;
		if (typeof onPick == 'function') {
			onPick(value, this.props.name);
		}
	}

	handleEnter() {
		this.inputedValue = '';
		super.handleEnter();
	}

	handleSelectByArrow(value) {
		this.selectedValue = value;
		super.handleSelectByArrow(value);
		this.fireSelect(value);
	}

	fireSelect(value) {
		const {name, onSelect} = this.props;
		if (typeof onSelect == 'function') {
			onSelect(value, name);
		}
	}

	handleIconClick = (e) => {
		if (!this.props.readOnly) {
			e.stopPropagation();
			this.setState({focused: !this.state.focused});
			this.focus();
		}
	}

	handleInputEnter = (value, name) => {
		const {onEnter} = this.props;
		if (typeof onEnter == 'function') {
			onEnter(value, name);
		}
	}

	hidePopup = () => {
		this.setState({focused: false});
	}

	filterChild(child) {
		return this.filterOption(child.props.value);
	}

	filterOption = (optionValue) => {
		if (this.props.dynamic) {
			return true;
		}
		if (typeof optionValue != 'string') {
			optionValue = String(optionValue);
		}
		if (!this.inputedValue) {
			return true;
		}
		const regexp = new RegExp('^' + regexEscape(this.inputedValue), 'i');
		return regexp.test(optionValue);
	}

	getOptionComponent() {
		return AutoCompleteOption;
	}

	hasEmptyOption() {
		return false;
	}

	isFocused() {
		return true;
	}

	isMultiple() {
		return false;
	}

	getBoxProps() {
		return {
			animation: null
		}
	}

	isPassive() {
		return !this.props.dynamic && this.props.passive;
	}

	focus() {
		this.refs.input.focus();
	}

	blur() {
		this.refs.input.blur();
	}

	checkValueChange() {}
}

export const AutoComplete = withStateMaster(AutoCompleteComponent, PROPS_LIST, null, Select);

export class AutoCompleteOption extends PopupMenuItem {
	static propTypes = PopupMenuItem.propTypes;
	static className = PopupMenuItem.className;
	static displayName = 'AutoCompleteOption';
}