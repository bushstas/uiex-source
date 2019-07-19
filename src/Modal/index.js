import React from 'react';
import ReactDOM from 'react-dom';
import {withStateMaster} from '../state-master';
import {UIEXComponent} from '../UIEXComponent';
import {Icon} from '../Icon';
import {Draggable, DragHandleArea} from '../Draggable';
import {ModalPropTypes} from './proptypes';
import {
	replace,
	getNumberOrNull,
	addClass,
	removeClass,
	getNumericProp,
	preAnimate,
	animate,
	animateBack
} from '../utils';

import '../style.scss';
import './style.scss';

const PROPS_LIST = ['isOpen', 'width', 'height', 'withoutPortal'];
const ROOT_ID = 'uiex-modal-root';
const DEFAULT_MASK_OPACITY = 6;
const DEFAULT_BLUR_VALUE = 2;

const wheelEventOptions = {
	capture: false,
	passive: false
};

class ModalComponent extends UIEXComponent {
	static propTypes = ModalPropTypes;
	static styleNames = ['body', 'header', 'footer', 'mask', 'controls'];
	static displayName = 'Modal';

	static getDerivedStateFromProps({add, isChanged, nextProps, isInitial}) {
		if (isInitial || isChanged('withoutPortal')) {
			const {withoutPortal} = nextProps;
			let root = null;
			if (!withoutPortal) {
				root = document.getElementById(ROOT_ID);
				if (!root) {
					root = document.createElement('div');
					root.id = ROOT_ID;
					document.body.appendChild(root);
				}
			}
			add('root', root);
		}
	}

	componentDidMount() {
		if (this.props.isOpen) {
			this.animateShowing();
		}
		window.addEventListener('resize', this.handleResize, false);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.isOpen != this.props.isOpen) {
			let {blurSelector, blurValue, withoutPortal} = this.props;
			if (!withoutPortal && blurSelector && typeof blurSelector == 'string') {
				let elementToBlur = document.querySelector(blurSelector);
				if (blurValue === 0) {
					blurValue = '0';
				}
				const blurClassName = 'uiex-blured-' + (blurValue || DEFAULT_BLUR_VALUE);
				if (this.props.isOpen) {
					addClass(elementToBlur, blurClassName);
				} else {
					removeClass(elementToBlur, blurClassName);
				}
			}
			if (this.props.isOpen) {
				this.animateShowing();
			} else {
				this.animateHiding();
			}
		}
		if (prevProps.width != this.props.width || prevProps.height != this.props.height) {
			this.initPosition();
		}
	}

	componentWillUnmount() {
		super.componentWillUnmount();
		window.removeEventListener('resize', this.handleResize, false);
	}

	animateShowing() {
		const container = this.getContainer();
		if (!container) {
			return;
		}
		const {mask, outer} = this.refs;
		const {animation, maskColor} = this.props;
		const maskOpacity = this.getMaskOpacity();
		if (mask) {
			mask.style.opacity = maskOpacity;
			if (maskColor && typeof maskColor == 'string') {
				mask.style.backgroundColor = maskColor;
			}
		}
		preAnimate(container, outer, animation);
		if (animation) {
			if (mask) {
				mask.style.opacity = '0';
			}
			setTimeout(() => {
				this.setState({isOpen: true}, () => {
					this.initPosition();
					animate(container, outer, animation);
					this.addWheelHandler();
					if (mask) {
						setTimeout(() => {
							mask.style.opacity = maskOpacity;
						}, 100);
					}
				});
			}, 10);
		} else {
			this.setState({isOpen: true}, () => {
				this.initPosition();
				this.addWheelHandler();
			});
		}
	}

	addWheelHandler() {
		if (this.refs.main && !this.wheelListenerAdded) {
			this.wheelListenerAdded = true;
			this.refs.mask.addEventListener('wheel', this.handleWheel, wheelEventOptions);
		}
	}

	removeWheelHandler() {
		if (this.refs.main && this.wheelListenerAdded) {
			this.wheelListenerAdded = false;
			this.refs.mask.removeEventListener('wheel', this.handleWheel, wheelEventOptions);
		}
	}

	animateHiding(isAction = false) {
		this.removeWheelHandler();
		const container = this.getContainer();
		if (!container) {
			return;
		}
		const {mask} = this.refs;
		const {animation} = this.props;
		if (animation) {
			if (mask) {
				mask.style.opacity = '0';
			}
			animateBack(container, animation);
			setTimeout(() => {
				this.setState({isOpen: false}, () => {
					if (isAction) {
						this.fireClose();
					}
				});
			}, 300);
		} else {
			this.setState({isOpen: false});
			if (isAction) {
				this.fireClose();
			}
		}
	}

	getMaskOpacity() {
		return getNumericProp(this.props.maskOpacity, DEFAULT_MASK_OPACITY, 0, 10) / 10;
	}

	fireClose() {
		this.fire('close');
	}

	initPosition = () => {
		const {isOpen} = this.state;
		if (isOpen && !this.dragged) {
			const {scrollWidth} = document.body;
			this.initSize();
			const container = this.getContainer();
			let {width, height} = container.getBoundingClientRect();
			const x = (scrollWidth - width) / 2;
			const y = (window.innerHeight - height) / 2;
			this.setState({x, y});
		}
	}

	initSize() {
		const container = this.getContainer();
		const {scrollWidth} = document.body;
		let {width, height, expanded} = this.props;
		if (!expanded && typeof height == 'string' && (/%$/).test(height)) {
			height = ~~replace(/%$/, '', height);
			if (height) {
				height = window.innerHeight * height / 100;
				container.style.height = height + 'px';
			}
		}
		container.style.maxWidth = '';
		container.style.maxHeight = '';
		width = container.getBoundingClientRect().width;
		if (width > scrollWidth) {
			width = scrollWidth - 50;
			container.style.maxWidth = width + 'px';
		}
		height = container.getBoundingClientRect().height;
		if (height > window.innerHeight) {
			height = window.innerHeight - 50;
			container.style.maxHeight = height + 'px';
		}
	}

	addClassNames(add) {
		const {
			expandable, animation, expanded, withoutPortal,
			header, footer, withoutPadding
		} = this.props;
		add('expandable', expandable);
		add('shown', this.state.isOpen);
		add('expanded', expanded);
		add('animation-' + animation, animation);
		add('without-portal', withoutPortal);
		add('without-header', !header);
		add('without-footer', !footer);
		add('without-padding', withoutPadding);
	}

	renderInternal() {
		let {
			withoutMask, 
			draggable, 
			expandable,
			expanded, 
			unclosable,
			onDragStart,
			onDragEnd,
			dragWithinWindow,
			outerContent,
			isOpen,
			header,
			x,
			y
		} = this.props;

		if (!isOpen && !this.state.isOpen) {
			return null;
		}
		const {root, x: sx, y: sy} = this.state;
		const TagName = this.getTagName();
		const canDrag = draggable && !expanded;

		x = getNumberOrNull(x, sx);
		y = getNumberOrNull(y, sy);
		const content = (
			<TagName {...this.getProps(null, false)} onClick={this.handleClick}>
				{!withoutMask && 
					<div 
						className={this.getClassName('mask')}
						onClick={this.handleMaskClick}
						style={this.getStyle('mask')}
						ref="mask"
					/>
				}
				{outerContent && 
					<div className={this.getClassName('outer-content')}>
						{outerContent}
					</div>
				}
				<div ref="outer" className={this.getClassName('outer-container')}>
					<Draggable 
						ref="drag"
						className={this.getClassName('container')}
						style={this.getMainStyle()}
						x={x}
						y={y}
						fixed
						dragLimits={dragWithinWindow ? 'window' : null}
						disabled={!canDrag}
						onDragStart={onDragStart}
						onDrag={this.handleDrag}
						onDragEnd={onDragEnd}					
					>
						{(expandable || !unclosable) && 
							<div className={this.getClassName('controls')} style={this.getStyle('controls')}>
								{!header && canDrag && 
									<DragHandleArea>
										<Icon name="drag_handle"/>
									</DragHandleArea>
								}
								{expandable && 
									<Icon 
										name={expanded ? 'crop_7_5' : 'crop_3_2'} 
										onClick={this.handleExpand}
									/>
								}
								{!unclosable && 
									<Icon 
										name="close" 
										onClick={this.handleClose}
									/>
								}
							</div>
						}
						{this.renderHeader()}
						<div
							className={this.getClassName('body', 'uiex-scrollable')}
							style={this.getStyle('body')}
						>
							{this.renderChildren()}
						</div>
						{this.renderFooter()}
					</Draggable>
				</div>
			</TagName>
		)
		return root ? ReactDOM.createPortal(content, root) : content;
	}

	renderHeader() {
		const {header} = this.props;
		if (header) {
			return (
				<DragHandleArea>
					<div 
						className={this.getClassName('header')} 
						style={this.getStyle('header')}
						onDoubleClick={this.handleHeaderDoubleClick}>
						{header}
					</div>
				</DragHandleArea>
			)
		}
	}

	renderFooter() {
		const {footer} = this.props;
		if (footer) {
			return (
				<div className={this.getClassName('footer')} style={this.getStyle('footer')}>
					{footer}
				</div>
			)
		}
	}

	handleDrag = (x, y) => {
		this.dragged = this.fire('drag', x, y);
	}

	handleClick = (e) => {
		e.stopPropagation();
	}

	handleMaskClick = () => {
		const {unclosable, noMaskClose} = this.props;
		if (!unclosable && !noMaskClose) {
			this.handleClose();
		}
	}

	handleClose = () => {
		this.animateHiding(true);
	}

	handleExpand = () => {
		this.fire('expand', !this.props.expanded);
	}

	handleHeaderDoubleClick = () => {
		const {expandable} = this.props;
		if (expandable) {
			this.handleExpand();
		}
	}

	handleResize = () => {
		const {expanded} = this.props;
		if (!expanded) {
			if (!this.dragged) {
				this.initPosition();
			} else {
				this.initSize();
			}
		}
	}

	handleWheel = (e) => {
		e.preventDefault();
	}

	getContainer() {
		if (this.refs.drag) {
			return this.refs.drag.refs.main;
		}
	}
}

export const Modal = withStateMaster(ModalComponent, PROPS_LIST, null, UIEXComponent);