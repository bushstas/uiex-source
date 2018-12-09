import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Icon} from '../Icon';
import {getNumber, regexEscape, isString, isNumber, isFunction, isArray, isBoolean, propsChanged} from '../utils';
import {InputPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const PROPS_LIST = ['validating', 'value', 'required', 'minLength', 'uncontrolled'];

export class Input extends UIEXComponent {
	static propTypes = InputPropTypes;
	static isControl = true;
	static displayName = 'Input';

	constructor(props) {
		super(props);
		this.handleKeyUp = this.keyUpHandler.bind(this);
		this.handleFocus = this.focusHandler.bind(this);
		this.handleBlur = this.blurHandler.bind(this);
		this.handleClick = this.clickHandler.bind(this);
		this.handleChange = this.inputHandler.bind(this);
	}

	componentDidMount() {
		const {initialValue} = this.props;
		if (initialValue) {
			const value = this.parseInitialValue(initialValue);
			if (value) {
				return this.fireChange(value);
			}
		}
		this.checkValidity();
	}

	componentDidUpdate(prevProps) {
		const value = this.getProp('value');
		if (value && isArray(this.propsList) && propsChanged(prevProps, this.props, this.propsList)) {
			return this.fireChange(value);
		}
		if (propsChanged(prevProps, this.props, PROPS_LIST)) {
			this.checkValidity();
		}
	}

	addClassNames(add) {
		const {textarea, readOnly} = this.props;
		const valid = this.getProp('valid');
		add('control');
		add('textarea', textarea);
		add('readonly', readOnly);
		add('clearable', this.isClearable());
		add('valid', valid === true);
		add('invalid', valid === false);
		add('focused', this.state.focused);
	}

	initRendering() {
		this.value = this.getValue();
		this.valueLength = 0;
		if (isString(this.value) || isNumber(this.value)) {
			this.valueLength = this.value.toString().length;
		}
	}

	renderInternal() {
		const TagName = this.getTagName();
		return (
			<TagName {...this.getProps()}>
				<div className="uiex-input-inner">
					{this.renderInput()}
					{this.renderClearButton()}
					{this.renderAdditionalInnerContent()}
				</div>
				{this.renderIndicator()}
				{this.renderAdditionalContent()}
			</TagName>
		)
	}

	renderInput() {
		let {type} = this.props;
		const {name, placeholder, textarea, maxLength} = this.props;
		if (!type || !isSting(type)) {
			type = 'text';
		}
		const TagName = !textarea ? 'input' : 'textarea';
		const customInputProps = this.getCustomInputProps();		
		return (
			<TagName 
				ref="input"
				type={!textarea ? type : null}
				name={name}
				value={this.value}
				placeholder={placeholder}
				maxLength={maxLength}
				autoComplete="off"
				spellCheck="off"
				onMouseDown={this.handleMouseDown}
				onChange={this.handleChange}
				onFocus={this.handleFocus}
				onBlur={this.handleBlur}
				onKeyUp={this.handleKeyUp}
				onClick={this.handleClick}
				onPaste={this.handlePaste}
				{...customInputProps}
			/>
		)	
	}

	getValue() {
		let value = this.getProp('value');
		if (value == null) {
			value = this.getProperDefaultValue();
		}
		return this.getProperIncomingValue(value);
	}

	isClearable() {
		const value = this.getProp('value');
		const {clearable, readOnly, defaultValue} = this.props;
		return (value || value === 0) && clearable && !readOnly && (!defaultValue || (defaultValue && value !== defaultValue));
	}

	renderClearButton() {
		if (this.isClearable()) {
			return (
				<div 
					className="uiex-input-clear"
					onClick={this.handleClear}
				>
					<Icon name="clear"/>
				</div>
			)
		}
	}

	renderIndicator() {
		const {withIndicator, maxLength} = this.props;
		if (withIndicator) {
			return (
				<div className="uiex-input-indicator">
					{this.valueLength} / {maxLength || '-'}
				</div>
			)
		}
	}

	handleMouseDown = (e) => {
		e.stopPropagation();
		const {disabled, readOnly, name} = this.props;
		if (disabled || readOnly) {
			e.preventDefault();
			if (disabled) {
				this.fire('disabledClick', name);
			}
		}
	}

	inputHandler() {
		const {disabled, readOnly} = this.props;
		if (!disabled && !readOnly) {
			this.fireChange();
		}
	}

	handlePaste = () => {
		this.outcomingValue = '';
		this.pasted = true;
	}

	fireChange(value = this.refs.input.value) {
		if (this.pasted) {
			this.pasted = false;
			value = this.getProperIncomingValue(value);
		}
		const {name, uncontrolled} = this.props;
		if (value !== '') {
			value = this.outcomingValue = this.getProperOutcomingValue(value);
		}
		this.firePropChange('change', 'value', [value, name], value);
		if (uncontrolled) {
			this.checkValidity(value);
		}
	}

	isValueValid(value) {
		let {pattern, required, minLength} = this.props;
		let isValid = true;
		if (pattern && isString(pattern)) {
			if (pattern == '^') {
				pattern = null;
			} else {
				pattern = new RegExp(regexEscape(pattern));
			}
		}
		if (value && (pattern instanceof RegExp || isFunction(pattern))) {
			if (pattern instanceof RegExp) {
				isValid = pattern.test(value);
			} else {
				isValid = pattern(value);
			}
		} else if (!required && !minLength) {
			return null;
		}
		if (isValid) {
			if ((value === '' || value == null) && required) {
				isValid = false;
			} else {
				minLength = getNumber(minLength);
				value = String(value);
				if (minLength) {
					isValid = value.length >= minLength; 
				}
			}
		}
		return isValid;
	}

	checkValidity(value = this.getProp('value')) {
		let currentValid = this.getProp('valid');
		const {name} = this.props;
		if (this.props.validating) {
			const valid = this.isValueValid(value);			
			if (currentValid === undefined) {
				currentValid = null;
			}		
			if (valid !== currentValid) {
				this.firePropChange('changeValidity', 'valid', [valid, value, name], valid);
			}
		} else if (isBoolean(currentValid)) {
			this.firePropChange('changeValidity', 'valid', [null, value, name], null);
		}
	}

	focusHandler() {
		const {name, focusStyle, disabled, readOnly} = this.props;
		this.valueBeforeFocus = this.value;
		if (!disabled && !readOnly) {
			if (focusStyle instanceof Object) {
				const {input} = this.refs;
				for (let k in focusStyle) {
					input.style[k] = focusStyle[k];
				}
			}
			this.fire('focus', this.value, name);
			this.setState({focused: true});
		}
	}

	blurHandler() {
		const {focusStyle, disabled, readOnly, value, name} = this.props;
		if (!disabled && !readOnly) {
			if (focusStyle instanceof Object) {
				const {input} = this.refs;
				for (let k in focusStyle) {
					input.style[k] = '';
				}
			}
			this.fire('blur', value, name);
			this.setState({focused: false});
			const defaultValue = this.getProperDefaultValue();
			if (value === '' && defaultValue) {
				this.fireChange(defaultValue);
			}
		}
	}

	clickHandler() {
		const {disabled, name} = this.props;
		if (!disabled) {
			this.fire('click', name);
		}
	}

	handleClear = () => {
		const {name, disabled, readOnly} = this.props;
		if (!disabled && !readOnly) {
			const defaultValue = this.getProperDefaultValue();
			this.fireChange(defaultValue);
			this.fire('clear', name);
		}
	}

	keyUpHandler(e) {
		const {key} = e;
		const {name, value, textarea} = this.props;
		switch (key) {
			case 'Enter':
				if (!textarea) {
					if (value) {
						this.blur();
					}
					this.fire('enter', value, name);
					this.handleEnter();
				}
			break;

			case 'Escape':
				this.blur();
				this.handleEscape();
				this.fireChange(this.valueBeforeFocus);		
			break;
		}
	}

	focus() {
		this.refs.input.focus();
	}

	blur() {
		this.refs.input.blur();
	}

	filterValue(value) {
		const {customFilter} = this.props;
		if (value == null) {
			value = '';
		}
		if (isFunction(customFilter)) {
			return customFilter(value);
		}
		return value;
	}

	getProperDefaultValue() {
		return this.props.defaultValue || '';
	}

	parseInitialValue(value) {
		return value;
	}

	getProperIncomingValue(value) {
		if (value == null) {
			return '';
		}
		if (value === '' || value === this.outcomingValue) {
			return value;
		}
		return this.filterValue(value);
	}

	getProperOutcomingValue(value) {
		return this.filterValue(value);
	}

	getCustomInputProps() {}
	renderAdditionalContent() {}
	renderAdditionalInnerContent() {}
	handleEnter() {}
	handleEscape() {}
}