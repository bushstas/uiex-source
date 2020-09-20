import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Draggable} from '../Draggable';
import {getNumberOrNull, getNumberInPxOrPercent, propsChanged, cacheProps, getNumericProp, isFunction} from '../utils';
import {ScrollContainerPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const DEFAULT_STEP = 50;
const DEFAULT_SLIDER_WIDTH = 12;
const DEFAULT_TRACK_WIDTH = 12;
const MIN_STEP = 20;
const MAX_STEP = 500;
const DEFAULT_SPEED = null;
const MIN_SPEED = 1;
const MAX_SPEED = 8;
const MIN_SLIDER_WIDTH = 5;
const MAX_SLIDER_WIDTH = 50;
const MIN_TRACK_WIDTH = 1;
const MAX_TRACK_WIDTH = 50;
const MIN_MASK_HEIGHT = 10;
const MAX_MASK_HEIGHT = 50;
const DEFAULT_RADIUS = null;
const MIN_RADIUS = 0;
const MAX_RADIUS = 50;
const DEFAULT_TRANSITION_EFFECT = 'linear';

const wheelEventOptions = {
	capture: false,
	passive: false
};

const PROPS_LIST = [
	'scrollTop',
	'scrollTopPercent',
	'transitionSpeed',
	'withoutScrollbar',
	'innerPadding',
	'trackWidth',
	'sliderWidth',
	'trackColor',
	'sliderColor',
	'overflowMaskColor',
	'overlaidScrollbar',
	'scrollbarRadius',
	'overflowMaskHeight'
];

export class ScrollContainer extends UIEXComponent {
	static propTypes = ScrollContainerPropTypes;
	static displayName = 'ScrollContainer';
	static className = 'scroll-container';
	static propsToCheck = ['outerPadding'];

	constructor(props) {
		super(props);
		if (props.uncontrolled) {
			this.state = {
				scrollTop: 0
			};
		}
	}

	getCustomProps() {
		return {
			onKeyDown: this.handleKeyDown,
			tabIndex: 0
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
		this.refs.main.addEventListener('wheel', this.handleWheel, wheelEventOptions);

		if (MutationObserver) {
			let currentHeight = this.refs.inner.getBoundingClientRect().height;
			this.observer = new MutationObserver(() => {
			    setTimeout(() => {
				    const newHeight = this.refs.inner.getBoundingClientRect().height;
				    if (currentHeight !== newHeight) {
				    	currentHeight = newHeight;
				        this.contentHeightChanged = true;			       
				        this.forceUpdate();
				    }
				}, 100);
			});
			this.observer.observe(this.refs.inner, {
				attributes: true,
				subtree: true,
				childList: true
			});
		}
	}

	componentWillUnmount() {
		clearTimeout(this.timeout);
		clearTimeout(this.scrollingTimeout);
		window.removeEventListener('resize', this.handleWindowResize, false);
		this.refs.main.removeEventListener('wheel', this.handleWheel, wheelEventOptions);
		if (this.observer) {
			this.observer.disconnect();
		}
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
		const {dragging, scrolling} = this.state;
		const {outerContent, disabled, indicateScrollTop} = this.props;
		const {sliderStyle, innerStyle, trackStyle, sliderTop, sliderLeft, sliderHeight, topMaskStyle, bottomMaskStyle} = this.getStyles();
		const TagName = this.getTagName();
		return (
			<TagName {...this.getProps()}>
				<div ref="outer" className={this.getClassName('outer')}>
					<div ref="inner" className={this.getClassName('inner')} style={innerStyle}>
						{this.renderChildren()}
					</div>
					<div className={this.getClassName('top-mask')} style={topMaskStyle}/>
					<div className={this.getClassName('bottom-mask')} style={bottomMaskStyle}/>
					<div 
						ref="track" 
						className={this.getClassName('track')} 
						style={trackStyle}
						onClick={this.handleTrackClick}
					>
						<Draggable
							ref="slider"
							className={this.getClassName('slider')} 
							x={sliderLeft}
							y={sliderTop}
							height={sliderHeight}
							style={sliderStyle}
							dragLimits="parent-in"
							disabled={disabled}
							vertical
							onDrag={this.handleSliderDrag}
							onDragStart={this.handleSliderDragStart}
							onDragEnd={this.handleSliderDragEnd}
						>
							{indicateScrollTop && (dragging || scrolling) && 
								<div className={this.getClassName('indicator')}>
									{Math.abs(this.cachedScrollTop).toString()}
								</div>
							}
						</Draggable>
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
		this.timeout = setTimeout(this.checkToUpdate, 200);
		if (propsChanged(this.props, this.cachedProps, PROPS_LIST)) {
			this.cachedProps = cacheProps(this.props, PROPS_LIST);
			return true;
		}
	}

	fireWheel(scrollTop, scrollTopPercent) {
		if (this.props.uncontrolled) {
			this.scrollTopChanged = true;
		}
		this.firePropChange('wheel', 'scrollTop', [scrollTop, scrollTopPercent], scrollTop);
	}

	checkToUpdate = () => {
		const {height: outerHeight} = this.refs.outer.getBoundingClientRect();
		const {height: innerHeight} = this.refs.inner.getBoundingClientRect();
		if (
			innerHeight != this.cachedInnerHeight ||
			outerHeight != this.cachedOuterHeight
		) {
			const {onWheel, uncontrolled} = this.props;
			const scrollTop = this.getScrollTop();
			if (scrollTop && (isFunction(onWheel) || uncontrolled)) {
				if (innerHeight <= outerHeight) {
					return this.fireWheel(0, 0);
				}
				const diff = innerHeight - outerHeight;
				if (Math.abs(scrollTop) > diff) {
					return this.fireWheel(diff, 100);
				}
			}
			this.cachedProps = null;
			this.forceUpdate();
		}
	}

	getStyles() {
		if (this.refs.outer && (this.contentHeightChanged || this.scrollTopChanged || this.isAnyPropChanged())) {
			this.contentHeightChanged = false;
			this.scrollTopChanged = false;
			const {withoutScrollbar, innerPadding, scrollbarAtLeft, trackColor, sliderColor} = this.props;
			const {dragging} = this.state;
			let {top, height, scrollTop} = this.calculateScrollbarData();
			const transition = this.getTransition();
			const trackWidth = this.getTrackWidth();
			const sliderWidth = this.getSliderWidth();
			const scrollbarRadius = this.getScrollbarRadius();

			const diff = this.cachedDiff || 0;
			const noScroll = top == null || height == null;

			this.trackStyle = {
				visibility: noScroll ? 'hidden' : 'visible',
				width: noScroll ? 0 : trackWidth,
				backgroundColor: trackColor,
				borderRadius: scrollbarRadius
			};
			this.sliderStyle = {
				width: sliderWidth,
				transition: !dragging ? transition : null
			};
			if (sliderColor) {
				this.sliderStyle.backgroundColor = sliderColor;
			}
			if (scrollbarRadius) {
				this.sliderStyle.borderRadius = scrollbarRadius;
			}
			if (trackWidth) {
				this.trackStyle.width = trackWidth;
				if (trackWidth >= sliderWidth) {
					this.trackStyle.right = 0;
				} else {
					this.trackStyle.right = Math.ceil((sliderWidth - trackWidth) / 2);
				}
			}
			this.innerStyle = {
				top: scrollTop,
				transition: dragging && this.props.noTransitionOnDrag ? null : transition,
				padding: getNumberInPxOrPercent(innerPadding)
			};
			const sideMargin = Math.max(sliderWidth, trackWidth);
			this.innerStyle[scrollbarAtLeft ? 'left' : 'right'] = withoutScrollbar ? 0 : sideMargin;
			this.sliderLeft = Math.ceil((trackWidth - sliderWidth) / 2);
			this.sliderTop = top;
			this.sliderHeight = height;

			let overflowMaskHeight = getNumberOrNull(this.props.overflowMaskHeight);
			if (overflowMaskHeight) {
				overflowMaskHeight = Math.max(MIN_MASK_HEIGHT, Math.min(MAX_MASK_HEIGHT, overflowMaskHeight));
			} else {
				overflowMaskHeight = '';
			}
			if (!noScroll && scrollTop < -15) {
				this.topMaskStyle = {
					display: 'block',
					backgroundImage: this.getMaskGradient('top'),
					height: overflowMaskHeight
				};
			} else {
				this.topMaskStyle = null;
			}
			if (!noScroll && scrollTop > diff + 15) {
				this.bottomMaskStyle = {
					display: 'block',
					backgroundImage: this.getMaskGradient('bottom'),
					height: overflowMaskHeight
				};
			} else {
				this.bottomMaskStyle = null;
			}
		}
		return {
			sliderTop: this.sliderTop,
			sliderLeft: this.sliderLeft,
			sliderHeight: this.sliderHeight,
			sliderStyle: this.sliderStyle,
			innerStyle: this.innerStyle,
			trackStyle:  this.trackStyle,
			topMaskStyle: this.topMaskStyle,
			bottomMaskStyle: this.bottomMaskStyle,
			sliderStyle: this.sliderStyle
		};
	}

	handleTrackClick = (e) => {
		const {
			onWheel,
			disabled,
			onDisabledWheel,
			uncontrolled
		} = this.props;
		if ((isFunction(onWheel) || uncontrolled) && !disabled) {
			let trackHeight = this.cachedTrackHeight;
			let sliderHeight = this.cachedSliderHeight;
			if (sliderHeight == null) {
				sliderHeight = this.refs.slider.getBoundingClientRect().height;
			}
			if (trackHeight == null) {
				trackHeight = this.getCalculatedDiff().trackHeight;
			}
			const halfOfSliderHeight = sliderHeight / 2;
			const y = e.nativeEvent.offsetY - halfOfSliderHeight;
			let scrollTopPercent = y * 100 / (trackHeight - sliderHeight);
			if (scrollTopPercent < 0) {
				scrollTopPercent = 0;
			} else if (scrollTopPercent > 100) {
				scrollTopPercent = 100;
			}
			const scrollTop = this.getScrollTopFromPercentage(scrollTopPercent);
			this.fireWheel(scrollTop, Number(scrollTopPercent.toFixed(2)));
		} else if (disabled && typeof onDisabledWheel == 'function') {
			onDisabledWheel();
		}
	}

	handleWheel = (e) => {
		const {
			onWheel,
			disabled,
			onDisabledWheel,
			uncontrolled
		} = this.props;
		if (!disabled && (isFunction(onWheel) || uncontrolled)) {
			e.preventDefault();
			if (this.isInTransition) {
				return;
			}
			const [scrollTop, scrollTopPercent] = this.calculateScrollTop(e);
			if (scrollTop != null) {
				const prevScrollTop = this.getScrollTop();
				if (Math.abs(prevScrollTop) != scrollTop) {
					this.setState({scrolling: true});
					clearTimeout(this.scrollingTimeout);
					this.scrollingTimeout = setTimeout(() => {
						this.setState({scrolling: false})
					}, 1000);
					this.fireWheel(scrollTop, scrollTopPercent);
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

	getSlider() {
		return this.refs.slider.refs.main;
	}

	handleSliderDragStart = () => {		
		this.setState({dragging: true});
	}

	handleSliderDragEnd = () => {
		this.setState({dragging: false});
	}

	handleSliderDrag = (x, y) => {
		const {onWheel, uncontrolled, disabled} = this.props;
		if ((uncontrolled || isFunction(onWheel)) && !disabled) {
			const {height: sliderHeight} = this.getSlider().getBoundingClientRect();
			const trackHeight = this.cachedTrackHeight - sliderHeight;
			if (trackHeight > 0) {
				const scrollTopPercent = y * 100 / trackHeight;
				const scrollTop = this.getScrollTopFromPercentage(scrollTopPercent);
				this.fireWheel(scrollTop, Number(scrollTopPercent.toFixed(2)));
			}
		}
	}

	handleKeyDown = (e) => {
		switch (e.key) {
			case 'ArrowUp':
			case 'ArrowDown':
			case 'Home':
			case 'End':
			case 'PageUp':
			case 'PageDown':
				return this.handleWheel(e);
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
		let {transitionEffect} = this.props;
		if (!transitionEffect || transitionEffect != 'string') {
			transitionEffect = DEFAULT_TRANSITION_EFFECT;
		}
		const transitionSpeed = getNumericProp(this.props.transitionSpeed, DEFAULT_SPEED, MIN_SPEED, MAX_SPEED)
		return 'top .' + transitionSpeed + 's ' + transitionEffect;
	}

	getSliderWidth() {
		const {sliderWidth} = this.props;
		return getNumericProp(sliderWidth, DEFAULT_SLIDER_WIDTH, MIN_SLIDER_WIDTH, MAX_SLIDER_WIDTH);
	}

	getScrollbarRadius() {
		const {scrollbarRadius} = this.props;
		return getNumericProp(scrollbarRadius, DEFAULT_RADIUS, MIN_RADIUS, MAX_RADIUS);
	}

	getTrackWidth() {
		const {trackWidth} = this.props;
		return getNumericProp(trackWidth, DEFAULT_TRACK_WIDTH, MIN_TRACK_WIDTH, MAX_TRACK_WIDTH);
	}
	
	getScrollTop() {
		let scrollTop = getNumberOrNull(this.getProp('scrollTop'));
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

	calculateScrollbarData() {
		const scrollTop = this.validateScrollTop(this.getScrollTop());
		this.cachedScrollTop = scrollTop;
		return this.getCalculatedData(Math.abs(scrollTop));
	}

	calculateScrollTop(e) {
		let deltaY;
		let scrollStep = getNumericProp(this.props.scrollStep, DEFAULT_STEP, MIN_STEP, MAX_STEP);		
		const {diff} = this.getCalculatedDiff();
		if (diff >= 0) {
			return [];
		}
		if (e.type != 'keydown') {
			deltaY = e.deltaY;
		} else {
			const {key} = e;
			if (key == 'ArrowUp') {
				deltaY = -1;
			} else if (key == 'ArrowDown') {
				deltaY = 1;
			} else if (key == 'Home') {
				return [0 , 0];
			} else if (key == 'End') {
				return [-diff , 100];
			}
			if (this.cachedOuterHeight && (key == 'PageUp' || key == 'PageDown')) {
				scrollStep = this.cachedOuterHeight;
				deltaY = key == 'PageUp' ? -1 : 1;
			}
		}
		const step = scrollStep * (deltaY > 0 ? -1 : 1);		
		let scrollTop = this.getScrollTop();		
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
		let trackHeight;
		if (this.refs.track) {
			trackHeight = this.refs.track.getBoundingClientRect().height;
			this.cachedTrackHeight = trackHeight;
		} else {
			this.cachedTrackHeight = 0;
		}
		this.cachedOuterHeight = outerHeight;
		this.cachedInnerHeight = innerHeight;
		this.cachedDiff = outerHeight - innerHeight;
		return {
			diff: this.cachedDiff,
			outerHeight,
			innerHeight,
			trackHeight
		};
	}

	getCalculatedData(scrollTop) {
		const {diff, outerHeight, innerHeight, trackHeight} = this.getCalculatedDiff();
		const percentage =  Math.min(100, outerHeight / innerHeight * 100);
		let height = 0, top = 0;
		if (trackHeight != null && !!innerHeight)  {
			height =  percentage == 100 ? null : Number((trackHeight * percentage / 100).toFixed(2));
			top = scrollTop * 100 / innerHeight;
		}
		this.cachedSliderHeight = height;
		return {
			diff,
			height,
			top: Number((top * trackHeight / 100).toFixed(2)),
			scrollTop: -scrollTop
		};
	}

	scrollIntoView(selector, options) {
		let duration, effect;
		if (options instanceof Object) {
			const optDuration = getNumberOrNull(options.duration);
			if (optDuration) {
				duration = optDuration;
			}
			effect = options.effect;
		}
		const {onWheel, uncontrolled} = this.props;
		if (isFunction(onWheel) || uncontrolled) {
			const {inner} = this.refs;
			const element = inner.querySelector(selector);
			if (element) {
				const parentTop = inner.getBoundingClientRect().top;
				const elementTop = element.getBoundingClientRect().top;
				let relativeTop = elementTop - parentTop - 20;
				if (duration) {
					duration = Math.max(MIN_SPEED, Math.min(MAX_SPEED, duration));
					this.scrollingIntoViewTransition = 'top .' + duration + 's' + (effect && typeof effect == 'string' ? ' ' + effect : DEFAULT_TRANSITION_EFFECT);
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
				this.fireWheel(relativeTop, this.getScrollTopPercentage(relativeTop));
			}
		}
	}
}