import React from 'react';
import {isNumber, isFunction} from '../utils';
import {Cell} from '../CellGroup';
import {FormControlPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export class FormControl extends Cell {
	static propTypes = FormControlPropTypes;
	static className = 'form-control';
	static properParentClasses = ['Form', 'FormSection', 'FormControlGroup'];
	static properChildrenSign = 'isControl';
	static properChildrenMaxCount = 1;
	static displayName = 'FormControl';

	componentDidMount() {
		const {arrayIndex, registerControl} = this.props;
		if (isFunction(registerControl)) {
			registerControl(this.name, arrayIndex);
		}
	}

	addChildProps(child, props) {
		const {
			valueGetter,
			initialValueGetter,
			arrayIndex,
			unregisterControl
		} = this.props;
		const {value, name, onChange} = child.props;
		if (this.name && this.name !== name && isFunction(unregisterControl)) {
			unregisterControl(this.name, arrayIndex);
		}
		this.name = name;
		const valueFromData = isFunction(valueGetter) ? valueGetter(name, arrayIndex) : undefined;
		props.value = valueFromData === undefined ? value : valueFromData;
		if (typeof onChange != 'function') {
			props.onChange = this.handleChange;
		}
	}

	renderInternal() {
		const {caption} = this.props;
		const TagName = this.getTagName();
		return (
			<TagName {...this.getProps()}>
				{caption &&
					<div className="uiex-form-control-caption">
						{caption}
					</div>
				}
				<div className="uiex-form-control-content">
					{this.renderChildren()}
				</div>
			</TagName>
		)
	}

	handleChange = (value, name) => {
		const {initialValueGetter, arrayIndex} = this.props;
		this.fire('change', name, value, arrayIndex);
		if (isFunction(initialValueGetter)) {
			let initialValue = initialValueGetter(name, arrayIndex);
			initialValue = initialValue === null || initialValue === undefined ? '' : initialValue;
			this.fire('dataChange', name, initialValue !== value, arrayIndex);
		}
	}
}