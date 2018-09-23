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

	static getDerivedStateFromProps({add, isChanged, nextProps, call, isInitial}) {
		if (isChanged('isOpen')) {
			const {isOpen} = nextProps;
			if (isOpen) {
				const {main} = this.refs;
				const inner = this.getInnerContainer();
				if (main && inner) {
					const {height, width} = inner.getBoundingClientRect();
					const {top, left} = main.getBoundingClientRect();
					const {scrollWidth, scrollHeight} = document.body;
					add('atTop', top + height > scrollHeight + 5);
					add('atLeft', left + width > scrollWidth + 5);
				}
			} else {
				add('atTop', false);
				add('atLeft', false);
			}
			call(() => {			
				if (isOpen) {
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
		add('at-top', this.props.onTop || this.state.atTop);
		add('at-left', this.state.atLeft);
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

	getInnerContainer() {
		return this.refs.inner;
	}
}

export const Popup = withStateMaster(PopupComponent, PROPS_LIST, null, UIEXBoxContainer);