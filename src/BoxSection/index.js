import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Box} from '../Box';
import {Icon} from '../Icon'; 
import {BoxSectionPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export class BoxSection extends UIEXComponent {
	static propTypes = BoxSectionPropTypes;
	static className = 'box-section';
	static displayName = 'BoxSection';

	addClassNames(add) {
		add('icon-at-right', this.props.iconAtRight);
	}

	renderInternal() {
		const {caption, note, isOpen} = this.props;
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
				<Box {...this.props}/>
			</TagName>
		)
	}

	handleClick = () => {
		const {disabled, onToggle, onDisabledClick, isOpen} = this.props;
		if (!disabled && typeof onToggle == 'function') {
			onToggle(!isOpen);
		} else if (disabled && typeof onDisabledClick == 'function') {
			onDisabledClick();
		}
	}
}