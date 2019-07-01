import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {ButtonGroup} from '../ButtonGroup';
import {Button} from '../Button';
import {getNumber, isObject, isString, isFunction, isArray, isNumber} from '../utils';
import {clone} from '../_utils/clone';
import {FormPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const DEFAULT_LINE_MARGIN = 15;
const DEFAULT_PROP_NAME = 'form';
const registeredForms = {};
const subscribers = {};

export const change = (name, data, value = null) => {
	if (isString(data)) {
		data = {[data]: value};
	}
	if ((isArray(registeredForms[name]) || isObject(registeredForms[name])) && isObject(data)) {
		if (isArray(registeredForms[name])) {
			registeredForms[name].forEach((form) => {
				if (isObject(form)) {
					form.change(data);
				}
			});
		} else {
			registeredForms[name].change(data);
		}
	}
}

export const reset = (name) => {
	if (isArray(registeredForms[name]) || isObject(registeredForms[name])) {
		if (isArray(registeredForms[name])) {
			registeredForms[name].forEach((form) => {
				if (isObject(form)) {
					form.reset();
				}
			});
		} else {
			registeredForms[name].reset();
		}
	}
}

export const clear = (name) => {
	if (isArray(registeredForms[name]) || isObject(registeredForms[name])) {
		if (isArray(registeredForms[name])) {
			registeredForms[name].forEach((form) => {
				if (isObject(form)) {
					form.clear();
				}
			});
		} else {
			registeredForms[name].clear();
		}
	}
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
	static properChildren = ['FormControl', 'FormControlGroup', 'Checkbox'];
	static styleNames = ['caption', 'buttons'];
	static displayName = 'Form';

	constructor(props) {
		super(props);
		this.state = {
			name: props.name,
			initialData: clone(props.initialData || props.data)
		};
		if (props.name && isString(props.name)) {
			registerForm(props.name, this);
		}
	}

	componentWillUnmount() {
		unregisterForm(this.state.name, this);
	}

	getControlValue = (name) => {
		const data = this.getProp('data');
		return isObject(data) ? data[name] : undefined;
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
			case 'Checkbox':
				const valueGetter = this.getControlValue;
				const {value, name, onChange} = child.props;
				if (value === undefined && isFunction(valueGetter)) {
					props.value = valueGetter(name);			
				}
				if (typeof onChange != 'function') {
					props.onChange = this.handleChange;
				}
			break;

			case 'FormControl':
				props.valueGetter = this.getControlValue;
				if (typeof child.props.onChange != 'function') {
					props.onChange = this.handleChange;
				}
			break;

			case 'FormControlGroup':
				let {rowMargin = DEFAULT_LINE_MARGIN, columns, cellSize} = this.props;
				const {columnsTiny, columnsSmall, columnsMiddle, columnsLarger, columnsLarge, columnsHuge, columnsGigantic} = this.props;
				rowMargin = getNumber(rowMargin);
				props.valueGetter = this.getControlValue;
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
			break;
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

	change = (data) => {
		data = this.getData(data);
		this.firePropChange('change', null, [data], {data});
		notifySubscribers(data);
	}

	reset = () => {
		const data = this.state.initialData || {};
		this.firePropChange('change', null, [data], {data});
		this.firePropChange('reset', null, [data], {data});
		notifySubscribers(data);
	}

	clear = () => {
		const data = {};
		this.firePropChange('change', null, [data], {data});
		this.firePropChange('clear', null, [data], {data});
		notifySubscribers(data);
	}

	handleChange = (fieldName, value) => {
		const data = this.getData(fieldName, value);
		this.firePropChange('change', null, [data, fieldName, value], {data});
		notifySubscribers(this.state.name, data);
	}
}