import React from 'react';
import {Input} from '../Input';
import {regexEscape, replace, isString} from '../utils';
import {InputPhonePropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const PROPS_LIST = ['numeric', 'withCode', 'code', 'mask', 'numericCode'];

export class InputPhone extends Input {
	static propTypes = InputPhonePropTypes;
	static className = 'input';
	static isControl = true;
	static displayName = 'InputPhone';

	constructor(props) {
		super(props);
		this.propsList = PROPS_LIST;
	}

	addClassNames(add) {
		super.addClassNames(add);
		add('phone-input');
		add('with-code', this.props.code);
	}

	renderAdditionalContent() {
		let {code} = this.props;
		if (code) {
			if (isString(code)) {
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
		if (isString(mask)) {
			const maxLength = mask.trim().length;
			return {maxLength}
		}
	}

	getProperIncomingValue(value) {
		if (value == null || value === '') {
			return '';
		}
		if (value === this.outcomingValue && this.addedCode) {
			const regex = new RegExp(`^${regexEscape(this.addedCode)}`);
			value = replace(regex, '', value);
		} else {
			value = this.getWithoutCode(value);
		}
		return this.getMaskedValue(value);
	}

	getProperOutcomingValue(value) {
		const {numeric} = this.props;
		value = super.filterValue(value);
		this.addedCode = '';
		return this.getWithCode(numeric ? replace(/[^\d]/g, '', value) : this.getMaskedValue(value));
	}

	getMaskedValue(value) {
		let properValue = value;
		let {mask} = this.props;
		if (isString(mask)) {
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
			this.addedCode = code;
			value = `${code}${value}`;
		}
		return value;
	}

	getWithoutCode(value) {
		if (isString(value)) {
			value = value.replace(/\s/g, '');
			let {numeric, code, withCode, numericCode} = this.props;
			if (withCode) {
				if (numeric && numericCode) {
					code = numericCode;
				}
				if (isString(code)) {
					code = code.replace(/\s/g, '');
				} else {
					code = code.toString();
				}
				if (code) {
					const regex = new RegExp(`^${regexEscape(code)}`);
					value = replace(regex, '', value);
				}
			}
		}
		return value;
	}

	isValueValid(value) {
		let {withCode, required, code, numeric, numericCode, mask} = this.props;
		if (value || required) {
			if (value == null) {
				value = '';
			}
			if (!isString(mask)) {
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
			const valid = value.length == length;
			const errorType = value ? 'length' : 'required';
			return {valid, errorType: valid ? null : errorType};
		}
		return {valid: null, errorType: null};
	}
}