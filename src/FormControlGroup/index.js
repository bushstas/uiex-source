import React from 'react';
import {CellGroup} from '../CellGroup';
import {addToClassName, isFunction} from '../utils';
import {FormControlGroupPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export class FormControlGroup extends CellGroup {
	static propTypes = FormControlGroupPropTypes;
	static properChildren = ['FormControl', ];
	static properParentClasses = ['Form', 'FormSection'];
	static className = 'form-control-group';
	static additionalClassName = 'cell-group';
	static onlyProperChildren = true;
	static defaultColumns = 1;
	static defaultCellMargin = 12;
	static defaultCellSize = 1;
	static displayName = 'FormControlGroup';
 
	addChildProps(child, props, idx) {
		super.addChildProps(child, props, idx);
		const {onChange, className} = child.props;
		props.registerControl = this.props.registerControl;
		props.valueGetter = this.props.valueGetter;
		props.initialValueGetter = this.props.initialValueGetter;
		props.className = addToClassName(className, props.className);
		props.className = addToClassName('uiex-cell', props.className);
		props.arrayIndex = this.props.arrayIndex;
		if (!isFunction(onChange)) {
			props.onChange = this.props.onChange;
		}
		props.onDataChange = this.props.onDataChange;
	}
}