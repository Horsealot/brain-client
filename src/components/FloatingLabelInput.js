import React from 'react';
import {FormGroup, Input, Label} from "reactstrap";

class FloatingLabelInput extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isFocused: false,
            value: ''
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleFocus = () => this.setState({ isFocused: true });
    handleBlur = () => {
        if(!this.state.value.length) {
            this.setState({ isFocused: false });
        }
    }

    handleChange = (e) => {
        const { value } = e.target;
        this.setState({ value: value });
        if(typeof this.props.onChange === 'function') {
            this.props.onChange(e);
        }
    }

    render() {
        let { label, formClass, extrablock, ...props } = this.props;
        const { isFocused } = this.state;
        if(!formClass) formClass = "";
        return (
            <FormGroup className={formClass + ' floating-form'}>
                <Label className={isFocused ? 'is-focused floating-form' : 'floating-form'}>
                    {label}
                </Label>
                <Input
                    {...props}
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                />
                {extrablock}
            </FormGroup>
        );
    }
}

export default FloatingLabelInput;