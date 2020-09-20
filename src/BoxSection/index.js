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

	constructor(props) {
		super(props);
		if (props.uncontrolled) {
			this.state = {
				isOpen: props.isOpen
			};
		}
	}

	addClassNames(add) {
		const {iconAtRight, view} = this.props;
		add('icon-at-right', iconAtRight);
		add('view-' + view, view);
	}

	renderInternal() {
		const isOpen = this.getProp('isOpen');
		const {caption, note} = this.props;
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
				<Box 
					{...this.props} 
					style={null}
					isOpen={isOpen}
					uncontrolled={false}
				/>
			</TagName>
		)
	}

	handleClick = () => {
		const isOpen = !this.getProp('isOpen');
		const {disabled, uncontrolled, name} = this.props;
		if (!disabled) {
			if (uncontrolled) {
				this.setState({isOpen});
			}
			this.fire('toggle', isOpen, name);
		} else {
			this.fire('disabledClick', name);
		}
	}
}