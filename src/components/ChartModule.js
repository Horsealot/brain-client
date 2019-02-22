import React, { Component } from 'react';
import {Line} from "react-chartjs-2";

class ChartModule extends Component {
    render() {
        const { module } = this.props;
        let data = {
            labels: module.stats.map((stat) => (new Date(stat.date)).toLocaleDateString('fr-FR')),
            datasets: [
                {
                    data: module.stats.map((stat) => stat.value),
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.05)'
                }
            ]
        };
        let options = {
            legend: {
                display: false,
            }
        };
        return <Line data={data} options={options} />;
    }
}

export default ChartModule;
