import React from "react";
import logo from '../assets/logo_white.png';
const HeaderBar = ({onToggleSidebar, onToggleVisBar, visBar, sideBar, isMobile}: {
  onToggleSidebar: React.MouseEventHandler,
  onToggleVisBar: React.MouseEventHandler
  visBar: any, sideBar:any,
  isMobile: any
}) => {

  return (
    <header>
      <div className="d-flex justify-content-between">
        <nav>
          <ul style={{margin: 0}}>
            <li><img src={logo} alt="" style={{width: "52px", height: "52px", marginRight: "10px"}}/></li>
            <div style={{display: "flex", placeItems: "center", marginRight: "20px"}}>
              <div className="menu-icon" style={{fontSize: "30px", marginRight: "10px"}}
                   onClick={onToggleSidebar}>
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
              {!isMobile && (sideBar ? 'Close Filters' : 'Open Filters')}
            </div>
          </ul>
        </nav>
        <div style={{display: "flex", placeItems: "center"}}>
        {!isMobile && (visBar? 'Close Statistics' : 'Open Statistics')}
          <div className="menu-icon" style={{marginLeft: "10px", fontSize: "30px", marginRight: "10px"}}
               onClick={onToggleVisBar}>
            <i className="fa fa-area-chart"></i>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
