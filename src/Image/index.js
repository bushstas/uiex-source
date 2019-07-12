import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {getNumber, getNumberOrNull, isNumber, isString} from '../utils';
import {ImagePropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const DEFAULT_IMAGE_SIZE = 100;
const DEFAULT_REFLECTION_HEIGHT = 30;
const DEFAULT_REFLECTION_OPACITY = 4;
const DEFAULT_BORDER_COLOR = '#F1F1F1';
const DEFAULT_REFLECTION_MASK_COLOR = '#FFFFFF';
const DEFAULT_BORDER_OPACITY = 10;

export class Image extends UIEXComponent {
	static propTypes = ImagePropTypes;
	static displayName = 'Image';

	getReflectionHeight() {
		const {height, reflectionHeight: rh} = this.props;
		const reflectionHeight = getNumber(rh, DEFAULT_REFLECTION_HEIGHT);
		return Math.round(height * reflectionHeight / 100);
	}

	getBorder() {
		const {borderWidth, borderColor} = this.props;
		const {hover} = this.state;
		let hoverBorderWidth;
		let hoverBorderColor;
		if (hover) {
			hoverBorderWidth = this.props.hoverBorderWidth;
			hoverBorderColor = this.props.hoverBorderColor;
		}
		const width = getNumber(hoverBorderWidth, borderWidth);
		const color = hoverBorderColor || borderColor || DEFAULT_BORDER_COLOR;
		if (width) {
			return `${width}px solid ${color}`;
		}
	}

	getBorderOpacity() {
		const {borderOpacity} = this.props;
		const {hover} = this.state;
		const opacity = getNumberOrNull(borderOpacity);
		let hoverBorderOpacity;
		if (hover) {
			hoverBorderOpacity = getNumber(this.props.hoverBorderOpacity);
		}
		return getNumber(hoverBorderOpacity || opacity, DEFAULT_BORDER_OPACITY) / 10;
	}

	getPaleness() {
		const {paleness} = this.props;
		const {hover} = this.state;
		let hoverPaleness;
		const pale = getNumber(paleness);
		if (hover) {
			hoverPaleness = getNumberOrNull(this.props.hoverPaleness);
		}
		return (isNumber(hoverPaleness) ? hoverPaleness : pale) * 10;
	}

	getReflectionMaskColor() {
		const {reflectionMaskColor} = this.props;
		return reflectionMaskColor && isString(reflectionMaskColor) ? reflectionMaskColor : DEFAULT_REFLECTION_MASK_COLOR;
	}

	renderReflection = () => {
		const {
			src,
			width: imageWidth,
			height: imageHeight,
			backgroundSize,
			backgroundRepeat,
			reflectionMargin,
			reflectionOpacity,
			borderRadius
		} = this.props;
		const border = this.getBorder();
		const width = getNumber(imageWidth, DEFAULT_IMAGE_SIZE);
		const height = getNumber(imageHeight, DEFAULT_IMAGE_SIZE);
		return (
			<div
				className="uiex-image-reflection"
				style={{					
					width: width,
					height: this.getReflectionHeight(),
					marginTop: reflectionMargin
				}}
			>
				<div
					className="uiex-image-reflection-bg"
					style={{
						backgroundImage: `url(${src})`,
						height: Math.round(height * 0.9),
						opacity: getNumber(reflectionOpacity, DEFAULT_REFLECTION_OPACITY) / 10,
						backgroundSize,
						backgroundRepeat,
						borderRadius: border && isNumber(borderRadius) ? borderRadius + 2 : borderRadius
					}}
				>
					{border &&
						<div
							className="uiex-image-border"
							style={{
								border,
								borderRadius,
								opacity: this.getBorderOpacity()
							}}
						/>
					}
				</div>
				<div
					className="uiex-image-reflection-mask"
					style={{
						backgroundImage: `linear-gradient(to top, ${this.getReflectionMaskColor()}, transparent)`
					}}
				/>
			</div>
		);
	}

	renderRealImage() {
		const {
			src,
			width: imageWidth,
			height: imageHeight
		} = this.props;
		const width = getNumber(imageWidth, DEFAULT_IMAGE_SIZE);
		const height = getNumber(imageHeight, DEFAULT_IMAGE_SIZE);
		return (
			<img src={src} style={{width, height}} />
		);
	}

	renderInternal = () => {
		const TagName = this.getTagName();
		const {
			src,
			width: imageWidth,
			height: imageHeight,
			marginBottom,
			marginRight,
			backgroundSize,
			backgroundRepeat,
			borderRadius,
			reflected,
			realImage
		} = this.props;
		const border = this.getBorder();
		const width = getNumber(imageWidth, DEFAULT_IMAGE_SIZE);
		const height = getNumber(imageHeight, DEFAULT_IMAGE_SIZE);
		return (
			<TagName {...this.getProps()}>
				<div
					className="uiex-image-outer"
					style={{
						filter: `grayscale(${this.getPaleness()}%)`,
						marginBottom,
						marginRight
					}}
					onMouseEnter={this.handleMouseEnter}
					onMouseLeave={this.handleMouseLeave}
					onClick={this.handleClick}
				>
					<div
						className="uiex-image-inner"
						style={{
							backgroundImage: realImage ? undefined : `url(${src})`,
							width: width,
							height: height,
							backgroundSize,
							backgroundRepeat,
							borderRadius: border && isNumber(borderRadius) ? borderRadius + 2 : borderRadius
						}}
					>
						{realImage && this.renderRealImage()}
						{border &&
							<div
								className="uiex-image-border"
								style={{
									border,
									borderRadius,
									opacity: this.getBorderOpacity()
								}}
							/>
						}
					</div>
					{reflected && this.renderReflection()}
				</div>
			</TagName>
		);
	}

	handleMouseEnter = () => {
		const {
			hoverBorderWidth,
			hoverBorderColor,
			hoverBorderOpacity,
			hoverPaleness
		} = this.props;
		if (
			isNumber(hoverBorderWidth) || hoverBorderColor ||
			isNumber(hoverBorderOpacity) || isNumber(hoverPaleness)
		) {
			this.setState({hover: true});
		}
	}

	handleMouseLeave = () => {
		if (this.state.hover) {
			this.setState({hover: false});
		}
	}

	handleClick = () => {
		const {value, src} = this.props;
		this.fire('click', value, src);
	}
}
