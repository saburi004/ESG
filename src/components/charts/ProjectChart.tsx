'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ProjectChartProps {
  metrics: Record<string, any>;
}

export function ProjectChart({ metrics }: ProjectChartProps) {
  const labels = Object.keys(metrics); // Project Names
  
  const data = {
    labels,
    datasets: [
      {
        label: 'CO2 (g)',
        data: labels.map(l => metrics[l].co2),
        backgroundColor: '#00ff88',
      },
      {
        label: 'Energy (kWh)',
        data: labels.map(l => metrics[l].energy * 1000), // Convert to Wh for visibility or just scale
        backgroundColor: '#f59e0b',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#9ca3af' },
      },
    },
    scales: {
      x: {
        ticks: { color: '#6b7280' },
        grid: { display: false },
      },
      y: {
        ticks: { color: '#9ca3af' },
        grid: { color: '#1f2937' },
      },
    },
  };

  return <Bar data={data} options={options} />;
}
