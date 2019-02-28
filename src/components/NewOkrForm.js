import React, { Component } from 'react';
import {Button, Col, Form, FormGroup, Row} from "reactstrap";
import FloatingLabelInput from "./FloatingLabelInput";
import {bindActionCreators} from "redux";
import {displayAlert} from "../actions/alert.actions";
import connect from "react-redux/es/connect/connect";
import {alertConstants} from "../_constants/alert.constants";
import userMessages from './../_constants/userMessages.constants';
import './../_styles/_components/_popup_form.scss';
import './../_styles/_components/_new_okr_form.scss';
import {uploadService} from "../_services/uploard.service";
import FullPageLoaderOverlay from "./FullPageLoaderOverlay";
import {okrService} from "../_services/okr.service";

class NewOkrForm extends Component {
    constructor(props) {
        super(props);

        let okr = this.props.okr ? this.props.okr : {
            link: null,
            picture: null,
            goal: null
        };

        this.state = {
            okr
        };
        this.fileUpload = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePropertiesChange = this.handlePropertiesChange.bind(this);
        this.close = this.close.bind(this);
        this.triggerFileUpload = this.triggerFileUpload.bind(this);
        this.onPictureChange = this.onPictureChange.bind(this);
    }

    close() {
        this.setState({
            submitted: false,
        });
        this.props.onClose();
    }

    triggerFileUpload() {
        this.fileUpload.current.click();
    }

    handleChange(e) {
        let okr = {...this.state.okr};
        const { name, value } = e.target;
        okr[name] = value;
        this.setState({ okr });
    }

    handlePropertiesChange(e) {
        let module = {...this.state.module};
        if(!module.properties) module.properties = {};
        const { name, value } = e.target;
        module.properties[name] = value;
        this.setState({ module });
    }

    onPictureChange = e => {
        const files = Array.from(e.target.files);

        const formData = new FormData();

        files.forEach((file, i) => {
            formData.append(i, file)
        });
        this.setState({pictureIsUploading: true});

        uploadService.uploadPicture(formData)
            .then(image => {
                this.handleChange({target: {name: 'picture', value: image.url}});
                this.setState({pictureIsUploading: false});
            }).catch(() => {
                this.setState({pictureIsUploading: false});
            });
    };

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const {okr} = this.state;
        if(!okr || !okr.goal || !okr.link || !okr.picture) return;
        return okrService.createOkr(okr, !this.props.forSquad)
            .then((data) => {
                if(data.okr) {
                    this.props.displayAlert(alertConstants.SUCCESS, userMessages.NEW_OKR_FORM.SUCCESS);
                    this.props.onUpdated(data.okr);
                    this.close();
                }
            }).catch((err) => {
                if(err === 'Conflict') {
                    this.props.displayAlert(alertConstants.ERROR, userMessages.NEW_OKR_FORM.EXISTING);
                } else {
                    this.props.displayAlert(alertConstants.ERROR, userMessages.NEW_OKR_FORM.INTERNAL_ERROR);
                }
            });
    }

    render() {
        const { submitted, okr, pictureIsUploading } = this.state;
        const { opened } = this.props;
        return (
            <>
                { pictureIsUploading &&
                    <FullPageLoaderOverlay/>
                }
                { opened &&
                    <div className='popup-form__backdrop' onClick={this.close}>
                        <Form className='popup-form new-okr-form' onSubmit={ this.handleSubmit } onClick={(e) => e.stopPropagation()}>
                            <Row form>
                                <Col md={{ size: 12}}>
                                    <FormGroup>
                                        <h3>Add current OKR</h3>
                                    </FormGroup>
                                </Col>
                                { okr.picture &&
                                    <Col md={{ size: 12}} className='text-center'>
                                        <FormGroup>
                                            <img src={okr.picture} onClick={this.triggerFileUpload} className='new-okr-form__picture'/>
                                        </FormGroup>
                                    </Col>
                                }
                                <div style={{'display': 'none'}}>
                                    <input className='btn btn-secondary' type='file' id='single'
                                           ref={this.fileUpload} onChange={this.onPictureChange}/>
                                </div>
                                { !okr.picture &&
                                    <Col md={{size: 12}} className='text-center'>
                                        <FormGroup>{
                                            (submitted && !okr.picture) ?
                                                (<div className="help-block" style={{
                                                    position: 'relative',
                                                    bottom: 0,
                                                    textAlign: 'center'
                                                }}>Picture is required</div>) : undefined
                                            }
                                            <Button onClick={this.triggerFileUpload}>Add picture</Button>
                                        </FormGroup>
                                    </Col>
                                }
                                <Col md={{ size: 12}}>
                                    <FormGroup>
                                        <FloatingLabelInput
                                            type="text"
                                            label="Link to the OKR"
                                            formClass={(submitted && !okr.link ? 'has-error' : '')}
                                            name="link" value={okr.link}
                                            extrablock={
                                                (submitted && !okr.link) ?
                                                    (<div className="help-block">Link is required</div>) : undefined
                                            }
                                            onChange={this.handleChange}/>
                                    </FormGroup>
                                </Col>
                                <Col md={{ size: 12}}>
                                    <FormGroup>
                                        <FloatingLabelInput
                                            type="text"
                                            label="Goal of the period"
                                            formClass={(submitted && !okr.goal ? 'has-error' : '')}
                                            name="goal" value={okr.goal}
                                            extrablock={
                                                (submitted && !okr.goal) ?
                                                    (<div className="help-block">Goal is required</div>) : undefined
                                            }
                                            onChange={this.handleChange}/>
                                    </FormGroup>
                                </Col>
                                <Col md={{ size: 12 }} className='text-right'>
                                    <Button>Create</Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                }
            </>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({ displayAlert }, dispatch);
}

const connectedNewOkrForm = connect(null, mapDispatchToProps)(NewOkrForm);
export default connectedNewOkrForm;