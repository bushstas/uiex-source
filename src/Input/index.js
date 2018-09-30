import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Icon} from '../Icon';
import {getNumber, regexEscape, addStyleProperty} from '../utils';
import {InputPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

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
		this.isValid = null;

		if (props.uncontrolled) {
			this.state = {
				value: props.value
			};
		}
	}

	componentDidMount() {
		if (!this.props.uncontrolled) {
			this.checkValidity(this.props.value);
		}
	}

	componentDidUpdate(prevProps) {
		const {value, required, maxLength, pattern} = this.props;
		if (!this.props.uncontrolled) {
			if (value !== prevProps.value) {
				return this.checkValidity(value);
			}
		}
		if (
			required !== prevProps.required ||
			maxLength !== prevProps.maxLength ||
			pattern !== prevProps.pattern
		) {
			this.checkValidity(this.getProp('value'));
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
		if (!type || typeof type != 'string') {
			type = 'text';
		}
		const TagName = !textarea ? 'input' : 'textarea';
		const customInputProps = this.getCustomInputProps();
		const value = this.getValue();
		if (typeof value == 'string' || typeof value == 'number') {
			this.valueLength = value.toString().length;
		} else {
			this.valueLength = 0;
		}
		return (
			<TagName 
				ref="input"
				type={!textarea ? type : null}
				name={name}
				value={value}
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
				{...customInputProps}
			/>
		)	
	}

	getValue() {
		let value = this.getProp('value');
		let {defaultValue} = this.props;
		if (value == null) {
			value = defaultValue || '';
		}
		return value;
	}

	isClearable() {
		const {value, clearable, readOnly, defaultValue} = this.props;
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
			this.fireChange(this.props);
		}
	}

	fireChange(props) {
		const {name} = props;
		const value = this.filterValue(this.refs.input.value, props);
		if (this.props.uncontrolled) {
			this.setState({
				value,
				valid: this.isValueValid(value)
			})	
		} else {
			this.fire('change', value, name);
		}
	}

	isValueValid(value) {
		let {pattern, required, minLength} = this.props;
		let isValid = true;
		if (pattern && typeof pattern == 'string') {
			if (pattern == '^') {
				pattern = null;
			} else {
				pattern = new RegExp(regexEscape(pattern));
			}
		}
		if (value && (pattern instanceof RegExp || typeof pattern == 'function')) {
			if (pattern instanceof RegExp) {
				isValid = pattern.test(value);
			} else {
				isValid = pattern(value);
			}
		} else if (!required && !minLength) {
			return;
		}
		if (isValid) {
			if (value === '' && required) {
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

	checkValidity(value) {
		this.fireChangeValidity(this.isValueValid(value));
	}

	fireChangeValidity(isValid) {
		if (isValid === false && this.isValid == null) {
			return;
		}
		if (isValid !== this.isValid) {
			const {name, value} = this.props;
			this.isValid = isValid;
			this.firePropChange('changeValidity', 'valid', [isValid, value, name], isValid);
		}
	}

	focusHandler() {
		const {name, focusStyle, disabled, readOnly, value} = this.props;
		this.valueBeforeFocus = value;
		if (!disabled && !readOnly) {
			if (focusStyle instanceof Object) {
				const {input} = this.refs;
				for (let k in focusStyle) {
					input.style[k] = focusStyle[k];
				}
			}
			this.fire('focus', this.refs.input.value, name);
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
			if (value === '') {
				this.fire('change', this.getProperDefaultValue(), name);
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
			this.fire('change', this.getProperDefaultValue(), name);
			this.fire('clear');
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
				this.fire('change', this.valueBeforeFocus, name);
				this.handleEscape();
			break;
		}
	}

	focus() {
		this.refs.input.focus();
	}

	blur() {
		this.refs.input.blur();
	}

	filterValue(value, props) {
		const {customFilter} = props;
		if (value == null) {
			value = '';
		}
		if (typeof customFilter == 'function') {
			return customFilter(value);
		}
		return value;
	}

	getProperDefaultValue() {
		return this.props.defaultValue || '';
	}

	getCustomInputProps() {}
	renderAdditionalContent() {}
	renderAdditionalInnerContent() {}
	handleEnter() {}
	handleEscape() {}
}