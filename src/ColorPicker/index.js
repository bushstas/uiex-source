import React from 'react';
import {withStateMaster} from '../state-master';
import {UIEXComponent} from '../UIEXComponent';
import {InputColor} from '../InputColor';
import {InputNumber} from '../InputNumber';
import {Colors} from '../Colors';
import {ColorPickerPropTypes} from './proptypes';
import {getColor} from '../color';
import {replace} from '../utils';

import '../style.scss';
import './style.scss';

const DEFAULT_COLOR = 'FFFFFF';
const PROPS_LIST = ['value', 'hue'];

class ColorPickerComponent extends UIEXComponent {
	static propTypes = ColorPickerPropTypes;
	static className = 'color-picker';
	static displayName = 'ColorPicker';

	static defaultProps = {
		value: DEFAULT_COLOR
	}

	static getDerivedStateFromProps({nextProps, isChanged, add}) {
		if (isChanged('value')) {
			const colorState = this.getStateFromColor(getColor(nextProps.value));
			add(colorState);
			add('inputValue', nextProps.value);
		}
		if (isChanged('hue') && typeof nextProps.hue == 'number') {
			add('hue');
		}
	}

	componentDidMount() {
		this.update();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.value != this.props.value) {
			this.update();
		}
	}

	update = () => {
		const {satval, pointer, huePos} = this.refs;
		if (satval instanceof Element) {
			const {hue, s, v} = this.state;
			satval.style.backgroundColor = 'hsl(' + hue + ', 100%, 50%)';
			pointer.style.left = s * 100 + '%';
			pointer.style.top = -(v * 100) + 100 + '%';
			huePos.style.left = hue * 100 / 360 + '%';
		}
	}

	handleMouseDownOnSatval = (e) => {
		if (!this.props.disabled) { 
			this.handleChangeSatval(e, true);
			window.addEventListener('mousemove', this.handleChangeSatval);
			window.addEventListener('mouseup', this.handleMouseUpOnSatval);
		}
	}

	handleMouseUpOnSatval = (e) => {
		window.removeEventListener('mousemove', this.handleChangeSatval);
    	window.removeEventListener('mouseup', this.handleMouseUpOnSatval);
	}

	handleChangeSatval = (e) => {
		e.preventDefault();
		const {satval, pointer} = this.refs;
		const {pageXOffset, pageYOffset} = window;
		let {width, height, left, top} = satval.getBoundingClientRect();
		const x = typeof e.pageX === 'number' ? e.pageX : e.touches[0].pageX;
		const y = typeof e.pageY === 'number' ? e.pageY : e.touches[0].pageY;
		left = x - (left + pageXOffset);
		top = y - (top + pageYOffset);

		if (left < 0) {
		  left = 0;
		} else if (left > width) {
		  left = width;
		}
		if (top < 0) {
		  top = 0;
		} else if (top > height) {
		  top = height;
		}
		const hsv = {
			h: this.state.hue,
			s: left * 100 / width,
			v: -(top * 100 / height) + 100
		};
		pointer.style.left = hsv.s + '%';
		pointer.style.top = -hsv.v + 100 + '%';
		
		this.fireChange(getColor(hsv));
	}

	handleMouseDownOnHue = (e) => {
		if (!this.props.disabled) {  
			this.handleChangeHue(e, true);
			window.addEventListener('mousemove', this.handleChangeHue);
			window.addEventListener('mouseup', this.handleMouseUpOnHue);
		}
	}

	handleMouseUpOnHue = (e) => {
		window.removeEventListener('mousemove', this.handleChangeHue);
    	window.removeEventListener('mouseup', this.handleMouseUpOnHue);
	}

	handleChangeHue = (e) => {
		e.preventDefault();
		const {hueDiv, huePos, satval} = this.refs;
		const {pageXOffset, pageYOffset} = window;
		const width = hueDiv.clientWidth;
		const x = typeof e.pageX === 'number' ? e.pageX : e.touches[0].pageX;
		const y = typeof e.pageY === 'number' ? e.pageY : e.touches[0].pageY;
		let {left, top} = hueDiv.getBoundingClientRect();
		left = x - (left + pageXOffset);
		top = y - (top + pageYOffset);
		
		let h;
		if (left < 0) {
			h = 0;
		} else if (left > width) {
			h = 359;
		} else {
			const percent = left * 100 / width;
			h = 360 * percent / 100;
		}

		const {hue, sat: s, l, a} = this.state;
		if (hue !== h) {
			huePos.style.left = h * 100 / 360 + '%';
			satval.style.backgroundColor = 'hsl(' + h + ', 100%, 50%)';
			this.fireChange(getColor({h, s, l, a}));
			const {onChangeHue} = this.props;
			if (typeof onChangeHue == 'function') {
				onChangeHue(h);
			}
		}
	}

	getProperValue(value) {
		if (value && typeof value == 'string') {
			return replace(/^\#+/, '', value);
		}
	}

	addClassNames(add) {
		const {withoutInput, withoutRGB} = this.props;
		add('without-input', withoutInput);
		add('without-rgb', withoutRGB);
	}

	getCustomProps() {
		return {
			onClick: this.preventDefault,
			onMouseDown: this.preventDefault
		}
	}

	renderInternal() {
		const {presetColors, disabled} = this.props;
		const {inputValue, inputR, inputG, inputB, r, g, b} = this.state;
		const TagName = this.getTagName();
		return (
			<TagName {...this.getProps()}>
				<div className={this.getClassName('selector')}>
					<div ref="satval" className={this.getClassName('satval')} onMouseDown={this.handleMouseDownOnSatval}>
						<div className={this.getClassName('white')}/>
						<div className={this.getClassName('black')}/>
						<div ref="pointer" className={this.getClassName('pointer')}/>
					</div>
					<div ref="hueDiv" className={this.getClassName('hue')} onMouseDown={this.handleMouseDownOnHue}>
						<div ref="huePos" className={this.getClassName('huepos')}/>
					</div>
					<div className={this.getClassName('controls')}>
						<InputNumber
							value={inputR != null ? inputR : r}
							maxLength="3"
							maxValue="255"
							positive
							disabled={disabled}
							className={this.getClassName('rgb-input')}
							withoutControls
							onChange={this.handleRInputChange}
							onBlur={this.handleRInputBlur}
						/>
						<InputNumber
							value={inputG != null ? inputG : g}
							maxLength="3"
							maxValue="255"
							positive
							disabled={disabled}
							className={this.getClassName('rgb-input')}
							withoutControls
							onChange={this.handleGInputChange}
							onBlur={this.handleGInputBlur}
						/>
						<InputNumber
							value={inputB != null ? inputB : b}
							maxLength="3"
							maxValue="255"
							positive
							disabled={disabled}
							withoutControls
							className={this.getClassName('rgb-input')}
							onChange={this.handleBInputChange}
							onBlur={this.handleBInputBlur}
						/>
					</div>
					<InputColor
						value={inputValue}
						className={this.getClassName('input')}						
						onChange={this.handleInputChange}
						disabled={disabled}
						withoutPicker
						withoutHash
					/>
				</div>
				{presetColors instanceof Array && presetColors.length > 0 && 
					<Colors 
						disabled={disabled}
						colors={presetColors}
						onSelect={this.handleSelectPresetColor}
					/>
				}
			</TagName>
		)
	}

	handleInputChange = (value) => {
		this.setState({inputValue: value});
		this.fireChange(getColor(value), this.update, 'value');
	}

	handleRInputChange = (r) => {
		this.handleRGBChange('r', r);
	}

	handleGInputChange = (g) => {
		this.handleRGBChange('g', g);
	}

	handleBInputChange = (b) => {
		this.handleRGBChange('b', b);
	}

	handleRInputBlur = (r) => {
		this.handleRGBBlur('r', r);
	}

	handleGInputBlur = (g) => {
		this.handleRGBBlur('g', g);
	}

	handleBInputBlur = (b) => {
		this.handleRGBBlur('b', b);
	}

	handleRGBBlur = (color, value) => {
		if (value === '') {
			this.setState({['input' + color.toUpperCase()]: 0});
		}
	}

	handleRGBChange(key, value) {
		this.setState({['input' + key.toUpperCase()]: value});
		let {r, g, b} = this.state;
		if (key == 'r') {
			r = value;
		} else if (key == 'g') {
			g = value;
		} else {
			b = value;
		}
		this.fireChange(getColor({r, g, b}), this.update, 'rgb');
	}

	preventDefault = (e) => {
		e.preventDefault();
	}

	handleSelectPresetColor = (value) => {
		this.handleInputChange(value);
		const {onSelectPreset} = this.props;
		if (typeof onSelectPreset == 'function') {
			onSelectPreset(value);
		}
	}

	getStateFromColor(color) {
		const isInitial = !this.state.value;
		let hex = color.toHex();
		let value = color.getValue();
		let isValid = color.isValid();
		let state;
		const isInitialInvalid = !isValid && isInitial;
		if (isInitialInvalid) {
			hex = DEFAULT_COLOR;
			value = DEFAULT_COLOR;
			color = getColor(hex);
			isValid = true;
		}
		if (isValid) {
			const {h: hue, s: sat, l, a} = color.toHsl();
			const {r, g, b} = color.toRgb();
			const {h, s, v} = color.toHsv();			
			state = {hex, r, g, b, hue, sat, l, a, h, s, v, isValid};
			if (hue === 0 && !isInitial) {
				delete state.hue;
				delete state.h;
			}
		} else {			
			state = {};
		}
		if (typeof value == 'string') {
			state.value = value;
			if (!isValid || isInitialInvalid) {
				state.hex = value;
			}
		} else {
			state.value = hex;
		}
		if (value instanceof Object && value.l !== undefined) {
			state.hue = value.h;
			state.h = value.h;
		}
		return state;
	}

	fireChange = (color, callback = null, changeSource = null) => {
		const state = this.getStateFromColor(color);
		if (changeSource != 'rgb') {
			state.inputR = state.r;
			state.inputG = state.g;
			state.inputB = state.b;
		}
		if (changeSource != 'value') {
			state.inputValue = state.hex;
		}
		const originalValue = color.getValue();
		const {hex, r, g, b, h = 0, s, v, hue = 0, sat, l, isValid, value} = state;

		if (this.props.value.toUpperCase() != hex.toUpperCase()) {
			let data;
			if (isValid) {
				data = {
					hex,
					hash: '#' + hex,
					rgb: {r, g, b},
					hsv: {h, s, v},
					hsl: {h: hue, s: sat, l},
					strRgb: 'rgb(' + r + ', ' + g + ', ' + b + ')',
					strHsl: 'hsl(' + Math.round(hue) + ', ' + Math.round(sat * 100) + '%, ' + Math.round(l * 100) + '%)'
				}
			} else {
				data = {
					hex,
					hash: '#' + hex
				}
			}
			this.setState(state, () => {
				const {onChange} = this.props;
				if (typeof onChange == 'function') {
					onChange(value, data);
				}
				if (typeof callback == 'function') {
					callback();
				}
			});
		} else if (originalValue instanceof Object && originalValue.l !== undefined) {
			this.setState({h: originalValue.h, hue: originalValue.h});
		}
	}

	isAlignable() {
		return false;
	}
}

export const ColorPicker = withStateMaster(ColorPickerComponent, PROPS_LIST, null, UIEXComponent);