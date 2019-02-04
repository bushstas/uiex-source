import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {getProperStyleProperty, getNumberOrNull} from '../utils';
import {TextCutPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export class TextCut extends UIEXComponent {
	static propTypes = TextCutPropTypes;
	static displayName = 'TextCut';
	static className = 'text-cut';
	static propsToCheck = ['maxHeight', 'lineHeight', 'maxLines'];

	constructor(props) {
		super(props);
		this.state = {
			withEllipsis: false
		};
	}

	componentDidMount() {
		this.checkCut();
	}

	componentDidUpdate() {
		this.checkCut();	
	}

	checkCut() {
		if (this.withEllipsis && this.refs.inner) {
			const {height} = this.refs.inner.getBoundingClientRect();
			this.setState({withEllipsis: height > this.maxHeight});
		} else {
			this.setState({withEllipsis: false});
		}
	}

	addClassNames(add) {
		const {withMask, justified} = this.props;
		add('with-mask', withMask);
		add('justified', justified);
	}

	initRendering() {
		let {
			maxHeight,
			maxLines,
			lineHeight,
			withEllipsis
		} = this.props;
		lineHeight = getNumberOrNull(lineHeight);
		maxLines = getNumberOrNull(maxLines);
		if (maxLines && lineHeight) {
			maxHeight = maxLines * lineHeight;
		} else {
			maxHeight = getNumberOrNull(maxHeight);
		}
		this.maxHeight = maxHeight;
		this.withEllipsis = maxHeight && withEllipsis;
	}

	getCustomStyle() {
		if (this.maxHeight) {
			return {maxHeight: getProperStyleProperty(this.maxHeight)};
		}
		return null;
	}

	renderInternal() {
		const {children, withEllipsisMask} = this.props;
		const TagName = this.getTagName(); 
		return (
			<TagName {...this.getProps()}>				
				<div
					ref="inner"
					className={this.getClassName('inner')}
				>
					{children} 
				</div>
				{this.state.withEllipsis && 
					<div className={this.getClassName('ellipsis')}>
						...
						{withEllipsisMask &&
							<div className={this.getClassName('ellipsis-mask')} />
						}
					</div>
				}
			</TagName>
		)
	}

	handleClick = () => {
		
	}
}