import React, { Component } from 'react';
import {Container} from "reactstrap";
import {okrService} from "../_services/okr.service";

import FullPageLoader from "../components/FullPageLoader";
import Okr from "../components/Okr";

import './../_styles/_components/_okrs.scss';

class PastOkrs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            okrs: []
        };
        this.updateOkr = this.updateOkr.bind(this);
        this.updateSquadOkr = this.updateSquadOkr.bind(this);
    }

    updateOkr(okr) {
        this.setState({okr});
    }

    updateSquadOkr(okr) {
        this.setState({squadOkr: okr});
    }

    componentDidMount() {
        okrService.getPastOkrs().then((data) => {
            this.setState({okrs: data.okrs, loaded: true});
        });
    }

    renderPeriod(okrPeriod) {
        if(!okrPeriod.period && !okrPeriod.okr && !okrPeriod.squadOkr) return;
        const startMonth = (new Date(okrPeriod.period.startDate)).toLocaleString('en-us', { month: 'short' });
        const endMonth = (new Date(okrPeriod.period.endDate)).toLocaleString('en-us', { month: 'short' });
        const year = (new Date(okrPeriod.period.startDate)).getFullYear();
        return (
            <>
                <div className='okrs__history'>
                    <div className='flex flex--center-center'>
                        <div className='flex--grow okrs__history-separator'></div>
                        <h2 className='text-center'>{`${startMonth}-${endMonth} ${year}`}</h2>
                        <div className='flex--grow okrs__history-separator'></div>
                    </div>
                </div>
                <div className='okrs__okr'>
                    {okrPeriod.okr &&
                        <Okr okr={okrPeriod.okr}/>
                    }
                </div>

                <div className='okrs__okr'>
                    {okrPeriod.squadOkr &&
                        <Okr okr={okrPeriod.squadOkr}/>
                    }
                </div>
            </>
        );
    }

    render() {
        const { loaded, okrs } = this.state;
        if(!loaded) {
            return (<FullPageLoader />);
        }
        return (
            <Container>
                <h1>Past OKRs</h1>
                {
                    okrs.map((okrPeriod) => this.renderPeriod(okrPeriod))
                }
            </Container>
        );
    }
}

export default PastOkrs;
