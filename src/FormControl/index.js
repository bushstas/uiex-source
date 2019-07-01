import React from 'react';
import {Cell} from '../CellGroup';
import {FormControlPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';
import { isFunction } from 'util';

export class FormControl extends Cell {
	static propTypes = FormControlPropTypes;
	static className = 'form-control';
	static properParentClasses = ['Form', 'FormControlGroup'];
	static properChildrenSign = 'isControl';
	static properChildrenMaxCount = 1;
	static displayName = 'FormControl';

	addChildProps(child, props) {
		const {valueGetter} = this.props;
		const {value, name, onChange} = child.props;
		const valueFromData = isFunction(valueGetter) ? valueGetter(name) : undefined;
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
		this.fire('change', name, value);
	}
}