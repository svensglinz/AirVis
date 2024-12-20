import  { useState } from "react";
import {useGlobalState} from "../context/state.tsx";

const Counter = ({ label, min = 0, max = 8 , filterName}: { label: string; min?: number; max?: number; filterName : string }) => {
  const [value, setValue] = useState<number>(min);

  const {setFilter} = useGlobalState();

  const increment = () => {
    if (value < max) {
      setValue(value + 1);
      setFilter(filterName, value + 1);
    }
  };

  const decrement = () => {
    if (value > min) {
      setValue(value - 1);
      setFilter(filterName, value - 1);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "Arial, sans-serif",
        gap: "10px",
      }}
    >
      <span style={{ fontSize: "16px"}}>{label}</span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <button
          onClick={decrement}
          className="counterButton"
          style={{
            backgroundColor: value > min ? "#fff" : "#f5f5f5",
            cursor: value > min ? "pointer" : "not-allowed",
            color: value > min ? "black" : "#aaa",
          }}
          disabled={value <= min}
        >
          −
        </button>
        <span
          style={{
            fontSize: "16px",
            minWidth: "40px",
            textAlign: "center",
          }}
        >
          {value > 0? `${value}+` : 'any'}
        </span>
        <button
          className={'counterButton'}
          onClick={increment}
          style={{
            backgroundColor: value < max ? "#fff" : "#f5f5f5",
            cursor: value < max ? "pointer" : "not-allowed",
            color: value < max ? "black" : "#aaa",
          }}
          disabled={value >= max}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Counter;
