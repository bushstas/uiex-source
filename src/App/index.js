import React from 'react';
import {UIEXComponent} from '../UIEXComponent';
import {AppPropTypes} from './proptypes';
import {isString, isNumber, isObject, getNumber} from '../utils';
import {addTranslations} from '../Translate';
import {DEFAULT_SIDE_MENU_WIDTH} from '../SideMenu';

import '../style.scss';
import './style.scss';

const PAGE_404 = 'notFound404';
const PAGE_404_PATH = '404';
let appCount = 0;
const appLinks = {};
const NOT_FOUND_PAGE = () => '404. Not found';

class LocationController {	
	setApp(app) {
		this.app = app;
	}

	applyParamsToPath(path, params) {
		if (isObject(params) && /\$/.test(path)) {
			for (let k in params) {
				const regex = new RegExp("\\$" + k);
				path = path.replace(regex, params[k]);
			}
		}
		return path;
	}

	navigateToPage(pageName, params) {
		if (!isObject(this.app)) {
			console.error('You need to have rendered App component');
			return null;
		}
		const pageIndex = this.app.names.indexOf(pageName);
		let path = this.app.paths[pageIndex];
		if (isNumber(pageIndex) && isString(path)) {
			path = this.applyParamsToPath(path, params);
			return this.app.navigateToPage(pageName, path, params);
		}
		this.app.navigateToNotFound(pageName, null);
	}

	navigateToPath(path, params) {
		if (!isObject(this.app)) {
			console.error('You need to have rendered App component');
			return null;
		}
		path = this.applyParamsToPath(path, params);
		const page = this.initPath(path, params);
		if (isString(page.page) || isNumber(page.page)) {
			return this.app.navigateToPage(page.page, page.path, params);
		}
		this.app.navigateToNotFound(null, path);
	}

	initCurrentLocation() {
		const {hashRouting} = this.app.props;
		const parts = window.location.toString().split('#');
		let path;
		if (hashRouting) {
			path = parts[1] || '';
		} else {
			path = parts[0];
			path = path.replace(/^[a-z]+:\/+/i, '');
		}
		if (!hashRouting) {
			const pathParts = path.split('/');
			pathParts.shift();
			if (pathParts.length == 0) {
				path = '';
			} else {
				path = pathParts.join('/');
			}
		}
		return this.initPath(path || '/');
	}

	initPath(path, params = null) {
		if ((path === '' || path === '/') && isNumber(this.app.indexPage)) {
			return this.getIndexPage();
		}
		const {hashRouting, hashPaths} = this.app.props;
		path = path.replace(/^\/|\/$/g, '');
		let page;
		if (!hashPaths && hashRouting) {
			page = this.findPageByName(path, params);
		} else {
			page = this.findPageByPath(path);
		}
		if (isObject(page)) {
			if (isString(page.page)) {
				return page;
			}
			if (isNumber(page.page)) {
				const pageName = this.app.names[page.page];
				if (isString(pageName)) {
					page.page = pageName;
				}
				return page;
			}
		}
		return {
			page: this.app.notFoundPageName,
			path: this.app.notFoundPagePath
		};
	}

	getIndexPage() {
		const {indexPage} = this.app;
		if (isNumber(indexPage)) {
			const pageName = this.app.names[indexPage];
			return {
				page: isString(pageName) ? pageName : indexPage,
				path: '',
				params: {}
			};
		}
	}

	findPageByName(pageName, params = null) {
		const pageIndex = this.app.names.indexOf(pageName);
		let path = this.app.paths[pageIndex]
		if (isNumber(pageIndex) && isString(path)) {
			path = this.applyParamsToPath(path, params);
			return {page: pageName, path, params};
		}
		return {};
	}

	findPageByPath(path) {
		const {paths, exactPaths} = this.app;
		let params;
		let pageIndex;
		const parts = path.split('/');
		const matchedPages = [];
		for (let i = 0; i < paths.length; i++) {
			const isExactPath = exactPaths[i];
			const pathParts = paths[i].split('/');
			if (isExactPath && parts.length != pathParts.length) {
				continue;
			}
			if (parts.length < pathParts.length) {
				continue;
			}
			let isMatched = true;
			params = {};
			pageIndex = i;
			for (let j = 0; j < parts.length; j++) {
				const pathPart = pathParts[j];
				if (pathPart == null) {
					continue;
				}
				const isAny =  pathPart.charAt(0) == '$';
				if (!isAny && parts[j] != pathPart) {
					isMatched = false;
					break;
				}
				if (isAny) {
					params[pathPart.replace(/^\$/, '')] = parts[j];
				}
			}
			if (!isMatched) {
				continue;
			}
			matchedPages.push({page: pageIndex, params, path, parts: pathParts.length});
		}
		if (matchedPages.length > 0) {
			let matchedPage = null;
			let maxPartCount = 0;
			for (let i = 0; i < matchedPages.length; i++) {
				if (matchedPages[i].parts > maxPartCount) {
					maxPartCount = matchedPages[i].parts;
					matchedPage = matchedPages[i];
				}
			}
			return matchedPage;
		}
		return {};
	}
}
const locationController = new LocationController;

let currentLinks = [];
const highlightLink = (page, app) => {
	const links = Object.values(appLinks);
	currentLinks.forEach((link) => {
		link.setState({active: false});
	});
	currentLinks = [];
	let path;
	const {paths} = app;
	if (isNumber(page)) {		
		path = paths[page];
	}
	if (isString(page)) {
		if (!path) {
			const {names} = app;
			const index = names.indexOf(page);
			if (index > -1) {
				path = paths[index];
			}
		}
		for (let i = 0; i < links.length; i++) {
			const linkPage = links[i].getAppLinkPage();
			const linkPath = links[i].getAppLinkPath();
			if (linkPage && page == linkPage) {
				links[i].setState({active: true});
				currentLinks.push(links[i]);
				continue;
			}				
			if (path && linkPath && path == linkPath) {
				links[i].setState({active: true});
				currentLinks.push(links[i]);			
			}
		}
	}
};

export const navigateToPage = (pageName, params) => {
	return locationController.navigateToPage(pageName, params);
};

export const navigateToPath = (path, params) => {
	return locationController.navigateToPath(path, params);
};

export const registerAppLink = (id, link) => {
	appLinks[id] = link;
};

export const unregisterAppLink = (id) => {
	const index = currentLinks.indexOf(appLinks[id]);
	if (index > -1) {
		currentLinks.splice(index, 1);
	}
	appLinks[id] = null;
	delete appLinks[id];
};

export class App extends UIEXComponent {
	static propTypes = AppPropTypes;
	static displayName = 'App';
	static properChildren = 'AppPage';
	static singleChild = true;

	constructor(props) {
		super(props);
		appCount++;
	}

	componentDidMount() {
		if (appCount > 1) {
			console.error('You can\'t have more then one App components mounted');
		} else {
			locationController.setApp(this);
			if (!this.props.initialPage) {
				setTimeout(() => {
					this.handleLocationChange(true);
				});
			} else {
				locationController.navigateToPage(this.props.initialPage);
			}
			window.addEventListener('popstate', this.handleLocationChange, false);
			if (!isNumber(this.indexPage)) {
				console.error('Index page is not defined');
			}
		}
	}
	
	componentWillUnmount() {
		window.removeEventListener('popstate', this.handleLocationChange, false);
		appCount--;
	}

	initRendering() {
		this.names = [];
		this.paths = [];
		this.params = [];
		this.exactPaths = [];
		this.indexPage = null;
		this.notFoundPage = null;
	}

	filterChild(child) {
		const {indexPageName} = this.props;
		const {name, path, params, indexPage, exactPath, notFoundPage} = child.props;
		const {page} = this.state;
		if (!indexPage && !notFoundPage && (!name || !isString(name))) {
			console.error('Not all AppPages have valid name property');
		}
		if (!notFoundPage && (!path && !isString(path) && !indexPage)) {
			console.error('Not all AppPages have valid path property');
		}
		if (!notFoundPage && (name && this.names.indexOf(name) > -1)) {
			console.error('Duplicate AppPage with name: ' + name);
		}
		if (!notFoundPage) {
			this.names.push(name);
			this.exactPaths.push(Boolean(exactPath));
			if (isString(path)) {
				this.paths.push(path.replace(/^\/|\/$/g, ''));
			} else {
				this.paths.push('');
			}			
			this.params.push(params);
			if (indexPage || indexPageName == name) {
				this.indexPage = this.currentProperChildIdx;
			}
			if (isString(page)) {
				return child.props.name == page;
			}
			if (isNumber(page)) {
				return this.currentProperChildIdx == page;
			}
		} else {
			this.notFoundPage = this.currentProperChildIdx;
			this.notFoundPageName = name || PAGE_404;
			this.notFoundPagePath = path || PAGE_404_PATH;
			if (page == PAGE_404 || page === name) {
				return true;
			}
		}
		return false;
	}

	addChildProps(child, props) {
		const {params} = this.state;
		props.params = params;
	}

	navigateToPage(page, path, params) {
		if (this.state.page !== page) {
			if (isString(path)) {
				this.pushState(path, page);
			}
			this.handleChangePage({page, path, params});
			this.pathWhichNotFound = null;
		}
	}

	navigateToNotFound(name, path) {
		if (isNumber(this.notFoundPage)) {
			if (this.pathWhichNotFound !== (path || name)) {
				this.fire('pageNotFound', name, path);
				this.replaceState(this.notFoundPagePath, this.notFoundPageName);
			}
			this.navigateToPage(this.notFoundPageName, this.notFoundPagePath, null);
			this.pathWhichNotFound = path || name;
		}
	}

	pushState(path, page) {
		const {hashRouting} = this.props;
		window.history.pushState({}, '', (hashRouting ? '#' : '/') + (path || page));
	}

	replaceState(path, page) {
		const {hashRouting} = this.props;
		window.history.replaceState({}, '', (hashRouting ? '#' : '/') + (path || page));
	}

	handleLocationChange = (initial) => {
		const page = locationController.initCurrentLocation();
		if (isObject(page) && (isNumber(page.page) || isString(page.page))) {
			this.handleChangePage(page, initial);
			if (initial && page.page === this.notFoundPageName) {
				this.replaceState(page.path, page.page);
			}
		}
	}

	handleChangePage({page, path, params}, initial = false) {
		if (this.state.page !== page) {
			this.setState({page: null, params: {}}, () => {
				this.setState({page, params}, () => {
					this.fire(initial ? 'initPage' : 'changePage', page, path, params);
					highlightLink(page, this);
				});
			});
		}
	}

	renderInternal() {
		const content = this.renderChildren();
		const {sideMenu, sideMenuWidth, sideMenuAtRight} = this.props;
		const TagName = this.getTagName();
		let style;
		if (sideMenu) {
			style = {
				[sideMenuAtRight ? 'paddingRight' : 'paddingLeft']: getNumber(sideMenuWidth, DEFAULT_SIDE_MENU_WIDTH)
			};
		}
		return (
			<TagName {...this.getProps()}>
				{sideMenu}
				<div
					className="uiex-app-content"
					style={style}
				>
					{content}
				</div>
			</TagName>
		)
	}
}