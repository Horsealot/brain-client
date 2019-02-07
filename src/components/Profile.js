import React, { Component } from 'react';
import {Button} from "reactstrap";
import FullPageLoader from "./FullPageLoader";
import NotFound from "./NotFound";
import ProfileEdition from "./ProfileEdition";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import connect from "react-redux/es/connect/connect";
import {bindActionCreators} from "redux";
import {updateUser} from "../actions/user.actions";
import {userService} from "../_services/user.service";
import {isAdmin, isAdminOfSquad} from "../_helpers/admin-validator";

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            loaded: false,
            inEdition: false,
            isOwner: false,
            isSuperAdmin: false,
            isSquadAdmin: false
        };
        this.toggleEdition = this.toggleEdition.bind(this);
        this.editionCompleted = this.editionCompleted.bind(this);
        this.loadUser = this.loadUser.bind(this);
    }

    componentDidMount() {
        this.loadUser();
    }

    loadUser() {
        userService.getUser(this.props.match.params.id).then((data) => {
            if(!data.user) {
                return this.setState({loaded: true});
            }
            const isOwner = (data.user.id === this.props.authentication.user.id);
            const isSuperAdmin = isAdmin(this.props.authentication.user);
            let isSquadAdmin = false;
            this.props.authentication.user.squads.forEach((squad) => {
                if(isAdminOfSquad(squad)) {
                    data.user.squads.forEach((otherUserSquad) => {
                       if(otherUserSquad.id === squad.id) {
                           isSquadAdmin = true;
                       }
                   })
               }
            });
            if(isOwner) {
                this.props.updateUser(data.user);
            }
            this.setState({user: data.user, loaded: true, isOwner, isSuperAdmin, isSquadAdmin});
        }).catch(() => {
            this.setState({loaded: true});
        })
    }

    toggleEdition() {
        this.setState({ inEdition: !this.state.inEdition });
    }

    editionCompleted() {
        this.setState({inEdition: false, loaded: false});
        this.loadUser();
    }

    render() {
        const { user, loaded, isOwner, isSuperAdmin, inEdition, isSquadAdmin } = this.state;
        if(!loaded) {
            return (<FullPageLoader />);
        }
        if(!user) {
            return (<NotFound />);
        }

        if(inEdition) {
            return (<ProfileEdition
                            user={user}
                            isOwner={isOwner}
                            isSuperAdmin={isSuperAdmin}
                            inEdition={inEdition}
                            isSquadAdmin={isSquadAdmin}
                            editionCompleted={this.editionCompleted}
                    />);
        }
        return (
            <div className='profile flex flex--start-center flex--column'>
                <img src={user.picture} className='profile__avatar' alt={user.firstname + ' ' + user.lastname}/>
                {
                    (isOwner || isSuperAdmin || isSquadAdmin) && (
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

function mapStateToProps(state) {
    const { authentication } = state;
    return {
        authentication
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ updateUser }, dispatch);
}

const connectedProfile = connect(mapStateToProps, mapDispatchToProps)(Profile);
export default connectedProfile;