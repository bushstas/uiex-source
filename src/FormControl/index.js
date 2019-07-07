import React from 'react';
import {isNumber, isFunction, isString} from '../utils';
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

	componentWillUnmount() {
		this.handleUnmount();
	}

	addChildProps(child, props) {
		const {
			valueGetter,
			initialValueGetter,
			arrayIndex,
			unregisterControl,
			validating
		} = this.props;
		const {value, name, onChange, minLength} = child.props;
		if (this.name && this.name !== name && isFunction(unregisterControl)) {
			unregisterControl(this.name, arrayIndex);
		}
		this.name = name;
		this.minLength = minLength;
		const valueFromData = isFunction(valueGetter) ? valueGetter(name, arrayIndex) : undefined;
		props.value = valueFromData === undefined ? value : valueFromData;
		if (typeof onChange != 'function') {
			props.onChange = this.handleChange;
		}
		props.valid = this.state.valid;
		props.noVisualValidation = !validating;
		props.onChangeValidity = this.handleValidate;
		props.onUnmount = this.handleUnmount;
		props.validating = true;
	}

	getErrorPlace() {
		const {placeError} = this.props;
		switch (placeError) {
			case 'above':
			case 'left':
			case 'right':
			case 'top':
			case 'bottom':
				return placeError;
			default:
				return 'under';
		}
	}

	renderInternal() {
		const {
			caption,
			requiredError,
			patternError,
			validating,
			errorsShown
		} = this.props;
		const {valid} = this.state;
		const TagName = this.getTagName();
		const error = validating && errorsShown && !valid ? this.getError() : null;
		const place = error ? this.getErrorPlace() : null;
		return (
			<TagName {...this.getProps()}>
				{caption &&
					<div className="uiex-form-control-caption">
						{caption}
						{place == 'above' && 
							<div className="uiex-form-control-error">
								{error}
							</div>
						}
					</div>
				}
				<div className="uiex-form-control-content">
					{this.renderChildren()}
					{place && place != 'under' && place != 'above' &&
						<div className={`uiex-form-control-error uiex-form-control-error-${place}`}>
							<div className="uiex-form-control-error-inner">
								{error}
							</div>
						</div>
					}
				</div>
				{place == 'under' &&
					<div className="uiex-form-control-error">
						{error}
					</div>
				}			
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

	renderError(error) {
		if (!error || !isString(error)) {
			return null;
		}
		return error.replace(/\{name\}/g, this.name)
					.replace(/\{length\}/g, this.minLength);
	}

	getError() {
		const {errorType} = this.state;
		switch (errorType) {
			case 'required':
				return this.renderError(this.props.requiredError);
			case 'length':
				return this.renderError(this.props.lengthError);
			case 'pattern':
				return this.renderError(this.props.patternError);
		}
		return null;
	}

	handleValidate = (valid, errorType) => {
		this.setState({valid, errorType});
		this.fire('changeValidity', this.name, valid);
	}

	handleUnmount = () => {
		if (this.state.valid === false) {
			this.fire('changeValidity', this.name, true);
		}
	}
}