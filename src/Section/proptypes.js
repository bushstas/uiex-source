import PropTypes from 'prop-types';
import {UIEXComponentPropTypes} from '../UIEXComponentPropTypes';
import {PROPTYPE} from '../consts';

export const SectionPropTypes = {
	...UIEXComponentPropTypes,
	caption: PROPTYPE.REACT_NODES,
	note: PROPTYPE.REACT_NODES,
	borderWidth: PROPTYPE.STRNUM,
	borderColor: PropTypes.string,
	borderStyle: PropTypes.string,
	borderRadius: PROPTYPE.STRNUM,
	padding: PROPTYPE.STRNUM
}