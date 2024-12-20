import {Bar} from 'react-chartjs-2';
import React, {useEffect, useState} from 'react';
import {useGlobalState} from "../context/state.tsx";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend, ChartOptions,
} from 'chart.js';

// Register required PriceHist.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function PriceHist() {
  const [chartData, setChartData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const {location} = useGlobalState();

  // load data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch(`/files/${location}`);
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

  // IDEA: COULD ALSO DO THIS STACKED BY TYPE OF LISTING (ROOM_TYPE IN DB)
  // Ensure chartData is available and has the correct format
  if (loading) return <div>Loading...</div>;

  const labels = chartData?.hist.map((val: any) => val.breaks); // Assuming 'breaks' is the bin upper limit
  const counts = chartData?.hist.map((val: any) => val.count); // Assuming 'count' is the number of values in the bin

  const data = {
    labels: labels,
    datasets: [
      {
        data: counts,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false, // Allows scaling
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.raw} listings`,
        },
      },
      title: {
        display: false,
        font: {
          size: 14,
          weight: "bold",
        },
        color: "#333",
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Price per night",
          font: {
            weight: "bold"
          }
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Number of listings",
          font: {
            weight: "bold"
          }
        }
      }
    }
  };

  return (
    <div style={{
      height: "350px",
      marginTop: "15px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }}>
      <p style={{
        fontWeight: "bold",
        fontSize: "14px",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        margin: "0",
        marginBottom: "5px"
      }}>Price distribution per
        night (*)</p>
      <p style={{
        fontWeight: "bold",
        fontSize: "12px",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        color: "#333"
      }}>Average:
        <i style={{fontWeight: "lighter"}}> {chartData?.meanPrice} CHF</i> <i className={"fw-light"}>|</i> Median: <i
          style={{fontWeight: "lighter"}}> {chartData?.medianPrice} CHF</i></p>
      <div style={{flexGrow: 1, position: "relative", height: "300px", width: "100%"}}>
        <Bar data={data} options={options}/>
      </div>
      <p style={{textAlign: "right", margin: 0, padding: "5px", fontSize: "11px"}}>
        (*) top and bottom 5% of values discarded
      </p>
    </div>
  );
}

export default React.memo(PriceHist);
