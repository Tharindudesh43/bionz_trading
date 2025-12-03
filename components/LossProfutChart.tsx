// components/FearGreedChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const FearGreedChart = ({ data }: any) => {
  const chartData = {
    labels: data.map((item: { timestamp: number; }) => new Date(item.timestamp * 1000).toLocaleDateString()).reverse(),
    datasets: [
      {
        label: 'Fear & Greed Index Value',
        data: data.map((item: { value: any; }) => item.value).reverse(),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Index Value (0-100)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Crypto Fear & Greed Index (Last 30 Days)',
        },
    }
  };

  return <Line data={chartData} options={options} />;
};

export default FearGreedChart;
