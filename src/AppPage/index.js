import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {AppPagePropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export class AppPage extends UIEXComponent {
	static propTypes = AppPagePropTypes;
	static className = 'app-page';
	static displayName = 'AppPage';

	renderInternal() {
		let {content} = this.props;
		console.log(this.props)
		const TagName = this.getTagName(); 
		return (
			<TagName {...this.getProps()}>
				{content}
			</TagName>
		)
	}
}