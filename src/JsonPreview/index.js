import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {previewRenderer, tabulation} from '../JSXPreview/utils';
import {JsonPreviewPropTypes} from './proptypes';

import '../style.scss';
import '../JSXPreview/style.scss';
import './style.scss';

const TAB = {
	1: "\t",
	2: "\t\t",
	3: "\t\t\t",
	4: "\t\t\t\t",
	5: "\t\t\t\t\t",
	6: "\t\t\t\t\t\t",
	7: "\t\t\t\t\t\t\t",
	8: "\t\t\t\t\t\t\t\t",
	9: "\t\t\t\t\t\t\t\t\t",
	10: "\t\t\t\t\t\t\t\t\t\t"
};

export class JsonPreview extends UIEXComponent {
	static propTypes = JsonPreviewPropTypes;
	static className = 'json-preview';
	static displayName = 'JsonPreview';

	initRendering() {
		this.tab = 0;
		this.content = '';
		this.info = null;
	}

	renderInternal() {
		const {data} = this.props;
		this.renderData(data);
		const TagName = this.getTagName();
		return (
			<TagName {...this.getProps()}>
				<pre dangerouslySetInnerHTML={{__html: this.content}}/>
				{this.renderInfo()}
			</TagName>
		)
	}

	renderInfo() {
		if (this.info) {
			return (
				<div className={this.getClassName('info')}>
					{this.info}
				</div>
			)
		}
	}

	renderData(data) {
		const isObject = data instanceof Object;
		const isArray = data instanceof Array;		
		const isElement = data instanceof Element;
		const isRegExp = data instanceof RegExp;
		const isFunction = data instanceof Function;
		const isPromise = data instanceof Promise;

		if (isObject && !isElement && !isRegExp && !isPromise) {
			if (isFunction) {
				return this.renderFunction(data);
			}
			if (isArray) {
				return this.renderArray(data);
			}
			if (data.jsonPreviewInfo) {
				this.info = data.jsonPreviewInfo;
				data = data.value;
				return this.renderData(data);
			}
			return this.renderObject(data);			
		}
		const item = this.getItem(data);
		this.renderLine(item);
	}

	renderFunction(data) {
		const content = data();
		if (React.isValidElement(content)) {
			tabulation.set(1);
			this.content += `() => (<div class="uiex-jsx-preview"><pre>${previewRenderer.render(content)}</pre></div>)`;
		} else {
			this.content += data.toString();
		}
	}

	renderArray(arr, isComma = false, isValue = false) {
		const len = arr.length;
		if (len == 0) {
			if (!isValue) {
				this.content += this.getTab();
			}
			this.content += this.wrapWithTag('[]', 'sign') + (isComma ? ',' : '') + "\n";
		} else {
			this.renderLine(this.wrapWithTag('[', 'sign'), false, isValue);
			this.addTab();
			for (let i = 0; i < len; i++) {
				const isComma = i < arr.length - 1;
				const item = this.getItem(arr[i], isComma);			
				if (item) {
					this.renderLine(item, isComma);
				}
			}
			this.addTab(-1);
			this.renderLine(this.wrapWithTag(']', 'sign') + (isComma ? ',' : ''));
		}
	}

	renderObject(obj, isComma = false, isValue = false) {
		const {noUndefined} = this.props;
		const keys = Object.keys(obj);
		const len = keys.length;
		if (len == 0) {
			if (!isValue) {
				this.content += this.getTab();
			}
			this.content += this.wrapWithTag('{}', 'sign') + (isComma ? ',' : '') + "\n";
		} else {
			this.renderLine(this.wrapWithTag('{', 'sign'), false, isValue);
			this.addTab();
			const lastKey = keys[len - 1];
			for (let k in obj) {
				if (noUndefined && obj[k] === undefined) {
					continue;
				}
				const key = this.getKey(k);
				const isWithComma = k != lastKey;
				this.renderLineStart(key + ': ');
				const item = this.getItem(obj[k], isWithComma, true);
				if (item) {
					this.renderLineEnd(item, isWithComma);
				}
			}
			this.addTab(-1);
			this.renderLine(this.wrapWithTag('}', 'sign') + (isComma ? ',' : ''));
		}
	}

	getItem(item, isComma, isValue = false) {
		switch (typeof item) {
			case 'symbol':
				return this.wrapWithTag(item.toString(), 'symbol');

			case 'string':
				return this.wrapWithTag('"' + item + '"', 'string');

			case 'number':
				return this.wrapWithTag(item, 'number');

			case 'boolean':
				return this.wrapWithTag(item.toString(), 'boolean');

			case 'undefined':
				return this.wrapWithTag('undefined', 'undefined');

			case 'function':
				return this.wrapWithTag('Function', 'function');

			case 'object':
				if (item === null) {
					return this.wrapWithTag('null', 'null');
				}
				if (item instanceof Element) {
					return this.wrapWithTag('Element', 'element');
				}
				if (item instanceof RegExp) {
					return this.wrapWithTag(item.toString(), 'regexp');
				}
				if (item instanceof Array) {
					return this.renderArray(item, isComma, isValue);
				}
				if (item instanceof Promise) {
					return this.wrapWithTag('Promise', 'promise');
				}
				return this.renderObject(item, isComma, isValue);
			
		}
	}

	renderLine(line, addComma = false, isWithoutTab = false) {
		this.content += (!isWithoutTab ? this.getTab(): '') + line + this.getComma(addComma) + "\n";
	}

	renderLineStart(start) {
		this.content += this.getTab() + start;
	}

	renderLineEnd(end, addComma = false) {
		this.content += end + this.getComma(addComma) + "\n";
	}

	addTab(add = 1) {
		this.tab += add;
	}

	getTab() {
		const quantity = this.tab;
		if (!quantity) {
			return '';
		}
		if (TAB[quantity]) {
			return TAB[quantity];
		}
		let tab = '';
		for (let i = 0; i < quantity; i++) {
			tab += "\t";
		}
		return tab;
	}

	getComma(isComma) {
		return isComma ? this.wrapWithTag(',', 'sign') : ''
	}

	wrapWithTag(item, className, tagName = 'span') {
		return '<' + tagName + ' class="' + this.getClassName(className) + '">' + item + '</' + tagName + '>';
	}

	getKey(key) {
		return this.wrapWithTag(key, 'key');
	}
}