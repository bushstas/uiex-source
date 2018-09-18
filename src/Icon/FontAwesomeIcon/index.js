import React from 'react';
import {UIEXIcon} from '../../UIEXComponent';
import {IconPropTypes} from '../proptypes';

import './style.scss';

export class FontAwesomeIcon extends UIEXIcon {
	static propTypes = IconPropTypes;
	static className = 'icon';
		
	addClassNames(add) {
		add('fa');
		add('fa-' + this.props.name);
	}

	renderInternal() {
		return (
			<i {...this.getProps()}/>
		)
	}
}