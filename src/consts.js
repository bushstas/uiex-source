import PropTypes from 'prop-types';

export const COLORS = ['black', 'gray', 'white', 'red', 'blue', 'green', 'yellow', 'orange'];
export const ALIGN = ['left', 'center', 'right'];
export const CELL_ALIGN = ['left', 'center', 'right', 'justify'];
export const ALIGN_SELF = ['start', 'center', 'end'];
export const VALIGN = ['top', 'center', 'bottom'];
export const FLOAT = ['left', 'right'];
export const ICON_TYPE = ['Material', 'FontAwesome', 'LineAwesome', 'Foundation', 'LigatureSymbols', 'Genericons', 'Glyphicons', 'Ionicons', 'IcoMoon'];
export const BUTTONS_VIEW = ['united', 'underlined', 'bordered', 'simple'];
export const ANIM_EFFECTS = ['ease', 'ease-in', 'ease-out', 'ease-in-out'];
export const ANIM_SPEED = ['fast', 'normal', 'slow'];
export const FORM_BUTTON_DISPLAY = ['united', 'under-left', 'under-center', 'under-right', 'under-stretch'];
export const SIDES = ['right', 'left', 'top', 'bottom'];
export const DIRECTIONS = ['up', 'down', 'left', 'right', 'up-left', 'up-right', 'down-left', 'down-right'];
export const ANIM_TYPE = ['fade', 'roll', 'fall', 'fade-roll', 'fade-fall'];
export const PANEL_ANIMATION = ['fade', 'roll', 'fade-roll'];
export const MODAL_ANIMATION = ['fade', 'fall', 'float', 'scale-up', 'scale-down', 'perspective-top', 'perspective-bottom'];
export const ARRAY_INPUT_TYPES = ['null', 'string', 'number', 'boolean', 'array', 'object', 'function', 'regexp'];
export const DRAG_LIMITS = ['window', 'parent-in', 'parent-out', 'parent-in-out'];
export const DRAG_POSITION_X = ['left', 'center', 'right', 'left-out', 'right-out', 'left-in-out', 'right-in-out'];
export const DRAG_POSITION_Y = ['top', 'center', 'bottom', 'top-out', 'bottom-out', 'top-in-out', 'bottom-in-out'];
export const DISPLAY_TIME = ['left-out', 'left-in', 'right-out', 'right-in', 'top', 'bottom'];
export const BOX_SECTION_VIEWS = ['header', 'large', 'small'];

const ARRAY_INPUT_TYPE = PropTypes.oneOf(ARRAY_INPUT_TYPES);
const ARRAY_OF_STRNUMS = PropTypes.arrayOf(
	PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	])
);

const OPTION_SHAPE = PropTypes.shape({
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.bool
	]).isRequired,
	title: PropTypes.string.isRequired,
	icon: PropTypes.string,
	iconType: PropTypes.oneOf(ICON_TYPE),
	single: PropTypes.bool,
	withTopDelimiter: PropTypes.bool,
	withBottomDelimiter: PropTypes.bool
});

const STRING_ARRAY = PropTypes.arrayOf(PropTypes.string);

export const PROPTYPE = {
	REACT_NODES: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node]
	), 
	STRNUM: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	]),
	STRNUMBOOL: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.bool
	]),
	STRNUMS: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.bool,
		ARRAY_OF_STRNUMS
	]),
	STRBOOL:PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.bool
	]),
	STRREGEXP:PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.object
	]),
	STRINGS: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(
			PropTypes.string
		)
	]),
	STRARR: ARRAY_OF_STRNUMS,
	ARROBJ: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object
	]),
	BOX_SECTION_VIEWS: PropTypes.oneOf(BOX_SECTION_VIEWS),
	DISPLAY_TIME: PropTypes.oneOf(DISPLAY_TIME),
	DRAG_LIMITS: PropTypes.oneOf(DRAG_LIMITS),
	COLORS: PropTypes.oneOf(COLORS),
	DIRECTIONS: PropTypes.oneOf(DIRECTIONS),
	ALIGN: PropTypes.oneOf(ALIGN),
	CELL_ALIGN: PropTypes.oneOf(CELL_ALIGN),
	ALIGN_SELF: PropTypes.oneOf(ALIGN_SELF),
	VALIGN: PropTypes.oneOf(VALIGN),
	FLOAT: PropTypes.oneOf(FLOAT),
	ICON_TYPES: PropTypes.oneOf(ICON_TYPE),
	BUTTONS_VIEWS: PropTypes.oneOf(BUTTONS_VIEW),
	ANIM_EFFECTS: PropTypes.oneOf(ANIM_EFFECTS),
	ANIM_SPEED: PropTypes.oneOf(ANIM_SPEED),
	ANIM_TYPE: PropTypes.oneOf(ANIM_TYPE),
	INPUT_MEASURES: STRING_ARRAY,
	OPTIONS: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.func,
		PropTypes.instanceOf(Promise),
		PropTypes.arrayOf(
			PropTypes.oneOfType([
				PropTypes.string,
				PropTypes.number,
				OPTION_SHAPE
			])
		)
	]),	
	CHECKBOX_GROUP_VALUE: PropTypes.oneOfType([
		ARRAY_OF_STRNUMS,
		PropTypes.object
	]),
	FORM_BUTTON_DISPLAY: PropTypes.oneOf(FORM_BUTTON_DISPLAY),
	SIDES: PropTypes.oneOf(SIDES),
	PANEL_ANIMATION: PropTypes.oneOf(PANEL_ANIMATION),
	MODAL_ANIMATION: PropTypes.oneOf(MODAL_ANIMATION),
	ARRAY_INPUT_TYPE,
	ARRAY_INPUT_TYPES: PropTypes.oneOfType([
		ARRAY_INPUT_TYPE,
		PropTypes.arrayOf(ARRAY_INPUT_TYPE)
	]),
	STRING_ARRAY
}