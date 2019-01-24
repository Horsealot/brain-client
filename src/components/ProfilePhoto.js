import React, { Component } from 'react';
import {Link} from "react-router-dom";

class ProfilePhoto extends Component {
    render() {
        let element = (
            <figure className="">
                <img src={this.props.src} alt={this.props.alt} />
            </figure>
        );
        if(this.props.link) {
            element = (
                <Link to={this.props.link}>
                    <figure className="">
                        <img src={this.props.src} alt={this.props.alt} />
                    </figure>
                </Link>
            );
        }
        return element;
    }
}

export default ProfilePhoto;
