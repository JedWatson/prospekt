var React = require('react');
var ReactDOM = require('react-dom');

var Button = require('elemental').Button;
var FormInput = require('elemental').FormInput;
var FormSelect = require('elemental').FormSelect;
var InputGroup = require('elemental').InputGroup;
var FormInput = require('elemental').FormInput;
var FormField = require('elemental').FormField;

var lastId = 0;
var ENTER_KEYCODE = 13;

function newItem (value) {
	lastId = lastId + 1;
	return { key: 'i' + lastId, value: value };
}

function reduceValues (values) {
	return values.map(i => i.value);
}

module.exports = {
	getInitialState: function () {
		const _isArray = Array.isArray(this.props.defaultValue);

		return {
			values: Array.isArray(this.props.value) ? this.props.value.map(newItem) : this.props.value,
			options: _isArray ? this.props.defaultValue.map((m) => ({ label: m, value: m })) : [],
			isArray: _isArray,
		};
	},

	componentWillReceiveProps: function (nextProps) {
		if (nextProps.value.join('|') !== reduceValues(this.state.values).join('|')) {
			this.setState({
				values: nextProps.value.map(newItem),
			});
		}
	},

	addItem: function () {
		var newValues = this.state.values.concat(newItem(''));
		this.setState({
			values: newValues,
		}, () => {
			if (!this.state.values.length) return;
			if(this.state.isArray) return;
			ReactDOM.findDOMNode(this.refs['item_' + this.state.values.length]).focus();
		});
		this.valueChanged(reduceValues(newValues));
	},

	removeItem: function (i) {
		var newValues = _.without(this.state.values, i);
		this.setState({
			values: newValues,
		}, function () {
			if(this.state.isArray) return;
			ReactDOM.findDOMNode(this.refs.button).focus();
		});
		this.valueChanged(reduceValues(newValues));
	},

	updateItem: function (i, newValue) {
		var updatedValues = this.state.values;
		const strValue = typeof newValue === 'string' ? newValue : (newValue.value || newValue.target.value);
		if (reduceValues(updatedValues).indexOf(newValue) >= 0 && this.state.isArray) {
			alert(`${newValue} is already selected`);
			return;
		}

		var updateIndex = updatedValues.indexOf(i);
		updatedValues[updateIndex].value = this.cleanInput ? this.cleanInput(strValue) : strValue;
		this.setState({
			values: updatedValues,
		});
		this.valueChanged(reduceValues(updatedValues));
	},

	valueChanged: function (values) {
		this.props.onChange({
			path: this.props.path,
			value: values,
		});
	},

	renderField: function () {
		return (
			<div>
				{this.state.values.map(this.renderItem)}
				<Button ref="button" onClick={this.addItem}>Add item</Button>
			</div>
		);
	},

	renderItem: function (item, index) {
		const value = this.processInputValue ? this.processInputValue(item.value) : item.value;
		const Input = this.getInputComponent ? this.getInputComponent() : FormInput;

		return (
			this.state.isArray
			? <InputGroup id={item.key}>
				<InputGroup.Section grow>
					<FormSelect
						name={this.props.path}
						options={this.state.options}
						prependEmptyOption={!value}
						value={value} onChange={(v) => this.updateItem(item, v)} />
				</InputGroup.Section>

				<InputGroup.Section>
					<Button type="link-cancel" onClick={this.removeItem.bind(this, item)} className="keystone-relational-button">
						<span className="octicon octicon-x" />
					</Button>
				</InputGroup.Section>

			</InputGroup>
			: <FormField key={item.key}>
				<Input ref={'item_' + (index + 1)} name={this.props.path} value={value} onChange={this.updateItem.bind(this, item)} onKeyDown={this.addItemOnEnter} autoComplete="off" />
				<Button type="link-cancel" onClick={this.removeItem.bind(this, item)} className="keystone-relational-button">
					<span className="octicon octicon-x" />
				</Button>
			</FormField>
		);
	},

	renderValue: function () {
		const Input = this.getInputComponent ? this.getInputComponent() : FormInput;
		return (
			<div>
				{this.state.values.map((item, i) => {
					const value = this.formatValue ? this.formatValue(item.value) : item.value;
					return (
						<div key={i} style={i ? { marginTop: '1em' } : null}>
							<Input noedit value={value} />
						</div>
					);
				})}
			</div>
		);
	},

	// Override shouldCollapse to check for array length
	shouldCollapse: function () {
		return this.props.collapse && !this.props.value.length;
	},

	addItemOnEnter: function (event) {
		if (event.keyCode === ENTER_KEYCODE) {
			this.addItem();
			event.preventDefault();
		}
	},
};
