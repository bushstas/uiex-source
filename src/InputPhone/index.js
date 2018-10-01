import React from 'react';
import {Input} from '../Input';
import {regexEscape, replace, propsChanged} from '../utils';
import {InputPhonePropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const PROPS_LIST = ['numeric', 'withCode', 'code', 'mask', 'numericCode'];

export class InputPhone extends Input {
	static propTypes = InputPhonePropTypes;
	static className = 'input';
	static isControl = true;
	static displayName = 'InputPhone';

	componentDidUpdate(prevProps) {
		super.componentDidUpdate(prevProps);
		let {onChange, name, value} = this.props;
		if (value && propsChanged(prevProps, this.props, PROPS_LIST)) {
			if (typeof onChange == 'function') {
				const newValue = this.filterValue(this.getWithoutCode(value));
				if (newValue != value) {
					onChange(newValue, name);
				}
			}
		}
	}

	addClassNames(add) {
		super.addClassNames(add);
		add('phone-input');
		add('with-code', this.props.code);
	}

	renderAdditionalContent() {
		let {code} = this.props;
		if (code) {
			if (typeof code == 'string') {
				code = code.trim();
			}
			return (
				<div className="uiex-phone-code">
					{code}
				</div>
			)
		}
	}

	getCustomInputProps() {
		const {mask} = this.props;
		if (typeof mask == 'string') {
			return {
				maxLength: mask.trim().length
			}
		}
	}

	getValue() {
		let value = this.getWithoutCode(super.getValue());
		return this.getMaskedValue(value);
	}

	filterValue(value) {		
		const {numeric} = this.props;
		return numeric ? replace(/[^\d]/g, '', this.getWithCode(value)) : this.getWithCode(this.getMaskedValue(value));
	}

	getMaskedValue(value) {
		let properValue = value;
		let {mask} = this.props;
		if (typeof mask == 'string') {
			value = replace(/[^\d]/g, '', value);
			mask = mask.trim();
			const l = mask.length;
			let idx = 0;
			properValue = '';
			if (!value) {
				return '';
			}
			for (let i = 0; i < l; i++) {
				const maskChar = mask.charAt(i);
				if (!(/^[\da-z]/i).test(maskChar)) {
					properValue += maskChar;
				} else {
					properValue += value[idx++];
					if (idx >= value.length) {
						break;
					}
				}
			}
		}		
		return properValue;
	}

	getWithCode(value) {
		let {code, withCode, numericCode, numeric} = this.props;
		if (numeric && numericCode) {
			code = numericCode;
		}
		if (withCode && code) {
			value = code + value;
		}
		return value;
	}

	getWithoutCode(value) {
		let {numeric, code, withCode, numericCode} = this.props;
		if (withCode) {
			if (numeric && numericCode) {
				code = numericCode;
			}
			if (code) {
				code = regexEscape(code);
				if (numeric) {
					code = replace(/[^\d]/g, '', code);
				}
				const regex = new RegExp('^' + code);
				return replace(regex, '', value);
			}
		}
		return value;
	}

	getProperDefaultValue() {
		const {defaultValue} = this.props;
		if (defaultValue) {
			return this.getMaskedValue(defaultValue);
		}
		return '';
	}

	checkValidity(value, props = this.props) {
		let {withCode, required, code, numeric, numericCode, mask} = props;
		if (value || required) {
			if (typeof mask != 'string') {
				mask = '';
			}
			let {length} = !!numeric && !!mask ? replace(/[^\da-z]/ig, '', mask) : mask;
			if (withCode) {
				if (numeric) {
					if (numericCode || numericCode === 0) {
						code = numericCode;
					}
				}
				if (code) {
					length += String(code).length;
				}
			}
			const isValid = value.length == length;
			if (isValid === false && this.isValid == null) {
				return;
			}
			this.fireChangeValidity(isValid, value);
		}
	}
}