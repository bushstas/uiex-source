import React from 'react';
import {withStateMaster} from '../state-master';
import {UIEXBoxContainer} from '../UIEXComponent';
import {PopupPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const PROPS_LIST = 'isOpen';

class PopupComponent extends UIEXBoxContainer {
	static propTypes = PopupPropTypes;
	static displayName = 'Popup';

	static getDerivedStateFromProps({isChanged, nextProps, call, isInitial}) {
		if (isChanged('isOpen')) {
			call(() => {			
				if (nextProps.isOpen) {
					this.addBodyClickHandler();
				} else if (!isInitial) {
					this.removeBodyClickHandler();
				}
			});
		}
	}
	
	componentWillUnmount() {
		this.removeBodyClickHandler();
		super.componentWillUnmount();
	}

	addClassNames(add) {
		add('open', this.props.isOpen);
	}

	addBodyClickHandler() {
		document.body.addEventListener('mousedown', this.handleBodyClick, false);
	}

	removeBodyClickHandler() {
		document.body.removeEventListener('mousedown', this.handleBodyClick, false);
	}

	getCustomProps() {
		return {
			onMouseDown: this.handleMouseDown
		}
	}

	renderInternal() {
		const content = this.renderChildren();
		const TagName = this.getTagName();
		return (
			<TagName {...this.getProps()}>
				<div ref="inner" className={this.getClassName('inner')}>
					{content}
				</div>
			</TagName>
		)
	}

	handleMouseDown = (e) => {
		e.stopPropagation();
	}

	handleBodyClick = (e) => {
		if (!this.isOwnChild(e.target)) {
			const {onCollapse} = this.props;
			if (typeof onCollapse == 'function') {
				onCollapse();
			}
			this.removeBodyClickHandler();
		}
	}
}

export const Popup = withStateMaster(PopupComponent, PROPS_LIST, null, UIEXBoxContainer);