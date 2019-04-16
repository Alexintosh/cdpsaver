import React from 'react';
import { Pie } from 'react-chartjs-2';
import PropTypes from 'prop-types';

import './PieChart.scss';
import { formatNumber } from '../../utils/utils';

const options = {
  rotation: -(0.1) * Math.PI,
  legend: { display: false },
  tooltips: { enabled: false },
  maintainAspectRatio: false,
};

// TODO add plugin that puts value labels inside the pieces (https://github.com/chartjs/Chart.js/issues/78)
const PieChart = ({ values }) => {
  const data = {
    pieceLabel: {
      mode: 'value',
    },
    datasets: [{
      data: values.map(({ data }) => data),
      borderWidth: [0, 0],
      backgroundColor: values.map(({ color }) => color),
    }],
  };

  return (
    <div className="pie-chart-wrapper chart-item">
      <div className="border" />

      <div className="pie-wrapper">
        <Pie data={data} options={options} />
      </div>

      <div className="legend-wrapper">
        {
          values.map(({ label, color, data }) => (
            <div className="legend-item" key={color}>
              <div className="box" style={{ background: color }} />

              <div className="value-wrapper">
                <div className="label">{ label }</div>
                <div className="value">{ formatNumber(data, 2) }$</div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

PieChart.propTypes = {
  values: PropTypes.array.isRequired,
};

export default PieChart;
