import React, {Fragment} from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {Modal} from '../Modal';
import {getNumber, isArray, isString, getMergedClassName, getNumericProp, isNumber} from '../utils';
import {ImageViewerPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const DEFAULT_WIDTH = 1600;
const DEFAULT_HEIGHT = 800;
const DEFAULT_CONTENT_SIZE_WIDTH = 30;
const MIN_CONTENT_SIZE_WIDTH = 20;
const MAX_CONTENT_SIZE_WIDTH = 80;

export class ImageViewer extends UIEXComponent {
	static propTypes = ImageViewerPropTypes;
	static displayName = 'ImageViewer';

	constructor(props) {
		super(props);
		this.currentImageIndex = getNumber(this.getProp('imageIndex'));
		this.currentImage = 1;
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

	getImage(id) {
		const {animated} = this.props;
		const currentImage = getNumber(this.getProp('imageIndex'));
		if (animated && currentImage != this.currentImageIndex) {
			this.currentImage = this.currentImage == 2 ? 1 : 2;
			this.currentImageIndex = currentImage;
		}
		if (id == this.currentImage) {
			const {images, source} = this.props;			
			if (isNumber(currentImage) && isArray(images) && images[currentImage] && isString(images[currentImage])) {
				this.tempPrevImage = `url(${this.getPath(images[currentImage])})`;
				return this.tempPrevImage;
			}
			return;
		}
		return this.prevImage;
	}

	getOpacity(id) {
		const {animated} = this.props;
		if (!animated) {
			return undefined;
		}
		if (id == this.currentImage) {
			return this.prevImage ? '0' : '1';
		}
		return this.prevImage ? '1' : '0';
	}

	getZIndex(id) {
		const {animated} = this.props;
		if (!animated) {
			return undefined;
		}
		if (id == this.currentImage) {
			return 2;
		}
		return 1;
	}

	getLeftSideWidth() {
		return `${100 - this.contentWidth}%`;
	}

	getRightSideWidth() {
		return `${this.contentWidth}%`;
	}

	getWidth() {
		const {width} = this.props;
		return getNumber(width, DEFAULT_WIDTH);
	}

	getHeight() {
		const {height} = this.props;
		return getNumber(height, DEFAULT_HEIGHT);
	}

	getNextIndex() {
		const {looping} = this.props;
		const lastIndex = this.imagesCount - 1;
		const currentIndex = getNumber(this.getProp('imageIndex'));
		const nextIndex = currentIndex + 1;
		const noNext = nextIndex > lastIndex && !looping;
		if (lastIndex < 0 || noNext) {
			return null;
		}
		if (nextIndex <= lastIndex) {
			return nextIndex;
		}
		return 0;
	}

	getPrevIndex() {
		const {looping} = this.props;
		const lastIndex = this.imagesCount - 1;
		const currentIndex = getNumber(this.getProp('imageIndex'));
		const prevIndex = currentIndex - 1;
		const noPrev = prevIndex < 0 && !looping;
		if (lastIndex < 0 || noPrev) {
			return null;
		}
		if (prevIndex >= 0) {
			return prevIndex;
		}
		return lastIndex;
	}

	initRendering() {
		const {contentWidth, images} = this.props;
		this.contentWidth = getNumericProp(contentWidth, DEFAULT_CONTENT_SIZE_WIDTH, MIN_CONTENT_SIZE_WIDTH, MAX_CONTENT_SIZE_WIDTH);
		this.imagesCount = isArray(images) ? images.length : 0;
	}

	renderControls() {
		const {images} = this.props;
		if (this.imagesCount > 1) {
			const isPrev = isNumber(this.getPrevIndex());
			const isNext = isNumber(this.getNextIndex());
			if (!isPrev && !isNext) {
				return null;
			}
			return (
				<Fragment>
					{isPrev && 
						<div
							className="uiex-image-viewer-control uiex-prev"
							onClick={this.handlePrevClick}
						>
						</div>
					}
					{isNext && 
						<div
							className="uiex-image-viewer-control uiex-next"
							onClick={this.handleNextClick}
						>
						</div>
					}
				</Fragment>
			);
		}
		return null;
	}

	renderPictures() {
		const {animated} = this.props;
		const opacity1 = this.getOpacity(1);
		const opacity2 = this.getOpacity(2);
		const zIndex1 = this.getZIndex(1);
		const zIndex2 = this.getZIndex(2);
		const pictures = [
			<div
				key="picture1"
				className="uiex-image-viewer-picture"
				style={{
					opacity: opacity1,
					zIndex: zIndex1,
					backgroundImage: this.getImage(1)					
				}}
			/>,
			animated ? <div
				key="picture2"
				className="uiex-image-viewer-picture"
				style={{
					opacity: opacity2,
					zIndex: zIndex2,
					backgroundImage: this.getImage(2)
				}}
			/> : null
		];
		this.prevImage = this.tempPrevImage;
		return pictures;
	}

	renderInternal() {
		const {
			animated,
			looping,
			source,
			images,
			imageIndex,
			contentWidth,
			className,
			children,
			...modalProps
		} = this.props;
		const {isOpen} = modalProps;
		return (
			<Modal
				className={getMergedClassName('uiex-image-viewer', className)}
				{...modalProps}
				width={this.getWidth()}
				height={this.getHeight()}
				withoutPadding
			>
				<div
					className="uiex-image-viewer-side uiex-left-side"
					style={{width: this.getLeftSideWidth()}}
				>
					{isOpen && this.renderPictures()}
					{isOpen && this.renderControls()}
				</div>
				<div
					className="uiex-image-viewer-side uiex-right-side"
					style={{width: this.getRightSideWidth()}}
				>
					{children}
				</div>
			</Modal>
		)
	}

	handlePrevClick = () => {
		this.fire('change', this.getPrevIndex());
	}

	handleNextClick = () => {
		this.fire('change', this.getNextIndex());		
	}
}
