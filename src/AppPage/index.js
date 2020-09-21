import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {isFunction} from '../utils';
import {AppPagePropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export class AppPage extends UIEXComponent {
	static propTypes = AppPagePropTypes;
	static className = 'app-page';
	static displayName = 'AppPage';

	renderInternal() {
		let {component: Component, params} = this.props;
		const TagName = this.getTagName();
		let content = null;
		if (isFunction(Component)) {
			content = <Component params={params} />;
		}
		return (
			<TagName {...this.getProps()}>
				{content}
			</TagName>
		)
	}
}