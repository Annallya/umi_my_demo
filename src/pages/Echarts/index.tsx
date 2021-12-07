import React from 'react';
import ReactEcharts from 'echarts-for-react';

const option = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line',
    },
  ],
};
const EchartsDemo = () => {
  return (
    <div>
      <ReactEcharts option={option} notMerge lazyUpdate style={{ height: 600 }} />
    </div>
  );
};

export default EchartsDemo;
