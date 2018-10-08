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
		this.cachedClickHandlers = {};
	}

	addClassNames(add) {
		const {disabled} = this.props;
		const {focused} = this.state;
		add('control');
		add('without-options', !this.hasOptions());
		add('select-focused', focused && !disabled);
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
				<div 
					ref={'preview'}
					key={null} 
					className={'uiex-select-object-item' + (!value ? ' uiex-active' : '')}
					onClick={this.getItemClickHandler()}
				>
					<Radio 
						value={value == null} 
						name={null} 
						onChange={this.handleRadioClick}
					>
						<JsonPreview data={null} />
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
				if (options[i] == null) {
					continue;
				}
				items.push(
					<div 
						ref={'preview' + i}
						key={i} 
						className={'uiex-select-object-item' + (active ? ' uiex-active' : '')}
						onClick={this.getItemClickHandler(i, options[i])}
					>
						<Radio 
							value={active} 
							name={i} 
							onChange={this.handleRadioClick}
						>
							<JsonPreview data={options[i]} />
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
		const {value, name, disabled, readOnly} = this.props;
		if (readOnly) {
			return;
		}
		const focused = !this.state.focused;
		if (!disabled) {
			this.setState({focused});
			if (focused) {				
				this.fire('focus', value, name);
			} else {
				this.fire('blur', value, name);
			}
		} else {
			this.fire('disabledClick', name);
		}
	}

	handleModalClose = () => {
		this.setState({focused: false});
	}

	getItemClickHandler = (key = -1, data = null) => {
		if (!this.cachedClickHandlers[key]) {
			this.cachedClickHandlers[key] = this.handleItemClick.bind(this, data);
		}
		return this.cachedClickHandlers[key];
	}

	handleItemClick(data) {
		this.fire('change', data, this.props.name);
		this.setState({focused: false});
	}

	handleRadioClick = (value, name) => {
		if (name == null) {
			name = '';
		}
		this.refs['preview' + name].click();
	}

	hasOptions() {
		const {options} = this.props;
		return options instanceof Array & options.length > 0;
	}
}


export class SelectObjectOption extends UIEXComponent {
	
}