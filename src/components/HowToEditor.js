import React, { Component } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-balloon';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import ClassicEditor from '@ckeditor/ckeditor5-build-inline';

import './../_styles/_libraries/_ck-editor.scss';

class HowToEditor extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {content} = this.props;
        return (
            <CKEditor
                editor={ ClassicEditor }
                data={content}
                onInit={ editor => {
                } }
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    if(this.props.onChange) {
                        this.props.onChange(data);
                    }
                } }
                onBlur={ editor => {
                    if(this.props.onBlur) {
                        this.props.onBlur();
                    }
                } }
            />
        );
    }
}

export default HowToEditor;