import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Icon} from '../Icon';
import {getNumber, regexEscape} from '../utils';
import {InputPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const INITIAL_STATE = {
	focused: false
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
		this.isValid = null;
		this.state = {
			...this.state,
			...INITIAL_STATE
		};
	}

	componentDidMount() {
		const {value} = this.props;
		if (value) {
			this.checkValidity(value);
		}
	}

	componentDidUpdate(prevProps) {
		const {value} = this.props;
		if (prevProps.value != value) {
			this.checkValidity(value, this.props);
		}
	}

	addClassNames(add) {
		const {textarea, readOnly, valid, invalid} = this.props;
		add('control');
		add('textarea', textarea);
		add('readonly', readOnly);
		add('clearable', this.isClearable());
		add('valid', valid);
		add('invalid', invalid);
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
		let {value, defaultValue} = this.props;
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
		const {disabled, readOnly, onDisabledClick, name} = this.props;
		if (disabled || readOnly) {
			e.preventDefault();
			if (disabled && typeof onDisabledClick == 'function') {
				onDisabledClick(name);
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
		const {onChange, name} = props;
		if (typeof onChange == 'function') {
			const value = this.filterValue(this.refs.input.value, props);
			onChange(value, name);
		}
	}

	checkValidity(value, props = this.props) {
		let {pattern, required, minLength} = props;
		let isValid = true;
		if (pattern && typeof pattern == 'string') {
			pattern = new RegExp(regexEscape(pattern));
		}
		if (value && pattern instanceof RegExp || typeof pattern == 'function') {
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
		this.fireChangeValidity(isValid, value);
	}

	fireChangeValidity(isValid, value = undefined) {
		if (isValid === false && this.isValid == null) {
			return;
		}
		if (isValid !== this.isValid) {
			const {name, onChangeValidity} = this.props;
			this.isValid = isValid;
			if (typeof onChangeValidity == 'function') {
				onChangeValidity(isValid, value, name);
			}
		}
	}

	focusHandler() {
		const {onFocus, name, focusStyle, disabled, readOnly, value} = this.props;
		this.valueBeforeFocus = value;
		if (!disabled && !readOnly) {
			if (focusStyle instanceof Object) {
				const {input} = this.refs;
				for (let k in focusStyle) {
					input.style[k] = focusStyle[k];
				}
			}
			if (typeof onFocus == 'function') {
				onFocus(this.refs.input.value, name);
			}
			this.setState({focused: true});
		}
	}

	blurHandler() {
		const {onBlur, focusStyle, disabled, readOnly, value, name, onChange} = this.props;
		if (!disabled && !readOnly) {
			if (focusStyle instanceof Object) {
				const {input} = this.refs;
				for (let k in focusStyle) {
					input.style[k] = '';
				}
			}
			if (typeof onBlur == 'function') {
				onBlur(value, name);
			}
			this.setState({focused: false});
			if (typeof onChange == 'function' && value === '') {
				onChange(this.getProperDefaultValue(), name);
			}
		}
	}

	clickHandler() {
		const {onClick, disabled, name} = this.props;
		if (!disabled && typeof onClick == 'function') {
			onClick(name);
		}
	}

	handleClear = () => {
		const {onClear, onChange, name, disabled, readOnly} = this.props;
		if (!disabled && !readOnly) {
			if (typeof onChange == 'function') {
				onChange(this.getProperDefaultValue(), name);
			}
			if (typeof onClear == 'function') {
				onClear();
			}
		}
	}

	keyUpHandler(e) {
		const {key} = e;
		const {onEnter, onChange, name, value, textarea} = this.props;
		switch (key) {
			case 'Enter':
				if (!textarea) {
					if (value) {
						this.blur();
					}
					if (typeof onEnter == 'function') {
						onEnter(value, name);
					}
					this.handleEnter();
				}
			break;

			case 'Escape':
				if (typeof onChange == 'function') {
					this.blur();
					onChange(this.valueBeforeFocus, name);
				}
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