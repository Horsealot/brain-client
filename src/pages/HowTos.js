import React, { Component } from 'react';
import {Container} from "reactstrap";
import SectionTitle from "../components/SectionTitle";
import {howToService} from "../_services/howTo.service";
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import './../_styles/_components/_how-to.scss';
import './../_styles/_libraries/_ck-editor.scss';
import FullPageLoader from "../components/FullPageLoader";
import {isAdmin, isAdminOfCurrentSquad} from "../_helpers/admin-validator";
import connect from "react-redux/es/connect/connect";
import {bindActionCreators} from "redux";
import {displayAlert} from "../actions/alert.actions";
import {alertConstants} from "../_constants/alert.constants";
import userMessages from "../_constants/userMessages.constants";

class HowTos extends Component {
    constructor(props) {
        super(props);

        this.state = {
            howToContent: null,
            squadHowToContent: null,
            original: {
                howToContent: null,
                squadHowToContent: null,
            },
            loaded: false,
            isSuperAdmin: isAdmin(this.props.authentication.user),
            isSquadAdmin: isAdminOfCurrentSquad(this.props.authentication.user),
        };

        // this.postHowTo = this.postHowTo.bind(this);
        // this.handleHowToChange = this.handleHowToChange.bind(this);
        this.resetContent = this.resetContent.bind(this);
    }

    componentDidMount() {
        howToService.get().then((data) => {
            this.setState({
                howToContent: data.howTo ? data.howTo.content : null,
                squadHowToContent: data.squadHowTo ? data.squadHowTo.content : null,
                original: {
                    howToContent: data.howTo ? data.howTo.content : null,
                    squadHowToContent: data.squadHowTo ? data.squadHowTo.content : null,
                },
                loaded: true
            });
        });
    }
    //
    // postHowTo(content, forSquad) {
    //     howToService.postHowTo({content}, forSquad);
    // }
    //
    handleHowToChange(name, value) {
        this.setState({ [name]: value });
    }

    resetContent(type) {
        this.setState({ [type]: this.state.original[type] });
    }

    saveContent(type) {
        howToService.postHowTo({content: this.state[type]}, type === 'squadHowToContent').then(() => {
            const original = {...this.state.original};
            original[type] = this.state[type];
            this.setState({ original });
            this.props.displayAlert(alertConstants.SUCCESS, userMessages.HOW_TO.SUCCESS);
        }).catch(() => {
            this.props.displayAlert(alertConstants.ERROR, userMessages.HOW_TO.INTERNAL_ERROR);
        });
    }

    render() {
        const {loaded, howToContent, squadHowToContent, isSuperAdmin, isSquadAdmin, original} = this.state;
        if(!loaded) {
            return (<FullPageLoader />);
        }
        return (
            <Container>
                <div className='how-to'>
                    <SectionTitle className='how-to__title text-right' title='Brain How To'/>
                    <div className='how-to__content'>
                        { isSuperAdmin &&
                            <>
                                <CKEditor
                                    editor={ ClassicEditor }
                                    data={ howToContent !== null ? howToContent : 'Edit text to create a How to article for Brain users'}
                                    onInit={ editor => {
                                    } }
                                    onChange={ ( event, editor ) => {
                                        this.handleHowToChange('howToContent', editor.getData())
                                    } }
                                />
                                <div className={'how-to__moderation ' + (howToContent !== original.howToContent ? 'moderation-visible' : '')}>
                                    <i className="fas fa-check-circle how-to__moderation__validate" onClick={() => {this.saveContent('howToContent')}}></i>
                                    <i className="fas fa-times-circle how-to__moderation__remove" onClick={() => {this.resetContent('howToContent')}}></i>
                                </div>
                            </>
                        }
                        { !isSuperAdmin &&
                            <div dangerouslySetInnerHTML={{ __html: howToContent}}></div>
                        }
                    </div>
                </div>
                <div className='how-to'>
                    <SectionTitle className='how-to__title text-right' title='Squad How To'/>
                    <div className='how-to__content'>
                        { (isSuperAdmin || isSquadAdmin) &&
                        <>
                            <CKEditor
                                editor={ ClassicEditor }
                                data={ squadHowToContent !== null ? squadHowToContent : 'Edit text to create a How to article for your squad'}
                                onInit={ editor => {
                                } }
                                onChange={ ( event, editor ) => {
                                    this.handleHowToChange('squadHowToContent', editor.getData())
                                } }
                            />
                            <div className={'how-to__moderation ' + (squadHowToContent !== original.squadHowToContent ? 'moderation-visible' : '')}>
                                <i className="fas fa-check-circle how-to__moderation__validate" onClick={() => {this.saveContent('squadHowToContent')}}></i>
                                <i className="fas fa-times-circle how-to__moderation__remove" onClick={() => {this.resetContent('squadHowToContent')}}></i>
                            </div>
                        </>
                        }
                        { !(isSuperAdmin || isSquadAdmin) &&
                            <div dangerouslySetInnerHTML={{ __html: squadHowToContent}}></div>
                        }
                    </div>
                </div>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    const { authentication } = state;
    return {
        authentication
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ displayAlert }, dispatch);
}

const connectedHowTos = connect(mapStateToProps, mapDispatchToProps)(HowTos);
export default connectedHowTos;
