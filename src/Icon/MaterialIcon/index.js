import React from 'react';
import {UIEXIcon} from '../../UIEXComponent';
import {IconPropTypes} from '../proptypes';

import './style.scss';

export class MaterialIcon extends UIEXIcon {
	static propTypes = IconPropTypes;
	static className = 'icon';

	addClassNames(add) {
		add('mti');
	}

	renderInternal() {
		const {name} = this.props;
		return (
			<i {...this.getProps()}>
				{name}
			</i>
		)
	}
}