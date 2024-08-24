import React from 'react';
import Chart from 'react-apexcharts';
import './styles.css';
import { useTheme } from '../../context/ThemeContext'; // Adjust path as needed

function ChartComponent({ transactions }) {
  const { theme } = useTheme(); // Use theme context

  const data = transactions.map((item) => ({
    x: item.date,
    y: item.amount,
  }));

  const spendingData = transactions
    .filter((item) => item.type === 'expense')
    .map((item) => ({
      name: item.tag,
      data: [item.amount],
    }));

  const barConfig = {
    series: [
      {
        name: 'Amount',
        data: data,
      },
    ],
    options: {
      chart: {
        type: 'bar',
        background: theme === 'dark' ? '#1a1a1a' : '#ffffff', // Set chart background
      },
      xaxis: {
        type: 'category',
        labels: {
          style: {
            colors: theme === 'dark' ? '#ffffff' : '#000000', // X-axis label color
          },
        },
      },
      yaxis: {
        title: {
          text: 'Amount',
          style: {
            color: theme === 'dark' ? '#ffffff' : '#000000', // Y-axis title color
          },
        },
        labels: {
          style: {
            colors: theme === 'dark' ? '#ffffff' : '#000000', // Y-axis label color
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      legend: {
        position: 'top',
        labels: {
          colors: theme === 'dark' ? '#ffffff' : '#000000', // Legend color
        },
      },
    },
  };

  const pieConfig = {
    series: spendingData.map((item) => item.data[0]),
    options: {
      chart: {
        type: 'pie',
        background: theme === 'dark' ? '#1a1a1a' : '#ffffff', // Set chart background
      },
      labels: spendingData.map((item) => item.name),
      legend: {
        position: 'top',
        labels: {
          colors: theme === 'dark' ? '#ffffff' : '#000000', // Legend color
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
          },
        },
      },
    },
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', flex: '1', width: '100%', height: '500px' }}>
      <div className={`charts-wrapper ${theme}`}>
        <h2>Your Analytics</h2>
        <Chart options={barConfig.options} series={barConfig.series} type='bar' height={350} width={750} />
      </div>
      <div className={`charts-wrapper-pie ${theme}`}>
        <h2>Your Spendings</h2>
        <Chart options={pieConfig.options} series={pieConfig.series} type='pie' height={350} />
      </div>
    </div>
  );
}

export default ChartComponent;
