import React from 'react';
import {Button} from '../Button';
import {Icon} from '../Icon';
import {TabPropTypes} from './proptypes';

import '../style.scss';

export class Tab extends Button {
	static propTypes = TabPropTypes;
	static displayName = 'Tab';

	addClassNames(add) {
		super.addClassNames(add);
		add('button');
		add('after-active', this.props.afterActive);
	}

	renderInternalChildren() {
		return this.props.caption;
	}

	handleClick = (e) => {
		e.stopPropagation();
		const {
			value,
			disabled,
			onSelect,
			onDisabledSelect,
			single
		} = this.props;

		if (!disabled) {
			if (typeof onSelect == 'function') {
				onSelect(value, single);
			}
		} else if (typeof onDisabledSelect == 'function') {
			onDisabledSelect(value);
		}
	}
}