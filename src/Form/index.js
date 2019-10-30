import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {ButtonGroup} from '../ButtonGroup';
import {Button} from '../Button';
import {getNumber, isObject, isString, isFunction, isArray, isNumber} from '../utils';
import {clone} from '../_utils/clone';
import {get} from '../_utils/get';
import {FormPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const DEFAULT_LINE_MARGIN = 15;
const DEFAULT_PROP_NAME = 'forms';
const registeredForms = {};
const subscribers = {};

export const isChanged = (name) => {
	if (isObject(registeredForms[name])) {
		return registeredForms[name].isChanged();
	}
	return undefined; 
}

export const getData = (name) => {
	if (isObject(registeredForms[name])) {
		return registeredForms[name].getProp('data');
	}
	return undefined;
}

export const getChangedFields = (name) => {
	if (isObject(registeredForms[name])) {
		return registeredForms[name].changedFields;
	}
	return undefined;
}

const doChangeAction = (action, name, data, value = null) => {
	if (isString(data)) {
		data = {[data]: value};
	}
	if (isObject(registeredForms[name]) && isObject(data)) {
		registeredForms[name][action](data);
	}
}

export const change = (name, data, value = null) => {
	doChangeAction('change', name, data, value);
}

export const alter = (name, data, value = null) => {
	doChangeAction('alter', name, data, value);
}

export const set = (name, data, value = null) => {
	doChangeAction('set', name, data, value);
}

export const replace = (name, data, value = null) => {
	doChangeAction('replace', name, data, value);
}

const doFormAction = (action, name) => {
	if (isObject(registeredForms[name])) {
		registeredForms[name][action]();
	}
}

export const reset = (name) => {
	doFormAction('reset', name);
}

export const clear = (name) => {
	doFormAction('clear', name);
}

export const fixate = (name) => {
	doFormAction('fixate', name);
}

export const subscribe = (name, component, propName) => {
	if (registeredForms[name] && isObject(component) && isFunction(component.setState)) {
		subscribers[name] = subscribers[name] || [];
		subscribers[name].push([component, propName]);
	}
};

export const unsubscribe = (name, component) => {
	if (isArray(subscribers[name])) {
		let index = null;
		for (let i = 0; i < subscribers[name].length; i++) {
			if (subscribers[name][i][0] == component) {
				index = i;
				break;
			}
		}
		if (isNumber(index)) {
			subscribers[name].splice(index, 1);
		}
	}
};

const registerForm = (name, form) => {
	if (!registeredForms[name]) {
		return registeredForms[name] = form;
	}
	console.error('Form with name "' + name + '" is already registered. You can\'t have more than one form with the same name');
};

const unregisterForm = (name) => {
	if (registeredForms[name]) {
		registeredForms[name] = null;
		delete registeredForms[name];
	}
};

const notifySubscribers = (name, data) => {
	if (isArray(subscribers[name])) {
		for (let i = 0; i < subscribers[name].length; i++) {
			let [component, propName] = subscribers[name][i];
			if (!isString(propName)) {
				propName = DEFAULT_PROP_NAME;
			}
			const parts = propName.split('.');
			if (parts[1]) {
				component.setState({[parts[0]]: {
					...component.state[parts[0]],
					[parts[1]]: data
				}});	
			} else {
				component.setState({[propName]: data});
			}
		}
	}
}

export const arrayLikeControls = ['Checkbox', 'CheckboxGroup'];

export class Form extends UIEXComponent {
	static propTypes = FormPropTypes;
	static properChildren = ['FormSection', 'FormControl', 'FormControlGroup', 'FormButtons'];
	static properChildrenSign = 'isControl';
	static forbiddenChildren = 'Form';
	static styleNames = ['caption', 'sectionCaption', 'buttons'];
	static displayName = 'Form';

	data = null;

	constructor(props) {
		super(props);
		this.state = {
			name: props.name,
			valid: undefined
		};
		this.initialData = props.initialData !== undefined ? props.initialData : props.data;
		if (props.name && isString(props.name)) {
			registerForm(props.name, this);
		}
		this.changedFields = [];
		this.invalidFields = [];
		this.registeredFields = [];
		this.checkboxes = new Map();
	}

	componentDidMount() {
		const {name} = this.state;
		notifySubscribers(name, clone(this.initialData));
	}

	componentDidUpdate(prevProps) {
		if (this.props.data != this.data) {
			this.initChangedFields(this.props.data);
		}
	}

	componentWillUnmount() {
		unregisterForm(this.state.name);
	}

	registerControl = (name, type) => {
		if (isFunction(type) && arrayLikeControls.includes(type.name)) {
			this.checkboxes.set(name, true);
		}
		if (this.registeredFields.indexOf(name) === -1) {
			this.registeredFields.push(name);
		}
	}

	unregisterControl = (name, type) => {
		if (isFunction(type) && arrayLikeControls.includes(type.name)) {
			this.checkboxes.delete(name);
		}
		const index = this.registeredFields.indexOf(name);
		if (index > -1) {
			this.registeredFields.splice(index, 1);
		}
	}

	getControlValue = (name) => {
		const data = this.getProp('data');
		return isObject(data) ? data[name] : undefined;
	}

	getControlInitialValue = (name) => {
		const {initialData} = this;
		return isObject(initialData) ? initialData[name] : undefined;
	}

	getData = (fieldName, value = null) => {
		const data = this.getProp('data');
		if (isObject(fieldName)) {
			return {...data, ...fieldName};
		}
		if (!isString(fieldName)) {
			return data;
		}		
		if (!isObject(data)) {
			return {[fieldName]: value};
		}
		return {...data, [fieldName]: value};
	}

	addStandartProps(child, props) {
		props.valueGetter = this.getControlValue;
		props.initialValueGetter = this.getControlInitialValue;
		props.onChangeValidity = this.handleChangeValidity;
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
				if (!rowMargin && rowMargin !== 0) {
					rowMargin = DEFAULT_LINE_MARGIN;
				}
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
					props.captionStyle = this.props.sectionCaptionStyle;
					props.itemStyle = this.props.sectionItemStyle;
				}
				this.addStandartProps(child, props);
			break;

			case 'FormButtons':
				props.onAction = this.handleAction;
			break;

			default:				
				if (control.isControl) {
					const valueGetter = this.getControlValue;
					const {value, name, onChange} = child.props;
					if (value === undefined && isFunction(valueGetter)) {
						props.value = valueGetter(name);
					}
					if (typeof onChange != 'function') {
						props.onChange = this.handleControlChange;
					}
				}
		}
	}

	renderInternal() {
		const {caption} = this.props;
		const TagName = this.getTagName();
		return (
			<TagName {...this.getProps()}>
				{caption &&
					<div
						className="uiex-form-caption"
						style={this.getStyle('caption')}
					>
						{caption}
					</div>
				}
				{this.renderChildren()}
				{this.renderButtons()}
			</TagName>
		)
	}

	renderButtons() {
		const {submit, clear} = this.props;
		if (submit || clear) {
			return (
				<ButtonGroup className="uiex-form-buttons">
					{submit && 
						<Button>
							{submit}
						</Button>
					}
					{clear && 
						<Button>
							{clear}
						</Button>
					}
				</ButtonGroup>
			)
		}
		return null;
	}

	initChangedFields(data) {
		const {onDataChange} = this.props;
		if (isFunction(onDataChange)) {
			const currentChanged = clone(this.changedFields);
			this.findChanges(data, currentChanged);
			if (currentChanged.toString() !== this.changedFields.toString()) {
				const changed = this.changedFields.length > 0;
				this.fire('dataChange', changed, this.changedFields);
			}
		}
	}

	findChanges(data, currentChanged) {
		this.changedFields.sort();		
		const {initialData} = this;
		this.changedFields = [];
		this.registeredFields.forEach(name => {
			let value = get(data, name);
			let initialValue = get(initialData, name);
			if (this.checkboxes.has(name) && isArray(value) && isArray(initialValue)) {
				const v = [...value];
				const iv = [...initialValue];
				v.sort();
				iv.sort();
				if (v.join() !== iv.join()) {
					this.changedFields.push(name);
				}
			} else {
				if (!value && value !== 0 && value !== false) {
					value = '';
				}
				if (!initialValue && initialValue !== 0 && initialValue !== false) {
					initialValue = '';
				}
				if (value !== initialValue) {
					this.changedFields.push(name);
				}
			}
		});
		this.changedFields.sort();
	}

	fireChange = (data, fieldName, value) => {
		this.data = data;
		this.firePropChange('change', null, [data, fieldName, value], {data});
		notifySubscribers(this.state.name, data);
	}

	isChanged = () => {
		const {onDataChange} = this.props;
		if (!isFunction(onDataChange)) {
			const currentChanged = clone(this.changedFields);
			this.findChanges(this.getProp('data'), currentChanged);
		}
		return this.changedFields.length > 0;
	}

	alter = (newData) => {
		const data = this.getData(newData);
		this.fireChange(data);
		const {initialData} = this;
		this.initialData = {
			...clone(initialData),
			...newData
		};
	}

	change = (data) => {
		data = this.getData(data);
		this.fireChange(data);
		this.initChangedFields(data);
	}

	set = (data) => {
		this.fireChange(data);
		this.initChangedFields(data);
	}

	replace = (data) => {
		this.fireChange(data);
		this.initialData = data;
		if (this.changedFields.length > 0) {
			this.fire('dataChange', false, []);
			this.changedFields = [];
		}
	}

	reset = () => {
		const data = this.initialData || {};
		this.fireChange(data);
		this.fire('reset', data);
		if (this.changedFields.length > 0) {
			this.fire('dataChange', false, []);
			this.changedFields = [];
		}
	}

	clear = () => {
		const data = {};
		this.fireChange(data);
		this.fire('clear');
		this.initChangedFields(data);
	}

	fixate = () => {
		this.changedFields = [];
		this.initialData = this.getProp('data');
		this.fire('dataChange', false, []);
	}

	handleControlChange = (value, fieldName) => {
		this.handleChange(fieldName, value);
	}

	handleChange = (fieldName, value) => {
		const data = this.getData(fieldName, value);
		this.fireChange(data, fieldName, value);
	}

	handleDataChange = (fieldName, isChanged) => {
		const {onDataChange} = this.props;
		if (isFunction(onDataChange)) {
			const idx = this.changedFields.indexOf(fieldName);
			let wasChanged = false;
			if (isChanged && idx == -1) {
				wasChanged = true;
				this.changedFields.push(fieldName);
			} else if (!isChanged && idx > -1) {
				wasChanged = true;
				this.changedFields.splice(idx, 1);
			}
			if (wasChanged) {
				const changed = this.changedFields.length > 0;
				this.fire('dataChange', changed, this.changedFields);
			}
		}
	}

	handleChangeValidity = (name, valid) => {
		const {valid: currentValid} = this.state;
		const idx = this.invalidFields.indexOf(name);
		const len = this.invalidFields.length;
		if (valid && idx > -1) {
			this.invalidFields.splice(idx, 1);
		} else if (!valid && idx === -1) {
			this.invalidFields.push(name);
		}
		const newLen = this.invalidFields.length;
		const newValid = this.invalidFields.length === 0;
		if (currentValid !== newValid || len !== newLen) {
			this.setState({valid: newValid});
			this.fire('changeValidity', newValid, this.invalidFields);
		}
	}

	handleAction = (action) => {
		switch (action) {
			case 'submit':
				const {valid} = this.state;
				const {onSubmitFail} = this.props;
				if (isFunction(onSubmitFail) && !valid) {
					this.fire('submitFail', this.invalidFields);
				} else {
					this.fire('submit', this.getProp('data'));
				}
			break;
			case 'reset':
				this.reset();
			break;
			case 'clear':
				this.clear();
			break;
			case 'view':
				alert('aaa')
			break;
		}
	}
}