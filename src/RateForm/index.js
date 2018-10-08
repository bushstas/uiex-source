import React from 'react';
import {UIEXForm} from '../UIEXComponent';
import {Icon} from '../Icon';
import {Button} from '../Button';
import {ButtonGroup} from '../ButtonGroup';
import {getNumericProp} from '../utils';
import {RateFormPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const DEFAULT_SCALE = 5;
const MIN_SCALE = 3;
const MAX_SCALE = 10;
const DEFAULT_ICON = 'star_border';
const DEFAULT_ACTIVE_ICON = 'star';

export class RateForm extends UIEXForm {
	static propTypes = RateFormPropTypes;
	static className = 'rate-form';
	static displayName = 'RateForm';
	static defaultProps = {
		scale: DEFAULT_SCALE,
		icon: DEFAULT_ICON,
		activeIcon: DEFAULT_ACTIVE_ICON
	};

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

	getActive() {
		const {value} = this.props;
		return typeof value == 'number' ? value - 1 : null;
	}

	getScale() {
		return getNumericProp(this.props.scale, DEFAULT_SCALE, MIN_SCALE, MAX_SCALE);
	}

	getNormalStyle() {
		if (this.isCachedPropsChanged('normalColor')) {
			const {normalColor} = this.props;
			this.cachedNormalStyle = !!normalColor ? {color: normalColor} : null;
		}
		return this.cachedNormalStyle;	
	}

	getActiveStyle() {
		if (this.isCachedPropsChanged('activeColor')) {
			const {activeColor} = this.props;
			this.cachedActiveStyle = !!activeColor ? {color: activeColor} : null;
		}
		return this.cachedActiveStyle;		
	}

	getHoverStyle() {
		if (this.isCachedPropsChanged('hoverColor')) {
			const {hoverColor} = this.props;
			this.cachedHoverStyle = !!hoverColor ? {color: hoverColor} : null;
		}
		return this.cachedHoverStyle;
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
		const {hovered} = this.state;
		const {iconType} = this.props;
		const active = this.getActive();
		const scale = this.getScale();
		const normalStyle = this.getNormalStyle();
		const activeStyle = this.getActiveStyle();
		const hoverStyle = this.getHoverStyle();
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
		this.fire('submit', this.props.value);
	}

	handleResetClick = () => {
		this.fireReset();
	}

	handleClick = (active) => {
		const currentActive = this.getActive();
		if (this.props.disabled) {
			return this.fire('disabledClick');			
		}
		const isResetting = active === currentActive;
		if (isResetting) {
			this.fireReset();
		} else {
			this.fire('change', active + 1);
		}
	}

	fireReset() {
		if (this.props.resettable) {
			this.fire('reset');
			this.fire('change', null);
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