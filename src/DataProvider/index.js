import React from 'react';
import {isArray, isFunction, isString, isObject, isNumber} from '../utils';
import {clone} from '../_utils/clone';
import {subscribe as subscribeToForm, unsubscribe as unsubscribeFromForm} from '../Form';
import {DataProviderPropTypes} from './proptypes';

const DEFAULT_PROP_NAME = 'stores';

const stores = {};
const saves = {};
const initial = {};
const subscribers = {};

const getStores = (storeNames) => {
	if (!isArray(storeNames)) {
		storeNames = [storeNames];
	}
	const data = {};
	storeNames.forEach(name => {
		if (stores[name]) {
			data[name] = stores[name];
		}
	});
	return data;
};

const notifySubscribers = (name) => {
	if (isArray(subscribers[name])) {
		const data = stores[name];
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
};

export const createStore = (name, initialData = {}) => {
	if (name && isString(name)) {
		initial[name] = clone(initialData);
		stores[name] = clone(initialData);
	}
};

export const changeStore = (name, data) => {
	if (isObject(stores[name])) {
		stores[name] = {
			...clone(stores[name]),
			...clone(data)
		};
		notifySubscribers(name);
	} else {
		createStore(name, data);
	}
};

export const setStore = (name, data) => {
	if (isObject(stores[name])) {
		stores[name] = clone(data);
		notifySubscribers(name);
	} else {
		createStore(name, data);
	}
};

export const resetStore = (name) => {
	if (isObject(stores[name])) {
		stores[name] = clone(initial[name] || {});
		notifySubscribers(name);
	} else {
		createStore(name);	
	}
};

export const resetChangeStore = (name, data) => {
	const newData = {
		...clone(initial[name] || {}),
		...data
	};
	if (isObject(stores[name])) {
		stores[name] = newData;
		notifySubscribers(name);
	} else {
		createStore(name, newData);	
	}
};

export const clearStore = (name, data) => {
	if (isObject(stores[name])) {
		stores[name] = {};
		notifySubscribers(name);
	} else {
		createStore(name);
	}
};

export const fixateStore = (name) => {
	createStore(name, stores[name]);
};

export const saveStore = (name, saveName) => {
	saves[`${name}/${saveName}`] = stores[name];
};

export const loadStore = (name, saveName) => {
	if (saves[`${name}/${saveName}`] !== undefined) {
		setStore(name, saves[`${name}/${saveName}`]);
	}
};

const subscribeToStore = (name, component, propName) => {
	if (stores[name] === undefined) {
		createStore(name);
	}
	if (isObject(component) && isFunction(component.setState)) {
		subscribers[name] = subscribers[name] || [];
		subscribers[name].push([component, propName]);
	}
};

const unsubscribeFromStore = (name, component) => {
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

export class DataProvider extends React.PureComponent {
	static propTypes = DataProviderPropTypes;
	static displayName = 'DataProvider';

	constructor(props) {
		super(props);
		const {formName, storeName} = props;

		this.state = {
			forms: {},
			stores: getStores(storeName)
		};		
		
		if (formName) {
			if (isArray(formName)) {
				formName.forEach(
					name => this.subscribeToForm(name)
				);
			} else {
				this.subscribeToForm(formName);
			}
		}
		if (storeName) {
			if (isArray(storeName)) {
				storeName.forEach(
					name => this.subscribeToStore(name)
				);
			} else {
				this.subscribeToStore(storeName);
			}
		}
	}

	componentWillUnmount() {
		const {formName} = this.props;
		if (formName) {
			if (isArray(formName)) {
				formName.forEach(
					name => this.unsubscribeFromForm(name)
				);
			} else {
				this.unsubscribeFromForm(formName);
			}
		}
	}

	subscribeToForm(formName) {
		if (isString(formName)) {
			subscribeToForm(formName, this, `forms.${formName}`);
		}
	}

	subscribeToStore(storeName) {
		if (isString(storeName)) {
			subscribeToStore(storeName, this, `stores.${storeName}`);
		}
	}

	unsubscribeFromForm(formName) {
		if (isString(formName)) {
			unsubscribeFromForm(formName, this);
		}
	}

	unsubscribeFromStore(storeName) {
		if (isString(storeName)) {
			unsubscribeFromStore(storeName, this);
		}
	}

	render() {
		const {
			formName,
			storeName,
			component: Component,
			...restProps
		} = this.props;

		const {forms, stores} = this.state;
		if (isFunction(Component)) {
			return (
				<Component
					{...restProps}
					forms={formName ? forms : undefined}
					stores={storeName ? stores : undefined}
				/>
			);
		}
		return Component;
	}
}