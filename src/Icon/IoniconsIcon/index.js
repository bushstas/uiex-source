import React from 'react';
import {UIEXIcon} from '../../UIEXComponent';
import {IconPropTypes} from '../proptypes';

import './style.scss';

export class IoniconsIcon extends UIEXIcon {
	static propTypes = IconPropTypes;
	static className = 'icon';

	addClassNames(add) {
		add('ion');
		add('ion-' + this.props.name);
	}

	renderInternal() {
		return (
			<i {...this.getProps()}/>
		)
	}
}