import React from 'react';
import {CellGroup} from '../CellGroup';
import {addToClassName, isFunction} from '../utils';
import {FormControlGroupPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export class FormControlGroup extends CellGroup {
	static propTypes = FormControlGroupPropTypes;
	static properChildren = 'FormControl';
	static className = 'form-control-group';
	static additionalClassName = 'cell-group';
	static onlyProperChildren = true;
	static defaultColumns = 10;
	static defaultCellMargin = 12;
	static defaultCellSize = 2;
	static displayName = 'FormControlGroup';

	addChildProps(child, props, idx) {
		super.addChildProps(child, props, idx);
		const {onChange, className} = child.props;
		props.valueGetter = this.props.valueGetter;
		props.className = addToClassName(className, props.className);
		props.className = addToClassName('uiex-cell', props.className);
		if (!isFunction(onChange)) {
			props.onChange = this.props.onChange;
		}
	}
}