import { useEffect, useState } from "react";
import { DNA } from "react-loader-spinner"; // Import a spinner from react-spinners

function ActionButton() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Toggle the menu state
  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
    console.log("clicked");
  };

  // Handle clicks outside the component
  useEffect(() => {
    const handleClickOutside = (event : MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest('.fab-menu') && !target?.closest('.fab')) {
        setMenuOpen(false); // Close the menu if clicked outside
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleDownloadData = () => {
    setLoading(true); // Start loading state
    fetch("/downloadData")
      .then((response) => {
        if (response.ok) {
          return response.blob();
        } else {
          throw new Error("Failed to download data");
        }
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "database_tables.zip";
        link.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => alert(error.message))
      .finally(() => setLoading(false)); // End loading state
  };

  return (
    <div className="actionButton">
      <div className={`fab-menu ${menuOpen ? 'open' : 'closed'}`}>
        <div className="fab-menu-options">
          <button className="fab-menu-item" onClick={handleDownloadData}>
            {loading ? (
              <div className="loading-spinner">
                <DNA/>
                <span>Loading...</span>
              </div>
            ) : (
              'Download Data'
            )}
          </button>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fab" onClick={toggleMenu}>
        <span>{menuOpen ? '-' : '+'}</span>
      </div>
    </div>
  );
}

export default ActionButton;
