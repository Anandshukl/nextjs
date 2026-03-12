"use client";

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import React from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function PostsChart({ data }: { data: { labels: string[]; values: number[] } }) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Posts per Week',
        data: data.values,
        borderColor: '#d4af37',
        backgroundColor: 'rgba(212,175,55,0.1)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Posts per Week' }
    }
  };

  return <Line options={options} data={chartData} />;
}
