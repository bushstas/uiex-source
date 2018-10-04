import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Input} from '../Input';
import {Icon} from '../Icon';
import {Modal} from '../Modal';
import {JsonPreview} from '../JsonPreview';
import {Radio} from '../Radio';
import {SelectObjectPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export class SelectObject extends UIEXComponent {
	static propTypes = SelectObjectPropTypes;
	static className = 'select';
	static additionalClassName = 'select-object';
	static properChildren = 'SelectObjectOption';
	static onlyProperChildren = true;
	static isControl = true;

	constructor(props) {
		super(props);		
		this.state = {
			focused: false,
			selectedItem: null
		};
	}

	addClassNames(add) {
		add('control');
		add('without-options', !this.hasOptions());
	}

	getCustomProps() {
		return {
			onClick: this.handleClick
		}
	}

	renderInternal() {
		const TagName = this.getTagName();
		return (
			<TagName {...this.getProps()}>
				{this.renderInput()}
				{this.renderArrowIcon()}
				{this.renderModal()}
			</TagName>
		)
	}

	getTitle() {
		let {value} = this.props;
		if (value == null) {
			return 'null';
		}
		if (typeof value == 'string' || typeof value == 'number') {
			return value;
		}
		if (typeof value == 'boolean' || value instanceof RegExp) {
			return value.toString();
		}
		if (value instanceof Promise) {
			return 'Promise';
		}
		if (value instanceof Array) {
			return 'Array (' + value.length + ')';
		}
		if (value instanceof Function) {
			return 'Function';
		}
		if (value instanceof RegExp) {
			return value.toString();
		}
		if (value instanceof Object) {
			return 'Object (' + Object.keys(value).length + ')';
		}
		
	}

	renderInput() {
		const {placeholder, disabled} = this.props;
		return (
			<Input 
				value={this.getTitle()}
				placeholder={placeholder}
				disabled={disabled}
				readOnly
			/>
		)
	}

	renderArrowIcon() {
		return (
			<div className="uiex-select-arrow-icon">
				<Icon 
					name="arrow_drop_down"
					disabled={this.props.disabled || !this.hasOptions()}
				/>
			</div>
		)	
	}

	renderModal() {
		return (
			<Modal 
				className="uiex-select-object-modal"
				width="800"
				header="Choose a value"
				isOpen={this.state.focused}
				onClose={this.handleModalClose}
			>
				{this.renderOptions()}
			</Modal>
		)
	}

	renderOptions() {		
		const {options, value, empty} = this.props;
		const items = [];
		if (empty) {
			items.push(
				<div key={null} className={'uiex-select-object-item' + (!value ? ' uiex-active' : '')}>
					<Radio 
						checked={value == null} 
						value={null} 
						onChange={this.handleRadioClick}
					>
						<JsonPreview 
							ref={'preview'}
							data={null} 
							onClick={this.handleItemClick}
						/>
					</Radio>
				</div>
			);
		}
		if (options instanceof Array) {
			for (let i = 0; i < options.length; i++) {
				let active;
				if (options[i] instanceof Object && options[i].jsonPreviewInfo) {
					active = options[i].value == value;
				} else {
					active = options[i] == value;
				}
				items.push(
					<div key={i} className={'uiex-select-object-item' + (active ? ' uiex-active' : '')}>
						<Radio 
							checked={active} 
							value={i} 
							onChange={this.handleRadioClick}
						>
							<JsonPreview 
								ref={'preview' + i}
								data={options[i]} 
								onClick={this.handleItemClick}
							/>
						</Radio>
					</div>
				);
			}
		}
		return items;
	}

	renderOption = (value, i) => {
		return (
			<SelectObjectOption key={i} value={value}/>
		)
	}

	handleClick = (e) => {
		e.stopPropagation();
		const {value, name, onFocus, onBlur, disabled, onDisabledClick} = this.props;
		const focused = !this.state.focused;
		if (!disabled) {
			this.setState({focused});
			if (focused && typeof onFocus == 'function') {
				onFocus(value, name);
			} else if (!focused && typeof onBlur == 'function') {
				onBlur(value, name);
			}
		} else if (typeof onDisabledClick == 'function') {
			onDisabledClick(name);
		}
	}

	handleModalClose = () => {
		this.setState({focused: false});
	}

	handleItemClick = (data) => {
		const {onChange, name} = this.props;
		if (typeof onChange == 'function') {
			onChange(data, name);
		}
		this.setState({focused: false});
	}

	handleRadioClick = (name, value) => {
		if (value == null) {
			value = '';
		}
		this.refs['preview' + value].refs.main.click();
	}

	hasOptions() {
		const {options} = this.props;
		return options instanceof Array & options.length > 0;
	}
}


export class SelectObjectOption extends UIEXComponent {
	
}