import React from 'react';
import {Button} from '../Button';
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
		const {value, disabled, single} = this.props;
		if (!disabled) {			
			this.fire('select', value, single);
		} else {
			this.fire('disabledClick', value);
		}
	}
}