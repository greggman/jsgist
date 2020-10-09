import Chart from 'chart.js';
import React from 'react';
import {hsl} from './color-utils.js';

export default class StackChart extends React.Component {
  constructor(props) {
    super();
    this.canvasRef = React.createRef();
  }
  componentDidMount() {
    const {data} = this.props;
    const config = {
      type: 'line',
      data: {
        labels: data[0].data.map(d => d.time),
        datasets: data.map(({data, title}, ndx, {length}) => {
          return {
            label: title,
            data: data.map(d => d.value),
            backgroundColor: hsl(ndx / length, 1, 0.7),
          };
        }),
      },
      options: {
        elements: {
          line: {
            tension: 0,
          },
        },
        scales: {
          yAxes: data.map(_ => {
            return {stacked: true};
          }),
        },
      }
    };
    this.myChart = new Chart(this.canvasRef.current, config);
  }
  componentDidUpdate() {
    const {data} = this.props;
    const {myChart} =  this;
    myChart.data.labels = data.map(d => d.label);
    myChart.data.datasets[0].data = data.map(d => d.value);
    myChart.update();
  }
  render() {
    return <canvas ref={this.canvasRef} />
  }
}

