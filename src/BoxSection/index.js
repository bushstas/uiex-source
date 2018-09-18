import React from 'react';
import {withStateMaster} from '../state-master';
import {UIEXComponent} from '../UIEXComponent';
import {Box} from '../Box';
import {Icon} from '../Icon';
import {BoxSectionPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const PROPS_LIST = 'isOpen';

class BoxSectionComponent extends UIEXComponent {
	static propTypes = BoxSectionPropTypes;
	static className = 'box-section';
	static displayName = 'BoxSection';

	static getDerivedStateFromProps({addIfChanged}) {
		addIfChanged('isOpen');
	}

	addClassNames(add) {
		add('icon-at-right', this.props.iconAtRight);
	}

	renderInternal() {
		const {caption, children, iconAtRight, className, note, ...boxProps} = this.props;
		const {isOpen} = this.state;
		const TagName = this.getTagName();
		return (
			<TagName {...this.getProps()}>
				<div className="uiex-box-section-caption" onClick={this.handleClick}>
					<Icon name={isOpen ? 'expand_less' : 'expand_more'}/>
					<span>
						{caption}
					</span>
				</div>
				{note && 
					<div className="uiex-box-section-note" onClick={this.handleClick}>
						{note}
					</div>
				}
				<Box {...boxProps} isOpen={isOpen}>
					{children}
				</Box>
			</TagName>
		)
	}

	handleClick = () => {
		const {disabled} = this.props;
		if (!disabled) {
			const {isOpen} = this.state;
			this.setState({isOpen: !isOpen});
		}
	}
}

export const BoxSection = withStateMaster(BoxSectionComponent, PROPS_LIST, null, UIEXComponent);