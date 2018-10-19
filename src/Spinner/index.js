import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {getNumericProp} from '../utils';
import {SpinnerPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const PROPS_LIST = ['color', 'thickness'];
const DEFAULT_SIZE = 18;
const MIN_SIZE = 10;
const MAX_SIZE = 100;
const DEFAULT_THICKNESS = 3;
const MIN_THICKNESS = 1;
const MAX_THICKNESS = 40;

export class Spinner extends UIEXComponent {
	static propTypes = SpinnerPropTypes;
	static displayName = 'Spinner';
	static propsToCheck = ['size'];

	addClassNames(add) {
		
	}

	getCustomStyle() {
		const size = this.getSize();
		return {
			width: size,
			height: size
		};
	}

	getInnerStyle() {
		const {color} = this.props;
		const thickness = this.getThickness();
		if (this.isCachedPropsChanged(PROPS_LIST)) {
			this.cachedInnerStyle = {
				borderColor: color,
				borderWidth: thickness
			};
		}
		return this.cachedInnerStyle;
	}

	getSize() {
		return getNumericProp(this.props.size, DEFAULT_SIZE, MIN_SIZE, MAX_SIZE);
	}

	getThickness() {
		return getNumericProp(this.props.thickness, DEFAULT_THICKNESS, MIN_THICKNESS, MAX_THICKNESS);
	}

	renderInternal() {
		const {children} = this.props;
		const TagName = this.getTagName(); 
		return (
			<TagName {...this.getProps()}>
				<div 
					className={this.getClassName('inner')}
					style={this.getInnerStyle()}
				/>
			</TagName>
		)
	}
}