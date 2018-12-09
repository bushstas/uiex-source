import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const CellGroupPropTypes = {
	...UIEXComponentPropTypes,
	columns: PROPTYPE.STRNUM,
	cellMargin: PROPTYPE.STRNUM,
	cellSize: PROPTYPE.STRNUM,
	maxCellSize: PROPTYPE.STRNUM,
	rowMargin: PROPTYPE.STRNUM,
	sideShrink: PropTypes.bool,
	cellAlign: PROPTYPE.CELL_ALIGN,
	cellTextAlign: PROPTYPE.CELL_ALIGN,
	cellTextValign: PROPTYPE.CELL_ALIGN,
	cellHeight: PROPTYPE.STRNUM,
	cellMinHeight: PROPTYPE.STRNUM,
	cellAutoHeight: PropTypes.bool
}

export const CellPropTypes = {
	...UIEXComponentPropTypes,
	size: PROPTYPE.STRNUM,
	shift: PROPTYPE.STRNUM,
	maxSize: PROPTYPE.STRNUM,
	alignSelf: PROPTYPE.ALIGN_SELF,
	firstInRow: PropTypes.bool,
	lastInRow: PropTypes.bool,
	floatSide: PropTypes.bool,
	stretched: PropTypes.bool,
	fullWidth: PropTypes.bool,
	minHeight: PROPTYPE.STRNUM,
	onClick: PropTypes.func
}

export const CellGroupRowPropTypes = {
	...UIEXComponentPropTypes
}