import React from 'react';
import {ButtonGroup} from '../ButtonGroup';
import {FormButtonsPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export class FormButtons extends ButtonGroup {
	static propTypes = FormButtonsPropTypes;
	static properChildren = ['Button'];
	static properParentClasses = ['Form'];
	static displayName = 'FormButtons';
	static additionalClassName = 'form-buttons';
}
