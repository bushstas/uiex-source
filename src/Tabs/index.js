import React from 'react';
import {PROPTYPE} from '../consts';
import {UIEXButtons} from '../UIEXComponent';
import {Button} from '../Button';
import {Icon} from '../Icon';
import {getClassNameBuilder} from '../utils';
import {TabsPropTypes} from './proptypes';

import '../style.scss';
import '../ButtonGroup/style.scss';
import './style.scss';

const NEW_TAB_CAPTION = 'New tab';

export class Tabs extends UIEXButtons {
	static propTypes = TabsPropTypes;
	static properChildren = 'Tab';
	static className = 'Tabs';

	addClassNames(add) {		
		add('dynamic-tabs', this.props.dynamic);
	}

	initRendering() {
		this.singles = [];
		this.isActive = false;
		this.activeTab = this.props.activeTab;
	}

	addChildProps(child, props, idx) {
		const {
			activeColor,
			activeStyle,
			dynamic,
			noRemoving
		} = this.props;

		props.caption = child.props.caption;
		const isPrevTabActive = this.isActive;
		const isRemovable = !noRemoving && !child.props.noRemoving;
		this.isActive = this.isTabActive(child, idx, props);
		if (dynamic && isRemovable) {
			props.caption = this.renderDynamicTabContent(props.caption, idx);
		}
		this.addCommonButtonsProps(child, props);
		props.onSelect = child.props.onSelect || this.handleSelectTab;
		if (isPrevTabActive) {
			props.afterActive = true;
		}
		
		if (this.isActive) {
			props.active = true;
			if (activeColor) {
				props.color = activeColor;
			}
			if (activeStyle instanceof Object) {
				if (props.style instanceof Object) {
					props.style = {
						...props.style,
						...activeStyle
					};
				} else {
					props.style = activeStyle;
				}
			}
		}
	}

	renderDynamicTabContent(caption, index) {
		return (
			<TabCloseButton
				caption={caption}
				value={this.value}
				index={index}
				onClick={this.handleRemoveTab}
			/>
		)
	}

	renderContent() {
		let {children} = this.props;
		if (!(children instanceof Array)) {
			children = [children];
		}
		const activeTab = this.activeTab;
		return children.map((child, idx) => this.isProperChild(child.type) && this.isTabActive(child, idx) ? child.props.children : null);
	}

	isTabActive(child, idx, props = null) {
		const {optional} = this.props;
		const activeTab = this.activeTab;
		let value = child.props.value;
		let active;
		if (value == null) {
			value = idx;
			if (props) {
				props.value = idx;
			}
		}
		if (child.props.single) {
			this.singles.push(value);
		}
		if (activeTab instanceof Array) {
			active = activeTab.indexOf(value) > -1;
		} else if (activeTab == null && !optional) {
			active = idx == 0;
			this.activeTab = value;
		} else {
			active = activeTab == value;
		}
		this.value = value;
		return active;
	}

	getButtonGroupClassName() {
		const {add, get} = getClassNameBuilder('uiex-tabs-menu uiex-button-group');
		super.addClassNames(add);
		return get();
	}

	renderInternal() {
		const {simple, dynamic} = this.props;
		const TagName = this.getTagName();

		return (
			<TagName {...this.getProps()}>
				<div className={this.getButtonGroupClassName()}>
					<div className="uiex-button-group-inner">
						{this.renderChildren()}
						{dynamic && this.renderAddTabButton()}
					</div>
				</div>
				{!simple &&
					<div className="uiex-tabs-content">
						{this.renderContent()}
					</div>
				}
			</TagName>
		)
	}

	renderAddTabButton() {
		const {
			buttonColor,
			buttonHeight,
			buttonStyle,
			disable,
		} = this.props;
		let classes = 'uiex-add-tab-button';
		if (this.isActive) {
			classes += ' uiex-after-active';
		}
		return (
			<Button 
				className={classes}
				icon="add"
				iconSize="24"
				onClick={this.handleAddTab}
				color={buttonColor}
				height={buttonHeight}
				style={buttonStyle}
				disable={disable}
			/>
		)
	}

	handleSelectTab = (value, single) => {
		const {onSelect, multiple, optional} = this.props;
		let activeTab = this.activeTab;
		if (typeof onSelect == 'function') {
			if (multiple) {
				if (!(activeTab instanceof Array)) {
					activeTab = activeTab != null ? [activeTab] : [];
				}
				const idx = activeTab.indexOf(value);
				if (idx > -1) {
					if (single) {
						activeTab = [];
					} else {
						activeTab.splice(idx, 1);
					}
				} else {
					if (single) {
						activeTab = [value];
					} else {
						activeTab.push(value);
						for (let s of this.singles) {
							let i = activeTab.indexOf(s);
							if (i > -1) {
								activeTab.splice(i, 1);
							}
						}
					}

				}
			} else if (activeTab != value) {
				activeTab = value;
			} else if (optional) {
				activeTab = null;
			}
			onSelect(activeTab);
		}
	}

	handleAddTab = () => {
		let {onAddTab, emptyTabName} = this.props;
		if (typeof onAddTab == 'function') {
			if (!emptyTabName || typeof emptyTabName != 'string') {
				emptyTabName = NEW_TAB_CAPTION;
			}
			onAddTab(emptyTabName + ' ' + this.getNextIndex());
		}
	}

	handleRemoveTab = (index, value) => {
		const {onRemoveTab} = this.props;
		if (typeof onRemoveTab == 'function') {
			onRemoveTab(index, value);
		}
	}

	getNextIndex() {
		this.index = this.index || 0;
		return ++this.index;
	}
}

class TabCloseButton extends React.Component {
	render() {
		return(
			<span>
				{this.props.caption} 
				<span className="uiex-tab-close" onClick={this.handleClick}>
					<Icon name="clear" fontSize="14"/>
				</span>
			</span>
		)
	}

	handleClick = (e) => {
		const {onClick, value, index} = this.props;
		e.stopPropagation();
		onClick(value, index);
	}
}