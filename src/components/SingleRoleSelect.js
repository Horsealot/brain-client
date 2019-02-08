import React, { Component } from 'react';
import Select from 'react-select'
import { multiSelectStyle } from './../_styles/_select';

const rolesOptions = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'USER', label: 'User' }
];

class SingleRoleSelect extends Component {
    constructor(props) {
        super(props);

        let value = this.props.value;

        this.state = {
            value: value,
            key: this.props.selectKey
        };

        this.mapToOption = this.mapToOption.bind(this);
        this.mapToValue = this.mapToValue.bind(this);
    }

    mapToOption(value) {
        let mappedOption = "";
        rolesOptions.forEach((option) => {
            if(option.value === value) {
                mappedOption = option;
            }
        });
        return mappedOption;
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
                defaultValue={this.mapToOption(value)}
                onBlur={() => {this.props.onBlur(key)}}
                options={rolesOptions}
                onChange={(newVal) => {this.props.onChange(newVal.value, key)}}
                styles={multiSelectStyle}
            />
        );
    }
}

export default SingleRoleSelect;
