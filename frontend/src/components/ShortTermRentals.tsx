import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { fetchShortTermRentals, ShortTermRentalData } from "../context/api";
import {useGlobalState} from "../context/state.tsx";
import {ChartOptions} from "chart.js";

const ShortTermRentals: React.FC = () => {
  const [data, setData] = useState<ShortTermRentalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {location} = useGlobalState();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedData = await fetchShortTermRentals(location);
        setData(fetchedData);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [location]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "#555" }}>
        Loading data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "#d9534f" }}>
        Error: {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
        No data available.
      </div>
    );
  }

  // Generate data for the bar chart
  const barChartData = {
    labels: data.histogram.map((item) => `[${item.bin}, ${+item.bin + 1})`), // Format bins as ranges
    datasets: [
      {
        label: "Number of Listings",
        data: data.histogram.map((item) => item.count),
        backgroundColor: "#84c5f4",
        borderColor: "#007acc",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions : ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (context: any) => {
            const labelArray = context[0].label.slice(2).split(",");
            return `Minimum Nights: ${labelArray[0]}`; // Select the first element
          },
          label: (context: any) => `${context.raw} listings`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Minimum Nights",
          font: { size: 12, weight: "bold", family: "Arial, sans-serif" },
          color: "#555",
        },
        ticks: {
          callback: (_value: any, index: number) => {
            var label = barChartData.labels[index]; // Get the label
            label = label.trim().split(',')[0];
            if (label === '[undefined') {
              return "35+";
            }
            const labelArray = barChartData.labels[index].replace("[", "").split(",");
            if (!labelArray || !labelArray[0]) {
              return "";
            }
            return `${labelArray[0].replace('[','')}`;
          },
          color: "#555",
          font: { size: 10 },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Listings",
          font: { size: 12, weight: "bold", family: "Arial, sans-serif" },
          color: "#555",
        },
        ticks: {
          color: "#555",
          font: { size: 10 },
        },
      },
    },
  };

  return (
    <div
      style={{
        height: "400px",
        backgroundColor: "#fff",
        fontFamily: "Arial, sans-serif",
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      <h4
        style={{
          fontSize: "14px",
          fontWeight: "bold",
          color: "#333",
          margin: "0 0 10px",
          textAlign: "center",
        }}
      >
        Short-Term Rentals
      </h4>
      <p
        style={{
          fontSize: "12px",
          color: "#555",
          margin: "0 0 10px",
          textAlign: "center",
          lineHeight: "1.4",
        }}
      >
        <strong>Short-term:</strong>{" "}
        {data.summary.find((item) => item.category === "short-term")?.percentage.toFixed(1)}% |{" "}
        <strong>Long-term:</strong>{" "}
        {data.summary.find((item) => item.category === "long-term")?.percentage.toFixed(1)}%
      </p>
      <div style={{ width: "100%", height: "300px", position: "relative"}}>
        <Bar data={barChartData} options={barChartOptions} />
      </div>
    </div>
  );
};

export default ShortTermRentals;
