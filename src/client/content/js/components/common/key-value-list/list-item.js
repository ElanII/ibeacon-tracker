import React from 'react/addons';
import View from './list-item-view';
import Editor from './list-item-editor';

export default React.createClass({
    mixins: [
        React.addons.PureRenderMixin
    ],

    propTypes: {
        index: React.PropTypes.number.isRequired,
        item: React.PropTypes.object.isRequired,
        types: React.PropTypes.object
    },

    getInitialState() {
        return {
            edit: this.props.item.isNew
        };
    },

    render() {
        let control;

        if (!this.state.edit) {
            control = (<View
                {...this.props}
                onEdit={this._onStartEdit}
                onDelete={this._onDelete}
                />);
        } else {
            control = (<Editor
                {...this.props}
                onSave={this._onSave}
                onCancel={this._onCancelEdit}
                />);
        }

        return control;
    },

    _onStartEdit() {
        this.setState({
            edit: true
        });
    },

    _onCancelEdit() {
        if (!this.props.item.isNew) {
            this.setState({
                edit: false
            });
        } else {
            this._onDelete(this.props.index);
        }
    },

    _onSave(options) {
        if (this.props.onSave) {
            this.props.onSave(options);
        }

        this.setState({
            edit: false
        });
    },

    _onDelete(index) {
        if (this.props.onDelete) {
            this.props.onDelete(index);
        }
    }
});
