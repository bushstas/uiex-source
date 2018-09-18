import React from 'react';
import {withStateMaster} from '../state-master';
import {Input} from '../Input';
import {getNumberOrNull, replace, propsChanged} from '../utils';
import {InputNumberPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const PROPS_LIST = ['positive', 'negative', 'decimal', 'toFixed', 'minValue', 'maxValue', 'valueWithMeasure'];
const ADD_STEP = 1;

class InputNumberComponent extends Input {
	static propTypes = InputNumberPropTypes;
	static className = 'input';
	static isControl = true;
	static displayName = 'InputNumber';

	componentDidUpdate(prevProps) {
		let {onChange, name, value} = this.props;
		if (value && propsChanged(prevProps, this.props, PROPS_LIST)) {
			if (typeof onChange == 'function') {
				const newValue = this.filterValue(value, this.props);
				if (newValue != value) {
					onChange(newValue, name);
				}
			}
		}
	}

	addClassNames(add) {
		const {measure} = this.props;
		super.addClassNames(add);
		add('number-input');
		add('with-measure', measure && typeof measure == 'string');
	}

	renderAdditionalInnerContent() {
		const data = this.getMeasure();
		if (data) {
			const [measure, isMultiple] = data;
			let className = 'uiex-input-measure';
			className += isMultiple ? ' uiex-multi-measure' : '';
			return (
				<div 
					className={className}
					onClick={isMultiple ? this.handleMeasureClick : null}
				>
					{measure}
				</div>
			)
		}
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

	getValue() {
		const {decimal, positive} = this.props;
		let value = super.getValue();
		if (value && typeof value == 'string') {
			if (value === '-0') {
				value = '-';
			} else {
				let withMinus = false;
				if (!positive && value.charAt(0) == '-') {
					withMinus = true;
					value = replace(/^-/, '', value);
				}
				if (decimal) {
					const parts = value.split('.');
					if (typeof parts[1] == 'string') {
						value = Number(replace(/[^\d]/g, '', parts[0]));
						let dec = '';
						if (parts[1]) {
							dec = replace(/[^\d]/g, '', parts[1]);
						}						
						value += '.' + dec;
					} else {
						value = Number(replace(/[^\d]/g, '', value));
					}
					if (withMinus) {
						value = '-' + value;
					}
				}
			}
		}
		return value;
	}

	filterValue(value, props) {
		value = super.filterValue(value, props);
		if (value) {
			let {maxValue, minValue, positive, negative, decimal, toFixed, valueWithMeasure, measure, correctionOnBlur} = props;
			if (negative && positive) {
				positive = false;
			}
			if (toFixed === 0 || toFixed === '0') {
				toFixed = 1;
			} else if (typeof toFixed == 'string') {
				toFixed = getNumberOrNull(toFixed);
			}
			let isNegative = false;
			if (!positive) {
				isNegative = (/^-/).test(value);
			}
			if (decimal && value == '.') {
				value = '0' + value;
			}
			value = replace(/,/, '.', value);
			const parts = value.split('.');
			value = parts[0];
			value = replace(/[^\d]/g, '', value);
			if (value !== '') {
				value = Number(value);
			}
			if ((isNegative || negative) && value) {
				value *= -1;
			}
			if (!correctionOnBlur) {
				value = this.correctValue(value);
				if (typeof maxValue == 'number' && value == maxValue) {
					decimal = false;
				} else if (typeof minValue == 'number' && value == minValue) {
					decimal = false;
				}
			}
			if (decimal && typeof parts[1] == 'string') {
				if (parts[1]) {
					parts[1] = replace(/[^\d]/g, '', parts[1]);
				}
				if (typeof toFixed == 'number' && parts[1].length > toFixed) {
					parts[1] = parts[1].substring(0, toFixed);
				}
				value += '.' + parts[1];
				if (parts[1] && !/0+$/.test(parts[1])) {
					value = Number(value);
				}
				if (value > 0 && (negative || isNegative)) {
					if (typeof value == 'number') {
						value *= -1;
					} else {
						value = '-' + value;
					}
				}
			}
			if (!value && isNegative) {
				return '-0';
			}
			if (valueWithMeasure && measure && typeof measure == 'string') {
				value += measure;
			}
		}
		return value;
	}

	correctValue(value) {
		if (value === '') {
			return '';
		}
		let {maxValue, minValue} = this.props;
		if (typeof maxValue == 'string') {
			maxValue = getNumberOrNull(maxValue);
		}
		if (typeof minValue == 'string') {
			minValue = getNumberOrNull(minValue);
		}
		if (typeof maxValue == 'number') {
			value = Math.min(maxValue, value);
		}
		if (typeof minValue == 'number') {
			value = Math.max(minValue, value);
		}
		return value;
	}

	handleMeasureClick = () => {
		const {measures, onChangeMeasure, name, disabled} = this.props;
		const i = measures.indexOf(this.props.measure);
		let measure;
		if (!disabled && typeof onChangeMeasure == 'function') {
			let idx = 0;
			measure = measures[idx];
			if (i >= 0 && measures[i + 1]) {
				measure = measures[i + 1];
				idx = i + 1;
			}
			if (measure) {
				onChangeMeasure(measure, idx, name);
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
		const {negative} = this.props;
		const {key} = e;
		if (key == 'ArrowUp') {
			this.changeValue(negative ? -1 : 1);	
		} else if (key == 'ArrowDown') {
			this.changeValue(negative ? 1 : -1);
		}
	}

	handleWheel = (e) => {
		e.preventDefault();
		const {deltaY} = e;
		const {negative} = this.props;
		let add = deltaY > 0 ? -1 : 1;
		if (negative) {
			add = -add;
		}
		this.changeValue(add);
	}

	changeValue(add) {
		let {disabled, name, value, onChange, negative, positive, decimal, addStep} = this.props;
		addStep = getNumberOrNull(addStep) || ADD_STEP;
		if (!disabled && typeof onChange == 'function') {
			if (typeof value == 'number') {
				value = String(value);
			}
			if (typeof value != 'string') {
				value = '';
			}
			const parts = value.split('.');
			value = Number(parts[0]);
			if (add > 0) {
				if (!negative || value < 0) {
					value += addStep;
				} else {
					decimal = false;
				}
			} else {
				if (!positive || value > 0) {
					value -= addStep;
				} else {
					decimal = false;
				}
			}
			if (decimal && typeof parts[1] == 'string') {
				value += '.';
				if (parts[1] !== '') {
					value += parts[1];
				}
			}
			value = this.filterValue(String(value), this.props);
			onChange(value, name);
		}
	}
	
	blurHandler() {
		super.blurHandler();
		let isChanged = false;
		let {correctionOnBlur, value, onChange, name} = this.props;
		if (value && typeof value == 'string') {
			const parts = value.split('.');
			if (parts[1]) {
				let dec = replace(/[^\d]/g, '', parts[1]);
				if (dec === '0') {
					dec = '';
				} else {
					dec = replace(/0+$/g, '', dec);
				}
				parts[0] += '.' + dec;
			}
			value = Number(parts[0]);
			isChanged = true;
		}
		if (value && correctionOnBlur && typeof onChange == 'function') {
			const correctedValue = this.correctValue(value);
			if (correctedValue != value) {
				isChanged = true;
				value = correctedValue;
			}
		}
		if (isChanged) {
			onChange(value, name);
		}
	}
}

export const InputNumber = withStateMaster(InputNumberComponent, PROPS_LIST, null, Input);