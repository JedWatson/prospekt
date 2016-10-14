var fieldTests = require('./commonFieldTestUtils.js');

// there is an issue with the viewport and the page height
// some elements are hidden and breaking the tests because of that
// implementing phantomjs would solve the issue.
module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Location field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Location');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.assertUI({
			listName: 'Location',
			fields: ['name', 'fieldA'],
			args: { 'showMore': false },
		});
		browser.initialFormPage.section.form.section.locationList.section.fieldA.showMore();

		browser.initialFormPage.assertUI({
			listName: 'Location',
			fields: ['name', 'fieldA'],
			args: { 'showMore': true },
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormPage.cancel();
		browser.app.waitForListScreen();
	},
	'Location field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Location');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.section.form.section.locationList.section.fieldA.showMore();
		browser.initialFormPage.fillInputs({
			listName: 'Location',
			fields: {
				'name': {value: 'Location Field Test 1'},
				'fieldA': {
					'number': 'Field A',
					'name': 'Building A',
					'street1': 'Street A',
					'street2': 'Town A',
					'suburb': 'Suburb A',
					'state': 'State A',
					'postcode': 'AAA AAA',
					'country': 'AAA',
					'geoLat': '123',
					'geoLng': '123'
				},
			}
		});

		browser.initialFormPage.save();
		browser.app.waitForItemScreen();

		browser.itemPage.assertInputs({
			listName: 'Location',
			fields: {
				'name': {value: 'Location Field Test 1'},
				'fieldA': {
					'number': 'Field A',
					'name': 'Building A',
					'street1': 'Street A',
					'street2': 'Town A',
					'suburb': 'Suburb A',
					'state': 'State A',
					'postcode': 'AAA AAA',
					'country': 'AAA',
					'geoLat': '123',
					'geoLng': '123'
				},
			}
		})
	},
	'Location field should show correctly in the edit form': function(browser) {
		browser.itemPage.assertUI({
			listName: 'Location',
			fields: ['fieldA'],
			args: { 'showMore': true },
		});
	},
	'Location field can be filled via the edit form': function(browser) {
		browser.itemPage.fillInputs({
			listName: 'Location',
			fields: {
				'fieldA': {
					'number': 'Field-changed A',
					'name': 'Building-changed A',
					'street1': 'Street-changed A',
					'street2': 'Town-changed A',
					'suburb': 'Suburb-changed A',
					'state': 'State-changed A',
					'postcode': '000 000',
					'country': 'COL',
					'geoLat': '999',
					'geoLng': '999'
				},
			}
		});
		browser.itemPage.save();
		browser.app.waitForItemScreen();
		browser.itemPage.assertFlashMessage('Your changes have been saved successfully');
		browser.itemPage.assertInputs({
			listName: 'Location',
			fields: {
				'name': {value: 'Location Field Test 1'},
				'fieldA': {
					'number': 'Field-changed A',
					'name': 'Building-changed A',
					'street1': 'Street-changed A',
					'street2': 'Town-changed A',
					'suburb': 'Suburb-changed A',
					'state': 'State-changed A',
					'postcode': '000 000',
					'country': 'COL',
					'geoLat': '999',
					'geoLng': '999'
				},
			}
		})
	},
};
