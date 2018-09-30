import React from 'react';
import {Input} from '../Input';
import {ColorPicker} from '../ColorPicker';
import {Popup} from '../Popup';
import {Icon} from '../Icon';
import {replace} from '../utils';
import {getColor} from '../color';
import {InputColorPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export class InputColor extends Input {
	static propTypes = InputColorPropTypes;
	static className = 'color-input';
	static isControl = true;
	static displayName = 'InputColor';

	addClassNames(add) {
		super.addClassNames(add);
		const {pickerOnTop, fullWidthPicker} = this.props;
		const pickerShown = this.getPickerShown();
		add('input');
		add('full-with-picker', fullWidthPicker);
		add('picker-on-top', pickerOnTop);
		add('picker-shown', pickerShown);
	}

	getCustomInputProps() {
		return {maxLength: 6}
	}

	filterValue(value) {
		value = super.filterValue(value, this.props);
		const {withoutHash} = this.props;
		return value ? (withoutHash ? '' : '#') + replace(/[^abcdef\d]/gi, '', value) : '';
	}

	getValue() {
		const value = super.getValue();
		if (value && typeof value == 'string') {
			return replace(/^#+/, '', value).toUpperCase();
		}
		return '';
	}

	getColorStyle() {
		const {value, defaultValue} = this.props;
		let color = value || defaultValue;
		if (!this.cachedColorStyle || color != this.cachedColor) {
			this.cachedColor = color;
			color = getColor(replace(/^#+/, '', color));
			this.isValidColor = color.isValid();
			this.cachedColorStyle = {
				backgroundColor: '#' + color.toHex()
			}
		}
		return this.cachedColorStyle;
	}

	renderAdditionalContent() {
		const colorStyle = this.getColorStyle();
		const {withoutPicker, presetColors} = this.props;
		const pickerShown = this.getPickerShown();
		return (
			<div className={this.getClassName('functional')}>
				<div className={this.getClassName('left-side')}>
					{this.isValidColor ?
						<div className={this.getClassName('color')} style={colorStyle} onClick={this.handleColorClick}/> :
						<Icon name="block" onClick={this.handleColorClick}/>
					}
					<div className={this.getClassName('hash')}>
						#
					</div>
				</div>
				{!withoutPicker && 
					<Popup
						ref="popup"
						isOpen={pickerShown}
						onCollapse={this.handlePopupCollapse}
					>
						<ColorPicker 
							value={this.getValue()}
							presetColors={presetColors}
							hue={this.hue}
							withoutInput
							onChange={this.handlePickerChange}
							onChangeHue={this.handlePickerHueChange}
						/>
					</Popup>
				}
			</div>
		)		
	}

	handlePickerChange = (value, colorData) => {
		const {disabled, name, withoutHash} = this.props;
		if (!disabled) {
			this.hue = colorData.hsl instanceof Object ? colorData.hsl.h : null;
			this.fire('change', (withoutHash ? '' : '#') + value, name);
			this.fire('changePicker', (withoutHash ? '' : '#') + value, colorData, name);
		}
	}

	handlePickerHueChange = (hue) => {
		this.hue = hue;
	}

	handleColorClick = () => {
		const {disabled, readOnly} = this.props;
		if (!disabled && !readOnly) {
			this.refs.input.focus();
			this.refs.input.click();
		}
	}

	inputHandler() {
		const {name, disabled, readOnly} = this.props;
		if (!disabled && !readOnly) {
			const value = this.filterValue(this.refs.input.value, this.props);
			this.fire('input', value, name);
		}
		super.inputHandler();
	}

	clickHandler() {
		const {disabled, readOnly} = this.props;
		if (!disabled && !readOnly) {
			super.clickHandler();
			this.fireShowPicker(true);
		}
	}

	handlePopupCollapse = () => {
		this.fireShowPicker(false);
	}

	handleEnter() {
		this.handlePopupCollapse();
	}

	handleEscape() {
		this.handlePopupCollapse();
	}

	checkValidity(value, props = this.props) {
		const {required} = props;
		if (value || required) {
			this.fireChangeValidity(this.isValidColor, value);
		}
	}

	getPickerShown() {
		const {onShowPicker, pickerShown} = this.props;
		if (typeof onShowPicker == 'function') {
			return pickerShown;
		}
		return this.state.pickerShown;
	}

	fireShowPicker(pickerShown) {
		const {onShowPicker} = this.props;
		if (typeof onShowPicker == 'function') {
			return this.fire('showPicker', pickerShown);
		}
		this.setState({pickerShown});
	}
}
