import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {TimeScalePropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export class TimeScale extends UIEXComponent {
	static propTypes = TimeScalePropTypes;
	static className = 'time-scale';
	static displayName = 'TimeScale';

	addClassNames(add) {
	
	}

	getCustomProps() {
		return {
			onClick: this.handleClick
		}
	}

	renderInternal() {
		const {value} = this.props;
		const TagName = this.getTagName(); 
		return (
			<TagName {...this.getProps()}>				
				<div className={this.getClassName('track')} onClick={this.handleTrackClick}>
					<div className={this.getClassName('indicator-line')}/>
				</div>
			</TagName>
		)
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