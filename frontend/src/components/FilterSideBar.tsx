import DropdownList from "./DropdownList.tsx";
import ToggleFilter from "./ToggleFilters.tsx";
import Slider from "./Slider.tsx";
import RoomsAndBeds from "./RoomsAndBeds.tsx";
import CheckboxList from "./Checkbox.tsx";

function FilterSideBar({sidebarOpen}: { sidebarOpen: boolean }) {
  return (
    <div
      className={`sidebar flex-shrink-0 col-lg-3 col-sm-4 overflow-auto px-4 ${sidebarOpen ? 'visible' : 'hidden'}`}
      style={{height: "100%"}}
    >
      <div className={"pt-4"} style={{position: "sticky", top: 0, zIndex: "100", backgroundColor: "white"}}>
        <DropdownList/>
        <hr/>
      </div>
      <ToggleFilter/>
      <Slider/>
      <RoomsAndBeds/>
      <CheckboxList/>
    </div>
  )
}

export default FilterSideBar;