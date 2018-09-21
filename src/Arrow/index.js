import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {getNumberOrNull} from '../utils';
import {ArrowPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const DEFAULT_SIZE = 20;
const DEFAULT_DIRECTION = 'up';
const DEFAULT_LENGTH_RATIO = 50;
const MIN_LENGTH_RATIO = 20;
const MAX_LENGTH_RATIO = 200;
const DEFAULT_THICKNESS = 5;

export class Arrow extends UIEXComponent {
	static propTypes = ArrowPropTypes;
	static displayName = 'Arrow';

	addClassNames(add) {
		let {onClick, clipped} = this.props;
		const direction = this.getDirection();
		add('direction-' + direction);
		add('pointer', !!onClick);
		add('clipped', clipped);
	}

	getCustomProps() {
		return {
			onClick: this.handleClick
		}
	}

	renderInternal() {
		const TagName = this.getTagName();
		return (
			<div className={this.getClassName('outer', this.getOuterClassName())}>
				<TagName {...this.getProps()}/>
			</div>
		)
	}

	getOuterClassName() {
		const {direction} = this.props;
		switch (direction) {
			case 'up-left':
			case 'up-right':
			case 'down-left':
			case 'down-right':
				return 'uiex-direction-' + direction;
			
		}
	}

	isCustomStyleChanged() {
		const {size, direction, color, lengthRatio, thickness, clipped} = this.props;
		return (
			this.cachedSize !== size || 
			this.cachedDirection !== direction || 
			this.cachedColor !== color ||
			this.cachedLength !== lengthRatio ||
			this.cachedThickness !== thickness ||
			this.cachedClipped !== clipped
		)
	}

	getCustomStyle() {
		let {size, color, lengthRatio, thickness, clipped} = this.props;
		const direction = this.getDirection();

		this.cachedSize = size;
		this.cachedDirection = direction;
		this.cachedColor = color;
		this.cachedLength = lengthRatio;
		this.cachedThickness !== thickness;
		this.cachedClipped !== clipped;

		size = getNumberOrNull(size);
		lengthRatio = getNumberOrNull(lengthRatio);
		thickness = getNumberOrNull(thickness);

		if (!size) {
			size = DEFAULT_SIZE;
		}
		if (!thickness) {
			thickness = DEFAULT_THICKNESS;
		}
		if (!lengthRatio || typeof lengthRatio != 'number') {
			lengthRatio = DEFAULT_LENGTH_RATIO;
		} else if (lengthRatio < MIN_LENGTH_RATIO) {
			lengthRatio = MIN_LENGTH_RATIO;
		} else if (lengthRatio > MAX_LENGTH_RATIO) {
			lengthRatio = MAX_LENGTH_RATIO;
		}

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
		return {
			width,
			height,
			backgroundColor: color,
			clipPath: 'polygon(' + this.getClipPath(direction, clipped, thickness) + ')'
		};
	}

	handleClick = (e) => {
		const {onClick, value, disabled, onDisabledClick} = this.props;
		if (!disabled && typeof onClick == 'function') {
			e.stopPropagation();
			onClick(value);
		} else if (disabled && typeof onDisabledClick == 'function') {
			e.stopPropagation();
			onDisabledClick(value);
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

	getClipPath(direction, clipped, thickness) {
		thickness = thickness * 5;
		const thickness2 = 100 - thickness;
		const thickness3 = thickness * 2;

		switch (direction) {
			case 'up':
				if (!clipped) {
					return '50% 0, 0 100%, 100% 100%';
				} else {
					return '50% 0, 0 100%, ' + thickness + '% 100%, 50% ' + thickness3 + '%, ' + thickness2 + '% 100%, 100% 100%';
				}
			
			case 'down':
				if (!clipped) {
					return '0 0, 50% 100%, 100% 0';
				} else {
					return '0 0, 50% 100%, 100% 0, ' + thickness2 + '% 0, 50% ' + (100 - thickness3) + '%, ' + thickness + '% 0';
				}

			case 'left':
			case 'up-left':
			case 'down-left':
				if (!clipped) {
					return '100% 0, 0 50%, 100% 100%';
				} else {
					return '100% 0, 0 50%, 100% 100%, 100% ' + thickness2 + '%, ' + thickness3 + '% 50%, 100% '+ thickness + '%';
				}

			case 'right':
			case 'up-right':
			case 'down-right':
				if (!clipped) {
					return '0 0, 100% 50%, 0 100%';
				} else {
					return '0 0, 100% 50%, 0 100%, 0 ' + thickness2 + '%, ' + (100 -thickness3) + '% 50%, 0 ' + thickness + '%';
				}
			
		}
	}
}