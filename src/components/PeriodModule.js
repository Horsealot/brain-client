import React, { Component } from 'react';
import {Table} from "reactstrap";

class PeriodModule extends Component {
    render() {
        const { module } = this.props;

        return <Table className='period-module'>
            <thead>
                <tr>
                    <th scope="col">{module.title}</th>
                    <th scope="col text-center">D</th>
                    <th scope="col text-center">W</th>
                    <th scope="col text-center">M</th>
                </tr>
            </thead>
            <tbody>
            {module.properties.map((property, index) => (
                <tr key={index}>
                    <td>
                        { property.title }
                    </td>
                    <td style={{width: '30px'}}>
                        { property.stats.today }
                    </td>
                    <td style={{width: '30px'}}>
                        { property.stats.weekly }
                    </td>
                    <td style={{width: '30px'}}>
                        { property.stats.monthly }
                    </td>
                </tr>
            ))}
            </tbody>
        </Table>
    }
}

export default PeriodModule;
