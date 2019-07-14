import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {TimeScalePropTypes} from './proptypes';
import {getNumber, propsChanged, cacheProps, getNumberOrNull, secondsToTimeString, timeToNumberSeconds} from '../utils';

import '../style.scss';
import './style.scss';

const PROPS_LIST = ['borderRadius', 'clickAreaHeight', 'trackColor', 'indicatorColor'];

const wheelEventOptions = {
	capture: false,
	passive: false
};

export class TimeScale extends UIEXComponent {
	static propTypes = TimeScalePropTypes;
	static className = 'time-scale';
	static displayName = 'TimeScale';

	componentDidMount() {
		this.cacheValues();
		this.setIndicatorWidthFromValue();
		if (this.props.playing) {
			this.play();
		}
		this.refs.main.addEventListener('wheel', this.handleTrackWheel, wheelEventOptions);
	}

	componentDidUpdate(prevProps) {
		const {playing, value, startValue, endValue} = this.props;
		if (startValue != prevProps.startValue || endValue != prevProps.endValue) {
			this.cacheValues();
			this.cachedValue = null;
		}
		if (this.cachedValue == null || this.cachedValue != value) {			
			this.setIndicatorWidthFromValue();
			if (playing) {
				this.setStyleInterval();
				this.setChangeInterval();
			}
		}
		if (playing != prevProps.playing) {
			if (playing) {
				this.play();
			} else {
				this.stop();
			}
		}
	}

	componentWillUnmount() {
		this.refs.main.removeEventListener('wheel', this.handleTrackWheel, wheelEventOptions);
		this.stop();
	}

	getCustomProps() {
		return {
			onClick: this.handleTrackClick
		}
	}

	getStyles() {
		if (propsChanged(this.props, this.cachedProps, PROPS_LIST)) {
			this.cachedProps = cacheProps(this.props, PROPS_LIST);
			let {borderRadius, clickAreaHeight, trackColor, indicatorColor} = this.props;
			borderRadius = getNumberOrNull(borderRadius);
			clickAreaHeight = getNumberOrNull(clickAreaHeight);

			this.indicatorStyle = null;
			this.clickAreaStyle = null;
			this.trackStyle = null;

			if (borderRadius || trackColor) {
				this.trackStyle = {
					borderRadius,
					backgroundColor: trackColor
				};
			}
			if (indicatorColor) {
				this.indicatorStyle = {
					backgroundColor: indicatorColor
				};
			}
			if (clickAreaHeight) {
				this.clickAreaStyle = {
					height: clickAreaHeight,
					marginTop: -Math.round(clickAreaHeight / 2)
				};
			}
		}
		return {
			trackStyle: this.trackStyle,
			indicatorStyle: this.indicatorStyle,
			clickAreaStyle: this.clickAreaStyle
		}
	}

	renderInternal() {
		const {trackStyle, indicatorStyle, clickAreaStyle} = this.getStyles();
		const TagName = this.getTagName(); 
		return (
			<TagName {...this.getProps()}>
				<div className={this.getClassName('click-area')} style={clickAreaStyle}/>
				<div 
					className={this.getClassName('track')} 
					style={trackStyle}
				>
					<div 
						ref="indicator"
						className={this.getClassName('indicator-line')} 
						style={indicatorStyle}
					/>
				</div>
			</TagName>
		)
	}

	handleTrackClick = (e) => {
		const {onChange, disabled, onClickChange, onDisabledClick} = this.props;
		if (!disabled && typeof onChange == 'function') {
			e.stopPropagation();
			const {offsetX} = e.nativeEvent;
			const newValue = this.getValueFromPosition(offsetX);
			this.cachedValue = newValue;
			this.setIndicatorWidth(offsetX);
			const time = this.valueToTime(newValue);
			onChange(newValue, time);
			if (typeof onClickChange == 'function') {
				onClickChange(newValue, time);
			}
		} else if (disabled && typeof onDisabledClick == 'function') {
			onDisabledClick();
		}
	}

	handleTrackWheel = (e) => {
		const {onChange, disabled} = this.props;
		if (!disabled && typeof onChange == 'function') {
			e.stopPropagation();
			const {deltaY} = e;
			const value = this.getValue();
			const newValue = Math.floor(value) + (deltaY > 0 ? -1 : 1);
			const time = this.valueToTime(newValue);
			onChange(newValue, time);
		}
	}

	stop() {
		clearInterval(this.interval);
		clearInterval(this.styleInterval);
	}

	play() {
		const {onChange} = this.props;
		if (typeof onChange == 'function') {
			this.setStyleInterval();
			this.setChangeInterval();
		}
	}

	setChangeInterval() {
		clearInterval(this.interval);
		if (this.isValidCurrentValue()) {
			const {onChange, onEnd, onChangeStatus} = this.props;
			this.interval = setInterval(() => {
				const value = Math.floor(this.getValue() + 1);
				this.cachedValue = value;
				onChange(value, this.valueToTime(value));
				if (value >= this.cachedEndValue) {
					if (typeof onEnd == 'function') {
						this.cachedValue = null;
						onEnd();
					}
					if (typeof onChangeStatus == 'function') {
						onChangeStatus(false);
						this.stop();
					}
				}
			}, 1000);
		}
	}

	setStyleInterval() {
		clearInterval(this.styleInterval);
		if (this.isValidCurrentValue()) {			
			const value = this.getValue();
			const trackWidth = this.getTrackWidth();
			const delay = (this.cachedEndValue - value) * 1000 / (trackWidth - (this.indicatorWidth || 0));
			this.styleInterval = setInterval(() => {
				this.setIndicatorWidth((this.indicatorWidth || 0) + 1);
			}, delay);
		}
	}

	isValidCurrentValue() {
		return this.getValue() < this.cachedEndValue;
	}

	getIndicatorWidthFromValue() {
		const trackWidth = this.getTrackWidth();
		const value = this.getValue();
		if (value < this.cachedStartValue || !this.cachedEndValue) {
			return 0;
		}
		if (value > this.cachedEndValue) {
			return trackWidth;
		}
		const percentage = (value - this.cachedStartValue) * 100 / this.cachedValueDiff;
		return Math.round(percentage * trackWidth / 100);
	}

	getValueFromPosition(x) {
		const trackWidth = this.getTrackWidth();
		const percentage = x * 100 / trackWidth;
		return Number(((percentage * this.cachedValueDiff / 100) + this.cachedStartValue).toFixed(2));
	}

	getTrackWidth() {
		return this.refs.main.getBoundingClientRect().width
	}

	getValue () {
		let {value, time} = this.props;
		if ((value === '' || value == null) && time && typeof time == 'string') {
			const parts = time.split(':');
			if (parts[1]) {
				value = timeToNumberSeconds(time);
			} else {
				value = 0;
			}
		} else {
			value = Math.abs(getNumber(this.props.value));
		}
		return value >= this.cachedStartValue ? value : this.cachedStartValue;
	}

	cacheValues() {
		let {endValue, startValue} = this.props;
		startValue = Math.abs(getNumber(startValue));
		endValue = Math.abs(getNumber(endValue));
		if (endValue < startValue) {
			const temp = endValue;
			endValue = startValue;
			startValue = temp;
		}
		this.cachedStartValue = startValue;
		this.cachedEndValue = endValue;
		this.cachedValueDiff = endValue - startValue;
	}

	setIndicatorWidth(width) {
		this.indicatorWidth = width;
		this.refs.indicator.style.width = width + 'px';
	}

	valueToTime(value) {
		return secondsToTimeString(value, {noEmptyHours: true});
	}

	setIndicatorWidthFromValue() {	
		const indicatorWidth = this.getIndicatorWidthFromValue();
		this.setIndicatorWidth(indicatorWidth);
	}
}