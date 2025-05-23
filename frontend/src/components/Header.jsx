import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import mushroomLogin from '../assets/mushroomlogin.png'; 

export default function Header({ title, subtitle }) {
    const navigate = useNavigate();
    const [imeKorisnik, setImeKorisnik] = useState(null);
  
    useEffect(() => {
        const ime = sessionStorage.getItem('ime_korisnik');
        if (ime) setImeKorisnik(ime);
    }, []);
  
    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('ime_korisnik');
        navigate('/login');
        window.location.reload();
    };
  
    return (
      <div className="header-grid">
        <div className="top" id="logotype" onClick={() => navigate('/')}></div>
  
        <div className="top" id="headerdiv">
          <div className="text" id="headerdivtext">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
        </div>
  
        <div className="top" id="headerbuttons">
          {imeKorisnik ? (
            <>
              <p>Dobrodošao, {imeKorisnik}!</p>
              <button onClick={handleLogout}>Odjava</button>
            </>
          ) : (
            <img
              src={mushroomLogin}
              alt="Prijava"
              style={{ height: '100px', cursor: 'pointer' }}
              onClick={() => navigate('/login')}
            />
          )}
        </div>
      </div>
    );
}