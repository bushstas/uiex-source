import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {CellGroup, Cell} from '../CellGroup';
import {getNumber, replace, getNumberOrNull} from '../utils';
import {ColorsPropTypes, ColorPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

const DEFAULT_COLUMNS = 8;
const DEFAULT_MARGIN = 5;

export class Colors extends UIEXComponent {
	static propTypes = ColorsPropTypes;
	static displayName = 'Colors';

	addClassNames(add) {
		const {square, round, withoutBorder} = this.props;
		add('square', square);
		add('round', round);
		add('without-border', withoutBorder);
	}

	renderInternal() {
		let {colors, colorHeight, selectable, value: currentValue, margin} = this.props;
		margin = getNumberOrNull(margin) != null ? margin : DEFAULT_MARGIN;
		const columns = this.getColumns();
		const TagName = this.getTagName();
		return (
			<TagName {...this.getProps()}>
				<CellGroup 
					columns={columns}
					cellMargin={margin}
					rowMargin={margin}
					cellHeight={colorHeight}
					sideShrink
				>
					{colors instanceof Array && colors.map((value) => {
						const active = selectable && currentValue == value;
						return (
							<Cell key={value}>
								<Color 
									value={value}
									active={active}
									onSelect={this.handleSelect}
								/>
							</Cell>
						)
					})}
				</CellGroup>
			</TagName>
		)
	}

	getColumns() {
		return getNumber(this.props.columns, DEFAULT_COLUMNS);
	}

	handleSelect = (value) => {
		if (!this.props.disabled) {
			this.fire('select', value);
		} else {
			this.fire('disabledClick', value);
		}
	}
}

export class Color extends UIEXComponent {
	static propTypes = ColorPropTypes;
	static displayName = 'Color';

	getBgStyle() {
		const {value} = this.props;
		if (value != this.chachedValue) {
			this.chachedValue = value;
			this.cachedBgStyle = {backgroundColor: value};
		}
		return this.cachedBgStyle;
	}

	getCustomProps() {
		return {
			onClick: this.handleClick
		}
	}

	renderInternal() {
		return (
			<div {...this.getProps()}>
				<div
					className={this.getClassName('bg')}
					style={this.getBgStyle()}
				/>
			</div>
		)
	}

	handleClick = () => {
		this.fire('select', this.props.value);
	}
}
