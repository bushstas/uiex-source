import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {isFunction} from '../utils';
import {AppPagePropTypes} from './proptypes';

import '../style.scss';

export class AppPage extends UIEXComponent {
	static propTypes = AppPagePropTypes;
	static className = 'app-page';
	static displayName = 'AppPage';
	static properParentClasses = ['App'];

	renderInternal() {
		let {component: Component, params, props} = this.props;
		const TagName = this.getTagName();
		let content = null;
		if (isFunction(Component)) {
			content = (
				<Component
					{...props}
					params={params}
				/>
			);
		}
		return (
			<TagName {...this.getProps()}>
				{content}
			</TagName>
		)
	}
}