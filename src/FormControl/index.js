import React from 'react';
import {isNumber, isFunction, isString, isArray} from '../utils';
import {Cell} from '../CellGroup';
import {Hint} from '../Hint';
import {FormControlPropTypes} from './proptypes';
import {arrayLikeControls} from '../Form';

import '../style.scss';
import './style.scss';

const DEFAULT_Z_INDEX = 100;
const DEFAULT_REQUIRED_ERROR = 'Please fill out this field';
const DEFAULT_LENGTH_ERROR = 'Please enter {length} symbols';
const DEFAULT_PATTERN_ERROR = 'Please enter correct value';

export class FormControl extends Cell {
	static propTypes = FormControlPropTypes;
	static className = 'form-control';
	static properParentClasses = ['Form', 'FormSection', 'FormControlGroup'];
	static properChildrenSign = 'isControl';
	static properChildrenMaxCount = 1;
	static displayName = 'FormControl';

	constructor(props) {
		super(props);
		this.errorTarget = React.createRef();
	}

	componentDidMount() {
		const {arrayIndex, registerControl} = this.props;
		if (isFunction(registerControl)) {
			registerControl(this.name, this.type, arrayIndex);
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
			unregisterControl(this.name, this.type, arrayIndex);
		}
		this.name = name;
		this.type = child.type;
		this.minLength = minLength;
		const valueFromData = isFunction(valueGetter) ? valueGetter(name, arrayIndex) : undefined;
		props.value = valueFromData === undefined ? value : valueFromData;
		if (typeof onChange != 'function') {
			props.onChange = this.handleChange;
		}
		props.valid = this.state.valid;
		props.validate = this.props.validate;
		props.noVisualValidation = !validating;
		props.onChangeValidity = this.handleValidate;
		props.onUnmount = this.handleUnmount;
		props.validating = true;
	}

	getErrorPlace() {
		const {errorPosition} = this.props;
		switch (errorPosition) {
			case 'above':
			case 'left':
			case 'right':
			case 'top':
			case 'bottom':
				return errorPosition;
			default:
				return 'under';
		}
	}

	getPopupPosition(place) {
		switch (place) {
			case 'left':
				return 'left-center';

			case 'top':
				return 'top-right';

			case 'bottom':
				return 'bottom-right';

			default:
				return 'right-center';
		}
	}

	renderError(error) {
		const {errorTextColor} = this.props;
		return (
			<div
				className="uiex-form-control-error"
				style={this.getElementStyle('error', errorTextColor, color => ({color}))}
			>
				{error}
			</div>
		);
	}

	renderInternal() {
		const {
			caption,
			requiredError,
			patternError,
			validating,
			errorsShown,
			errorZIndex,
			errorBgColor,
			errorTextColor
		} = this.props;
		const {valid} = this.state;
		const TagName = this.getTagName();
		const error = validating && errorsShown && !valid ? this.getError() : null;
		const place = error ? this.getErrorPlace() : null;
		const zIndex = isNumber(errorZIndex) ? errorZIndex : DEFAULT_Z_INDEX;
		return (
			<TagName {...this.getProps()}>
				{caption &&
					<div className="uiex-form-control-caption">
						{caption}
						{place == 'above' && this.renderError(error)}
					</div>
				}
				<div className="uiex-form-control-content">
					{this.renderChildren()}
					{place && place != 'under' && place != 'above' &&
						<div
							className={`uiex-form-control-error uiex-form-control-error-${place}`}
							ref={this.errorTarget}
						>
							<Hint
								position={this.getPopupPosition(place)}
								target={this.errorTarget}
								zIndex={zIndex}
								color={errorBgColor}
								textColor={errorTextColor}
								withArrow
								isOpen
							>
								{error}
							</Hint>
						</div>
					}
				</div>
				{place == 'under' && this.renderError(error)}
			</TagName>
		)
	}

	handleChange = (value, name) => {
		const {initialValueGetter, arrayIndex} = this.props;
		this.fire('change', name, value, arrayIndex);
		if (isFunction(initialValueGetter)) {
			let initialValue = initialValueGetter(name, arrayIndex);
			if (
				isFunction(this.type) && arrayLikeControls.includes(this.type.name) &&
				isArray(value) && isArray(initialValue)
			) {
				const v = [...value];
				const iv = [...initialValue];
				v.sort();
				iv.sort();
				this.fire('dataChange', name, iv.join() !== v.join(), arrayIndex);
			} else {
				initialValue = initialValue === null || initialValue === undefined ? '' : initialValue;
				this.fire('dataChange', name, initialValue !== value, arrayIndex);
			}			
		}
	}

	getProperError(error) {
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
				return this.getProperError(this.props.requiredError || DEFAULT_REQUIRED_ERROR);
			case 'length':
				return this.getProperError(this.props.lengthError || DEFAULT_LENGTH_ERROR);
			case 'pattern':
				return this.getProperError(this.props.patternError || DEFAULT_PATTERN_ERROR);
		}
		return errorType;
	}

	handleValidate = (valid, errorType) => {
		this.setState({valid, errorType});
		this.fire('changeValidity', this.name, valid);
	}

	handleUnmount = () => {
		const {unregisterControl, arrayIndex} = this.props;
		if (isFunction(unregisterControl)) {
			unregisterControl(this.name, this.type, arrayIndex);
		}
		if (this.state.valid === false) {
			this.fire('changeValidity', this.name, true);
		}
	}
}