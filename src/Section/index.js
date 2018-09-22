import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {SectionPropTypes} from './proptypes';
import {getNumberInPxOrPercent, addStyleProperty} from '../utils';

import '../style.scss';
import './style.scss';

export class Section extends UIEXComponent {
	static propTypes = SectionPropTypes;
	static styleNames = ['caption', 'note', 'content'];
	static displayName = 'Section';
	static propsToCheck = ['borderColor', 'borderWidth', 'borderStyle', 'borderRadius', 'bgColor', 'padding'];

	getCustomStyle() {
		let {borderColor: bc, borderWidth: bw, borderStyle: bs, borderRadius: br, bgColor: bg, padding: pd} = this.props;
		bw = getNumberInPxOrPercent(bw);
		pd = getNumberInPxOrPercent(pd);
		br = getNumberInPxOrPercent(br);
		let style = addStyleProperty(pd, 'padding');
		style = addStyleProperty(bw, 'borderWidth', style);
		style = addStyleProperty(bc, 'borderColor', style);
		style = addStyleProperty(bs, 'borderStyle', style);
		style = addStyleProperty(br, 'borderRadius', style);
		style = addStyleProperty(bg, 'backgroundColor', style);
		return style;
	}

	renderInternal() {
		const {children, caption, note} = this.props;
		const TagName = this.getTagName();

		return (
			<TagName {...this.getProps()}>
				{(caption || note) &&
					<div className="uiex-section-caption" style={this.getStyle('caption')}>
						{caption}
						{note && 
							<div className="uiex-section-note" style={this.getStyle('note')}>
								{note}
							</div>
						}
					</div>
				}
				<div className="uiex-section-content" style={this.getStyle('content')}>
					{children}
				</div>
			</TagName>
		)
	}
}