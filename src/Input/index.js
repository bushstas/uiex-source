import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Icon} from '../Icon';
import {getNumber, regexEscape, isString, isNumber, isFunction, isArray, isBoolean, propsChanged} from '../utils';
import {InputPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const PROPS_LIST = ['validating', 'value', 'required', 'minLength', 'uncontrolled'];

const wheelEventOptions = {
	capture: false,
	passive: false
};

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
		this.errorType = null;
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
		if (isFunction(this.handleWheel)) {
			this.refs.main.addEventListener('wheel', this.handleWheel, wheelEventOptions);	
		}
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

	componentWillUnmount() {
		if (isFunction(this.handleWheel)) {
			this.refs.main.removeEventListener('wheel', this.handleWheel, wheelEventOptions);	
		}
		this.fire('unmount');
	}

	addClassNames(add) {
		const {textarea, readOnly, noVisualValidation, value} = this.props;
		const valid = this.getProp('valid');
		add('control');
		add('textarea', textarea);
		add('readonly', readOnly);
		add('clearable', this.isClearable());
		add('focused', this.state.focused);
		if (!noVisualValidation) {
			add('valid', value && valid === true);
			add('invalid', valid === false);
		}
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
		if (!type || !isString(type)) {
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
		if (value == null || value === '') {
			value = this.getProperDefaultValue();
		}
		return this.getProperIncomingValue(value);
	}

	getProperIncomingValue(value) {
		return this.filterValue(value);
	}

	getProperOutcomingValue(value) {
		return this.filterValue(value);
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
			this.inputed = true;
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
		if (this.inputed) {
			this.inputed = false;
			this.fire('input', value, name);
		}
	}

	isValueValid(value) {
		let errorType = 'pattern';
		let {pattern, required, minLength} = this.props;
		let isValid = true;
		if (pattern && isString(pattern)) {
			try {
				pattern = new RegExp(pattern);
			} catch (e) {
				console.error(e);
			}
		}
		if (value && (pattern instanceof RegExp || isFunction(pattern))) {
			if (pattern instanceof RegExp) {
				isValid = pattern.test(value);
			} else {
				isValid = pattern(value);
			}
		} else if (!required && !minLength) {
			return {valid: null, errorType: null};
		}
		if (isValid) {
			if ((value === '' || value == null) && required) {
				isValid = false;
				errorType = 'required';
			} else if (value) {
				minLength = getNumber(minLength);
				value = String(value);
				if (minLength) {
					isValid = value.length >= minLength; 
				}
				errorType = 'length';
			}
		}
		return {valid: isValid, errorType: isValid ? null : errorType};
	}

	checkValidity(value = this.getProp('value')) {
		let currentValid = this.getProp('valid');
		const {name, validate} = this.props;
		if (this.props.validating) {
			let {valid, errorType} = this.isValueValid(value);
			if (value && !valid && isFunction(validate)) {
				const error = validate(value, name);
				valid = true;
				if (error) {
					valid = false;
					errorType = error;
				}
			}
			if (currentValid === undefined) {
				currentValid = null;
			}		
			if (valid !== currentValid || this.errorType !== errorType) {
				this.errorType = errorType;
				this.firePropChange('changeValidity', 'valid', [valid, errorType, value, name], valid);
			}
		} else if (isBoolean(currentValid)) {
			this.firePropChange('changeValidity', 'valid', [null, null, value, name], null);
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
		const {focusStyle, disabled, readOnly, name} = this.props;
		const value = this.getProp('value');
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
		const {name, textarea} = this.props;
		const value = this.getProp('value');
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

	parseInitialValue(value) {
		return value;
	}

	getCustomInputProps() {}
	renderAdditionalContent() {}
	renderAdditionalInnerContent() {}
	handleEnter() {}
	handleEscape() {}
}