import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {getNumberOrNull, getNumericProp} from '../utils';
import {ArrowPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const DEFAULT_SIZE = 20;
const MIN_SIZE = 5;
const MAX_SIZE = 200;
const DEFAULT_DIRECTION = 'up';
const DEFAULT_LENGTH_RATIO = 50;
const MIN_LENGTH_RATIO = 20;
const MAX_LENGTH_RATIO = 200;
const DEFAULT_THICKNESS = 5;
const MIN_THICKNESS = 0;
const MAX_THICKNESS = 8;
const DEFAULT_DEPTH = 18;
const MIN_DEPTH = 5;
const MAX_DEPTH = 80;

export class Arrow extends UIEXComponent {
	static propTypes = ArrowPropTypes;
	static displayName = 'Arrow';
	static propsToCheck = ['size', 'direction', 'color', 'lengthRatio', 'thickness', 'clipped', 'figured', 'figuredDepth'];

	addClassNames(add) {
		add('pointer', !!this.props.onClick);
	}

	getCustomProps() {
		return {
			onClick: this.handleClick
		}
	}

	renderInternal() {
		const TagName = this.getTagName();
		return (
			<TagName className={this.getClassName('outer', this.getOuterClassName())}>
				<div {...this.getProps()}/>
			</TagName>
		)
	}

	getOuterClassName() {
		const classNames = [];
		const {direction, float} = this.props;
		if (float && (float === 'left' || float === 'right')) {
			classNames.push(`uiex-float-${float}`);
		}
		if (direction) {
			switch (direction) {
				case 'up-left':
				case 'up-right':
				case 'down-left':
				case 'down-right':
					classNames.push('uiex-direction-' + direction);
				
			}
		}
		return classNames.join(' ');
	}

	getCustomStyle() {
		let {size, color, lengthRatio, thickness, clipped, figured, figuredDepth} = this.props;
		const direction = this.getDirection();

		size = getNumericProp(size, DEFAULT_SIZE, MIN_SIZE, MAX_SIZE);
		lengthRatio = getNumericProp(lengthRatio, DEFAULT_LENGTH_RATIO, MIN_LENGTH_RATIO, MAX_LENGTH_RATIO);
		thickness = getNumericProp(thickness, DEFAULT_THICKNESS, MIN_THICKNESS, MAX_THICKNESS);
		figuredDepth = getNumericProp(figuredDepth, DEFAULT_DEPTH, MIN_DEPTH, MAX_DEPTH);

		let sideSize = size * lengthRatio / 100;			
		let width = size;
		let height = Math.round(sideSize);
		switch (direction) {
			case 'down':
				width = size;
			break;
			
			case 'up-left':
			case 'up-right':
			case 'down-left':
			case 'down-right':
			case 'left':
			case 'right':
				width = height;	
				height = size;					
			break;
		}
		const style = {
			width,
			height,
			clipPath: 'polygon(' + this.getClipPath(direction, clipped, figured, thickness, figuredDepth) + ')'
		};
		if (color) {
			style.backgroundColor = color;
		}
		return style;
	}

	handleClick = (e) => {
		const {value, disabled} = this.props;
		if (!disabled) {
			e.stopPropagation();
			this.fire('click', value);
		} else {
			e.stopPropagation();
			this.fire('disabledClick', value);
		}
	}

	getWidthProp() {
		return null;
	}

	getHeightProp() {
		return null;
	}

	getDirection() {
		let {direction} = this.props;
		if (!direction || typeof direction != 'string') {
			direction = DEFAULT_DIRECTION;
		}
		return direction;
	}

	getClipPath(direction, clipped, figured, thickness, figuredDepth) {
		thickness = thickness * 5;
		const thickness2 = 100 - thickness;
		const thickness3 = thickness * 2;
		const figuredDepth2 = 100 - figuredDepth;

		switch (direction) {
			case 'up':
				if (!clipped) {
					if (figured) {
						return '50% 0, 0 100%, 50% ' + figuredDepth2 + '%, 100% 100%';	
					}
					return '50% 0, 0 100%, 100% 100%';
				} else {
					return '50% 0, 0 100%, ' + thickness + '% 100%, 50% ' + thickness3 + '%, ' + thickness2 + '% 100%, 100% 100%';
				}
			
			case 'down':
				if (!clipped) {
					if (figured) {
						return '0 0, 50% 100%, 100% 0, 50% ' + figuredDepth + '%';	
					}
					return '0 0, 50% 100%, 100% 0';
				} else {
					return '0 0, 50% 100%, 100% 0, ' + thickness2 + '% 0, 50% ' + (100 - thickness3) + '%, ' + thickness + '% 0';
				}

			case 'left':
			case 'up-left':
			case 'down-left':
				if (!clipped) {
					if (figured) {
						return '100% 0, 0 50%, 100% 100%, ' + figuredDepth2 + '% 50%';	
					}
					return '100% 0, 0 50%, 100% 100%';
				} else {
					return '100% 0, 0 50%, 100% 100%, 100% ' + thickness2 + '%, ' + thickness3 + '% 50%, 100% '+ thickness + '%';
				}

			case 'right':
			case 'up-right':
			case 'down-right':
				if (!clipped) {
					if (figured) {
						return '0 0, 100% 50%, 0 100%, ' + figuredDepth + '% 50%';	
					}
					return '0 0, 100% 50%, 0 100%';
				} else {
					return '0 0, 100% 50%, 0 100%, 0 ' + thickness2 + '%, ' + (100 -thickness3) + '% 50%, 0 ' + thickness + '%';
				}			
		}
	}
}