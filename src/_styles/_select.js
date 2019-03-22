export const multiSelectStyle = {
    clearIndicator: styles => ({
        display: 'none'
    }),
    indicatorSeparator: styles => ({
        ...styles,
        marginTop: '10px',
        marginBottom: '10px',
    }),
    dropdownIndicator: styles => ({
        ...styles,
        padding: '0',
        width: '15px'
    }),
    control: styles => ({
        ...styles,
        backgroundColor: 'transparent' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            backgroundColor: '#666',
            color: 'white',
            cursor: isDisabled ? 'not-allowed' : 'default'
        };
    },
    multiValue: (styles, { data }) => {
        return {
            ...styles,
            backgroundColor: '#333',
            borderRadius: '5px'
        };
    },
    multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: data.color,
    }),
    multiValueRemove: (styles, { data }) => ({
        ...styles,
        color: data.color,
        ':hover': {
            backgroundColor: data.color,
            color: 'white',
        },
    }),
};

export const singleSelect = {
    clearIndicator: styles => ({
        display: 'none'
    }),
    indicatorSeparator: styles => ({
        ...styles,
        marginTop: '10px',
        marginBottom: '10px',
    }),
    dropdownIndicator: styles => ({
        ...styles,
        padding: '0',
        width: '15px'
    }),
    singleValue: styles => ({
        ...styles,
        color: 'white'
    }),
    input: styles => ({
        ...styles,
    }),
    control: styles => ({
        ...styles,
        backgroundColor: 'transparent' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            textAlign: 'center',
            backgroundColor: '#666',
            color: 'white'
        };
    }
};