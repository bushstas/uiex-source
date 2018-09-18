import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Draggable} from '../Draggable';
import {SliderScalePropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export class SliderScale extends UIEXComponent {
	static propTypes = SliderScalePropTypes;
	static className = 'slider-scale';
	static displayName = 'SliderScale';
	static isControl = true;

	addClassNames(add) {
	
	}

	getCustomProps() {
		return {
			onClick: this.handleClick
		}
	}

	renderInternal() {
		const {width, height} = this.props;
		const {x, y} = this.state;
		const TagName = this.getTagName(); 
		return (
			<TagName {...this.getProps()}>				
				<div className={this.getClassName('track')}>
					<div className={this.getClassName('track-inner')} onClick={this.handleTrackClick}>
						<Draggable 
							areaWidth={width}
							areaHeight={height}
							initialPositionX="center"
							x={x}
							y={y}
							className={this.getClassName('runner')}
							dragLimits="parent-in-out"
							horizontal
							onDrag={this.handleDrag}
						/>
					</div>
				</div>
				<div className={this.getClassName('numbers')}>
					1111
				</div>
			</TagName>
		)
	}

	handleDrag = (x, y) => {
		this.setState({x, y});
	}

	handleTrackClick = (e) => {
		const {onClick, value, disabled, onDisabledClick} = this.props;
		if (!disabled && typeof onClick == 'function') {
			e.stopPropagation();
			onClick(value);
		} else if (disabled && typeof onDisabledClick == 'function') {
			e.stopPropagation();
			onDisabledClick(value);
		}
	}
}