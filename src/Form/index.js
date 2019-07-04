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
const DEFAULT_PROP_NAME = 'form';
const registeredForms = {};
const subscribers = {};

const doChangeAction = (action, name, data, value = null) => {
	if (isString(data)) {
		data = {[data]: value};
	}
	if ((isArray(registeredForms[name]) || isObject(registeredForms[name])) && isObject(data)) {
		if (isArray(registeredForms[name])) {
			registeredForms[name].forEach((form) => {
				if (isObject(form)) {
					form[action](data);
				}
			});
		} else {
			registeredForms[name][action](data);
		}
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
	if (isArray(registeredForms[name]) || isObject(registeredForms[name])) {
		if (isArray(registeredForms[name])) {
			registeredForms[name].forEach((form) => {
				if (isObject(form)) {
					form[action]();
				}
			});
		} else {
			registeredForms[name][action]();
		}
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
		registeredForms[name] = form;
	} else if (isArray(registeredForms[name])) {
		registeredForms[name].push(form);
	} else {
		registeredForms[name] = [registeredForms[name], form];
	}
};

const unregisterForm = (name, form) => {
	if (registeredForms[name]) {
		if (isArray(registeredForms[name])) {
			const index = registeredForms[name].indexOf(form);
			if (index > -1) {
				registeredForms[name].splice(index, 1);
			}
		} else {
			registeredForms[name] = null;
			delete registeredForms[name];
		}
	}
};

const notifySubscribers = (name, data) => {
	if (isArray(subscribers[name])) {
		for (let i = 0; i < subscribers[name].length; i++) {
			let [component, propName] = subscribers[name][i];
			if (!isString(propName)) {
				propName = DEFAULT_PROP_NAME;
			}
			component.setState({[propName]: data});
		}
	}
}

export class Form extends UIEXComponent {
	static propTypes = FormPropTypes;
	static properChildren = ['FormSection', 'FormControl', 'FormControlGroup'];
	static properChildrenSign = 'isControl';
	static forbiddenChildren = 'Form';
	static styleNames = ['caption', 'sectionCaption', 'buttons'];
	static displayName = 'Form';

	data = null;

	constructor(props) {
		super(props);
		this.state = {
			name: props.name,
			initialData: clone(props.initialData || props.data)
		};
		if (props.name && isString(props.name)) {
			registerForm(props.name, this);
		}
		this.changedFields = [];
		this.registeredFields = [];
	}

	componentDidMount() {
		const {name, initialData} = this.state;
		notifySubscribers(name, initialData);
	}

	componentDidUpdate(prevProps) {
		if (this.props.data != this.data) {
			this.initChangedFields(this.props.data);
		}
	}

	componentWillUnmount() {
		unregisterForm(this.state.name, this);
	}

	registerControl = (name) => {
		if (this.registeredFields.indexOf(name) === -1) {
			this.registeredFields.push(name);
		}
	}

	getControlValue = (name) => {
		const data = this.getProp('data');
		return isObject(data) ? data[name] : undefined;
	}

	getControlInitialValue = (name) => {
		const {initialData} = this.state;
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

	addChildProps(child, props) {
		const {type: control} = child;
		switch (control.name) {
			case 'FormControl':
				props.valueGetter = this.getControlValue;
				if (typeof child.props.onChange != 'function') {
					props.onChange = this.handleChange;
				}
			break;

			case 'FormSection':
			case 'FormControlGroup':
				let {rowMargin = DEFAULT_LINE_MARGIN, columns, cellSize} = this.props;
				const {columnsTiny, columnsSmall, columnsMiddle, columnsLarger, columnsLarge, columnsHuge, columnsGigantic} = this.props;
				rowMargin = getNumber(rowMargin);
				props.valueGetter = this.getControlValue;
				props.initialValueGetter = this.getControlInitialValue;
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
				if (typeof child.props.onChange != 'function') {
					props.onChange = this.handleChange;
				}
				props.onChangeData = this.handleChangeData;
				props.registerControl = this.registerControl;
				if (control.name == 'FormSection') {
					props.captionStyle = this.props.sectionCaptionStyle;
					props.itemStyle = this.props.sectionItemStyle;
				}
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
			const {initialData} = this.state;
			this.changedFields = [];
			this.registeredFields.forEach(name => {
				let value = get(data, name);
				let initialValue = get(initialData, name);

				if (!value && value !== 0 && value !== false) {
					value = '';
				}
				if (!initialValue && initialValue !== 0 && initialValue !== false) {
					initialValue = '';
				}
				if (value !== initialValue) {
					this.changedFields.push(name);
				}
			});
			const changed = this.changedFields.length > 0;
			this.firePropChange('dataChange', null, [changed, this.changedFields]);
		}
	}

	fireChange = (data, fieldName, value) => {
		this.data = data;
		this.firePropChange('change', null, [data, fieldName, value], {data});
		notifySubscribers(this.state.name, data);
	}

	alter = (newData) => {
		const data = this.getData(newData);
		this.fireChange(data);
		const {initialData} = this.state;
		this.setState({initialData: {
			...initialData,
			...newData
		}});
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
		this.setState({initialData: data});
		this.changedFields = [];
		this.firePropChange('dataChange', null, [false, []]);
	}

	reset = () => {
		const data = this.state.initialData || {};
		this.fireChange(data);
		this.firePropChange('reset', null, [data], {data});		
		this.firePropChange('dataChange', null, [false, []]);
		this.changedFields = [];
	}

	clear = () => {
		const data = {};
		this.fireChange(data);
		this.firePropChange('clear', null, [data], {data});
		this.initChangedFields(data);
	}

	fixate = () => {
		this.changedFields = [];
		const initialData = this.getProp('data');
		this.setState({initialData});
		this.firePropChange('dataChange', null, [false, []]);
	}

	handleControlChange = (value, fieldName) => {
		this.handleChange(fieldName, value);
	}

	handleChange = (fieldName, value) => {
		const data = this.getData(fieldName, value);
		this.fireChange(data, fieldName, value);
	}

	handleChangeData = (fieldName, isChanged) => {
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
				this.firePropChange('dataChange', null, [changed, this.changedFields]);
			}
		}
	}
}