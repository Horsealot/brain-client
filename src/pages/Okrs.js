import React, { Component } from 'react';
import {Container} from "reactstrap";
import {okrService} from "../_services/okr.service";

import FullPageLoader from "../components/FullPageLoader";
import Okr from "../components/Okr";
import NewOkrForm from "../components/NewOkrForm";

import './../_styles/_components/_okrs.scss';
import connect from "react-redux/es/connect/connect";
import {isAdmin, isAdminOfCurrentSquad} from "../_helpers/admin-validator";
import {Link} from "react-router-dom";

class Okrs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            brainEditPopup: false,
            squadEditPopup: false,
            okr: {},
            squadOkr: {},
            isSuperAdmin: isAdmin(this.props.authentication.user),
            isSquadAdmin: isAdminOfCurrentSquad(this.props.authentication.user),
            loaded: false
        };
        this.updateOkr = this.updateOkr.bind(this);
        this.updateSquadOkr = this.updateSquadOkr.bind(this);
        this.toggleEditPopup = this.toggleEditPopup.bind(this);
    }

    updateOkr(okr) {
        this.setState({okr});
    }

    toggleEditPopup(type) {
        if(type === 'brain') {
            this.setState({brainEditPopup: !this.state.brainEditPopup});
        } else {
            this.setState({squadEditPopup: !this.state.squadEditPopup});
        }
    }

    updateSquadOkr(okr) {
        this.setState({squadOkr: okr});
    }

    componentDidMount() {
        okrService.getOkr().then((data) => {
            this.setState({period: data.period, okr: data.okr, squadOkr: data.squadOkr, loaded: true});
        });
    }

    render() {
        const { loaded, period, okr, squadOkr, isSuperAdmin, isSquadAdmin, brainEditPopup, squadEditPopup } = this.state;
        if(!loaded) {
            return (<FullPageLoader />);
        }
        const startMonth = (new Date(period.startDate)).toLocaleString('en-us', { month: 'short' });
        const endMonth = (new Date(period.endDate)).toLocaleString('en-us', { month: 'short' });
        const year = (new Date(period.startDate)).getFullYear();
        return (
            <Container>
                <div className='flex flex--center-center'>
                    <h2 className='flex--grow'>{`${startMonth}-${endMonth} ${year}`}</h2>
                    <div className='okrs__links'>
                        <Link to='/okr/history'>Past OKR's <i className="fas fa-history"></i></Link>
                    </div>
                </div>
                <div className='okrs__okr'>
                    {okr &&
                        <Okr okr={okr}/>
                    }
                    { isSuperAdmin &&
                        <NewOkrForm
                            okr={okr}
                            opened={brainEditPopup}
                            onUpdated={(okr) => this.updateOkr(okr)}
                            forSquad={false}
                            onClose={() => this.toggleEditPopup('brain')}
                        />
                    }
                    { okr && isSuperAdmin &&
                        <div
                            className='okrs__okr__edit'
                            onClick={() => this.toggleEditPopup('brain')}
                        >
                            <i className="fas fa-edit"></i>
                        </div>
                    }
                    {!okr && isSuperAdmin &&
                        <div
                            className='new-okr-form__title flex flex--center-center'
                            onClick={() => this.toggleEditPopup('brain')}
                        >
                            <h5>Add Brain OKR</h5>
                        </div>
                    }
                </div>

                <div className='okrs__okr'>
                    {squadOkr &&
                        <Okr okr={squadOkr}/>
                    }
                    { (isSquadAdmin || isSuperAdmin) &&
                        <NewOkrForm
                            okr={squadOkr}
                            opened={squadEditPopup}
                            onUpdated={(okr) => this.updateSquadOkr(okr)}
                            forSquad={true}
                            onClose={() => this.toggleEditPopup('squad')}
                        />
                    }
                    { squadOkr && isSuperAdmin &&
                    <div
                        className='okrs__okr__edit'
                        onClick={() => this.toggleEditPopup('squad')}
                    >
                        <i className="fas fa-edit"></i>
                    </div>
                    }
                    {!squadOkr && (isSquadAdmin || isSuperAdmin) &&
                        <div
                            className='new-okr-form__title flex flex--center-center'
                            onClick={() => this.toggleEditPopup('squad')}
                        >
                            <h5>Add Squad OKR</h5>
                        </div>
                    }
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

const connectedOkrs = connect(mapStateToProps, null)(Okrs);
export default connectedOkrs;
