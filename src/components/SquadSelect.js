import React, { Component } from 'react';
import Select from 'react-select'
import makeAnimated from 'react-select/lib/animated';
import { multiSelectStyle } from './../_styles/_select';

const squadOptions = [
    { value: 'executive', label: 'Executive' },
    { value: 'design', label: 'Design' },
    { value: 'tech', label: 'Tech' },
    { value: 'marketing', label: 'Marketing' }
];

class SquadSelect extends Component {
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
            squadOptions.forEach((option) => {
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
                options={squadOptions}
                styles={multiSelectStyle}
                onBlur={() => {this.props.onBlur(key)}}
                onChange={(newVal) => {this.props.onChange(this.mapToValue(newVal), key)}}
            />
        );
    }
}

export default SquadSelect;
