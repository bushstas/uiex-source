import React from 'react';

const componentsMap = {};

export const addComponent = (name, component) => {
 	if (typeof component == 'function') {
		componentsMap[name] = component;
	}
}

export class Renderer extends React.PureComponent {
	renderProperChild(child) {
		let  {type, props, handlers, children} = child;
		props = props || {};
		props.key = Math.random();
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
		}
		return React.createElement(type, props, children);
	}

	renderChild = (child) => {
		if (React.isValidElement(child)) {
			return child;
		}
		if (child instanceof Object && child.type) {
			return this.renderProperChild(child);
		}
		return null;
	}

	render() {
		const {children} = this.props;
		if (children instanceof Array) {
			return children.map(this.renderChild);
		}
		return this.renderChild(children);
	}
}