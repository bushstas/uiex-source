import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Draggable} from '../Draggable';
import {getNumberOrNull, propsChanged, cacheProps} from '../utils';
import {ScrollContainerPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const DEFAULT_STEP = 50;
const MIN_STEP = 20;
const MAX_STEP = 500;
const MIN_SPEED = 1;
const MAX_SPEED = 8;
const MAIN_PROPS_LIST = ['scrollTop', 'scrollTopPercent', 'transitionSpeed'];
const PROPS_LIST = ['width', 'height', 'style', 'fontSize', 'float', 'className', 'tagName', 'children'];

export class ScrollContainer extends UIEXComponent {
	static propTypes = ScrollContainerPropTypes;
	static displayName = 'ScrollContainer';
	static className = 'scroll-container';

	getCustomProps() {
		return {
			onWheel: this.handleWheel
		}
	}

	componentDidMount() {
		this.forceUpdate();
		window.addEventListener('resize', this.handleWindowResize, false);
	}

	componentWillUnmount() {
		clearTimeout(this.timeout);
		window.removeEventListener('resize', this.handleWindowResize, false);
	}

	renderInternal() {
		const {outerContent, disabled} = this.props;
		const {scrollStyle, innerStyle, barStyle, scrollerTop, scrollerHeight} = this.getStyles();
		const TagName = this.getTagName();
		return (
			<TagName {...this.getProps()}>
				<div ref="outer" className={this.getClassName('outer')}>
					<div ref="inner" className={this.getClassName('inner')} style={innerStyle}>
						{this.renderChildren()}
					</div>
					<div ref="bar" className={this.getClassName('bar')} style={barStyle}>
						<Draggable
							ref="scroller"
							className={this.getClassName('scroller')} 
							y={scrollerTop}
							height={scrollerHeight}
							style={scrollStyle}
							dragLimits="parent-in"
							disabled={disabled}
							vertical
							onDrag={this.handleScrollerDrag}
							onDragStart={this.handleScrollerDragStart}
							onDragEnd={this.handleScrollerDragEnd}
						/>
					</div>
				</div>
				{outerContent &&
					<div className={this.getClassName('outer-content')}>
						{outerContent}
					</div>
				}
			</TagName>
		)
	}

	isAnyPropChanged() {
		let isChanged = !this.cachedProps;
		if (!isChanged) {
			if (propsChanged(this.props, this.cachedProps, PROPS_LIST)) {
				clearTimeout(this.timeout);
				this.timeout = setTimeout(this.checkToUpdate, 0);
			}
			isChanged = propsChanged(this.props, this.cachedProps, MAIN_PROPS_LIST);
		}
		if (this.refs.outer) {
			this.cachedProps = cacheProps(this.props, PROPS_LIST);
		}
		return isChanged;
	}

	checkToUpdate = () => {
		const {height: outerHeight} = this.refs.outer.getBoundingClientRect();
		const {height: innerHeight} = this.refs.inner.getBoundingClientRect();
		if (
			innerHeight != this.cachedInnerHeight ||
			outerHeight != this.cachedOuterHeight
		) {
			const {onWheel} = this.props;
			const scrollTop = this.getScrollTop();
			if (scrollTop && typeof onWheel == 'function') {
				if (innerHeight <= outerHeight) {
					return onWheel(0, 0);
				}
				const diff = innerHeight - outerHeight;
				if (Math.abs(scrollTop) > diff) {
					return onWheel(diff, 0);
				}
			}
			this.cachedProps = null;
			this.forceUpdate();
		}
	}

	getStyles() {
		if (this.refs.outer && this.isAnyPropChanged()) {
			let {top, height, scrollTop} = this.getScrollerStyle();
			const transition = this.getTransition();			
			this.scrollStyle = transition && !this.dragging ? {transition} : null;
			this.barStyle = {
				display: top != null && height != null ? 'block' : 'none'
			};
			this.innerStyle = {
				top: scrollTop,
				transition: this.dragging && this.props.noTransitionOnDrag ? null : transition
			};
			this.scrollerTop = top;
			this.scrollerHeight = height;
		}		
		return {
			scrollerTop: this.scrollerTop,
			scrollerHeight: this.scrollerHeight,
			scrollStyle: this.scrollStyle,
			innerStyle: this.innerStyle,
			barStyle:  this.barStyle
		}
	}

	handleWheel = (e) => {
		const {onWheel, disabled, onDisabledWheel} = this.props;
		if (!disabled && typeof onWheel == 'function') {
			e.preventDefault();
			const [scrollTop, scrollTopPercent] = this.calculateScrollTop(e);
			const prevScrollTop = this.getScrollTop();
			if (Math.abs(prevScrollTop) != scrollTop) {
				onWheel(scrollTop, scrollTopPercent);
			}
		} else if (disabled && typeof onDisabledWheel == 'function') {
			onDisabledWheel();
		}
	}

	getScroller() {
		return this.refs.scroller.refs.main;
	}

	handleScrollerDragStart = () => {		
		this.dragging = true;
	}

	handleScrollerDragEnd = () => {
		this.dragging = false;
	}

	handleScrollerDrag = (x, y) => {
		const {onWheel} = this.props;
		if (typeof onWheel == 'function') {
			const {height: scrollerHeight} = this.getScroller().getBoundingClientRect();
			const barHeight = this.cachedBarHeight - scrollerHeight;
			if (barHeight > 0) {
				const scrollTopPercent = y * 100 / barHeight;
				const scrollTop = this.getScrollTopFromPercentage(scrollTopPercent);
				onWheel(scrollTop, Number(scrollTopPercent.toFixed(2)));
			}
		}
	}

	handleWindowResize = () => {
		this.forceUpdate();
	}

	getTransition() {
		let transitionSpeed = getNumberOrNull(this.props.transitionSpeed);
		if (!transitionSpeed) {
			return null;
		}
		transitionSpeed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, transitionSpeed));
		return 'top .' + transitionSpeed + 's';
	}
	
	getScrollTop() {
		let scrollTop = getNumberOrNull(this.props.scrollTop);
		if (scrollTop == null) {
			let scrollTopPercent = getNumberOrNull(this.props.scrollTopPercent);
			if (scrollTopPercent != null) {
				scrollTop = this.getScrollTopFromPercentage(scrollTopPercent);
			} else {
				scrollTop = 0;
			}
		}
		return -Math.abs(scrollTop);
	}

	getScrollTopFromPercentage(scrollTopPercent) {
		scrollTopPercent = Math.max(0, Math.min(100, scrollTopPercent));
		let diff = this.cachedDiff;
		if (diff == null) {
			this.getCalculatedDiff();
			diff = this.cachedDiff;
		}
		return Math.round(scrollTopPercent * -diff / 100);
	}

	getScrollTopPercentage(scrollTop) {
		return Number((scrollTop * 100 / -this.cachedDiff).toFixed(2));
	}

	getScrollerStyle() {
		let scrollTop = this.getScrollTop();
		return this.getCalculatedData(scrollTop);
	}

	calculateScrollTop(e) {
		const {deltaY} = e;
		let scrollStep = getNumberOrNull(this.props.scrollStep);
		if (!scrollStep) {
			scrollStep = DEFAULT_STEP;
		} else {
			scrollStep = Math.min(Math.max(scrollStep, MIN_STEP), MAX_STEP);
		}
		const step = scrollStep * (deltaY > 0 ? -1 : 1);		
		let scrollTop = this.getScrollTop();
		const {diff} = this.getCalculatedDiff();
		scrollTop += step;
		if (scrollTop > 0) {
			scrollTop = 0;
		} else if (diff < 0 && scrollTop < diff) {
			scrollTop = diff;
		}
		scrollTop = Math.abs(scrollTop);
		return [scrollTop , this.getScrollTopPercentage(scrollTop)];
	}

	getCalculatedDiff() {
		const {height: outerHeight} = this.refs.outer.getBoundingClientRect();
		const {height: innerHeight} = this.refs.inner.getBoundingClientRect();
		let barHeight;
		if (this.refs.bar) {
			barHeight = this.refs.bar.getBoundingClientRect().height;
			this.cachedBarHeight = barHeight;
		} else {
			this.cachedBarHeight = 0;
		}
		this.cachedOuterHeight = outerHeight;
		this.cachedInnerHeight = innerHeight;
		this.cachedDiff = outerHeight - innerHeight;
		return {
			diff: this.cachedDiff,
			outerHeight,
			innerHeight,
			barHeight
		};
	}

	getCalculatedData(scrollTop) {
		const {diff, outerHeight, innerHeight, barHeight} = this.getCalculatedDiff();
		const percentage =  Math.min(100, outerHeight / innerHeight * 100);
		let height, top;
		if (barHeight != null)  {
			height =  percentage == 100 ? null : Number((barHeight * percentage / 100).toFixed(2));
			top = -scrollTop * 100 / innerHeight;
		}
		return {
			diff,
			height,
			top: Number((top * barHeight / 100).toFixed(2)),
			scrollTop
		}
	}
}