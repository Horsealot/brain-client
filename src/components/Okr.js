import React, { Component } from 'react';

class Okr extends Component {
    render() {
        const { okr } = this.props;
        return (
            <>
                <h4 className='okrs__okr-title'>{okr.isSquad ? `My squad quarter : ${okr.goal}` : okr.goal}</h4>
                <a href={okr.link} target='_blank' rel="noopener noreferrer">
                    <img className='okrs__okr-img' src={okr.picture} alt={okr.goal}/>
                </a>
            </>
        );
    }
}

export default Okr;
