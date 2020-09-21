import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {BoxSection} from '../BoxSection';
import {Icon} from '../Icon'; 
import {isArray, isNumber} from '../utils';
import {BoxSectionGroupPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export class BoxSectionGroup extends UIEXComponent {
	static propTypes = BoxSectionGroupPropTypes;
	static className = 'box-section-group';
	static displayName = 'BoxSectionGroup';
	static properChildren = 'BoxSection';
	static onlyProperChildren = true;

	constructor(props) {
		super(props);
		if (props.uncontrolled) {
			this.state = {
				openIndexes: null
			};
		}
	}

	addChildProps(child, props, idx) {
		if (typeof child.props.onToggle != 'function') {
			props.onToggle = this.handleToggle;
		}
		if (typeof child.props.onDisabledClick != 'function') {
			props.onDisabledClick = this.handleDisabledClick;
		}
		if (child.props.animation === undefined) {
			props.animation = this.props.animation;
		}
		if (child.props.effect === undefined) {
			props.effect = this.props.effect;
		}
		if (child.props.iconAtRight === undefined) {
			props.iconAtRight = this.props.iconAtRight;
		}
		if (child.props.noHideAnimation === undefined) {
			props.noHideAnimation = this.props.noHideAnimation;
		}
		if (child.props.speed === undefined) {
			props.speed = this.props.speed;
		}
		if (child.props.view === undefined) {
			props.view = this.props.view;
		}
		props.name = idx;

		const openIndexes = this.getProp('openIndexes');
		if (isNumber(openIndexes)) {
			props.isOpen = openIndexes === idx;
		} else if (isArray(openIndexes)) {
			props.isOpen = openIndexes.includes(idx);
		} else {
			props.isOpen = Boolean(this.props.allOpen);
		}
	}

	handleToggle = (isOpen, idx) => {
		let openIndexes = this.getProp('openIndexes');		
		const {singleOpen, allOpen} = this.props;
		if (allOpen && !singleOpen && !isArray(openIndexes)) {
			openIndexes = [];
			for (let i = 0; i < this.properChildrenCount; i++) {
				openIndexes.push(i);
			}
		}
		if (isNumber(openIndexes)) {
			openIndexes = [openIndexes];
		}
		let nextOpenIndexes = openIndexes;
		if (isOpen) {
			if (!isArray(openIndexes) || singleOpen) {
				nextOpenIndexes = [idx];
			} else if (!openIndexes.includes(idx)) {
				nextOpenIndexes = [...openIndexes, idx];
			}
		} else if (isArray(openIndexes)) {
			const index = openIndexes.indexOf(idx);
			if (singleOpen) {
				nextOpenIndexes = [];
			} else if (index > -1) {
				openIndexes.splice(index, 1);
				nextOpenIndexes = [...openIndexes];
			}
		}
		this.firePropChange('toggle', 'openIndexes', [nextOpenIndexes], nextOpenIndexes);
	}

	handleDisabledClick = () => {
		
	}
}