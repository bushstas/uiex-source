import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {addClass, removeClass} from '../utils';
import {TouchablePropTypes} from './proptypes';

import '../style.scss';

export class Touchable extends UIEXComponent {
	static propTypes = TouchablePropTypes;
	static displayName = 'Touchable';


	getCustomProps() {
		return {
			onMouseDown: this.handleMouseDown,
			onStartDrag: this.preventEvent,
			onDrag: this.preventEvent
		}
	}

	preventEvent = (e) => {
		e.preventDefault();
	}

	renderInternal() {
		const TagName = this.getTagName(); 
		return (
			<TagName {...this.getProps()}>				
				{this.props.children}
			</TagName>
		)
	}

	fireRelease() {
		switch (this.direction) {
			case 'pushRight':
				return this.fire('releaseRight');
			
			case 'pushLeft':
				return this.fire('releaseLeft');

			case 'pushUp':
				return this.fire('releaseUp');

			case 'pushDown':
				return this.fire('releaseDown');
		}
	}

	firePush(direction, coord) {
		if (!this.direction) {
			this.direction = direction;
		}
		if (direction == this.direction) {
			this.fire(direction, coord);
		}
	}

	handleMouseDown = (e) => {
		addClass(document.body, 'uiex-no-select');
		this.direction = null;
		const {disabled} = this.props;
		if (!disabled) {
			this.curX = e.clientX;
			this.curY = e.clientY;
			this.totalX = 0;
			this.totalY = 0;
			document.body.addEventListener('mousemove', this.handleMouseMove, false);
			document.body.addEventListener('mouseup', this.handleMouseUp, false);
			document.body.addEventListener('mouseleave', this.handleMouseLeave, false);
			document.body.addEventListener('startdrag', this.preventEvent, false);
			document.body.addEventListener('drag', this.preventEvent, false);
		} else {
			this.fire('disabledClick');
		}
	}

	handleMouseMove = (e) => {
		removeClass(document.body, 'uiex-no-select');
		const x = e.clientX - this.curX;
		const y = e.clientY - this.curY;
		if (Math.abs(x) > Math.abs(y)) {
			const ratio = Math.abs(x / y);
			if (ratio >= 5) {
				if (x > 0) {
					this.firePush('pushRight', x);
				} else if (x < 0) {
					this.firePush('pushLeft', x);
				}
			}
		} else {
			const ratio = Math.abs(y / x);
			
			if (ratio >= 5) {
				if (y > 0) {
					this.firePush('pushDown', y);
				} else if (y < 0) {
					this.firePush('pushUp', y);
				}
			}
		}
		this.totalX += x;
		this.totalY += y;
		this.curX = e.clientX;
		this.curY = e.clientY;
	}

	handleMouseUp = () => {
		document.body.style.userSelect = '';
		document.body.removeEventListener('mousemove', this.handleMouseMove, false);
		document.body.removeEventListener('mouseup', this.handleMouseUp, false);
		document.body.removeEventListener('mouseleave', this.handleMouseLeave, false);
		document.body.removeEventListener('startdrag', this.preventEvent, false);
		document.body.removeEventListener('drag', this.preventEvent, false);
		this.fireRelease();
	}

	handleMouseLeave = () => {
		this.handleMouseUp();
	}
}