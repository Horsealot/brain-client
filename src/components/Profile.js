import React, { Component } from 'react';
import {Button} from "reactstrap";
import authHeader from "../_helpers/auth-header";
import config from "../config";
import FullPageLoader from "./FullPageLoader";
import NotFound from "./NotFound";
import ProfileEdition from "./ProfileEdition";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            loaded: false,
            inEdition: false,
            isOwner: false,
            isAdmin: false
        };
        this.toggleEdition = this.toggleEdition.bind(this);
        this.editionCompleted = this.editionCompleted.bind(this);
        this.loadUser = this.loadUser.bind(this);
    }

    componentDidMount() {
        this.loadUser();
    }

    loadUser() {
        const requestOptions = {
            method: 'GET',
            headers: { ...authHeader(), 'Content-Type': 'application/json' }
        };

        return fetch(`${config.apiUrl}/users/${this.props.match.params.id}`, requestOptions)
            .then((response) => {
                return response.text().then((text) => {
                    if (!response.ok) {
                        this.setState({loaded: true});
                        return;
                    }
                    const data = text && JSON.parse(text);
                    const myUser = JSON.parse(localStorage.getItem('user'));
                    const isOwner = data.user && myUser && data.user._id === myUser._id;
                    const isAdmin = data.user && myUser && data.user._id === myUser._id;
                    this.setState({user: data.user, loaded: true, isOwner, isAdmin});
                });
            });
    }

    toggleEdition() {
        this.setState({ inEdition: !this.state.inEdition });
    }

    editionCompleted() {
        this.setState({inEdition: false, loaded: false});
        this.loadUser();
    }

    render() {
        const { user, loaded, isOwner, isAdmin, inEdition } = this.state;
        if(!loaded) {
            return (<FullPageLoader />);
        }
        if(!user) {
            return (<NotFound />);
        }
        if(inEdition) {
            return (<ProfileEdition user={user} editionCompleted={this.editionCompleted}/>);
        }
        return (
            <div className='profile flex flex--start-center flex--column'>
                <img src={user.picture} className='profile__avatar' alt={user.firstname + ' ' + user.lastname}/>
                {
                    (isOwner || isAdmin) && (
                        <Button onClick={this.toggleEdition} className='profile__edit'>Edit</Button>
                        // <Link to={`/profile/${this.props.match.params.id}/edition`}>Edit</Link>
                    )
                }
                <h1 className='profile__name'>{ user.firstname } { user.lastname }</h1>
                <h2 className='profile__title'>{ user.jobTitle }</h2>
                <div className='profile__birthdate'>{ user.birthdate }</div>
                <div className='profile__description'>{ user.description }</div>
                <div className='profile__phone-number'>{ user.phoneNumber }</div>
                {
                    user.scorecard &&
                        <div className='profile__scorecard'>{ user.scorecard }</div>
                }

                <div className='profile__actions'>
                    { isAdmin && user.administrativeLink &&
                        <a href={user.administrativeLink} target='_blank'>
                            <div className='profile__actions__action flex flex--center-center'>
                                <div className='flex--grow'>
                                    Administrative follow up
                                </div>
                                <div className='profile__actions__icon'>
                                    <FontAwesomeIcon icon="bars" />
                                </div>

                            </div>
                        </a>
                    }
                    { isOwner &&
                        <a href="mailto:alexandra@horsealot.com?Subject=Hello%20again" target="_top">
                            <div className='profile__actions__action flex flex--center-center'>
                                <div className='flex--grow'>
                                    Request meeting with alexandra
                                </div>
                                <div className='profile__actions__icon'>
                                    <FontAwesomeIcon icon="hand-peace" />
                                </div>

                            </div>
                        </a>
                    }
                </div>
            </div>
        );
    }
}

export default Profile;
