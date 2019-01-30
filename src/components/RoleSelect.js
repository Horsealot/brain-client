import React, { Component } from 'react';
import Select from 'react-select'
import makeAnimated from 'react-select/lib/animated';
import { multiSelectStyle } from './../_styles/_select';

const rolesOptions = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'USER', label: 'User' }
];

class RoleSelect extends Component {
    constructor(props) {
        super(props);

        let value = this.props.value;
        if(!value) {
            value = [];
        }
        this.mapToOption = this.mapToOption.bind(this);
        this.mapToValue = this.mapToValue.bind(this);

        this.state = {
            value: value,
            key: this.props.selectKey
        };
    }

    mapToOption(values) {
        let userOptions = [];
        values.forEach((value) => {
            rolesOptions.forEach((option) => {
                if(option.value === value) {
                    userOptions.push(option);
                }
            })
        });
        return userOptions
    }

    mapToValue(squads) {
        return squads.map((squad) => {
            return squad.value;
        });
    }

    render() {
        const { value, key } = this.state;
        return (
            <Select
                closeMenuOnSelect={false}
                components={makeAnimated()}
                defaultValue={this.mapToOption(value)}
                isMulti
                options={rolesOptions}
                styles={multiSelectStyle}
                onBlur={() => {this.props.onBlur(key)}}
                onChange={(newVal) => {this.props.onChange(this.mapToValue(newVal), key)}}
            />
        );
    }
}

export default RoleSelect;
