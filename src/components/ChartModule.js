import React, { Component } from 'react';
import {Line} from "react-chartjs-2";

class ChartModule extends Component {
    render() {
        const { module } = this.props;
        if(!module.stats) {
            return <>
                No data
            </>;
        }
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
            },
            maintainAspectRatio: false,
            responsive:true,
            scales: {
                xAxes: [{
                    ticks: {
                        display: false //this will remove only the label
                    }
                }]
            }
        };

        if(module.properties.xAxes && module.properties.xAxes.length > 0) {
            options.scales.xAxes = [{
                ticks: {
                    display: false //this will remove only the label
                },
                scaleLabel: {
                    display: true,
                    labelString: module.properties.xAxes
                }
            }]
        }

        if(module.properties.yAxes && module.properties.yAxes.length > 0) {
            options.scales.yAxes = [{
                scaleLabel: {
                    display: true,
                    labelString: module.properties.yAxes
                }
            }]
        }

        return <Line data={data} options={options} height={150}/>;
    }
}

export default ChartModule;
