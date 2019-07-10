import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {getNumber, isNumber} from '../utils';
import {ImagePropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const DEFAULT_IMAGE_SIZE = 100;
const DEFAULT_REFLECTION_HEIGHT = 30;
const DEFAULT_REFLECTION_OPACITY = 4;
const DEFAULT_BORDER_COLOR = '#F1F1F1';
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
		const width = getNumber(borderWidth);
		const color = borderColor || DEFAULT_BORDER_COLOR;
		if (width) {
			return `${width}px solid ${color}`;
		}
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
			borderOpacity,
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
								opacity: getNumber(borderOpacity, DEFAULT_BORDER_OPACITY) / 10
							}}
						/>
					}
				</div>
				<div
					className="uiex-image-reflection-mask"
					style={{
						backgroundImage: 'linear-gradient(to top, #f4f4f4, transparent)'
					}}
				/>
			</div>
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
			borderOpacity,
			reflected
		} = this.props;
		const border = this.getBorder();
		const width = getNumber(imageWidth, DEFAULT_IMAGE_SIZE);
		const height = getNumber(imageHeight, DEFAULT_IMAGE_SIZE);
		return (
			<TagName {...this.getProps()}>
				<div className="uiex-image-outer">
					<div
						className="uiex-image-inner"
						style={{
							backgroundImage: `url(${src})`,
							width: width,
							height: height,
							marginBottom,
							marginRight,
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
									opacity: getNumber(borderOpacity, DEFAULT_BORDER_OPACITY) / 10
								}}
							/>
						}
					</div>
					{reflected && this.renderReflection()}
				</div>
			</TagName>
		);
	}
}
