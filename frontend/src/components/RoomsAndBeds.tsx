import './Counter'
import Counter from "./Counter.tsx";

function RoomsAndBeds() {
  return(
    <div  style={{display: 'flex', flexDirection: "column", gap: '10px'}}>
      <p style={{fontWeight: "bold"}}>Rooms and Beds</p>
      <Counter label={"Bedrooms"} filterName={"bedrooms"} />
      <Counter label={"Beds"} filterName={"beds"} />
      <Counter label={"Bathrooms"} filterName={"bathrooms"} />
      <hr/>
    </div>
  )
}

export default RoomsAndBeds;