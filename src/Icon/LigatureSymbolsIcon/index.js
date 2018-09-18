import React from 'react';
import {UIEXIcon} from '../../UIEXComponent';
import {IconPropTypes} from '../proptypes';

import './style.scss';

export class LigatureSymbolsIcon extends UIEXIcon {
	static propTypes = IconPropTypes;
	static className = 'icon';

	addClassNames(add) {
		add('lsf');
	}

	renderInternal() {
		const {name} = this.props;
		return (
			<span {...this.getProps()}>
				{name}
			</span>
		)
	}
}