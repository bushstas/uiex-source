import React from 'react';
import {withStateMaster} from '../state-master';
import {UIEXComponent} from '../UIEXComponent';
import {MaterialIcon} from './MaterialIcon';
import {FontAwesomeIcon} from './FontAwesomeIcon';
import {LineAwesomeIcon} from './LineAwesomeIcon';
import {FoundationIcon} from './FoundationIcon';
import {LigatureSymbolsIcon} from './LigatureSymbolsIcon';
import {GenericonsIcon} from './GenericonsIcon';
import {GlyphiconsIcon} from './GlyphiconsIcon';
import {IoniconsIcon} from './IoniconsIcon';
import {IcomoonIcon} from './IcomoonIcon';

import '../style.scss';
import './style.scss';

const PROPS_LIST = 'style';

class IconComponent extends UIEXComponent {
	static displayName = 'Icon';

	static getDerivedStateFromProps({add, isChanged, nextProps}) {
		if (isChanged('style')) {
			if (this.constructor.defaultStyles instanceof Object) {
				add('style', {
					...this.constructor.defaultStyles.main,
					...nextProps.style
				});
			} else {
				add('style');
			}		
		}
	}
	
	render() {
		let TypedIcon = MaterialIcon;
		switch (this.props.type) {
			case 'FontAwesome':
				TypedIcon = FontAwesomeIcon;
			break;

			case 'LineAwesome':
				TypedIcon = LineAwesomeIcon;
			break;

			case 'Foundation':
				TypedIcon = FoundationIcon;
			break;

			case 'LigatureSymbols':
				TypedIcon = LigatureSymbolsIcon;
			break;

			case 'Genericons':
				TypedIcon = GenericonsIcon;
			break;

			case 'Glyphicons':
				TypedIcon = GlyphiconsIcon;
			break;

			case 'Ionicons':
				TypedIcon = IoniconsIcon;
			break;

			case 'IcoMoon':
				TypedIcon = IcomoonIcon;
			break;
		}
		return (
			<TypedIcon {...this.props} style={this.state.style}/>
		)
	}
}

export const Icon = withStateMaster(IconComponent, PROPS_LIST, null, UIEXComponent);