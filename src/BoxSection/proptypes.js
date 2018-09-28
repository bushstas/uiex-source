import PropTypes from 'prop-types';
import {BoxContainerPropTypes} from '../Box/proptypes';
import {PROPTYPE} from '../consts';

export const BoxSectionPropTypes = {
	...BoxContainerPropTypes,
	caption: PROPTYPE.REACT_NODES.isRequired,
	note: PROPTYPE.REACT_NODES,
	view: PROPTYPE.BOX_SECTION_VIEWS,
	iconAtRight: PropTypes.bool
}