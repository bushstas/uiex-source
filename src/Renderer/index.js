import React from 'react';

const componentsMap = {};

export const addComponent = (name, component) => {
 	if (typeof component == 'function') {
		componentsMap[name] = component;
	}
}

export const addComponents = (...components) => {
	for (let i = 0; i < components.length; i++) {
		if (typeof components[i] == 'function' && components[i].displayName && typeof components[i].displayName == 'string') {
			addComponent(components[i].displayName, components[i]);
		}
	}
}

let currentKey = 0;
const getKey = () => {
	return currentKey++;
}

export class Renderer extends React.PureComponent {
	renderProperChild(child) {
		let  {type, props, handlers, children} = child;
		props = {...props};
		props.key = getKey();
		if (handlers instanceof Object) {
			for (let k in handlers) {
				if (typeof this.props[handlers[k]] == 'function') {
					props[k] = this.props[handlers[k]];
				}
			}
		}
		if (componentsMap[type]) {
			type = componentsMap[type];
			props.uncontrolled = true;
			props.renderedFromObject = child;
		}
		return React.createElement(type, props, this.renderChildren(children));
	}

	renderChild = (child) => {
		if (
			typeof child == 'string' ||
			typeof child == 'number' ||
			React.isValidElement(child)
		) {
			return child;
		}
		if (child instanceof Object && child.type) {
			return this.renderProperChild(child);
		}
		return null;
	}

	renderChildren(children) {
		if (children instanceof Array) {
			return children.map(this.renderChild);
		}
		return this.renderChild(children);
	}

	render() {
		return this.renderChildren(this.props.children);
	}
}