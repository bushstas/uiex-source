import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {ScrollContainer} from '../ScrollContainer';
import {SideMenuPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export const DEFAULT_SIDE_MENU_WIDTH = 200;

export class SideMenu extends UIEXComponent {
	static propTypes = SideMenuPropTypes;
	static displayName = 'SideMenu';
	static className = 'side-menu';

	addClassNames(add) {
		add('scrollable', this.props.scrollable);
		add('at-right', this.props.atRight);
	}

	renderInternal() {
		const content = this.renderChildren();
		const TagName = this.getTagName();
		const {
			scrollable,
			className,
			atRight,
			...scrollerProps
		} = this.props;
		return (
			<TagName {...this.getProps()}>
				{scrollable ? 
					<ScrollContainer
						{...scrollerProps}
					>
						{content}
					</ScrollContainer> : content
				}
			</TagName>
		)
	}
}
