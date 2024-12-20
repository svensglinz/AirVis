import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import HeaderBar from "./components/Header.tsx";
import Map from "./components/Map.tsx";
import {useEffect, useRef, useState} from "react";
import FilterSideBar from "./components/FilterSideBar.tsx";
import VisSideBar from "./components/VisSideBar.tsx";

function App() {

  /*STATE TO CONTROL THE SIDEBAR*/
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(window.innerWidth > 768);
  const [visBarOpen, setVisBarOpen] = useState<boolean>(window.innerWidth > 768);
  const savedState= useRef<{sidebar: boolean | null, vizbar: boolean | null}>({sidebar: sidebarOpen, vizbar: visBarOpen});
  const isMobile = useRef(window.innerWidth <= 768);
  const [isM, setM] = useState(false);

  const toggleSidebar = () => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      if (sidebarOpen) {
        setSidebarOpen(false);
      } else {
        if (visBarOpen) {
          setVisBarOpen(false);
        }
        setSidebarOpen(true);
      }
    } else if (sidebarOpen) {
      setSidebarOpen(false);
      savedState.current.sidebar = false;
    } else {
      setSidebarOpen(true);
      savedState.current.sidebar = true;
    }
  };

  const toggleVisBar = () => {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      if (visBarOpen)
        setVisBarOpen(false);
      else {
        if (sidebarOpen) {
          setSidebarOpen(false);
        }
        setVisBarOpen(true)
      }
    } else if (visBarOpen) {
      setVisBarOpen(false);
      savedState.current.vizbar = false;
    } else {
      setVisBarOpen(true);
      savedState.current.vizbar = true;
    }
  };

  // MOBILE CONTROL
  useEffect(() => {
    const handleResize = () => {
      // check transitions to and from mobile
      if (window.innerWidth <= 768 && !isMobile.current) {
        setSidebarOpen(false);
        setVisBarOpen(false);
      } else if (window.innerWidth > 768 && isMobile.current) {
        setSidebarOpen(savedState.current.sidebar || false);
        setVisBarOpen(savedState.current.vizbar || false);
      }
      isMobile.current = window.innerWidth <= 768;
      setM(window.innerWidth <= 768)
    };

    handleResize(); // Initial call to check the current size
    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Only runs on mount/unmount


  return (
    <>
      <div className="overflow-hidden d-flex flex-column m-0 p-0">
        <HeaderBar onToggleSidebar={toggleSidebar} onToggleVisBar={toggleVisBar} visBar={visBarOpen} sideBar = {sidebarOpen} isMobile = {isM}/>
        <div className="d-flex p-0 flex-shrink-0 position-relative" style={{height: "calc(100vh - var(--header-height))"}}>
          {/* sidebar container */}
          <FilterSideBar sidebarOpen={sidebarOpen}/>
          {/* map container */}
            <Map width1={sidebarOpen} width2={visBarOpen} />
          {/*visualization bar*/}
          <VisSideBar sidebarOpen={visBarOpen}/>
        </div>
      </div>
    </>
  )
}

export default App
