import Chart from "./PriceHist.tsx";
import PieChart from "./pieChart.tsx";
import ShortTermRentals from "./ShortTermRentals.tsx";
import {useGlobalState} from "../context/state.tsx";


function VisSideBar({sidebarOpen}: { sidebarOpen: boolean }) {

  const {location} = useGlobalState();

  return (
    <div className={`d-flex vizbar flex-column flex-shrink-0 flex-grow-0 px-3 pb-3 col-lg-3 col-sm-4 position-relative ${sidebarOpen ? 'visible' : 'hidden'}`}
         style={{position: "relative", height: "100%", overflowY: "scroll"}} >
      <div style={{position: "sticky", top: "0", zIndex: "1000", background: "white", paddingTop: "20px"}}>
        <h4 style={{textAlign: "center"}}>Summary
          Statistics for: {location == "all" ? "Zürich" : location || ""}</h4>
        <hr/>
      </div>
      <Chart/>
      <hr/>
      <PieChart/>
      <hr/>
      <ShortTermRentals/>
    </div>
  )
}

export default VisSideBar;