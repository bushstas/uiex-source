import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {LoaderPropTypes} from './proptypes';
import {Spinner} from '../Spinner';
import {getNumericProp} from '../utils';

import '../style.scss';
import './style.scss';

const DEFAULT_OPACITY = 8;
const MIN_OPACITY = 0;
const MAX_OPACITY = 10;

const MASK_PROPS_LIST = ['maskColor', 'maskOpacity', 'maskStyle'];

export class Loader extends UIEXComponent {
	static propTypes = LoaderPropTypes;
	static displayName = 'Loader';
	static styleNames = ['mask'];

	renderText() {
		const {textStyle, loadingText} = this.props;
		return (
			<div 
				className={this.getClassName('text')}
				style={textStyle}
			>
				{loadingText}
			</div>
		)
	}

	renderSpinner() {
		const {
			loadingText,
			spinnerType,
			spinnerColor,
			spinnerSize,
			spinnerThickness,
			spinnerSpeed
		} = this.props;
		return (
			<div className={this.getClassName('spinner-area')}>
				{loadingText && this.renderText()}
				<Spinner
					type={spinnerType}
					color={spinnerColor}
					size={spinnerSize}
					thickness={spinnerThickness}
					speed={spinnerSpeed}
				/>
			</div>
		)
	}

	getOpacity() {
		return getNumericProp(this.props.maskOpacity, DEFAULT_OPACITY, MIN_OPACITY, MAX_OPACITY) / 10;
	}

	getMaskStyle() {
		if (this.isCachedPropsChanged(MASK_PROPS_LIST, 'mask')) {
			return {
				backgroundColor: this.props.maskColor,
				opacity: this.getOpacity()
			};
		}
	}

	renderMask() {
		return (
			<div 
				className={this.getClassName('mask')}
				style={this.getStyle('mask')}
			/>
		)
	}

	renderInternal() {
		const {
			children,
			loading,
			overlayed,
			withoutMask
		} = this.props;
		const TagName = this.getTagName();
		return (
			<TagName {...this.getProps()}>
				{(!loading || overlayed) && (
					<div className={this.getClassName('content')}>
						{children}
					</div>
				)}
				{!withoutMask && loading && this.renderMask()}
				{loading && this.renderSpinner()}
			</TagName>
		)
	}
}