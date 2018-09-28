import React from 'react';

export const mapChildren = (children, renderChild) => {
	const ch = [];
	for (let i = 0; i < children.length; i++) {
		const child = renderChild(children[i], i, children);
		if (child instanceof Array) {
			let child2 = mapChildren(child, renderChild);
			if (child2) {
				ch.push(child2);	
			}
		} else if (child) {
			ch.push(child);	
		}
	}
	return ch.length == 0 ? null : ch;
}

export const addToClassName = (classNameToAdd, className = undefined) => {
	if (classNameToAdd && typeof classNameToAdd == 'string') {
		if (!className || typeof className != 'string') {
			return classNameToAdd;
		}
		className += ' ' + classNameToAdd;
	}
	return className;
}

export const removeClass = (element, cn) => {
	if (element instanceof Element) {
		let {className} = element;
		if (typeof className == 'string') {
			const regexp = new RegExp(regexEscape(cn));
			className = replace(regexp, '', className);
			element.className = className.trim();
		}
	} else if (typeof element == 'string') {
		const classNames = element.split(' ');
		const idx = classNames.indexOf(cn);
		if (idx > -1) {
			classNames.splice(idx, 1);
			if (classNames.length == 0) {
				return;
			}
			return classNames.join(' ');
		}
		return element;
	}
}

export const addClass = (element, cn) => {
	if (element instanceof Element) {
		if (!element.className) {
			element.className = cn;
		} else {
			const classes = element.className.split(' ');
			if (classes.indexOf(cn) == -1) {
				classes.push(cn);
				element.className = classes.join(' ');
			}
		}
	}
}

export const toggleClass = (element, cn, isAdd) => {
	if (isAdd) {
		addClass(element, cn);
	} else {
		removeClass(element, cn);
	}
}

export const isValidNumericStyle = (v) => {
	if (typeof v == 'number') {
		return true;
	}
	if (typeof v == 'string' && (/^\d/).test(v.chartAt(0))) {
		return true;
	}
	return false;
}

export const isValidAndNotEmptyNumericStyle = (v) => {
	return !!v && v !== '0' && v !== '0px' && v !== '0%' && isValidNumericStyle(v);
}

export const getNumber = (n, d = 0) => {
	if (typeof n == 'string' && n == Number(n)) {
		n = Number(n);
	}
	if (typeof n == 'number') {
		return n;
	}
	if (typeof d == 'number') {
		return d;
	}
	return 0;
}

export const getNumberOrNull = (n, d = null) => {
	if (n !== '' && typeof n == 'string' && n == Number(n)) {
		n = Number(n);
	}
	if (typeof n == 'number') {
		return n;
	}
	return d;
}

export const getNumberInPxOrPercent = (n) => {
	if (typeof n == 'string' || typeof n == 'number') {
		const i = getNumberOrNull(n);
		if (!i) {
			return n;
		}
		return i + 'px';
	}
	return '';
}

export const regexEscape = (str) => {
	return replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&', str);
}

export const showImproperChildError = (child, parent) => {
	let childType = 'text';
	if (React.isValidElement(child)) {
		childType = 'element';
		if (typeof child.type == 'function') {
			child = child.type.name;
		} else {
			child = child.type;
		}			
	}
	let expectedChildren = parent.getExpectedChildren();
	const expected = typeof expectedChildren == 'string' ? 'The only expected child' : 'Expected children';
	if (expectedChildren instanceof Array) {
		expectedChildren = expectedChildren.join(', ');
	}
	console.error('Improper ' + childType + ' child "' + child + '" in ' + parent.constructor.name + '. ' + expected + ': ' + expectedChildren);
}

export const showProperChildMaxCountError  = (child, parent) => {
	let expectedChildren = parent.getExpectedChildren();
	if (expectedChildren instanceof Array) {
		expectedChildren = expectedChildren.join(', ');
	}
	const maxCount = parent.getProperChildMaxCount();
	console.error('Component ' + parent.constructor.name + ' can have only ' + maxCount + ' child of type ' + expectedChildren);
}

export const getClassNameBuilder = (cn = '', cn2 = '') => {
	if (cn2 && typeof cn2 == 'string') {
		cn += ' ' + cn2;
	}
	const add = function(c) {
		if ((arguments.length > 1 ? !!arguments[1] : true) && c && typeof c == 'string') {
			cn += ' uiex-' + c;
		}
	};
	const get = () => {
		return cn;
	};
	return {add, get};
}

export const getComponentClassName = (component) => {	
	const {
		className,
		disabled,
		active,
		block,
		float,
		color,
		align,
		valign,
		hidden,
		onClick
	} = component.props;

	const {add, get} = getClassNameBuilder(component.getNativeClassName(), className);
	component.addClassNames(add);
	add('disabled', disabled);
	add('active', active);
	add('block', block);
	add('hidden', hidden);
	if (color) {
		add('colored');
		if (onClick) {
			add('color-hover');
		}
		add('color-' + color);
	}
	if (component.isAlignable()) {
		add('align-' + align, align);
		add('valign-' + valign, valign);
	}
	add('float-' + float, float);
	return get();
}

export const getProperStyleProperty = (value) => {
	if (value && typeof value != 'undefined') {
		if (typeof value == 'number') {
			value += 'px';
		}
		if (typeof value == 'string') {
			if (value == Number(value)) {
				value += 'px';
			}
			return value;
		}
	}
}

export const addStyleProperty = (value, name, style = null) => {
	value = getProperStyleProperty(value);
	if (value) {
		style = style || {};
		style[name] = value;
	}
	return style
}

export const mergeObjects = (obj1, obj2) => {
	if (obj1 && obj1 instanceof Object) {
		if (!(obj2 instanceof Object)) {
			obj2 = {};
		}
		for (let k in obj1) {
			obj2[k] = obj1[k];
		}
	}
	return obj2;
}

export const getTransitionDuration = (speed, size, animation) => {
	if (animation == 'fade') {
		size = 0;
	} else {
		if (!size) {
			size = 100;
		}
		size = Math.min(10, Math.round(size / 150)) - 1;
		size = Math.max(size, 0);
	}
	switch (speed) {
		case 'fast':
			return [1, 1, 2, 2, 3, 3, 4, 4, 5, 5][size];
		break;
		
		case 'slow':
			return [6, 6, 7, 7, 8, 8, 9, 9, 10, 10][size];
		break;

		default:
			return [3, 3, 4, 4, 5, 5, 6, 6, 7, 7][size];
	}
}

export const inPercent = (value) => {
	return typeof value == 'string' && (/%$/).test(value);
}

export const getSizeInPercentageOfWindow = (value, attr) => {
	if (typeof value == 'string') {
		value = Number(replace(/%$/, '', value));
	}
	if (typeof value == 'number') {
		return Math.round((attr == 'width' ? window.innerWidth : window.innerHeight) * value / 100);
	}
	return 0;
}

export const propsChanged = (p1, p2, list) => {
	const io1 = p1 instanceof Object;
	const io2 = p2 instanceof Object;
	if ((io1 && !io2) || (!io1 && io2)) {
		return true;
	}
	if (list instanceof Array && io1 && io2) {
		for (let i = 0; i < list.length; i++) {
			const k = list[i];
			if (p1[k] != p2[k]) {
				return true;
			}
		}
	}
	return false;
}

export const getNumericProp = (value, defaultValue = null, minValue = null, maxValue = null) => {
	value = getNumberOrNull(value);
	if (!value) {
		return defaultValue;
	}
	return Math.min(Math.max(value, minValue), maxValue);
}

export const cacheProps = (props, list) => {
	if (list instanceof Array && props instanceof Object) {
		const cachedProps = {};
		for (let i = 0; i < list.length; i++) {
			cachedProps[list[i]] = props[list[i]];
		}
		return cachedProps;
	}
}

export const replace = (regexp, to, str) => {
	if (typeof str != 'string') {
		try {
			str = str.toString();
		} catch (e) {
			str = '';
		}
	}
	return str.replace(regexp, to);
}

export const modObject = (key, value, obj) => {
	if (!obj || !(obj instanceof Object)) {
		obj = {};
	}
	obj[key] = value;
	return obj;
}

export const secondsToTimeString = (value, options) => {
	let withHours = true;
	let hours = 0, minutes = 0, seconds = 0;
	if (value >= 3600) {
		hours = Math.floor(value / 3600);
		value = value - (hours * 3600);
	}
	if (value >= 60) {
		minutes = Math.floor(value / 60);
		value = value - (minutes * 60);
	}
	if (value > 0) {
		seconds = Math.floor(value);
	}
	if (options && options instanceof Object) {
		withHours = !!hours || !options.noEmptyHours;
	}
	let time = '';
	if (withHours) {
		time += getTimeNumber(hours) + ':';
	}
	return time + getTimeNumber(minutes) + ':' + getTimeNumber(seconds);
}

const getTimeNumber = (number) => {
	if (number > 9) {
		return number;
	}
	return '0' + number;
}

export const timeToNumberSeconds = (time) => {
	if (typeof time != 'string') {
		time = time || '';
		try {
			time = time.toString();
		} catch(e) {
			time = '';
		}
	}
	let parts = time.split(':');
	if (!parts[1]) {
		return 0;
	}
	let seconds = 0;
	parts = parts.reverse();
	if (parts[2] != null) {
		seconds += getNumber(parts[2]) * 3600;
	}
	seconds += getNumber(parts[1]) * 60;
	seconds += getNumber(parts[0]);
	return seconds;
}

class PopupQueue {
	constructor() {
		this.queues = {};
	}

	addObjectToQueue(name, object) {
		this.queues[name] = this.queues[name] || [];
		this.removeObjectFromQueue(name, object);
		this.queues[name].push(object);
	}

	removeObjectFromQueue(name, object) {
		if (this.queues[name] instanceof Array) {
			const index = this.queues[name].indexOf(object);
			if (index > -1) {
				this.queues[name].splice(index, 1);
			}
		}
	}

	isLastInQueue(name, object) {
		if (this.queues[name] instanceof Array) {
			const index = this.queues[name].indexOf(object);
			return index == this.queues[name].length - 1;
		}
		return true;
	}
}

export const popupQueue = new PopupQueue();

export const ucfirst = (str) => {
	const f = str.charAt(0).toUpperCase();
	return f + str.substr(1, str.length - 1);
}	