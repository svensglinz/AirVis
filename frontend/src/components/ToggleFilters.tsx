import "bootstrap/dist/css/bootstrap.min.css";
import { useGlobalState } from "../context/state";

const ToggleFilter: React.FC = () => {
  const {filters, setFilter } = useGlobalState();
  const selected = filters.roomType || "Any type";

  const options = ["Any type", "Room", "Entire home"];

  const handleSelect = (option: string) => {
    let filterValue: string;
    if (option === "Any type"){
      filterValue = "any";
    } else if (option.toLowerCase().includes("room")){
      filterValue = "room";
    } else if (option.toLowerCase().includes("entire")){
      filterValue = "entire";
    } else {
      filterValue = "any";
    }
    setFilter('roomType', filterValue);
  };

  const getOptionIndex = (selectedFilter: string) => {
    if (selectedFilter === "any") return 0;
    if (selectedFilter.includes("room")) return 1;
    if (selectedFilter.includes("entire")) return 2;
    return 0; // Default
  };

  return (
    <div className="toggle-container">
      <label className="mb-2" style={{fontWeight: "bold"}}>Type of place</label>
      <div className="btn-group" role="group">
        <div
          className="toggle-slider position-absolute"
          style={{
            transform: `translateX(${getOptionIndex(selected) * 100}%)`,
          }}
        ></div>

        {/* Options */}
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`btn toggle-button ${
              (option === "Any type" && selected === "any") ||
              (option !== "Any type" && option.toLowerCase().includes(selected.toLowerCase()))
                ? "active"
                : ""
            }`}
            onClick={() => handleSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <hr/>
    </div>
  );
};

export default ToggleFilter;
