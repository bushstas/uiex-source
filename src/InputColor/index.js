import React from 'react';
import {withStateMaster} from '../state-master';
import {Input} from '../Input';
import {ColorPicker} from '../ColorPicker';
import {Popup} from '../Popup';
import {Icon} from '../Icon';
import {replace} from '../utils';
import {getColor} from '../color';
import {InputColorPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const PROPS_LIST = ['pickerShown', 'value', 'defaultValue'];

class InputColorComponent extends Input {
	static propTypes = InputColorPropTypes;
	static className = 'color-input';
	static isControl = true;
	static displayName = 'InputColor';

	static getDerivedStateFromProps({add, isChanged, isChangedAny, nextProps}) {
		if (isChanged('pickerShown', false)) {
			add('pickerShown');
		}
		if (isChangedAny('value', 'defaultValue')) {
			const {value, defaultValue} = nextProps;
			const color = getColor(replace(/^#+/, '', value || defaultValue));
			const isValidColor = color.isValid();
			add('isValidColor', isValidColor);
			add('colorStyle', isValidColor ? {backgroundColor: '#' + color.toHex()} : null);
		}
	}

	addClassNames(add) {
		super.addClassNames(add);
		add('input');
		add('full-with-picker', this.props.fullWidthPicker);
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

	renderAdditionalContent() {
		let {pickerShown, isValidColor, colorStyle} = this.state;
		const {withoutPicker, presetColors, pickerShown: pickerAlwaysShown, pickerOnTop} = this.props;
		pickerShown = pickerShown || pickerAlwaysShown;
		return (
			<div className={this.getClassName('functional')}>
				<div className={this.getClassName('left-side')}>
					{isValidColor ?
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
						onTop={pickerOnTop}
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
		const {disabled, onChange, name, withoutHash, onChangePicker} = this.props;
		if (!disabled) {
			this.hue = colorData.hsl instanceof Object ? colorData.hsl.h : null;
			if (typeof onChange == 'function') {				
				onChange((withoutHash ? '' : '#') + value, name);
			}
			if (typeof onChangePicker == 'function') {
				onChangePicker((withoutHash ? '' : '#') + value, colorData, name);
			}
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
		const {name, disabled, readOnly, onInput} = this.props;
		if (!disabled && !readOnly && typeof onInput == 'function') {
			const value = this.filterValue(this.refs.input.value, this.props);
			onInput(value, name);
		}
		super.inputHandler();
	}

	clickHandler() {
		const {disabled, readOnly} = this.props;
		if (!disabled && !readOnly) {
			super.clickHandler();
			this.setState({pickerShown: true});
		}
	}

	handlePopupCollapse = () => {
		if (!this.props.pickerShown) {
			this.setState({pickerShown: false});
		}
	}

	handleEnter() {
		this.handlePopupCollapse();
	}

	handleEscape() {
		this.handlePopupCollapse();
	}

	checkValidity(value, props = this.props) {
		const {required} = props;
		const {isValidColor} = this.state;
		if (value || required) {
			this.fireChangeValidity(isValidColor, value);
		}
	}

	checkPosition() {
		
	}
}
export const InputColor = withStateMaster(InputColorComponent, PROPS_LIST, null, Input);
