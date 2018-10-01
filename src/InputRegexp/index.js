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
				this.fireChangeValidity(true, v);
			} catch(e) {
				this.fireChangeValidity(false, value);
				return value;
			}
			return v;
		}
		return value;
	}
}