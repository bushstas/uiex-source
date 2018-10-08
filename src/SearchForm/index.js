import React from 'react';
import {UIEXForm} from '../UIEXComponent';
import {Input} from '../Input';
import {Button} from '../Button';
import {SearchFormPropTypes} from './proptypes';
import {getNumberInPxOrPercent} from '../utils';

import '../style.scss';
import './style.scss';

const DEFAULT_ICON = 'search';

export class SearchForm extends UIEXForm {
	static propTypes = SearchFormPropTypes;
	static className = 'search-form';
	static displayName = 'SearchForm';

	addClassNames(add) {
		super.addClassNames(add);
		const {focusedWidth, hiddenButton} = this.props;
		const {focused} = this.state;
		add('form-with-focused-width', focusedWidth);
		add('form-focused', focused);
		add('form-width-hidden-button', hiddenButton);
	}

	renderContent() {
		let {
			value,
			buttonColor,
			buttonWidth,
			buttonHeight,
			placeholder,
			icon,
			iconType,
			buttonTitle,
			disabled,
			hiddenButton,
			onDisabledClick
		} = this.props;

		if (!buttonTitle && !icon) {
			iconType = null
			icon = DEFAULT_ICON;
		}

		return (
			<div className={this.getClassName('controls')}>
				<Input
					value={value}
					className={this.getClassName('input')}
					placeholder={placeholder}
					disabled={disabled}
					onChange={this.handleChange}
					onEnter={this.handleSubmit}
					onFocus={this.handleFocus}
					onBlur={this.handleBlur}
					onDisabledClick={onDisabledClick}
				/>
				{(!hiddenButton || this.state.focused) &&
					<Button 
						icon={icon}
						iconType={iconType}
						className={this.getClassName('submit')}
						width={buttonWidth}
						height={buttonHeight}
						color={buttonColor}
						disabled={disabled}
						onClick={this.handleSubmit}
						onDisabledClick={onDisabledClick}
					>
						{buttonTitle}
					</Button>
				}
			</div>
		)
	}

	handleChange = (value) => {
		this.fire('change', value);
	}

	handleSubmit = () => {
		this.fire('submit', this.props.value);
	}

	handleFocus = () => {
		this.setState({focused: true});
		const {focusedWidth} = this.props;
		if (focusedWidth) {
			clearTimeout(this.timeout);
			this.refs.main.style.width = getNumberInPxOrPercent(focusedWidth);
		}
		this.fire('focus');
	}

	handleBlur = () => {
		setTimeout(() => this.setState({focused: false}), 100);
		const {focusedWidth, width} = this.props;
		if (focusedWidth) {
			this.timeout = setTimeout(() => {			
				this.refs.main.style.width = getNumberInPxOrPercent(width);	
			}, 200);
		}		
		this.fire('blur');
	}
}