import React, {Fragment} from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {addToClassName, isFunction, isObject, getNumber, isNumber, isArray} from '../utils';
import {clone} from '../_utils/clone';
import {FormSectionPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export class FormSection extends UIEXComponent {
	static propTypes = FormSectionPropTypes;
	static properChildren = ['FormControl', 'FormSection', 'CellGroupRow', 'FormControlGroup'];
	static properParentClasses = ['Form', 'FormSection'];
	static displayName = 'FormSection';

	registerControl = (name, type, arrayIndex) => {
		const {registerControl} = this.props;
		if (isFunction(registerControl)) {
			registerControl(
				`${this.props.name}${isNumber(arrayIndex) ? `[${arrayIndex}]` : ''}.${name}`,
				type,
				this.props.arrayIndex
			);
		}
	}

	unregisterControl = (name, type, arrayIndex) => {
		const {unregisterControl} = this.props;
		if (isFunction(unregisterControl)) {
			unregisterControl(
				`${this.props.name}${isNumber(arrayIndex) ? `[${arrayIndex}]` : ''}.${name}`,
				type,
				this.props.arrayIndex
			);
		}
	}

	getControlValue = (fieldName, index) => {
		const {valueGetter, name} = this.props;
		let value;
		if (isFunction(valueGetter)) {
			value = valueGetter(name);
		}
		if (isNumber(index)) {
			return isArray(value) && isObject(value[index]) ? value[index][fieldName] : undefined;
		}
		return isObject(value) ? value[fieldName] : undefined;
	}

	getControlInitialValue = (fieldName, index) => {
		const {initialValueGetter, name} = this.props;
		let value;
		if (isFunction(initialValueGetter)) {
			value = initialValueGetter(name);
		}
		if (isNumber(index)) {
			return isArray(value) && isObject(value[index]) ? value[index][fieldName] : undefined;
		}
		return isObject(value) ? value[fieldName] : undefined;
	}

	addStandartProps(child, props) {
		props.valueGetter = this.getControlValue;
		props.initialValueGetter = this.getControlInitialValue;
		props.arrayIndex = this.currentIndex;
		props.onChangeValidity = this.props.onChangeValidity;
		props.validating = this.props.validating;
		props.errorsShown = this.props.errorsShown;
		props.requiredError = this.props.requiredError;
		props.lengthError = this.props.lengthError;
		props.patternError = this.props.patternError;
		props.errorPosition = this.props.errorPosition;
		props.errorZIndex = this.props.errorZIndex;
		props.errorBgColor = this.props.errorBgColor;
		props.errorTextColor = this.props.errorTextColor;
		props.registerControl = this.registerControl;
		props.unregisterControl = this.unregisterControl;
		if (typeof child.props.onChange != 'function') {
			props.onChange = this.handleChange;
		}
		if (isFunction(this.props.onDataChange)) {
			props.onDataChange = this.handleDataChange;
		}		
	}

	addChildProps(child, props) {
		const {type: control} = child;
		switch (control.name) {
			case 'FormControl':
				this.addStandartProps(child, props);
			break;

			case 'FormSection':
			case 'FormControlGroup':
				let {rowMargin, columns, cellSize} = this.props;
				const {columnsTiny, columnsSmall, columnsMiddle, columnsLarger, columnsLarge, columnsHuge, columnsGigantic} = this.props;
				rowMargin = getNumber(rowMargin);
				if (rowMargin) {
					props.rowMargin = rowMargin;
				}
				if (columns && !child.props.columns) {
					props.columns = columns;
				}
				if (columnsTiny && !child.props.columnsTiny) {
					props.columnsTiny = columnsTiny;
				}
				if (columnsSmall && !child.props.columnsSmall) {
					props.columnsSmall = columnsSmall;
				}
				if (columnsMiddle && !child.props.columnsMiddle) {
					props.columnsMiddle = columnsMiddle;
				}
				if (columnsLarger && !child.props.columnsLarger) {
					props.columnsLarger = columnsLarger;
				}
				if (columnsLarge && !child.props.columnsLarge) {
					props.columnsLarge = columnsLarge;
				}
				if (columnsHuge && !child.props.columnsHuge) {
					props.columnsHuge = columnsHuge;
				}
				if (columnsGigantic && !child.props.columnsGigantic) {
					props.columnsGigantic = columnsGigantic;
				}
				if (cellSize && !child.props.cellSize) {
					props.cellSize = cellSize;
				}
				if (control.name == 'FormSection') {
					props.captionStyle = this.props.captionStyle;
					props.itemStyle = this.props.itemStyle;
				}
				this.addStandartProps(child, props);
			break;
		}
	}

	renderFieldArray() {
		const {valueGetter, name, minCount} = this.props; 
		let value;
		if (isFunction(valueGetter)) {
			value = valueGetter(name);
		}
		const countByDefault = getNumber(minCount, 1);
		const length = isArray(value) ? value.length : 0;
		const count = Math.max(length, countByDefault);
		const children = [];
		for (let i = 0; i < count; i++) {
			this.currentIndex = i;
			children.push(
				<div
					key={i}
					className="uiex-form-section-item"
					style={this.getStyle('item')}
				>
					{this.renderChildren()}
				</div>
			);
		}
		return children;
	}

	initRendering() {
		this.currentIndex = undefined;
	}

	renderInternal() {
		const {
			name,
			caption,
			fieldArray,
			...restProps
		} = this.props;
		return (
			<Fragment>
				{caption &&
					<div
						className="uiex-form-section-caption"
						style={this.getStyle('caption')}
					>
						{caption}
					</div>
				}
				{!fieldArray ? this.renderChildren() : this.renderFieldArray()}
			</Fragment>
		)
	}

	handleChange = (fieldName, fieldValue, arrayIndex) => {
		const {valueGetter, name} = this.props;
		let value;
		if (isFunction(valueGetter)) {
			value = valueGetter(name);
		}
		if (isNumber(arrayIndex)) {
			if (!isArray(value)) {
				value = [];
			}
			const diff = -(value.length - 1 - arrayIndex);
			for (let i = 0; i < diff; i++) {
				value.push({});	
			}				
				let item = value[arrayIndex];
			if (!isObject(item)) {
				item = {[fieldName]: fieldValue};
			} else {
				item = clone(item);
				item[fieldName] = fieldValue;
			}
			value[arrayIndex] = item;
		} else {
			if (!isObject(value)) {
				value = {[fieldName]: fieldValue};
			} else {
				value = clone(value);
				value[fieldName] = fieldValue;
			}
		}
		this.fire('change', name, value);
	}

	handleDataChange = (fieldName, isChanged, arrayIndex) => {
		this.fire(
			'dataChange',
			`${this.props.name}${isNumber(arrayIndex) ? `[${arrayIndex}]` : ''}.${fieldName}`, isChanged,
			this.props.arrayIndex
		);
	}
}
