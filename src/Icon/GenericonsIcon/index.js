import React from 'react';
import {UIEXIcon} from '../../UIEXComponent';
import {IconPropTypes} from '../proptypes';

import './style.scss';

export class GenericonsIcon extends UIEXIcon {
	static propTypes = IconPropTypes;
	static className = 'icon';
	
	addClassNames(add) {
		add('gnr');
		add('gnr-' + this.props.name);
	}

	renderInternal() {
		return (
			<i {...this.getProps()}/>
		)
	}
}