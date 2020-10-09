import Chart from 'chart.js';
import React from 'react';
import {hsl} from './color-utils.js';

export default class PieChart extends React.Component {
  constructor(props) {
    super();
    this.canvasRef = React.createRef();
  }
  componentDidMount() {
    const {data} = this.props;
    const config = {
      type: 'pie',
      data: {
        labels: data.map(({data}) => data[data.length - 1].label),
        datasets: [{
          label: 'title',
          data: data.map(({data}) => data[data.length - 1].value),
          backgroundColor: data.map((_, ndx, array) => hsl(ndx / array.length, 0.8, 0.4)),
        }],
      },
      options: {
      },
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