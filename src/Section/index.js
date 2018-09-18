import React from 'react';
import {withStateMaster} from '../state-master';
import {UIEXComponent} from '../UIEXComponent';
import {SectionPropTypes} from './proptypes';
import {getNumberInPxOrPercent, addObject} from '../utils';

import '../style.scss';
import './style.scss';

const PROPS_LIST = ['borderWidth', 'borderColor', 'borderStyle', 'borderRadius', 'bgColor', 'padding'];

class SectionComponent extends UIEXComponent {
	static propTypes = SectionPropTypes;
	static styleNames = ['caption', 'note', 'content'];
	static displayName = 'Section';

	static getDerivedStateFromProps({add, nextProps, isChangedAny}) {
		if (isChangedAny()) {
			let customStyle = {};
			let {borderColor, borderWidth, borderStyle, borderRadius, bgColor: backgroundColor, padding} = nextProps;
			borderWidth = getNumberInPxOrPercent(borderWidth);
			padding = getNumberInPxOrPercent(padding);
			borderRadius = getNumberInPxOrPercent(borderRadius);
			if (padding) {
				customStyle.padding = padding;
			}
			if (borderWidth) {
				customStyle.borderWidth = borderWidth;
			}
			if (borderColor) {
				customStyle.borderColor = borderColor;
			}
			if (borderStyle) {
				customStyle.borderStyle = borderStyle;
			}
			if (borderRadius) {
				customStyle.borderRadius = borderRadius;
			}
			if (backgroundColor) {
				customStyle.backgroundColor = backgroundColor;
			}
			add('customStyle', customStyle);
		}
	}

	getCustomStyle() {
		return this.state.customStyle;
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

export const Section = withStateMaster(SectionComponent, PROPS_LIST, null, UIEXComponent);