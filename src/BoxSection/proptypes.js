import PropTypes from 'prop-types';
import {BoxContainerPropTypes} from '../Box/proptypes';
import {PROPTYPE} from '../consts';

export const BoxSectionCommonPropTypes = {
	...BoxContainerPropTypes,
	view: PROPTYPE.BOX_SECTION_VIEWS,
	iconAtRight: PropTypes.bool,
	name: PROPTYPE.STRNUM
}

export const BoxSectionPropTypes = {
	...BoxSectionCommonPropTypes,
	caption: PROPTYPE.REACT_NODES.isRequired,
	note: PROPTYPE.REACT_NODES
}
