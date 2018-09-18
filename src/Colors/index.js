import React from 'react';
import {withStateMaster} from '../state-master';
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
					{colors instanceof Array && colors.map((value, idx) => {
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
		const {onSelect, disabled, onDisabledClick} = this.props;
		if (!disabled && typeof onSelect == 'function') {
			onSelect(value);
		} else if (disabled && typeof onDisabledClick == 'function') {
			onDisabledClick(value);
		}
	}
}

const COLOR_PROPS_LIST = 'value';

class ColorComponent extends UIEXComponent {
	static propTypes = ColorPropTypes;
	static displayName = 'Color';

	static getDerivedStateFromProps({add, isChanged, nextProps}) {
		if (isChanged('value') && typeof nextProps.value == 'string') {
			add('bgColorStyle', {backgroundColor: '#' + replace(/^\#/, '', nextProps.value)});
		}	
	}

	getCustomProps() {
		return {
			onClick: this.handleClick
		}
	}

	renderInternal() {
		return (
			<div {...this.getProps()}>
				<div className={this.getClassName('bg')} style={this.state.bgColorStyle}/>
			</div>
		)
	}

	handleClick = () => {
		let {onSelect, value} = this.props;
		if (typeof onSelect == 'function') {
			if (typeof value == 'string') {
				value = replace(/^\#/, '', value);
			}
			onSelect(value);
		}
	}
}

const Color = withStateMaster(ColorComponent, COLOR_PROPS_LIST, null, UIEXComponent);