import React, { useEffect } from 'react';
import "./styles.css";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAuth, signOut } from 'firebase/auth';
import coin from "../../assets/SL-020622-4930-02-removebg-preview.png";
import { useTheme } from '../../context/ThemeContext'; 
import Switch from 'react-switch'; 
import { FaSun, FaMoon } from 'react-icons/fa'; 

function Header() {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme(); 

  useEffect(() => {
    if (user && location.pathname !== '/analysis') {
      navigate("/dashboard");
    }
  }, [user, loading, navigate, location.pathname]);

  function logoutfnc() {
    const auth = getAuth();
    signOut(auth).then(() => {
      toast.success("Logged Out Successfully");
      navigate("/");
    }).catch((error) => {
      console.error("Sign-out error", error);
    });
  }

  return (
    <div className={`navbar ${theme}`}> {/* Apply the theme class */}
      <p className='logo'>
        <div className='logo-image'>
          <img src={coin} style={{ height: "2.5rem", width: "2.8rem", margin: "0px" }} alt="logo" />
        </div>
        FinanceX.
      </p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
        {user && (
          <p className={'logo link'} onClick={() => navigate('/dashboard')}>
            <span style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <i className="bi bi-piggy-bank-fill"></i>
              DashBoard
            </span>
          </p>
        )}

        {user && (
          <p className={'logo link'} onClick={() => navigate('/analysis')}>
            <span style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <i className="bi bi-cash-coin"></i>
              Lend/Borrowed
            </span>
          </p>
        )}

        {user && (
          <p className='logo link' onClick={logoutfnc}>
            <span style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <i className="bi bi-door-closed-fill"></i>
              Log Out
            </span>
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: theme === 'dark' ? 'grey' : '#D4F1F4', borderRadius: '50px' }}>
          <Switch
            onChange={toggleTheme}
            checked={theme === 'dark'}
            offColor="transparent"
            onColor="transparent"
            offHandleColor="#fff"
            onHandleColor="#fff"
            checkedIcon={
              <FaMoon style={{ color: '#f1c40f', marginLeft: '6px', height: '100%', fontSize: 14 }} />
            }
            uncheckedIcon={
              <FaSun style={{ color: '#f39c12', marginLeft: '6px', height: '100%', fontSize: 14 }} />
            }
            height={24}  
            width={48}   
            handleDiameter={20}  
            boxShadow="0px 0px 2px 3px #999" 
            activeBoxShadow="0px 0px 2px 3px #666"
            
          />
        </div>
      </div>
    </div>
  );
}

export default Header;
