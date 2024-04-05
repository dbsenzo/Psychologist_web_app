import { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Box, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { Chart as ChartJS } from 'chart.js/auto';

export function ChartClient({chartName, pourcentage}) {
  const chartRef = useRef(null);

  const getPourcentageColor = () => {
    return pourcentage > 0
      ? { pourcentage: pourcentage, sign: "+", color: 'green', data: [5,3,11] }
      : { pourcentage: Math.abs(pourcentage), sign: "-", color: 'red', data: [11,3,5] }; // Make sure pourcentage is always positive here
  }

  const pourcentageObject = getPourcentageColor();

  useEffect(() => {
    // We need to wait for the chart to be fully rendered before updating the gradient.
    const chartInstance = chartRef.current;
    if (chartInstance) {
        updateGradient(chartInstance);
    }

    return () => {
        if (chartInstance) {
          chartInstance.destroy();
        }
      };

  }, []);

  const updateGradient = (chartInstance) => {
    const ctx = chartInstance.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, chartInstance.height);
    gradient.addColorStop(0, 'rgba(75,192,192,1)');
    gradient.addColorStop(1, 'rgba(75,192,192,0)');
  
    // Assuming your dataset is the first dataset (index 0)
    chartInstance.data.datasets[0].backgroundColor = gradient;
    chartInstance.update();
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
          display: false // This hides the legend
  
        },
        datalabels: {
            display: false
        },
      
      },
    scales: {
        x: { // Hides the x-axis labels
            display: false,
            ticks: {
              display: false
            }
          },
          y: { // Hides the y-axis labels
            display: false,
            min: 0,
            ticks: {
              display: false
            }
          },
    },
    elements: {
      point: {
        radius: 0 // Hides the points on the line
      }
    },
  };

  const chartData = {
    labels: ['Sunday', 'Monday', 'Tuesday'], // Simplified for readability
    datasets: [
      {
        label: 'Current lag',
        fill: true, // Set fill to true to show the gradient background
        lineTension: 0.5,
        borderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: 'rgba(75,192,192,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(179,181,198,1)',
        data: pourcentageObject.data // Simplified for readability
      }
    ]
  };

  return (
    <Box as="div" minWidth={"250px"}> 
        <Box display={'flex'} gap={"10px"} >
            <Text fontSize={"large"} fontWeight={700}>{chartName}</Text>
            <Text fontSize={"medium"} fontWeight={700} color={pourcentageObject.color}>{pourcentageObject.sign + pourcentageObject.pourcentage}%</Text>                
        </Box>
        <Box>
            <Line 
                data={chartData} 
                options={chartOptions} 
                ref={chartRef}
            />
        </Box>
    </Box>
  );
}

ChartClient.propTypes = {
    chartName: PropTypes.string.isRequired,
    pourcentage: PropTypes.number.isRequired,
  };
