import {useEffect, useState} from 'react';
import {Pie} from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend, ChartOptions,
} from 'chart.js';
import {useGlobalState} from "../context/state.tsx";

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart() {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // subscribe to filtering state
  const {location} = useGlobalState();

  // load data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch(`/chart2/${location}`);
        const data = await resp.json();
        setChartData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location]);

  if (loading) return <div>Loading...</div>;

  const labels = chartData.map((val: any) => val.room_type);
  const vals = chartData.map((val: any) => val.count);
  const data = {
    labels: labels,
    datasets: [
      {
        data: vals,
        backgroundColor: [
          "#4e73df", // Soft Blue
          "#1cc88a", // Soft Green
          "#36b9cc", // Light Cyan
          "#f6c23e", // Warm Yellow
          "#e74a3b", // Soft Red
          "#858796", // Neutral Gray
          "#f8d7da", // Light Pink
          "#5a5c69", // Slate Gray
        ]
      }
    ]
  }

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: true, // Allows scaling
    plugins: {
      legend: {
        display: true,
        position: 'bottom', // Legend positioned at the bottom
        labels: {
          padding: 15, // Adds space between the legend and chart
        },
        align: "center"
      },
      title: {
        display: true,
        text: 'Room Type Distribution', // Chart title
      },
    },
  };

  return (
    <div style={{
      display: "flex",
      width: '100%',
      position: "relative",
      minHeight: "300px",
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Pie data={data} options={options}/>
    </div>
  )
}

export default PieChart;
