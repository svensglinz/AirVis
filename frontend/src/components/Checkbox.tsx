import OptionButton from "./OptionButton.tsx";
import pool from '/src/assets/pool.svg'
import wifi from '/src/assets/wifi.svg'
import kitchen from '/src/assets/kitchen.svg'
import parking from '/src/assets/parking.svg'
import breakfast from '/src/assets/breakfast.svg'

// CheckboxList component
const CheckboxList = () => {
  return (
    <div>
      <p style={{fontWeight: "bold"}}>Amenities</p>
      <div className={"d-flex flex-wrap gap-2"}>
        <OptionButton name={"Pool"} icon={pool} filterName={"pool"}/>
        <OptionButton name={"Wifi"} icon={wifi} filterName={"wifi"}/>
        <OptionButton name={"Kitchen"} icon={kitchen} filterName={"kitchen"}/>
        <OptionButton name={"Free Parking"} icon={parking} filterName={"parking"}/>
        <OptionButton name={"Breakfast"} icon={breakfast} filterName={"breakfast"}/>
      </div>
      <hr/>
    </div>
  );
};

export default CheckboxList;
