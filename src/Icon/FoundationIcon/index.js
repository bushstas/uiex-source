import React from 'react';
import {UIEXIcon} from '../../UIEXComponent';
import {IconPropTypes} from '../proptypes';

import './style.scss';

export class FoundationIcon extends UIEXIcon {
	static propTypes = IconPropTypes;
	static className = 'icon';

	addClassNames(add) {
		add('fi');
		add('fi-' + this.props.name);
	}

	renderInternal() {
		return (
			<i {...this.getProps()}/>
		)
	}
}