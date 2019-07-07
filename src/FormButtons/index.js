import React from 'react';
import {isString, isFunction} from '../utils';
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

	handleAction(action) {
		const {onAction} = this.props;
		if (isFunction(onAction)) {
			onAction(action);
		}
	}

	handleSubmit = () => {
		this.handleAction('submit');
	}

	handleReset = () => {
		this.handleAction('reset');
	}

	handleClear = () => {
		this.handleAction('clear');
	}

	handleView = () => {
		this.handleAction('view');
	}

	addChildProps(child, props) {
		super.addChildProps(child, props);
		const {role, onClick} = child.props;
		const {onAction} = this.props;
		if (role && isString(role) && isFunction(onAction) && !isFunction(onClick)) {
			switch (role) {
				case 'submit':
					props.onClick = this.handleSubmit;
				break;
				case 'reset':
					props.onClick = this.handleReset;
				break;
				case 'clear':
					props.onClick = this.handleClear;
				break;
				case 'view':
					props.onClick = this.handleView;
				break;
			}
		}
	}
}
