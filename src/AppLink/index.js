import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Button} from '../Button';
import {navigateToPage, navigateToPath, registerAppLink, unregisterAppLink} from '../App';
import {isString} from '../utils';
import {AppLinkPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

let linkId = 0;

export class AppLink extends UIEXComponent {
	static propTypes = AppLinkPropTypes;
	static displayName = 'AppLink';

	constructor(props) {
		super(props);
		linkId++;
		this.linkId = linkId;
		const {path} = this.props;
		this.linkPath = isString(path) ? path.replace(/^\/|\/$/g, '') : null;
		registerAppLink(linkId, this);
	}

	componentWillUnmount() {
		unregisterAppLink(this.linkId);
	}

	getCustomProps() {
		return {
			onClick: this.handleClick
		}
	}

	getAppLinkPage = () => {
		return this.props.page;
	}

	getAppLinkPath = () => {
		return this.linkPath;
	}

	renderInternal() {
		let {children, isButton, page, path, ...rest} = this.props;
		const TagName = this.getTagName();
		let active = false;
		if (this.state && this.state.active) {
			active = true;
		}
		if (isButton) {
			return (
				<Button
					{...rest}
					onClick={this.handleClick}
					active={active}
				>
					{children}
				</Button>
			);
		}
		return (
			<TagName {...this.getProps()}>
				{children}
			</TagName>
		)
	}

	handleClick = () => {
		const {page, params} = this.props;
		if (isString(page)) {
			navigateToPage(page, params);
		} else {
			navigateToPath(this.linkPath, params);
		}
	}
}