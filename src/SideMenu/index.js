import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {SideMenuPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

export const DEFAULT_SIDE_MENU_WIDTH = 200;

export class SideMenu extends UIEXComponent {
	static propTypes = SideMenuPropTypes;
	static displayName = 'SideMenu';
	static className = 'side-menu';


}
