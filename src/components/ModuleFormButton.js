import React, { Component } from 'react';
import {Button} from "reactstrap";

class ModuleFormButton extends Component {

    render() {
        const { module } = this.props;
        return (
            <Button className="btn">
                {
                    module.id &&
                        <>Update</>
                }
                {
                    !module.id &&
                        <>Create</>
                }
            </Button>
        );
    }
}

export default ModuleFormButton;

