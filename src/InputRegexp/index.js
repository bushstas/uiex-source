import React from 'react';
import {Input} from '../Input';
import {replace} from '../utils';
import {InputRegexpPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export class InputRegexp extends Input {
	static propTypes = InputRegexpPropTypes;
	static className = 'input';
	static isControl = true;
	static displayName = 'InputRegexp';

	addClassNames(add) {
		super.addClassNames(add);
		add('regexp-input');
	}

	getValue() {
		let value = super.getValue();
		if (value instanceof RegExp) {
			value = replace(/^\/|\/$/g, '', value);
		}
		return value;
	}

	filterValue(value) {
		const {stringified} = this.props;
		if (!stringified && value) {
			let v;
			try {
				v = new RegExp(value);
			} catch(e) {
				return value;
			}
			return v;
		}
		return value;
	}

	isValueValid(value) {
		const {required} = this.props;
		if (value || required) {
			if (value == null) {
				value = '';
			}
			if (!value && required) {
				return false;
			}
			try {
				value = new RegExp(value);
			} catch(e) {
				return false;
			}
			return true;
		}
		return null;
	}
}