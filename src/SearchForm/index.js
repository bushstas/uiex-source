import React from 'react';
import {withStateMaster} from '../state-master';
import {UIEXForm} from '../UIEXComponent';
import {Input} from '../Input';
import {Button} from '../Button';
import {SearchFormPropTypes} from './proptypes';
import {getNumberInPxOrPercent} from '../utils';

import '../style.scss';
import './style.scss';

const DEFAULT_ICON = 'search';
const PROPS_LIST = 'value';

class SearchFormComponent extends UIEXForm {
	static propTypes = SearchFormPropTypes;
	static className = 'search-form';
	static displayName = 'SearchForm';

	static getDerivedStateFromProps({addIfChanged}) {
		addIfChanged('value');
	}

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
					value={this.state.value}
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
		const {onChange} = this.props;

		if (typeof onChange == 'function') {
			onChange(value);
		}
		this.setState({value});
	}

	handleSubmit = (value) => {
		const {onSubmit} = this.props;
		if (typeof onSubmit == 'function') {
			onSubmit(this.state.value);
		}
	}

	handleFocus = () => {
		this.setState({focused: true});
		const {focusedWidth, onFocus} = this.props;
		if (focusedWidth) {
			clearTimeout(this.timeout);
			this.refs.main.style.width = getNumberInPxOrPercent(focusedWidth);
		}
		if (typeof onFocus == 'function') {
			onFocus();
		}
	}

	handleBlur = () => {
		setTimeout(() => this.setState({focused: false}), 100);
		const {focusedWidth, width, onBlur} = this.props;
		if (focusedWidth) {
			this.timeout = setTimeout(() => {			
				this.refs.main.style.width = getNumberInPxOrPercent(width);	
			}, 200);
		}		
		if (typeof onBlur == 'function') {
			onBlur();
		}
	}
}

export const SearchForm = withStateMaster(SearchFormComponent, PROPS_LIST, null, UIEXForm);