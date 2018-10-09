import React from 'react';
import ReactDOM from 'react-dom';
import {registerContext, unregisterContext, withStateMaster} from './state-master';
import {UIEXAnimatedPropTypes} from './UIEXComponentPropTypes';
import {
	showImproperChildError,
	showProperChildMaxCountError,
	getComponentClassName,
	addStyleProperty,
	mergeObjects,
	mapChildren,
	propsChanged,
	cacheProps,
	popupQueue,
	ucfirst
} from './utils';
import {FORM_BUTTON_DISPLAY} from './consts';

export class UIEXComponent extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {};
		registerContext(this);		
	}
	
	getStyle(name) {
		const propKey = name + 'Style';
		const cachedPropKey = name + 'StyleCachedProp';
		const key = name + 'CachedStyle';
		const additionalStyles = this.getAdditionalStyle(name);
		if (this[cachedPropKey] !== this.props[propKey] || additionalStyles) {
			this[cachedPropKey] = this.props[propKey];
			this[key] = null;
			const defaultStyle = this.getDefaultStyle(name);
			if (this.props[propKey] instanceof Object || defaultStyle instanceof Object || additionalStyles) {
				this[key] = {
					...defaultStyle,
					...this.props[propKey],
					...additionalStyles
				};
			}
		}
		return this[key];
	}

	getMainStyle() {
		const {style, fontSize} = this.props;
		const isWithPropStyle = this.isWithPropStyle();
		const width = this.getWidthProp();
		const height = this.getHeightProp();
		const isCustomStyleChanged = this.isCustomStyleChanged();
		if (isCustomStyleChanged) {
			this.initCustomStyles();
		}
		if (
			isCustomStyleChanged ||
			(isWithPropStyle && this.cachedStyle != style) ||
			this.cachedWidth != width ||
			this.cachedHeight != height ||
			this.cachedFontSize != fontSize
		) {
			let newStyle = mergeObjects(this.getDefaultStyle());
			if (isWithPropStyle) {
				newStyle = mergeObjects(style, newStyle);
			}
			newStyle = addStyleProperty(fontSize, 'fontSize', newStyle);
			newStyle = addStyleProperty(width, 'width', newStyle);
			newStyle = addStyleProperty(height, 'height', newStyle);
			newStyle = mergeObjects(this.getCustomStyle(), newStyle);
			
			this.cachedStyle = style;
			this.cachedWidth = width;
			this.cachedHeight = height;
			this.cachedFontSize = fontSize;
			this.cachedMainStyle = newStyle;
		}
		return this.cachedMainStyle;
	}

	componentWillUnmount() {
		unregisterContext(this);
		this.isUnmounted = true;
	}

	renderChildren() {
		this.properChildrenCount = 0;
		this.currentProperChildIdx = -1;
		return this.prepareChildren(
			this.doRenderChildren(this.props.children)
		);
	}
	
	doRenderChildren(children) {
		if (children) {
			if (children instanceof Array) {
				return mapChildren(children, this.renderChild);
			}
			return this.renderChild(children);
		}
		return null;
	}

	renderChild = (child, idx = 0, arr = null) => {
		if (child) {
			if (child instanceof Array) {
				return this.doRenderChildren(child);
			}
			const isValidElement = React.isValidElement(child);
			const isProperChild = this.isProperChild(child.type);
			if (!isProperChild && this.canHaveOnlyProperChildren()) {
				showImproperChildError(child, this);
				return null;
			}
			if (isValidElement) {
				if (child.props.hidden) {
					return null;
				}
				const props = {
					key: child.key || idx
				};
				if (isProperChild) {
					if (!this.filterChild(child)) {
						return null;
					}
					const maxCount = this.getProperChildMaxCount();
					if (maxCount && maxCount == this.properChildrenCount) {
						showProperChildMaxCountError(child, this);
						return null;
					}
					this.currentProperChildIdx++;
					this.properChildrenCount++;
					const {
						disabled,
						vertical,
					} = this.props;

					if (disabled) {
						props.disabled = true;
					}
					if (vertical) {
						props.block = true;
					}
					let isLast = false;
					if (arr instanceof Array) {
						isLast = idx == arr.length - 1;
					}
					this.addChildProps(child, props, this.currentProperChildIdx, isLast);
				}
				const children = isProperChild ? child.props.children : this.doRenderChildren(child.props.children);
				child = React.cloneElement(child, props, children);
			}
			return child;
		}
		return null;
	}

	getProps(props, withStyle = true) {
		const {title} = this.props;
		const componentProps = {
			ref: 'main',
			className: getComponentClassName(this)
		};
		if (typeof title == 'string') {
			componentProps.title = title;
		}
		if (withStyle) {
			componentProps.style = this.getMainStyle();
		}
		if (props instanceof Object) {
			for (let k in props) {
				componentProps[k] = props[k];
			}
		}
		const customProps = this.getCustomProps();
		if (customProps instanceof Object) {
			for (let k in customProps) {
				componentProps[k] = customProps[k];
			}
		}
		return componentProps;
	}

	render() {
		this.initRendering();
		return this.renderInternal();
	}

	getNativeClassName() {
		let {className, additionalClassName, displayName, name} = this.constructor;
		if (displayName) {
			name = displayName;
		}
		className = 'uiex-' + (className || name.toLowerCase());
		if (additionalClassName) {
			className += ' uiex-' + additionalClassName;
		}
		return className;
	}

	getCustomProps() {
		return null;
	}

	getCustomStyle() {
		return null;
	}

	renderInternal() {
		const content = this.renderChildren();
		const TagName = this.getTagName();
		return (
			<TagName {...this.getProps()}>
				{content}
			</TagName>
		)
	}

	getTagName() {
		let {tagName} = this.props; 
		if (!tagName || typeof tagName != 'string' || !(/^[a-z]/i).test(tagName.charAt(0))) {
			tagName = 'div';
		}
		return tagName;
	}

	getDefaultStyle(name = 'main') {
		if (this.constructor.defaultStyles instanceof Object) {
			return this.constructor.defaultStyles[name];
		}
	}

	isProperChild(child) {
		if (child instanceof Object && typeof child.type == 'function') {
			child = child.type;
		}
		if (typeof child == 'function') {
			const {properChildren, properChildrenSign} = this.constructor;
			if (properChildren) {
				if (typeof properChildren == 'string') {
					return child.displayName == properChildren;
				} else if (properChildren instanceof Array) {
					return properChildren.indexOf(child.displayName) > -1;
				}
			}
			if (typeof properChildrenSign == 'string') {
				return !!child[properChildrenSign];
			}
		}
		return false;
	}

	getExpectedChildren() {
		const {properChildren} = this.constructor;
		if (properChildren) {
			if (typeof properChildren == 'string') {
				return properChildren;
			} else if (properChildren instanceof Array) {
				return properChildren.join(', ');
			}
		}
		return '';
	}

	canHaveOnlyProperChildren() {
		return this.constructor.onlyProperChildren;
	}

	getProperChildMaxCount() {
		return this.constructor.properChildrenMaxCount;
	}

	isOwnChild(element) {
		const {isInnerChild} = this.props;
		const {main} = this.refs;
		if (main instanceof Element) {
			const parent = main.parentNode;
			while (element instanceof Element) {
				if (element == main || (isInnerChild && element == parent)) {
					return true;
				}
				element = element.parentNode;
			}
		}
		return false;
	}

	filterChild() {
		return true;
	}

	getClassName(cn, add = null) {
		let classNames;
		if (cn instanceof Array) {
			classNames = [];
			for (let i = 0; i < cn.length; i++) {
				classNames.push(this.getClassName(cn[i]));
			}
			classNames = classNames.join(' ');
		} else {
			classNames = this.getNativeClassName() + '-' + cn;
		}
		return classNames + (add && typeof add == 'string' ? ' ' + add : '');
	}

	isAlignable() {
		return true;
	}

	prepareChildren(children) {
		return children;
	}

	getWidthProp() {
		return this.props.width;
	}

	getHeightProp() {
		return this.props.height;
	}

	isWithPropStyle() {
		return true;
	}

	isCustomStyleChanged() {
		const propsToCheck = this.constructor.propsToCheck;
		if (propsToCheck instanceof Array && propsChanged(this.props, this.cachedProps, propsToCheck)) {
			this.cachedProps = cacheProps(this.props, propsToCheck);
			return true;
		}
		return false;
	}
	
	fire(eventName, ...args) {
		const eventPropName = 'on' + ucfirst(eventName);
		const hasHandler = typeof this.props[eventPropName] == 'function';
		if (hasHandler) {
			this.props[eventPropName].apply(this, args);
		}
		return hasHandler;
	}

	firePropChange(eventName, propName, args, propValue) {
		if (this.props.uncontrolled) {
			this.setState({[propName]: propValue});
		} else {
			this.fire(eventName, ...args);
		}
	}

	getProp(name) {
		return this.props.uncontrolled ? this.state[name] : this.props[name];
	}

	cacheProps(list) {
		this.cachedProps = this.cachedProps || {};
		for (let i = 0; i < list.length; i++) {
			this.cachedProps[list[i]] = this.props[list[i]];
		}
	}

	isCachedPropsChanged(list) {
		this.cachedProps = this.cachedProps || {};
		if (!(list instanceof Array)) {
			if (this.props[list] !== this.cachedProps[list]) {
				this.cacheProps([list]);
				return true;
			}
			return false;
		}
		for (let i = 0; i < list.length; i++) {
			if (this.props[list[i]] !== this.cachedProps[list[i]]) {
				this.cacheProps(list);
				return true;
			}
		}
		return false;
	}

	initRendering() {}
	addChildProps() {}
	getStyleNames() {}
	addClassNames() {}
	initCustomStyles() {}
	getAdditionalStyle() {}
}


export class UIEXButtons extends UIEXComponent {
	addClassNames(add) {
		const {vertical, view} = this.props;
		add('button-group-vertical', vertical);
		add('button-group-' + view, view);
	}

	addCommonButtonsProps(child, props) {
		const {
			buttonColor,
			buttonWidth,
			buttonHeight,
			buttonStyle,
			iconSize,
			iconType,
			iconAtRight,
			view,
			gradient
		} = this.props;

		
		if (view == 'simple') {
			props.width = 'auto';
		}
		if (gradient && typeof child.props.gradient == 'undefined') {
			props.gradient = true;
		}
		if (buttonColor && !child.props.color) {
			props.color = buttonColor;
		}
		if (buttonWidth && !child.props.width) {
			props.width = buttonWidth;
		}
		if (buttonHeight && !child.props.height) {
			props.height = buttonHeight;
		}
		if (buttonStyle instanceof Object) {
			if (child.props.style instanceof Object) {
				props.style = {
					...buttonStyle,
					...child.props.style
				};
			} else {
				props.style = buttonStyle;
			}
		}
		if (iconSize && !child.props.iconSize) {
			props.iconSize = iconSize;
		}
		if (iconType && !child.props.iconType) {
			props.iconType = iconType;
		}
		if (iconAtRight && !child.props.iconAtRight) {
			props.iconAtRight = iconAtRight;
		}
	}
}

export class UIEXIcon extends UIEXComponent {
	getCustomProps() {
		let {disabled, onClick} = this.props;
		return {
			onClick: disabled ? null : onClick
		}
	}
}

export class UIEXForm extends UIEXComponent {
	addClassNames(add) {
		const {width, noBorder, buttonDisplay} = this.props;
		if (buttonDisplay && FORM_BUTTON_DISPLAY.indexOf(buttonDisplay) > -1) {
			add('form-button-' + buttonDisplay);
		} else {
			add('form-button-standart');
		}		
		add('simple-form');
		add('form-with-given-width', width);
		add('without-border', noBorder);
	}

	renderInternal() {		
		const {caption, contentBefore, children, captionInside} = this.props;
		return (
			<div {...this.getProps()}>
				{caption && !captionInside && 
					<div className={this.getClassName('caption')}>
						{caption}
					</div>
				}
				<div className={this.getClassName('inner')}>
					{caption && captionInside && 
						<div className={this.getClassName('caption')}>
							{caption}
						</div>
					}
					{contentBefore && 
						<div className={this.getClassName('content') + ' uiex-content-before'}>
							{contentBefore}
						</div>
					}
					{this.renderContent()}
					{children && 
						<div className={this.getClassName('content')}>
							{children}
						</div>
					}
				</div>
			</div>
		)
	}

	getClassName(cn) {
		return super.getClassName(cn) + ' uiex-simple-form-' + cn;
	}

	renderContent() {}
}


const ROOT_ID = 'uiex-popup-root';
export class UIEXPopup extends UIEXComponent {

	componentDidMount() {
		if (this.props.isOpen) {
			this.showPopup();
		}
	}

	addClassNames(add) {
		const {shown, outY, outX} = this.state;
		add('shown', shown);
		add('vertically-out', outY);
		add('horizontally-out', outX);
	}

	componentDidUpdate(prevProps) {
		const {isOpen} = this.props;
		if (!!isOpen != !!prevProps.isOpen) {
			if (isOpen) {
				this.showPopup();
			} else {
				this.hidePopup();
			}
		}
	}

	componentWillUnmount() {
		this.removeBodyClickHandler();
		super.componentWillUnmount();
	}

	getCustomProps() {
		return {
			onMouseDown: this.handleMouseDown
		}
	}

	addBodyClickHandler() {
		const {queueName} = this.props;
		if (queueName) {
			popupQueue.addObjectToQueue(queueName, this);
		}
		document.body.addEventListener('mousedown', this.handleBodyClick, false);
	}

	removeBodyClickHandler() {
		document.body.removeEventListener('mousedown', this.handleBodyClick, false);
	}	

	handleBodyClick = (e) => {
		if (!this.isOwnChild(e.target)) {
			const {queueName} = this.props;
			if (!queueName || popupQueue.isLastInQueue(queueName, this)) {
				if (queueName) {
					popupQueue.removeObjectFromQueue(queueName, this);
				}
				const {onCollapse} = this.props;
				if (typeof onCollapse == 'function') {
					onCollapse();
				}
				this.removeBodyClickHandler();
			}
		}
	}

	handleMouseDown = (e) => {
		e.stopPropagation();
	}

	renderInternal() {
		const {inPortal} = this.props;
		const TagName = this.getTagName();
		const content = (
			<TagName {...this.getProps()}>
				<div ref="inner" className="uiex-popup-inner">
					{this.renderContent()}
				</div>
			</TagName>
		);
		return inPortal ? ReactDOM.createPortal(content, this.getRootElement()) : content;
	}

	renderContent() {
		return this.renderChildren();
	}
	
	getRootElement() {
		let root = document.getElementById(ROOT_ID);
		if (!root) {
			root = document.createElement('div');
			root.id = ROOT_ID;
			document.body.appendChild(root);
		}
		return root;
	}

	getPositionState() {
		const {main} = this.refs;
		const inner = this.getInnerContainer();
		if (inner) {
			const {height, width} = inner.getBoundingClientRect();
			const {top, left} = main.getBoundingClientRect();
			const {innerHeight} = window;
			const {scrollWidth} = document.body;
			return {
				outY: top + height > innerHeight + 5,
				outX: left + width > scrollWidth + 5
			}
		}
		return {
			outY: false,
			outX: false
		}
	}

	showPopup() {
		clearTimeout(this.timeout);
		this.addBodyClickHandler();
		const {main} = this.refs;
		main.style.position = this.getPopupPosition();
		const {animation} = this.props;
		const positionState = this.getPositionState();
		main.style.opacity = '0';		
		this.setState({shown: true, ...positionState}, () => {
			if (animation) {
				main.style.transition = 'opacity .' + this.getSpeed() + 's';
			}
			this.timeout = setTimeout(() => main.style.opacity = '1', 0);
		});
	}

	hidePopup() {
		clearTimeout(this.timeout);
		this.removeBodyClickHandler();
		const {main} = this.refs;
		main.style.opacity = '0';
		const {animation} = this.props;
		const delay = animation ? this.getDelay() : 0;
		this.timeout = setTimeout(() => {
			main.style.position = '';		
			main.style.display = '';
			main.style.opacity = '';
			main.style.transition = '';
			this.setState({shown: false, outY: false, outX: false});
		}, delay + 100);
		
	}

	getInnerContainer() {
		return this.refs.inner;
	}

	getPopupPosition() {
		return 'absolute';
	}

	getSpeed() {
		let {speed} = this.props;
		switch (speed) {
			case 'fast':
				return 2;

			case 'slow':
				return 6;

			default:
				return 4;
		}
	}

	getDelay() {
		return this.getSpeed() * 100;
	}
}

export class UIEXBoxContainer extends UIEXPopup {
	getBoxProps() {
		const keys = Object.keys(UIEXAnimatedPropTypes);
		const boxProps = {};
		for (let k of keys) {
			boxProps[k] = this.props[k];
		}
		return boxProps;
	}
}