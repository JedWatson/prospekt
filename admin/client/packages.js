// This file exports the common packages required by the Admin UI.

// It is used to build /public/js/packages.js, and exclude these packages from
// the Admin UI bundle generated by browserify.

module.exports = [
	'async',
	'blacklist',
	'bytes',
	'classnames',
	'color',
	'display-name',
	'elemental',
	'expression-match',
	'history',
	'i',
	'list-to-array',
	'marked',
	'moment',
	'numeral',
	'qs',
	'react-addons-css-transition-group',
	'react-alt-text',
	'react-color',
	'react-day-picker',
	'react-dnd',
	'react-dnd-html5-backend',
	'react-dom',
	'react-select',
	'react',
	'store-prototype',
	'vkey',
	'xhr',
	'json-cycle'
];
