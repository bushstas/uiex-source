import React from 'react';
import {Input} from '../Input';
import {Arrow} from '../Arrow';
import {getNumberOrNull, replace, isString, isNumber, isFunction} from '../utils';
import {InputNumberPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const PROPS_LIST = ['positive', 'negative', 'decimal', 'toFixed', 'minValue', 'maxValue', 'valueWithMeasure'];
const ADD_STEP = 1;
	
export class InputNumber extends Input {
	static propTypes = InputNumberPropTypes;
	static className = 'input';
	static isControl = true;
	static displayName = 'InputNumber';

	constructor(props) {
		super(props);
		this.propsList = PROPS_LIST;
	}

	addClassNames(add) {
		const {measure, withoutControls} = this.props;
		super.addClassNames(add);
		add('number-input');
		add('with-measure', measure && isString(measure));
		add('without-controls', withoutControls);
	}

	renderAdditionalInnerContent() {
		let value = this.getProp('value');
		let {disabled, withoutControls, positive, negative, readOnly} = this.props;
		const content = [];
		const data = this.getMeasure();
		if (data) {
			const [measure, isMultiple] = data;
			let className = 'uiex-input-measure';
			className += isMultiple ? ' uiex-multi-measure' : '';
			content.push(
				<div 
					key="measure"
					className={className}
					onClick={isMultiple ? this.handleMeasureClick : null}
				>
					{measure}
				</div>
			);
		}
		if (!withoutControls && !readOnly) {
			if (value == '0') {
				value = '';
			}
			const upDisabled = disabled || (negative && !value);
			const downDisabled = disabled || (positive && !value);
			content.push(
				<div 
					key="controls"
					className={this.getClassName('controls')}
				>
					<Arrow 
						size="14"
						direction="up" 
						disabled={upDisabled}
						onClick={this.handleUpClick}
					/>
					<Arrow 
						size="14"
						direction="down" 
						disabled={downDisabled}
						onClick={this.handleDownClick}
					/>
				</div>
			);
		}
		return content.length > 0 ? content : null;
	}

	getMeasure() {
		const {measure, measures, disabled} = this.props;
		if (!measure) {
			return;
		}
		if (!measures || !(measures instanceof Array)) {
			return [measure, false];
		}
		return [measure, !disabled];
	}

	getProperIncomingValue(value) {
		return this.getProperValue(value, true);
	}

	filterValue(value) {
		value = super.filterValue(value);
		if (value) {
			let {valueWithMeasure, measure, correctionOnBlur} = this.props;
			value = this.getProperValue(value, true);
			if (!correctionOnBlur || this.useAutoCorrection) {
				value = this.correctValue(value);
				this.useAutoCorrection = false;
			}
			if (valueWithMeasure && measure && isString(measure)) {
				value += measure;
			}
		}
		return value;
	}

	correctValue(value) {
		if (!isNumber(value)) {
			return value;
		}
		let {maxValue, minValue} = this.props;
		if (isString(maxValue)) {
			maxValue = getNumberOrNull(maxValue);
		}
		if (isString(minValue)) {
			minValue = getNumberOrNull(minValue);
		}
		if (isNumber(maxValue)) {
			value = Math.min(maxValue, value);
		}
		if (isNumber(minValue)) {
			value = Math.max(minValue, value);
		}
		return value;
	}

	handleMeasureClick = () => {
		const {measures, name, disabled} = this.props;
		const i = measures.indexOf(this.props.measure);
		let measure;
		if (!disabled) {
			let idx = 0;
			measure = measures[idx];
			if (i >= 0 && measures[i + 1]) {
				measure = measures[i + 1];
				idx = i + 1;
			}
			if (measure) {
				this.firePropChange('changeMeasure', 'measure', [measure, idx, name], measure);
			}
		}
	}

	getCustomInputProps() {
		return {
			onWheel: this.handleWheel
		}
	}

	keyUpHandler(e) {
		super.keyUpHandler(e);
		const {key} = e;
		if (key == 'ArrowUp') {
			this.useAutoCorrection = true;
			this.changeValue(1);	
		} else if (key == 'ArrowDown') {
			this.useAutoCorrection = true;
			this.changeValue(-1);
		}
	}

	handleWheel = (e) => {
		this.useAutoCorrection = true;
		e.preventDefault();
		this.changeValue(e.deltaY > 0 ? -1 : 1);
	}

	changeValue(add) {
		let value = this.getProp('value');
		let {disabled, negative, positive, decimal, addStep} = this.props;
		if (!disabled) {
			addStep = getNumberOrNull(addStep) || ADD_STEP;
			value = this.getProperValue(value);
			if (negative && positive) {
				positive = false;
			}
			const intValue = value > 0 ? Math.floor(value) : Math.ceil(value);			
			let dec = 0;
			let toFixed = 0;
			if (decimal) {
				dec = value.toString().split('.')[1];
				if (dec != null) {
					toFixed = dec.length;
				}
			}
			value = intValue + addStep * add;
			if ((negative && value > 0) || (positive && value < 0)) {
				value = 0;
			} else if (dec) {
				value = Number(value.toString() + '.' + dec).toFixed(toFixed);
			}
			this.fireChange(value);
		}
	}
	
	blurHandler() {
		super.blurHandler();
		let value = this.getProp('value');
		let {correctionOnBlur} = this.props;
		const oldValue = value;
		value = this.getProperValue(value);
		let isChanged = value !== oldValue;
		if (value && correctionOnBlur) {
			const correctedValue = this.correctValue(value);
			if (correctedValue != value) {
				isChanged = true;
				value = correctedValue;
			}
		}
		if (isChanged) {
			this.fireChange(value);
		}
	}

	getProperValue(value, canBeString = false) {
		if ((!value && value !== 0) || (!isNumber(value) && !isString(value))) {
			return '';
		}
		let {negative, positive, decimal} = this.props;
		if (negative && positive) {
			positive = false;
		}
		if (isNumber(value)) {
			value = String(value);
		}
		if (canBeString && value === '-0') {
			return '-';
		}
		value = value.trim();
		const withMinus = negative || (!positive && value.charAt(0) == '-');
		let dec = null;
		let decLength = 0;
		if (decimal) {
			value = replace(/,/, '.', value);
			const parts = value.split('.');
			if (parts[1]) {
				dec = replace(/[^\d]/g, '', parts[1]);
				if (!canBeString || (dec && !(/0$/).test(dec))) {
					const numDec = Number(dec.replace(/0+$/, ''));
					decLength = numDec.toString().length;
					dec = numDec / Math.pow(10, decLength);
				}
			} else if (canBeString && parts[1] === '') {
				dec = '';
			}
			dec = this.getProperDecimal(dec);
			value = parts[0];
		}
		value = replace(/[^\d]/g, '', value);
		const numValue = Number(value);
		if (String(numValue) == value || !canBeString) {
			value = numValue;
		}
		if (withMinus) {		
			if (isNumber(value)) {
				value *= -1;
			} else {
				value = '-' + value;
			}
			if (dec && isNumber(dec)) {
				dec *= -1;
			}
		}
		if (dec != null) {
			if (isNumber(dec) && isString(value)) {
				value += '.' + dec.toString().split('.')[1];
			} else if (isString(dec)) {
				value += '.' + dec;
			} else {
				value = (value + dec).toFixed(decLength);
			}
		}
		if (isString(value) && withMinus && value.charAt(0) != '-') {
			value = '-' + value;
		}
		return isNumber(value) || isString(value) ? value : '';
	}

	getProperDecimal(dec) {
		if (dec) {
			let {toFixed} = this.props;
			if (toFixed === 0 || toFixed === '0') {
				toFixed = 1;
			} else if (isString(toFixed)) {
				toFixed = getNumberOrNull(toFixed);
			}
			if (isNumber(toFixed)) {
				if (isNumber(dec)) {
					dec = dec.toString();
					const parts = dec.split('.');
					if (parts[1] != null) {
						dec = parts[1];
					}
					return Number('0.' + dec.substring(0, toFixed));
				}
				return dec.substring(0, toFixed);
			}
		}
		return dec;
	}

	handleUpClick = () => {
		this.changeValue(1);
	}

	handleDownClick = () => {
		this.changeValue(-1);
	}
}