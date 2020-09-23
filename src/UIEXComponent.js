import React from 'react';
import ReactDOM from 'react-dom';
import {registerContext, unregisterContext} from './state-master';
import {UIEXAnimatedPropTypes} from './UIEXComponentPropTypes';
import {
	getComponentClassName,
	addStyleProperty,
	mergeObjects,
	propsChanged,
	cacheProps,
	popupQueue,
	ucfirst,
	getStyleObjectFromString,
	isObject,
	isNumber,
	isString,
	mergeStyleProps,
	preAnimate,
	animate,
	animateBack,
	addToClassName,
	isArray,
	isFunction
} from './utils';
import {
	showImproperChildError,
	showProperChildMaxCountError,
	showForbiddenChildError,
	showImproperParentError,
} from './error';
import {FORM_BUTTON_DISPLAY, POPUP_ROLES} from './consts';

export class UIEXComponent extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {};
		registerContext(this);

		if (!this.isInProperParent()) {
			this.improperParentError = showImproperParentError(this, this.constructor.properParentClasses);
		}
	}

	componentWillUnmount() {
		unregisterContext(this);
		this.isUnmounted = true;
	}
	
	getStyle(name) {
		const theme = this.getTheme();
		const key = name + 'CachedStyle';
		const propKey = name + 'Style';
		const cachedPropKey = name + 'StyleCachedProp';
		const customStyleMethod = 'get' + ucfirst(name) + 'Style';
		let customStyles;
		if (typeof this[customStyleMethod] == 'function') {
			customStyles = this[customStyleMethod]();
		}
		if (
			this[key] === undefined ||
			this[cachedPropKey] !== this.props[propKey] ||
			isObject(customStyles) ||
			this.isCachedPropsChanged('theme', name)
		) {
			this[cachedPropKey] = this.props[propKey];
			this[key] = mergeStyleProps(
				this.getDefaultStyle(name),
				this.getThemeStyle(theme, name),
				this.props[propKey],
				customStyles
			);
		}
		return this[key] || undefined;
	}

	getMainStyle() {
		let {style} = this.props;
		const theme = this.getTheme();
		const isWithPropStyle = this.isWithPropStyle();
		const width = this.getWidthProp();
		const height = this.getHeightProp();
		const isCustomStyleChanged = this.isCustomStyleChanged();
		if (isCustomStyleChanged) {
			this.initCustomStyles();
		}
		if (
			this.cachedMainStyle === undefined ||
			isCustomStyleChanged ||
			(isWithPropStyle && this.cachedStyle != style) ||
			this.cachedWidth != width ||
			this.cachedHeight != height || 
			this.cachedTheme != theme
		) {
			let newStyle = mergeObjects(this.getDefaultStyle());
			if (theme) {
				newStyle = mergeObjects(this.getThemeStyle(theme), newStyle);
			}
			if (isWithPropStyle) {
				if (typeof style == 'string') {
					style = getStyleObjectFromString(style);
				}
				newStyle = mergeObjects(style, newStyle);
			}
			newStyle = addStyleProperty(width, 'width', newStyle);
			newStyle = addStyleProperty(height, 'height', newStyle);
			newStyle = mergeObjects(this.getCustomStyle(), newStyle);
			
			this.cachedTheme = theme;
			this.cachedStyle = style;
			this.cachedWidth = width;
			this.cachedHeight = height;
			this.cachedMainStyle = newStyle || undefined;
		}
		return this.cachedMainStyle;
	}

	renderChildren() {
		const {properChildren, properChildrenSign} = this.constructor;
		if (!properChildren && !properChildrenSign) {
			return this.props.children;
		}
		this.properChildrenCount = 0;
		this.currentProperChildIdx = -1;
		return this.prepareChildren(
			this.doRenderChildren(this.props.children)
		);
	}
	
	doRenderChildren(children) {
		if (children) {
			if (children instanceof Array) {
				return children.map(this.renderChild);
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
			if (React.isValidElement(child)) {
				const isProperChild = this.isProperChild(child.type);
				if (!isProperChild) {
					if (this.canHaveOnlyProperChildren()) {
						return showImproperChildError(child, this);
					}
					if (this.isForbiddenChild(child)) {
						return showForbiddenChildError(child, this);
					}
					if (typeof child.type == 'function' && child.type.properChildren) {
						return child;
					}
					if (!child.props.children || isString(child.props.children) || isNumber(child.props.children)) {
						return child;
					}
				}				
				if (child.props.skipped) {
					return null;
				}
				const props = {
					key: child.key || idx
				};
				if (isProperChild) {
					const {singleChild, displayName} = this.constructor;
					this.currentProperChildIdx++;
					if (!this.filterChild(child, idx)) {
						return null;
					}
					if (singleChild && this.properChildrenCount) {
						return null;	
					}
					const maxCount = this.getProperChildMaxCount();
					if (maxCount && maxCount == this.properChildrenCount) {
						return showProperChildMaxCountError(child, this);
					}
					this.properChildrenCount++;
					
					const isLast = isArray(arr) && idx == arr.length - 1;
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
					this.addChildProps(child, props, this.currentProperChildIdx, isLast);
					props.parent = displayName;
					return React.cloneElement(child, props);
				}
				return React.cloneElement(child, props, this.doRenderChildren(child.props.children));
			}
			return isObject(child) ? JSON.stringify(child) : child;
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
		if (this.improperParentError) {
			return this.improperParentError;
		}
		if (this.props.skipped) {
			return null;
		}
		this.initRendering();
		return this.renderInternal();
	}

	getNativeClassName(mainElement = false) {
		let {className, additionalClassName, displayName, name} = this.constructor;
		if (displayName) {
			name = displayName;
		}
		className = 'uiex-' + (className || name.toLowerCase());
		if (mainElement && additionalClassName) {
			className += ' uiex-' + additionalClassName;
		}
		return className;
	}

	getCustomProps() {
		return null;
	}

	getCustomStyle() {
		return undefined;
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
		if (isObject(this.constructor.defaultStyles)) {
			let style = this.constructor.defaultStyles[name];
			if (typeof style == 'string') {
				style = getStyleObjectFromString(style);
			}
			if (isObject(style)) {
				return style;
			}
		}
	}

	getThemeStyle(theme, name = 'main') {
		if (this.constructor.themes instanceof Object && this.constructor.themes[theme]) {
			if (this.constructor.themes[theme] instanceof Object) {
				let style = this.constructor.themes[theme][name];
				if (typeof style == 'string') {
					style = getStyleObjectFromString(style);
				}
				if (style instanceof Object) {
					return style;
				}
			}
		}
	}

	getTheme() {
		const {theme} = this.props;
		return !!theme ? theme : (isObject(this.constructor.defaultProps) ? this.constructor.defaultProps.theme : undefined);
	}

	isProperChild(child) {
		if (child instanceof Object && typeof child.type == 'function') {
			child = child.type;
		}
		if (typeof child == 'function') {
			const {properChildren, properChildrenSign} = this.constructor;
			let isProper = false;
			if (properChildren) {
				if (typeof properChildren == 'string') {
					isProper = child.displayName == properChildren;
				} else if (properChildren instanceof Array) {
					isProper = properChildren.indexOf(child.displayName) > -1;
				}
			}
			if (!isProper && typeof properChildrenSign == 'string') {
				isProper = !!child[properChildrenSign];
			}
			return isProper;
		}
		return false;
	}

	isInProperParent() {
		let {properParentClasses} = this.constructor;
		if (properParentClasses) {
			const {parent} = this.props;
			if (!parent) {
				return false;
			}
			if (!isArray(properParentClasses)) {
				properParentClasses = [properParentClasses];
			}
			return properParentClasses.indexOf(parent) > -1;
		}
		return true;
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

	isForbiddenChild(child) {
		const {forbiddenChildren} = this.constructor;
		if (forbiddenChildren && child instanceof Object && typeof child.type == 'function') {
			if (!isArray(forbiddenChildren)) {
				return forbiddenChildren === child.type.name;
			}
			return forbiddenChildren.indexOf(child.type.name) > -1;
		}
		return false;
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

	getClassName(cn = null, ...add) {
		if (!cn) {
			return this.getNativeClassName();
		}
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
		if (add.length > 0) {
			for (let i = 0; i < add.length; i++) {
				if (add[i]) {
					classNames = addToClassName(add[i], classNames);
				}
			}
		}
		return classNames;
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
		const hasHandler = isFunction(this.props[eventPropName]);
		if (hasHandler) {
			const {sourceObject} = this.props;
			if (isObject(sourceObject)) {
				args.push(sourceObject);
			}
			this.props[eventPropName].apply(this, args);
		}
		return hasHandler;
	}

	firePropChange(eventName, propName, args, propValue = null) {
		if (this.props.uncontrolled) {
			if (!propName && isObject(propValue)) {
				this.setState(propValue);	
			} else if (propName) {
				this.setState({[propName]: propValue});
			}
		}
		this.fire(eventName, ...args);
	}

	getProp(name) {
		return this.props.uncontrolled && this.state && this.state[name] !== undefined ? this.state[name] : this.props[name];
	}

	cacheProps(list, name = '') {
		this.cachedProps = this.cachedProps || {};
		for (let i = 0; i < list.length; i++) {
			const key = (!!name ? name + '_' : '') + list[i];
			this.cachedProps[key] = this.props[list[i]];
		}
	}

	isCachedPropsChanged(list, name = '') {
		this.cachedProps = this.cachedProps || {};
		if (!(list instanceof Array)) {
			list = [list];
		}
		for (let i = 0; i < list.length; i++) {
			const key = (!!name ? name + '_' : '') + list[i];
			if (this.props[list[i]] !== this.cachedProps[key]) {
				this.cacheProps(list, name);
				return true;
			}
		}
		return false;
	}

	getElementStyle(name, value, getter) {
		this.cachedElementStyles = this.cachedElementStyles || {};
		const key = `${name}_${value}`;
		if (!this.cachedElementStyles[key]) {
			this.cachedElementStyles[key] = getter(value);
		}
		return this.cachedElementStyles[key];
	}

	initRendering() {}
	addChildProps() {}
	addClassNames() {}
	initCustomStyles() {}
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
const DEFAULT_Z_INDEX = 1000;
const ANIMATION_OPTIONS = {
	margin: 10,
	scaleUp: 0.9,
	scaleDown: 1.1
};

export class UIEXPopup extends UIEXComponent {
	constructor(props) {
		super(props);
		this.roots = {};
		this.zIndex = props.zIndex;
	}

	componentDidMount() {
		if (this.props.isOpen) {
			this.showPopup();
		}
	}

	addClassNames(add) {
		const {animation} = this.props;
		const {shown, outY, outX} = this.state;
		add('shown', shown);
		add('vertically-out', outY);
		add('horizontally-out', outX);
		add('animation-' + animation, animation);
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
		if (isObject(this.root)) {
			const count = this.root.childNodes.length;
			if (count === 1) {
				document.body.removeChild(this.root);
			}
		}
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
				setTimeout(() => {
					this.fire('collapse');
				}, 100);
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
		let {zIndex} = this;
		if (!zIndex || (!isString(zIndex) && !isNumber(zIndex))) {
			zIndex = DEFAULT_Z_INDEX;
		}
		if (!this.roots[zIndex]) {
			const rootId = `${ROOT_ID}-${zIndex}`;
			let root = document.getElementById(rootId);
			if (!root) {
				root = document.createElement('div');
				root.style.zIndex = zIndex;
				root.className = ROOT_ID;
				root.id = rootId;
				document.body.appendChild(root);
			}
			this.roots[zIndex] = root;
		}
		this.root = this.roots[zIndex];
		return this.roots[zIndex];
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
		preAnimate(main, this.getRootElement(), animation);
		setTimeout(() => {
			this.setState({shown: true}, () => {
				const positionState = this.getPositionState();
				this.setState(positionState, () => {
					this.handlePopupShown();
					animate(main, this.getRootElement(), animation, ANIMATION_OPTIONS);
				});
			});
		}, 100);
	}

	hidePopup() {
		clearTimeout(this.timeout);
		this.removeBodyClickHandler();
		const {main} = this.refs;
		const {animation} = this.props;
		animateBack(main, animation, ANIMATION_OPTIONS);
		const delay = animation ? this.getDelay() : 0;
		this.timeout = setTimeout(() => {
			this.setState({
				shown: false,
				outY: false,
				outX: false
			});
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

	handlePopupShown() {}
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