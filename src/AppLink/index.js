import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {AppLinkPropTypes} from './proptypes';
import {locationController} from '../App';

import '../style.scss';
import './style.scss';

export class AppLink extends UIEXComponent {
	static propTypes = AppLinkPropTypes;
	static displayName = 'AppLink';

	getCustomProps() {
		return {
			onClick: this.handleClick
		}
	}

	renderInternal() {
		let {children} = this.props;
		const TagName = this.getTagName(); 
		return (
			<TagName {...this.getProps()}>
				{children}
			</TagName>
		)
	}

	handleClick = () => {
		console.log(location)
		locationController.navigateToPage(this.props.page);
	}
}