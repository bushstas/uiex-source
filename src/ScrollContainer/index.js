import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Draggable} from '../Draggable';
import {getNumberOrNull, getNumberInPxOrPercent, propsChanged, cacheProps} from '../utils';
import {ScrollContainerPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const DEFAULT_STEP = 50;
const MIN_STEP = 20;
const MAX_STEP = 500;
const MIN_SPEED = 1;
const MAX_SPEED = 8;
const MIN_SCROLL_WIDTH = 5;
const MAX_SCROLL_WIDTH = 50;
const PROPS_LIST = ['scrollTop', 'scrollTopPercent', 'transitionSpeed', 'withoutScrollbar', 'innerPadding', 'scrollerWidth', 'trackColor', 'sliderColor', 'overflowMaskColor', 'overlaidScrollbar'];

export class ScrollContainer extends UIEXComponent {
	static propTypes = ScrollContainerPropTypes;
	static displayName = 'ScrollContainer';
	static className = 'scroll-container';
	static propsToCheck = ['outerPadding'];

	getCustomProps() {
		return {
			onWheel: this.handleWheel
		}
	}

	addClassNames(add) {
		const {withoutScrollbar, hiddenScrollbar, scrollbarAtLeft, transparentTrack, overlaidScrollbar} = this.props;
		add('without-scrollbar', withoutScrollbar);
		add('overlaid-scrollbar', overlaidScrollbar);
		add('hidden-scrollbar', hiddenScrollbar);
		add('scrollbar-at-left', scrollbarAtLeft);
		add('transparent-track', transparentTrack);
		add('dragging', this.state.dragging);
	}

	componentDidMount() {
		this.forceUpdate();
		window.addEventListener('resize', this.handleWindowResize, false);
	}

	componentWillUnmount() {
		clearTimeout(this.timeout);
		window.removeEventListener('resize', this.handleWindowResize, false);
	}

	getCustomStyle() {
		const {outerPadding} = this.props;
		if (outerPadding) {
			return {
				padding: getNumberInPxOrPercent(outerPadding)
			}
		}
	}

	renderInternal() {
		const {outerContent, disabled} = this.props;
		const {scrollStyle, innerStyle, barStyle, scrollerTop, scrollerHeight, topMaskStyle, bottomMaskStyle} = this.getStyles();
		const TagName = this.getTagName();
		return (
			<TagName {...this.getProps()}>
				<div ref="outer" className={this.getClassName('outer')}>
					<div ref="inner" className={this.getClassName('inner')} style={innerStyle}>
						{this.renderChildren()}
					</div>
					<div className={this.getClassName('top-mask')} style={topMaskStyle}/>
					<div className={this.getClassName('bottom-mask')} style={bottomMaskStyle}/>
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
		clearTimeout(this.timeout);
		this.timeout = setTimeout(this.checkToUpdate, 0);
		if (propsChanged(this.props, this.cachedProps, PROPS_LIST)) {
			this.cachedProps = cacheProps(this.props, PROPS_LIST);
			return true;
		}
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
					return onWheel(diff, 100);
				}
			}
			this.cachedProps = null;
			this.forceUpdate();
		}
	}

	getStyles() {
		if (this.refs.outer && this.isAnyPropChanged()) {
			const {withoutScrollbar, innerPadding, scrollbarAtLeft, trackColor, sliderColor} = this.props;
			const {dragging} = this.state;
			let {top, height, scrollTop} = this.getScrollerStyle();
			const transition = this.getTransition();
			const scrollerWidth = this.getScrollerWidth();
			this.scrollStyle = transition && !dragging ? {transition} : null;
			const diff = this.cachedDiff || 0;
			const noScroll = top == null || height == null;
			
			this.barStyle = {
				display: noScroll ? 'none' : 'block',
				width: scrollerWidth,
				backgroundColor: trackColor
			};
			this.innerStyle = {
				top: scrollTop,
				transition: dragging && this.props.noTransitionOnDrag ? null : transition,
				padding: getNumberInPxOrPercent(innerPadding)
			};
			this.innerStyle[scrollbarAtLeft ? 'left' : 'right'] = withoutScrollbar ? 0 : scrollerWidth;
			this.scrollerTop = top;
			this.scrollerHeight = height;

			const isTopLimit =  noScroll || scrollTop > -15;
			this.topMaskStyle = {
				display: isTopLimit ? 'none' : 'block',
				backgroundImage: this.getMaskGradient('top')
			};

			const isBottomLimit = noScroll || scrollTop <= diff + 15;
			this.bottomMaskStyle = {
				display: isBottomLimit ? 'none' : 'block',
				backgroundImage: this.getMaskGradient('bottom')
			};

			if (sliderColor) {
				this.scrollStyle = this.scrollStyle || {};
				this.scrollStyle.backgroundColor = sliderColor
			}
		}		
		return {
			scrollerTop: this.scrollerTop,
			scrollerHeight: this.scrollerHeight,
			scrollStyle: this.scrollStyle,
			innerStyle: this.innerStyle,
			barStyle:  this.barStyle,
			topMaskStyle: this.topMaskStyle,
			bottomMaskStyle: this.bottomMaskStyle,
			sliderStyle: this.sliderStyle
		};
	}

	handleWheel = (e) => {
		const {onWheel, disabled, onDisabledWheel} = this.props;
		if (!disabled && typeof onWheel == 'function') {
			e.preventDefault();
			if (this.isInTransition) {
				return;
			}
			const [scrollTop, scrollTopPercent] = this.calculateScrollTop(e);
			if (scrollTop != null) {
				const prevScrollTop = this.getScrollTop();
				if (Math.abs(prevScrollTop) != scrollTop) {
					onWheel(scrollTop, scrollTopPercent);
				}
			}
		} else if (disabled && typeof onDisabledWheel == 'function') {
			onDisabledWheel();
		}
	}

	getMaskGradient(side) {
		const {overflowMaskColor} = this.props;
		if (overflowMaskColor) {
			return 'linear-gradient(to ' + side + ', transparent, ' + overflowMaskColor + ')';
		}
	}

	getScroller() {
		return this.refs.scroller.refs.main;
	}

	handleScrollerDragStart = () => {		
		this.setState({dragging: true});
	}

	handleScrollerDragEnd = () => {
		this.setState({dragging: false});
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
		if (!this.needTransition) {
			this.needTransition = true;
			return null;
		}
		if (this.scrollingIntoViewTransition) {
			const transition = this.scrollingIntoViewTransition;
			this.scrollingIntoViewTransition = null;
			return transition;
		}
		let transitionSpeed = getNumberOrNull(this.props.transitionSpeed);
		if (!transitionSpeed) {
			return null;
		}
		transitionSpeed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, transitionSpeed));
		return 'top .' + transitionSpeed + 's';
	}

	getScrollerWidth() {
		let scrollerWidth = getNumberOrNull(this.props.scrollerWidth);
		if (!scrollerWidth) {
			return null;
		}
		return Math.max(MIN_SCROLL_WIDTH, Math.min(MAX_SCROLL_WIDTH, scrollerWidth));
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
		const scrollTop = this.validateScrollTop(this.getScrollTop());
		return this.getCalculatedData(Math.abs(scrollTop));
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
		if (diff >= 0) {
			return [];
		}
		scrollTop = Math.abs(this.validateScrollTop(scrollTop + step));
		return [scrollTop , this.getScrollTopPercentage(scrollTop)];
	}
	
	validateScrollTop(scrollTop) {
		let diff = this.cachedDiff;
		if (diff == null) {
			diff = this.getCalculatedDiff().diff;
		}
		if (scrollTop > 0) {
			return 0;
		} else if (diff < 0 && scrollTop < diff) {
			return diff;
		}
		return scrollTop;
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
			top = scrollTop * 100 / innerHeight;
		}
		return {
			diff,
			height,
			top: Number((top * barHeight / 100).toFixed(2)),
			scrollTop: -scrollTop
		}
	}

	scrollIntoView(selector, options) {
		let duration;
		if (options instanceof Object) {
			const transitionSpeed = getNumberOrNull(options.transitionSpeed);
			if (transitionSpeed) {
				duration = transitionSpeed;
			}
		}
		const {onWheel} = this.props;
		if (typeof onWheel == 'function') {
			const {inner} = this.refs;
			const element = inner.querySelector(selector);
			if (element) {
				const parentTop = inner.getBoundingClientRect().top;
				const elementTop = element.getBoundingClientRect().top;
				let relativeTop = elementTop - parentTop - 20;
				if (duration) {
					duration = Math.max(MIN_SPEED, Math.min(MAX_SPEED, duration));
					this.scrollingIntoViewTransition = 'top .' + duration + 's ease-in-out';
					this.isInTransition = true;
					setTimeout(() => {
						this.isInTransition = false;
					}, duration * 100);
				}
				let diff = this.cachedDiff;
				if (diff == null) {
					this.getCalculatedDiff();
					diff = this.cachedDiff;
				}
				relativeTop = Math.min(Math.max(0, relativeTop), -diff);
				onWheel(relativeTop, this.getScrollTopPercentage(relativeTop));
			}
		}
	}
}