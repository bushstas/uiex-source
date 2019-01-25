import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {getNumericProp} from '../utils';
import {DelimiterPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const MIN_LINE_THICKNESS = 1;
const MAX_LINE_THICKNESS = 20;

export class Delimiter extends UIEXComponent {
	static propTypes = DelimiterPropTypes;
	static displayName = 'Delimiter';
	static propsToCheck = ['line'];

	addClassNames(add) {
		const {withGradient, lineValign} = this.props;
		add(`line-valign-${lineValign}`, lineValign);
		add('with-gradient', withGradient);
	}

	getLineStyle() {
		const {lineThickness, lineWidth} = this.props;
		const height = getNumericProp(lineThickness, MIN_LINE_THICKNESS, MIN_LINE_THICKNESS, MAX_LINE_THICKNESS);
		return {
			width: lineWidth,
			height: height
		};
	}

	getLineInnerStyle() {
		const {lineColor} = this.props;
		return {
			backgroundColor: lineColor
		};
	}

	getLineEdgeStyle(toSide) {
		const {lineColor} = this.props;
		if (lineColor) {
			return {
				background: `linear-gradient(to ${toSide}, transparent, ${lineColor})`
			};
		}
	}

	renderInternal() {
		const TagName = this.getTagName();
		const {withLine, withGradient} = this.props;
		return (
			<TagName {...this.getProps()}>
				{withLine && 
					<div
						className={this.getClassName('line')}
						style={this.getLineStyle()}
					>
						<div
							className={this.getClassName('line-inner')}
							style={this.getLineInnerStyle()}
						/>
						{withGradient && 
							<div
								className={this.getClassName('line-left')}
								style={this.getLineEdgeStyle('right')}
							/>
						}
						{withGradient && 
							<div
								className={this.getClassName('line-right')}
								style={this.getLineEdgeStyle('left')}
							/>
						}
					</div>
				}
			</TagName>
		)
	}

	getHeightProp() {
		return this.props.space || this.props.height;
	}
}