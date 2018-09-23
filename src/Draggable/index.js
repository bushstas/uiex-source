import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {getNumberOrNull, replace} from '../utils';
import {DRAG_POSITION_X, DRAG_POSITION_Y} from '../consts';
import {DraggablePropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const CLASS_NAME = 'draggable-handle-area';

export class Draggable extends UIEXComponent {
	static propTypes = DraggablePropTypes;
	static displayName = 'Draggable';
	static properChildren = 'DragHandleArea';

	componentDidMount() {
		window.addEventListener('resize', this.handleResize, false);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize, false);
		super.componentWillUnmount();
	}

	addClassNames(add) {
		const {dragLimits, withOwnPosition, fixed, disabled} = this.props;
		if (fixed) {
			add('fixed', true);
		} else {
			add('drag-limits-' + dragLimits, !withOwnPosition && dragLimits);
		}
		add(CLASS_NAME, !disabled && !this.properChildrenCount);
		add('with-own-position', withOwnPosition);
	}

	isCustomStyleChanged() {
		let {initialPositionX, initialPositionY, x, y, z, dragLimits} = this.props;
		return (
			x != this.cachedX ||
			y != this.cachedY ||
			z != this.cachedZ ||
			initialPositionX != this.cachedIX ||
			initialPositionY != this.cachedIY ||
			dragLimits != this.cachedDragLimits
		);
	}

	getCustomStyle() {
		let {initialPositionX, initialPositionY, x, y, z, dragLimits} = this.props;
		this.cachedX = x;
		this.cachedY = y;
		this.cachedZ = z;
		this.cachedIX = initialPositionX;
		this.cachedIY = initialPositionY;
		this.cachedDragLimits = dragLimits;		
		this.X = this.getPositionX(x);
		this.Y = this.getPositionY(y);		
		return {
			left: this.X,
			top: this.Y,
			zIndex: z
		};
	}

	getCustomProps() {
		if (!this.properChildrenCount && !this.props.disabled) {
			return {
				onMouseDown: this.handleMouseDown,
				onDragStart: this.handleDragStart,
				onDrag: this.handleDragStart,
				onClick: this.handleClick
			}
		}
	}

	addChildProps(child, props) {
		const {disabled} = this.props;
		if (!disabled) {
			props.onMouseDown = this.handleMouseDown;
			props.onDragStart = this.handleDragStart;
			props.onDrag = this.handleDragStart;
		} else {
			props.disabled = true;
		}
	}

	getPositionX(x) {
		x = getNumberOrNull(x);
		if (x != null) {
			return x;
		}
		if (!this.refs.main) {
			return 0;
		}
		let {initialPositionX: ix, dragLimits, fixed} = this.props;
		if (ix && typeof ix == 'string') {
			let nx;
			const ownRect = this.refs.main.getBoundingClientRect();
			const isInPercent = ix.charAt(ix.length - 1) == '%';
			const isConst = !isInPercent && DRAG_POSITION_X.indexOf(ix) > -1;
			const isValidPosition = isInPercent || isConst;
			if (isValidPosition) {
				let parentWidth;
				if (dragLimits == 'window' || fixed) {
					parentWidth = document.body.scrollWidth;
				} else {
					const {parentNode} = this.refs.main;
					const {width} = parentNode.getBoundingClientRect();
					parentWidth = width;
				}
				parentWidth -= ownRect.width;
				if (isInPercent) {
					const pn = Number(replace(/%$/, '', ix));
					if (!isNaN(pn)) {
						nx = pn * parentWidth / 100;
					}
				} else {
					switch (ix) {
						case 'left-out':
							nx = -ownRect.width;
						break;

						case 'left-in-out':
							nx = -ownRect.width / 2;
						break;

						case 'left':
							nx = 0;
						break;

						case 'center':
							nx = 50 * parentWidth / 100;
						break;

						case 'right':
							nx = parentWidth;
						break;

						case 'right-out':
							nx = parentWidth + ownRect.width;
						break;
						
						case 'right-in-out':
							nx = parentWidth + ownRect.width / 2;
						break;
					}
				}
			}
			return nx;
		}
		return 0;		
	}

	getPositionY(y) {
		y = getNumberOrNull(y);
		if (y != null) {
			return y;
		}
		if (!this.refs.main) {
			return 0;
		}
		let {initialPositionY: iy, dragLimits, fixed} = this.props;
		if (iy && typeof iy == 'string') {
			let ny;
			const ownRect = this.refs.main.getBoundingClientRect();
			const isInPercent = iy.charAt(iy.length - 1) == '%';
			const isConst = !isInPercent && DRAG_POSITION_Y.indexOf(iy) > -1;
			const isValidPosition = isInPercent || isConst;
			if (isValidPosition) {
				let parentHeight;
				if (dragLimits == 'window' || fixed) {
					parentHeight = window.innerHeight;
				} else {
					const {parentNode} = this.refs.main;
					const {height} = parentNode.getBoundingClientRect();
					parentHeight = height;
				}
				parentHeight -= ownRect.height;
				if (isInPercent) {
					const pn = Number(replace(/%$/, '', iy));
					if (!isNaN(pn)) {
						ny = pn * parentHeight / 100;
					}
				} else {
					switch (iy) {
						case 'top-out':
							ny = -ownRect.height;
						break;

						case 'top-in-out':
							ny = -ownRect.height / 2;
						break;

						case 'top':
							ny = 0;
						break;

						case 'center':
							ny = 50 * parentHeight / 100;
						break;

						case 'bottom':
							ny = parentHeight;
						break;

						case 'bottom-out':
							ny = parentHeight + ownRect.height;
						break;
						
						case 'bottom-in-out':
							ny = parentHeight + ownRect.height / 2;
						break;
					}
				}
			}
			return ny;
		}
		return 0;
	}

	initDragLimits = () => {
		const {dragLimits, fixed} = this.props;
		if (dragLimits) {
			const ownRect = this.refs.main.getBoundingClientRect();
			if (dragLimits == 'window') {
				const {scrollWidth} = document.body;
				this.limitXZero = 0;
				this.limitYZero = 0;
				this.limitX = scrollWidth - ownRect.width;
				this.limitY = window.innerHeight - ownRect.height;
				this.limitXLeft = null;
				this.limitXRight = null;
				this.limitYTop = null;
				this.limitYBottom = null;
				return;
			} else if (!fixed) {
				const {parentNode} = this.refs.main;
				let {left, top, width, height} = parentNode.getBoundingClientRect();
				
				switch (dragLimits) {
					case 'parent-in':
						this.limitXZero = 0;
						this.limitYZero = 0;
						this.limitX = width - ownRect.width;
						this.limitY = height - ownRect.height;
						this.limitXLeft = left;
						this.limitXRight = left + width;
						this.limitYTop = top;
						this.limitYBottom = top + height;
						return;

					case 'parent-out':
						this.limitXZero = -ownRect.width;
						this.limitYZero = -ownRect.height;
						this.limitX = width;
						this.limitY = height;
						this.limitXLeft = left - ownRect.width;
						this.limitXRight = left + width + ownRect.width;
						this.limitYTop = top - ownRect.height;
						this.limitYBottom = top + height + ownRect.height;
						return;

					case 'parent-in-out':
						this.limitXZero = -ownRect.width / 2;
						this.limitYZero = -ownRect.height / 2;
						this.limitX = width - ownRect.width / 2;
						this.limitY = height - ownRect.height / 2;
						this.limitXLeft = left - ownRect.width;
						this.limitXRight = left + width + ownRect.width;
						this.limitYTop = top - ownRect.height;
						this.limitYBottom = top + height + ownRect.height;
						return;
				}
			}
		}
		this.limitXZero = null;
		this.limitYZero = null;
		this.limitX = null;
		this.limitY = null;
		this.limitXLeft = null;
		this.limitXRight = null;
		this.limitYTop = null;
		this.limitYBottom = null;
	}

	handleResize = () => {
		const {dragLimits, onDrag} = this.props;
		if (typeof onDrag == 'function' && dragLimits) {
			let x = this.X;
			let y = this.Y;
			this.initDragLimits();
			let isChanged = false;			
			if (x > this.limitX) {
				isChanged = true;
				x = this.limitX;
			}
			if (y > this.limitY) {
				isChanged = true;
				y = this.limitY;
			}
			if (isChanged) {
				onDrag(x, y)
			}
		}
	}

	handleDragStart = (e) => {
		e.preventDefault();
	}

	handleClick = (e) => {
		e.stopPropagation();
	}

	handleMouseDown = (e) => {
		e.preventDefault();
		const {onDragStart, name} = this.props;
		this.x = e.clientX;
		this.y = e.clientY;
		document.body.addEventListener('mousemove', this.handleMouseMove, false);
		document.body.addEventListener('mouseup', this.handleMouseUp, false);
		this.initDragLimits();
		if (typeof onDragStart == 'function') {
			onDragStart(this.X, this.Y, name);
		}
	}

	handleMouseMove = (e) => {
		let {horizontal, vertical, dragLimits, onDrag, fixed, name} = this.props;
		if (typeof onDrag == 'function') {
			if (horizontal && vertical) {
				horizontal = false;
				vertical = false;
			}
			let x = this.X;
			let y = this.Y;
			let mx = x || 0;
			let my = y || 0;
			let {clientX, clientY} = e;
				if (!fixed && dragLimits && dragLimits != 'window') {
				if (!vertical) {
					if (clientX < this.limitXLeft) {
						clientX = this.limitXLeft;
					} else if (clientX > this.limitXRight) {
						clientX = this.limitXRight;
					}
				}
				if (!horizontal) {
					if (clientY < this.limitYTop) {
						clientY = this.limitYTop;
				} else if (clientY > this.limitYBottom) {
						clientY = this.limitYBottom;
					}
				}
			}
			if (!vertical) {
				const sx = clientX - this.x;
				this.x = clientX;
				mx += sx;
				mx = Math.round(mx);
			}
			if (!horizontal) {
				const sy = clientY - this.y;
				this.y = clientY;
				my += sy;
				my = Math.round(my);
			}
				if (typeof this.limitX == 'number') {
				if (!vertical) {
					if (mx > this.limitX) {
						mx = this.limitX;
					} else if (mx < this.limitXZero) {
						mx = this.limitXZero;
					}
				}
				if (!horizontal) {
					if (my > this.limitY) {
						my = this.limitY;
					} else if (my < this.limitYZero) {
						my = this.limitYZero;
					}
				}
			}
			onDrag(mx, my, name);
		}
	}

	handleMouseUp = () => {
		const {onDragEnd, name} = this.props;
		if (typeof onDragEnd == 'function') {
			onDragEnd(this.X, this.Y, name);
		}
		document.body.removeEventListener('mousemove', this.handleMouseMove, false);
 		document.body.removeEventListener('mouseup', this.handleMouseUp, false);
	}
}

export class DragHandleArea extends React.PureComponent {
	static displayName = 'DragHandleArea';

	render() {
		let {disabled, tagName, className, children, onMouseDown, onDragStart, onDrag} = this.props; 
		if (!tagName || typeof tagName != 'string' || !(/^[a-z]/i).test(tagName.charAt(0))) {
			tagName = 'div';
		}
		const TagName = tagName;
		if (!disabled) {
			if (!className || typeof className != 'string') {
				className = 'uiex-' + CLASS_NAME
			} else {
				className += ' uiex-' + CLASS_NAME;
			}
		}
		return (
			<TagName 
				className={className} 
				onMouseDown={onMouseDown}
				onDragStart={onDragStart}
				onDrag={onDrag}
			>
				{children}
			</TagName>
		)
	}
}