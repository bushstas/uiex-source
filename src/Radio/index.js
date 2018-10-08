import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {RadioPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export class Radio extends UIEXComponent {
	static propTypes = RadioPropTypes;
	static isControl = true;
	static displayName = 'Radio';

	addClassNames(add) {
		const {children, multiline, value, label} = this.props;
		add('control');
		add('multilined', multiline);
		add('checked', !!value);
		add('without-content', !children && !label);
	}

	renderInternal() {
		let {label} = this.props;

		const content = this.renderChildren();
		let additionalContent;
		if (!label) {
			label = content;
		} else {
			additionalContent = content;
		}
		const TagName = this.getTagName();
		return (
			<TagName {...this.getProps()}>
				<span 
					className="uiex-radio-control"
					onClick={this.handleClick}
					style={this.getStyle('control')}
				>
					<span className="uiex-radio-marker" style={this.getStyle('marker')}/>
				</span>
				{label &&
					<div 
						className="uiex-radio-label uiex-radio-content"
						style={this.getStyle('label')}
					>
						<span onClick={this.handleClick}>
							{label}
						</span>
					</div>
				}
				{additionalContent && 
					<div className="uiex-radio-content">
						{additionalContent}
					</div>
				}
			</TagName>
		)
	}

	handleClick = (e) => {
		e.stopPropagation();
		this.fire('change', true, this.props.name);		
	}
}