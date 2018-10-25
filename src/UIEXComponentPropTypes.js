import PropTypes from 'prop-types';
import {PROPTYPE} from './consts';

export const UIEXComponentPropTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    tagName: PropTypes.string,
    width: PROPTYPE.STRNUM,
    height: PROPTYPE.STRNUM,
    style: PROPTYPE.STYLE,
    disabled: PropTypes.bool,
    align: PROPTYPE.ALIGN,
    valign: PROPTYPE.VALIGN,
    float: PROPTYPE.FLOAT,
    block: PropTypes.bool,
    hidden: PropTypes.bool,
    vertical: PropTypes.bool
}

export const ButtonsPropTypes = {
    ...UIEXComponentPropTypes,
    buttonColor: PROPTYPE.COLORS,
    buttonWidth: PROPTYPE.STRNUM,
    buttonHeight: PROPTYPE.STRNUM,
    buttonStyle: PropTypes.object,
    iconSize: PROPTYPE.STRNUM,
    iconType: PROPTYPE.ICON_TYPES,
    iconAtRight: PropTypes.bool,
    view: PROPTYPE.BUTTONS_VIEWS
}

export const UIEXFormPropTypes = {
    ...UIEXComponentPropTypes,
    value: PROPTYPE.STRNUM,
    caption: PROPTYPE.REACT_NODES,
    captionInside: PropTypes.bool,
    contentBefore: PROPTYPE.REACT_NODES,
    buttonDisplay: PROPTYPE.FORM_BUTTON_DISPLAY,
    buttonColor: PROPTYPE.COLORS,
    buttonWidth: PROPTYPE.STRNUM,
    buttonHeight: PROPTYPE.STRNUM,
    noBorder: PropTypes.bool,
    onSubmit: PropTypes.func,
    onChange: PropTypes.func
}

export const UIEXAnimatedPropTypes = {
    animation: PROPTYPE.ANIM_TYPE,
	speed: PROPTYPE.ANIM_SPEED,
	effect: PROPTYPE.ANIM_EFFECTS
}