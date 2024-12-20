import React, {useState, useEffect} from 'react';
import {useGlobalState} from "../context/state.tsx";

// DropdownList component
function DropdownList() {

  // List of options for the dropdown
  const [optionData, setOptionData] = useState<string[]>([]);

  const {displayData, listings, location, setLocation} = useGlobalState();

  const totalListings = listings.length || 0;
  const displayedListings = displayData.length || 0;
  const percentageDisplayed = totalListings > 0 ? ((displayedListings / totalListings) * 100).toFixed(2) : "0";

  // Update the global state with the selected location
  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLocation(event.target.value);
  };

  // load data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch('/area');
        const data = await resp.json();
        setOptionData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className={"d-flex align-items-end"}>
        <div className={"col-7"}>
          <h3>ZÜRICH</h3>
          <select className={"form-select"} style={{margin: "auto"}} value={location || ''}
                  onChange={handleLocationChange}>
            {optionData.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div style={{
          marginLeft: "15px",
        }}>
          <p style={{fontSize: "15px", textAlign: "end", marginBottom: "0"}}>
            <span style={{fontSize: "30px", fontStyle: "italic", fontFamily: "serif"}}>{displayedListings}</span><br/>
            out
            of <b>{totalListings}</b> listings ({percentageDisplayed}%)
          </p>
        </div>
      </div>
    </div>
  );
}

export default DropdownList;
