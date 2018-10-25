import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {getNumericProp} from '../utils';
import {SpinnerPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const PROPS_LIST = ['color', 'thickness', 'speed'];
const DEFAULT_SIZE = 18;
const MIN_SIZE = 10;
const MAX_SIZE = 100;
const DEFAULT_THICKNESS = 3;
const MIN_THICKNESS = 1;
const MAX_THICKNESS = 40;
const DEFAULT_SPEED = 12;
const MIN_SPEED = 5;
const MAX_SPEED = 40;

export class Spinner extends UIEXComponent {
	static propTypes = SpinnerPropTypes;
	static displayName = 'Spinner';
	static propsToCheck = ['size'];

	addClassNames(add) {
		const {type} = this.props;
		add('spinner-' + type, type);
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
		const margin = thickness / -2;
		const speed = this.getSpeed();
		if (this.isCachedPropsChanged(PROPS_LIST)) {
			this.cachedParticleStyle = {
				backgroundColor: color,
				width: thickness,
				height: thickness,
				marginTop: margin,
				marginLeft: margin
			};
			this.cachedInnerStyle = {
				borderColor: color,
				borderWidth: thickness,
				animationDuration: speed
			};
		}
		return this.cachedInnerStyle;
	}

	getParticleStyle() {
		return this.cachedParticleStyle;
	}

	getSpeed() {
		return getNumericProp(this.props.speed, DEFAULT_SPEED, MIN_SPEED, MAX_SPEED) / 10 + 's';
	}

	getSize() {
		return getNumericProp(this.props.size, DEFAULT_SIZE, MIN_SIZE, MAX_SIZE);
	}

	getThickness() {
		return getNumericProp(this.props.thickness, DEFAULT_THICKNESS, MIN_THICKNESS, MAX_THICKNESS);
	}

	renderInnerContent() {
		const {type} = this.props;
		const style = this.getInnerStyle();
		switch (type) {
			case 'roller':
				const spanStyle = this.getParticleStyle();
				return [
					<div key="1" style={style}><span style={spanStyle}/></div>,
					<div key="2" style={style}><span style={spanStyle}/></div>,
					<div key="3" style={style}><span style={spanStyle}/></div>,
					<div key="4" style={style}><span style={spanStyle}/></div>,
					<div key="5" style={style}><span style={spanStyle}/></div>,
					<div key="6" style={style}><span style={spanStyle}/></div>,
					<div key="7" style={style}><span style={spanStyle}/></div>,
					<div key="8" style={style}><span style={spanStyle}/></div>
				];

			case 'ring':
				return [
					<div key="1" style={style}/>,
					<div key="2" style={style}/>,
					<div key="3" style={style}/>,
					<div key="4" style={style}/>
				];

			default:
				return (
					<div style={style}/>
				);
		}
	}

	renderInternal() {
		const {children} = this.props;
		const TagName = this.getTagName(); 
		return (
			<TagName {...this.getProps()}>
				{this.renderInnerContent()}				
			</TagName>
		)
	}
}