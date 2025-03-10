import React, { useEffect, useState, useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import AccountContext from "../../Context/AccountContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlassMartini, faMartiniGlassCitrus, faMessage, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Feed_Header() {
  const navigate = useNavigate();
  const { getSession, signout } = useContext(AccountContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [sub, setSub] = useState('');

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      window.location.href = `/finder?keyword=${encodeURIComponent(searchTerm)}`;
    }
  };

  useEffect(() => {
    getSession()
      .then((session) => {
        document.getElementById("username").innerHTML = session.name;
        setSub(session.sub);  // Set sub in state
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handlesignout = () => {
    signout()
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.log("fail", err.message);
      });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <div className="container-fluid bk py-2">
        <div className="d-flex align-items-center justify-content-between">
          {/* Brand Name with Icon */}
          <a className="navbar-brand d-flex align-items-center text-white" href="/feed">
            Hangout <FontAwesomeIcon className="ms-2" icon={faMartiniGlassCitrus} />
          </a>

          {/* Search Bar */}
          <div className="d-flex flex-grow-1 mx-3 position-relative">
            <input
              id="searchbar"
              className="form-control pe-5 text-white"
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyPress}
              style={{
                backgroundColor: "black",
                border: "1px solid white",
                color: "white",
                paddingRight: "40px",
              }}
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="position-absolute end-0 top-50 translate-middle-y"
              style={{
                color: "white",
                paddingRight: "10px",
                cursor: "pointer",
              }}
              onClick={handleSearch}
            />
          </div>

          {/* Navigation Icons */}
          <div className="d-flex align-items-center text-white">
            <a className="me-3 text-white" href="/chat">
              <FontAwesomeIcon icon={faMessage} />
            </a>
            <a className="me-3 text-white text-decoration-none" href= {`/profile?username=${sub}`} id="username">
              username
            </a>

            {/* Dropdown Menu */}
            <div className="dropdown">
              <button
                className="btn btn-dark dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FontAwesomeIcon icon={faGlassMartini} />
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li>
                <Link className="dropdown-item" to={`/profile?username=${sub}`}>
                    Profile
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/settings">
                    Settings
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/inventory">
                    Inventory
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/party">
                    Party 
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/calendar" >
                    Calendar
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/wallet" >
                    Wallet
                  </Link>
                </li>
                <li>
                  <a className="dropdown-item" href="#" onClick={handlesignout}>
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}

export default Feed_Header;
