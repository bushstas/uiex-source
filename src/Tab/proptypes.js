import PropTypes from 'prop-types';
import {ButtonPropTypes} from '../Button/proptypes';
import {PROPTYPE} from '../consts';

export const TabPropTypes = {
	...ButtonPropTypes,
	caption: PROPTYPE.REACT_NODES,
	single: PropTypes.bool,
	noRemoving: PropTypes.bool,
	// private
	active: PropTypes.bool,
	afterActive: PropTypes.bool
}