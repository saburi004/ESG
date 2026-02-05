'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface UsageChartProps {
  data: any[]; // Expecting history data
}

export function UsageChart({ data }: UsageChartProps) {
  const chartData = {
    labels: data.map(d => new Date(d.ts).toLocaleTimeString()),
    datasets: [
      {
        label: 'CO2 Emissions (g)',
        data: data.map(d => d.co2),
        fill: true,
        borderColor: '#00ff88',
        backgroundColor: 'rgba(0, 255, 136, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Tokens (k)',
        data: data.map(d => d.tokens / 1000),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.0)',
        borderDash: [5, 5],
        tension: 0.4,
        yAxisID: 'y1',
      }
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
        grid: { color: '#1f2937' },
      },
      y: {
        ticks: { color: '#9ca3af' },
        grid: { color: '#1f2937' },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: { display: false },
        ticks: { color: '#3b82f6' },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
