import React from 'react';
import {Input} from '../Input';
import {ColorPicker} from '../ColorPicker';
import {Popup} from '../Popup';
import {Icon} from '../Icon';
import {replace, isString} from '../utils';
import {getColor} from '../color';
import {InputColorPropTypes} from './proptypes';
import {COLOR_NAMES} from './colors';

import '../style.scss';
import './style.scss';

const PROPS_LIST = ['withoutHash'];
const REGEX = /[^abcdef\d]/gi;

export class InputColor extends Input {
	static propTypes = InputColorPropTypes;
	static className = 'color-input';
	static isControl = true;
	static displayName = 'InputColor';

	constructor(props) {
		super(props);
		this.propsList = PROPS_LIST;
	}

	addClassNames(add) {
		super.addClassNames(add);
		const {pickerOnTop, fullWidthPicker} = this.props;
		const pickerShown = this.getProp('pickerShown');
		add('input');
		add('full-with-picker', fullWidthPicker);
		add('picker-on-top', pickerOnTop);
		add('picker-shown', pickerShown);
	}

	getCustomInputProps() {
		return {maxLength: 6};
	}

	filterValue(value) {
		value = super.filterValue(value);
		const {withoutHash} = this.props;
		return value ? (withoutHash ? '' : '#') + replace(REGEX, '', value) : '';
	}

	getColorStyle() {
		let color = this.value;
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
		const pickerShown = this.getProp('pickerShown');
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
							value={this.value}
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
		const {disabled, name} = this.props;
		if (!disabled) {
			this.hue = colorData.hsl instanceof Object ? colorData.hsl.h : null;
			this.fireChange(value);
			this.fire('pick', this.getProperOutcomingValue(value), colorData, name);
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

	isValueValid(value) {
		const {required} = this.props;
		const valid = value || required ? this.isValidColor : null;
		return {valid, errorType: valid ? null : 'required'};
	}

	getProperIncomingValue(value) {
		if (value && isString(value)) {
			return replace(REGEX, '', value).toUpperCase();
		}
		return '';
	}

	parseInitialValue(initialValue) {
		if (COLOR_NAMES[initialValue]) {
			return COLOR_NAMES[initialValue];
		}
		return '';
	}

	fireShowPicker(pickerShown) {
		this.firePropChange('showPicker', 'pickerShown', [pickerShown, this.props.name], pickerShown);
	}
}
