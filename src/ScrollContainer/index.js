import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Draggable} from '../Draggable';
import {getNumberOrNull, propsChanged, cacheProps} from '../utils';
import {ScrollContainerPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const DEFAULT_STEP = 50;
const PROPS_LIST = ['scrollTop', 'scrollTopPercent', 'width', 'height', 'style', 'fontSize', 'float', 'className', 'tagName', 'children'];

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
		window.removeEventListener('resize', this.handleWindowResize, false);
	}

	renderInternal() {
		const {outerContent} = this.props;
		const {scrollStyle, innerStyle, barStyle} = this.getStyles();
		const TagName = this.getTagName();
		return (
			<TagName {...this.getProps()}>
				<div ref="outer" className={this.getClassName('outer')}>
					<div ref="inner" className={this.getClassName('inner')} style={innerStyle}>
						{this.renderChildren()}
					</div>
					{scrollStyle && 
						<div className={this.getClassName('bar')} style={barStyle}>
							<Draggable
								className={this.getClassName('scroller')} 
								y={scrollStyle.top}
								height={scrollStyle.height}
								dragLimits="parent-in"
								vertical
								onDrag={this.handleScrollerDrag}
							/>
						</div>
					}
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
		if (!this.cachedProps) {
			return true;
		}
		const isChanged = propsChanged(this.props, this.cachedProps, PROPS_LIST);
		this.cachedProps = cacheProps(this.props, PROPS_LIST);
		return isChanged;
	}

	getStyles() {
		if (this.refs.outer && this.isAnyPropChanged()) {console.log(45)
			const scrollTop = this.getScrollTop();
			let {top, height} = this.getScrollerStyle();
			let display;
			this.barStyle = null;
			if (top == null) {
				display = 'none';
				height = 0;
				this.barStyle = {
					display: 'none'
				};
			}
			
			this.scrollStyle = {
				top,
				height,
				display
			};
			this.innerStyle = {
				top: scrollTop
			};
		}		
		return {
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
			onWheel(scrollTop, scrollTopPercent);
		} else if (disabled && typeof onDisabledWheel == 'function') {
			onDisabledWheel();
		}
	}

	handleScrollerDrag = ({x, y}) => {

	}

	handleWindowResize = () => {
		this.forceUpdate();
	}
	
	getScrollTop() {
		let scrollTop = getNumberOrNull(this.props.scrollTop);
		if (scrollTop == null) {
			const scrollTopPercent = getNumberOrNull(this.props.scrollTopPercent);
			if (scrollTopPercent != null) {

			} else {
				scrollTop = 0;
			}
		}
		return -scrollTop;
	}

	getScrollerStyle() {
		let scrollTop = this.getScrollTop();
		const {diff, height, top} = this.getCalculatedData(scrollTop);
		if (diff == null || diff >= 0) {
			return {};
		}		
		return {top, height};
	}

	calculateScrollTop(e) {
		const {deltaY} = e;
		const step = DEFAULT_STEP * (deltaY > 0 ? -1 : 1);		
		let scrollTop = this.getScrollTop();
		const {diff} = this.getCalculatedData(scrollTop);
		scrollTop += step;
		if (scrollTop > 0) {
			scrollTop = 0;
		} else if (diff < 0 && scrollTop < diff) {
			scrollTop = diff;
		}
		return [-scrollTop , 0]
	}

	calculateScrollerTopPercentage(scrollTop, diff) {
		return scrollTop / -diff * 100;
	}

	getCalculatedData(scrollTop) {
		if (!this.refs.outer) {
			return {};
		}
		const {height: outerHeight} = this.refs.outer.getBoundingClientRect();
		const {height: innerHeight} = this.refs.inner.getBoundingClientRect();
		const diff = outerHeight - innerHeight;
		const percentage =  outerHeight / innerHeight * 100;
		const height =  Number((outerHeight * percentage / 100).toFixed(2));		
		let top = -scrollTop * 100 / innerHeight;
		return {
			diff,
			diff2: (outerHeight / 2) - innerHeight,
			height,
			top: Number((top * outerHeight / 100).toFixed(2))
		}
	}
}