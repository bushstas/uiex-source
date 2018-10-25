import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {AppPropTypes} from './proptypes';

import '../style.scss';
import './style.scss';

class LocationController {	
	setApp(app) {
		this.app = app;
	}

	navigateToPage(page) {
		this.app.navigateToPage(page);
	}

	navigateToPath(path) {
		this.app.navigateToPath(path);
	}
}
export const locationController = new LocationController;

export class App extends UIEXComponent {
	static propTypes = AppPropTypes;
	static displayName = 'App';
	static properChildren = 'AppPage';

	constructor(props) {
		super(props);
		this.state = {
			page: props.page
		};
	}

	componentDidMount() {
		locationController.setApp(this);
		window.addEventListener('popstate', this.handleLocationChange, false);
	}

	componentWillUnmount() {
		window.removeEventListener('popstate', this.handleLocationChange, false);
	}

	initRendering() {
		this.names = [];
		this.paths = [];
		this.params = [];
	}

	handleLocationChange = () => {
		alert('location change')
	}

	filterChild(child) {
		const {name, path, params, indexPage} = child.props;
		const {page} = this.state;
		if (!name || typeof name != 'string') {
			console.error('Not all AppPages have valid name property');
		}
		if (!path && typeof path != 'string' && !indexPage) {
			console.error('Not all AppPages have valid path property');
		}
		if (name && this.names.indexOf(name) > -1) {
			console.error('Duplicate AppPage with name: ' + name);
		}
		this.names.push(name);
		this.paths.push(path);
		this.params.push(params);
		if (!page) {
			return !!indexPage;
		}
		return child.props.name == page;
	}

	navigateToPage(page) {
		this.replaceState(page);
		this.setState({page});
	}

	navigateToPath(path) {
		
	}

	replaceState(path) {
		window.history.pushState({}, 'aaa', '/' + path);
	}
}