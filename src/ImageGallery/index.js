import React, {Fragment} from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {isArray, getNumber, isString} from '../utils';
import {CellGroup, Cell} from '../CellGroup';
import {Image} from '../Image';
import {GALLERY_BEHAVIORS} from '../consts';
import {ImageGalleryPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const DEFAULT_COLUMNS = 10;

export class ImageGallery extends UIEXComponent {
	static propTypes = ImageGalleryPropTypes;
	static displayName = 'ImageGallery';
	static className = 'gallery';
	static properChildren = ['Image'];

	addClassNames(add) {
		let {behavior} = this.props;
		if (!behavior || GALLERY_BEHAVIORS.indexOf(behavior) === -1) {
			behavior = GALLERY_BEHAVIORS[0];
		}
		add(`behavior-${behavior}`);
	}

	initRendering() {
		this.currentIndex = 0;
	}

	addChildProps(child, props) {
		const {
			src, width, height, marginBottom,
			marginRight, reflectionHeight: rh,
			reflectionMargin: rm, reflectionOpacity: ro,
			backgroundSize: bs, backgroundRepeat: br,
			borderWidth: bw, borderColor: bc, borderRadius: bra,
			borderOpacity: bo, reflected: re, paleness: pa,
			hoverBorderWidth: hbw, hoverBorderColor: hbc,
			hoverBorderOpacity: hbo, hoverPaleness: hp,
			reflectionMaskColor: rmc, realImage: ri
		} = child.props;
		const {
			imageWidth, imageHeight, imageMargin,
			behavior, reflectionHeight, reflectionMargin,
			reflectionOpacity, backgroundSize, backgroundRepeat,
			borderWidth, borderColor, borderRadius, borderOpacity,
			reflected, paleness, hoverBorderWidth, hoverBorderColor,
			hoverBorderOpacity, hoverPaleness, reflectionMaskColor,
			realImage, onView
		} = this.props;
		props.src = this.getPath(src);
		props.value = this.currentIndex++;
		if (!width) {
			props.width = imageWidth;
		}
		if (!height) {
			props.height = imageHeight;
		}
		if (behavior !== 'grid') {
			if (!marginBottom) {
				props.marginBottom = imageMargin;
			}
			if (!marginRight) {
				props.marginRight = imageMargin;
			}
		}
		if (!rh) {
			props.reflectionHeight = reflectionHeight;
		}
		if (!rm) {
			props.reflectionMargin = reflectionMargin;
		}
		if (!rmc) {
			props.reflectionMaskColor = reflectionMaskColor;
		}
		if (!ro) {
			props.reflectionOpacity = reflectionOpacity;
		}
		if (!bs) {
			props.backgroundSize = backgroundSize;
		}
		if (!br) {
			props.backgroundRepeat = backgroundRepeat;
		}
		if (!bw) {
			props.borderWidth = borderWidth;
		}
		if (!bc) {
			props.borderColor = borderColor;
		}
		if (!bra) {
			props.borderRadius = borderRadius;
		}
		if (!bo) {
			props.borderOpacity = borderOpacity;
		}
		if (!re) {
			props.reflected = reflected;
		}
		if (!ri) {
			props.realImage = realImage;
		}
		if (!pa) {
			props.paleness = paleness;
		}
		if (!hbw) {
			props.hoverBorderWidth = hoverBorderWidth;
		}
		if (!hbc) {
			props.hoverBorderColor = hoverBorderColor;
		}
		if (!hbo) {
			props.hoverBorderOpacity = hoverBorderOpacity;
		}
		if (!hp) {
			props.hoverPaleness = hoverPaleness;
		}
		props.onClick = onView;
	}

	getPath(image) {
		const {source} = this.props;
		if (isString(image)) {
			if (/^https*:/.test(image)) {
				return image;
			}
			if (source && isString(source)) {
				return `${source.replace(/\/+$/, '')}/${image.replace(/^\/+/, '')}`;
			}
		}
		return image;
	}

	getChildren() {
		const children = this.renderChildren();
		if (!isArray(children)) {
			return [children];
		}
		return children;
	}

	renderImage = (src, idx) => {
		const {
			source,
			behavior,
			imageWidth,
			imageHeight,
			imageMargin,
			reflectionHeight,
			reflectionMargin,
			reflectionOpacity,
			reflected,
			backgroundSize,
			backgroundRepeat,
			borderWidth,
			borderColor,
			borderRadius,
			borderOpacity,
			paleness,
			hoverBorderWidth,
			hoverBorderColor,
			hoverBorderOpacity,
			reflectionMaskColor,
			hoverPaleness,
			realImage,
			onView
		} = this.props;
		return (
			<Image
				key={idx !== undefined ? `${src}_${idx}` : undefined}
				src={this.getPath(src)}
				value={this.currentIndex++}
				width={imageWidth}
				height={imageHeight}
				marginBottom={behavior !== 'grid' ? imageMargin : undefined}
				marginRight={behavior !== 'grid' ? imageMargin : undefined}
				reflectionHeight={reflectionHeight}
				reflectionMargin={reflectionMargin}
				reflectionOpacity={reflectionOpacity}
				reflectionMaskColor={reflectionMaskColor}
				backgroundSize={backgroundSize}
				backgroundRepeat={backgroundRepeat}
				borderWidth={borderWidth}
				borderColor={borderColor}
				borderRadius={borderRadius}
				borderOpacity={borderOpacity}
				reflected={reflected}
				paleness={paleness}
				hoverBorderWidth={hoverBorderWidth}
				hoverBorderColor={hoverBorderColor}
				hoverBorderOpacity={hoverBorderOpacity}
				hoverPaleness={hoverPaleness}
				realImage={realImage}
				onClick={onView}
			/>
		);
	}

	renderImageCellWithSrc = (src, idx) => {
		return (
			<Cell key={`${src}_${idx}`}>
				{this.renderImage(src)}
			</Cell>
		);
	}

	renderExtraContent = (child) => {
		return (
			<div className="uiex-gallery-extra-content">
				{child}
			</div>
		);
	}

	renderImageCell = (image, idx) => {
		const properChild = this.isProperChild(image);
		return (
			<Cell
				key={idx}
				firstInRow={!properChild}
				fullWidth={!properChild}
			>
				{properChild ? image : this.renderExtraContent(image)}
			</Cell>
		);
	}

	renderItem = (item, idx) => {
		const properChild = this.isProperChild(item);
		return properChild ? item : (
			<div key={`item-${idx}`} className="uiex-gallery-extra-content">
				{item}
			</div>
		);
	}

	renderImages() {
		let children = this.renderChildren();
		let {images, behavior, imageMargin} = this.props;
		const columns = getNumber(this.props.columns, DEFAULT_COLUMNS);		
		if (!isArray(images)) {
			images = [];
		}
		if (!isArray(children)) {
			children = [children];
		}
		if (behavior === 'grid') {
			return (
				<CellGroup
					columns={columns}
					cellMargin={imageMargin}
					rowMargin={imageMargin}
				>
					{children.map(this.renderImageCell)}
					{images.map(this.renderImageCellWithSrc)}
				</CellGroup>
			);
		}
		return (
			<Fragment>
				{images.map(this.renderImage)}
				{children.map(this.renderItem)}
			</Fragment>
		);
	}

	renderInternal() {
		const TagName = this.getTagName();
		const {imageMargin, behavior} = this.props;
		return (
			<TagName {...this.getProps()}>
				<div className="uiex-gallery-outer">
					<div
						className="uiex-gallery-inner"
						style={behavior !== 'grid' ? {width: `calc(100% + ${getNumber(imageMargin)}px)`} : undefined}
					>
						{this.renderImages()}
					</div>
				</div>
			</TagName>
		)
	}
}