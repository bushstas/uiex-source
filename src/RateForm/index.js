import React from 'react';
import {withStateMaster} from '../state-master';
import {UIEXForm} from '../UIEXComponent';
import {Icon} from '../Icon';
import {Button} from '../Button';
import {ButtonGroup} from '../ButtonGroup';
import {getNumberOrNull} from '../utils';
import {RateFormPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const DEFAULT_SCALE = 5;
const DEFAULT_MIN_SCALE = 3;
const DEFAULT_MAX_SCALE = 10;
const DEFAULT_ICON = 'star_border';
const DEFAULT_ACTIVE_ICON = 'star';

const PROPS_LIST = ['value', 'scale', 'normalColor', 'activeColor', 'hoverColor'];

class RateFormComponent extends UIEXForm {
	static propTypes = RateFormPropTypes;
	static className = 'rate-form';
	static displayName = 'RateForm';
	static defaultProps = {
		scale: DEFAULT_SCALE,
		icon: DEFAULT_ICON,
		activeIcon: DEFAULT_ACTIVE_ICON
	};

	static getDerivedStateFromProps({nextProps, isChanged, add}) {
		if (isChanged('scale')) {
			let {scale} = nextProps;
			scale = getNumberOrNull(scale) || DEFAULT_SCALE;
			scale = Math.max(DEFAULT_MIN_SCALE, scale);
			scale = Math.min(DEFAULT_MAX_SCALE, scale);
			add('scale', scale);
		}
		if (isChanged('value')) {
			const value = getNumberOrNull(nextProps.value);
			add('active', typeof value == 'number' && value > 0 ? value - 1 : null);
		}
		if (isChanged('normalColor')) {
			const {normalColor} = nextProps;
			if (normalColor && typeof normalColor == 'string') {
			 	add('normalStyle', {color: normalColor});
			}
		}
		if (isChanged('activeColor')) {
			const {activeColor} = nextProps;
			if (activeColor && typeof activeColor == 'string') {
			 	add('activeStyle', {color: activeColor});
			}
		}
		if (isChanged('hoverColor')) {
			const {hoverColor} = nextProps;
			if (hoverColor && typeof hoverColor == 'string') {
			 	add('hoverStyle', {color: hoverColor});
			}
		}
	}

	addClassNames(add) {
		super.addClassNames(add);
		const {submit, reset} = this.props;
		add('with-buttons', submit || reset);
	}

	getIcon(isActive) {
		let {icon, activeIcon} = this.props;
		if (!icon || typeof icon != 'string') {
			icon = DEFAULT_ICON;
		}
		if (!activeIcon || typeof activeIcon != 'string') {
			activeIcon = DEFAULT_ACTIVE_ICON;
		}
		return isActive ? activeIcon : icon;
	}

	renderContent() {
		const {
			submit,
			reset,
			buttonDisplay,
			buttonColor,
			buttonWidth,
			buttonHeight,
			disabled,
			onDisabledClick
		} = this.props;
		return (
			<div className={this.getClassName('stars')}>
				{this.renderStars()}
				{(submit || reset) && 
					<ButtonGroup view={buttonDisplay == 'united' ? 'united' : null}>
						{submit && 
							<Button 
								color={buttonColor}
								disabled={disabled}
								width={buttonWidth}
								height={buttonHeight}
								onClick={this.handleSubmitClick}
								onDisabledClick={onDisabledClick}
							>
								{submit}
							</Button>
						}
						{reset && 
							<Button 
								color={buttonColor}
								disabled={disabled}
								width={buttonWidth}
								height={buttonHeight}
								onClick={this.handleResetClick}
								onDisabledClick={onDisabledClick}
							>
								{reset}
							</Button>
						}
					</ButtonGroup>
				}
			</div>
		)
	}

	renderStars() {
		const {hovered, active, scale, normalStyle, activeStyle, hoverStyle} = this.state;
		const {iconType} = this.props;
		const stars = [];		
		for (let i = 0; i < scale; i++) {
			const isHovered = typeof hovered == 'number' && hovered >= i;
			const isActive = typeof active == 'number' && active >= i;
			const style = isHovered ? hoverStyle : (isActive ? activeStyle : normalStyle);
			stars.push(
				<RateFormStar 
					key={i}
					index={i}
					onClick={this.handleClick}
					onMouseEnter={this.handleMouseEnter}
					onMouseLeave={this.handleMouseLeave}
				>
					<Icon 
						className={isHovered ? 'uiex-hovered' : null}
						active={isActive}
						style={style}
						type={iconType}
						name={this.getIcon(isActive)}
					/>
				</RateFormStar>
			);
		}
		return stars;
	}

	handleSubmitClick = () => {
		const {onSubmit} = this.props;
		if (typeof onSubmit == 'function') {
			onSubmit();
		}
	}

	handleResetClick = () => {
		this.setState({active: -1});
		const {onReset} = this.props;
		if (typeof onReset == 'function') {
			onReset();
		}	
	}

	handleClick = (active) => {
		const {resettable, onChange, onReset, disabled, onDisabledClick} = this.props;
		if (disabled) {
			if (typeof onDisabledClick == 'function') {
				onDisabledClick();
			}
			return;
		}
		if (resettable && active == this.state.active) {
			active = -1;
			if (typeof onReset == 'function') {
				onReset();
			}
		}
		if (active != this.state.active) {
			this.setState({active});
			if (typeof onChange == 'function') {
				onChange(active + 1);
			}
		}
	}

	handleMouseEnter = (hovered) => {
		if (!this.props.disabled) {
			this.setState({hovered});
		}
	}

	handleMouseLeave = () => {
		if (!this.props.disabled) {
			this.setState({hovered: null});
		}
	}
}

export const RateForm = withStateMaster(RateFormComponent, PROPS_LIST, null, UIEXForm);

class RateFormStar extends React.PureComponent {
	static displayName = 'RateFormStar';

	render() {
		return (
			<span
				onClick={this.handleClick}
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}
			>
				{this.props.children}
			</span>
		)
	}

	handleClick = (e) => {
		e.stopPropagation();
		this.props.onClick(this.props.index);
	}

	handleMouseEnter = () => {
		this.props.onMouseEnter(this.props.index);
	}

	handleMouseLeave = () => {
		this.props.onMouseLeave(this.props.index);
	}
}