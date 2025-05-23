import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './UnosiList.css';

export default function UnosiList() {
  const [unosi, setUnosi] = useState([]);
  const [greska, setGreska] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  
    fetch(`${import.meta.env.VITE_API_URL}/unosi`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (res) => {
        const text = await res.text();
  
        try {
          const data = JSON.parse(text);
  
          if (Array.isArray(data)) {
            setUnosi(data);
          } else {
            console.error("Backend error response:", data);
            setGreska(data?.error || data?.poruka || "Nepoznata greška");
          }
        } catch (err) {
          console.error("Odgovor nije JSON:", text);
          setGreska("Greška pri spajanju na server.");
        }
      })
      .catch((err) => {
        console.error("Greška u fetch pozivu:", err);
        setGreska("Greška pri spajanju na server.");
      });
  }, []);

  return (
    <div className="unosi-list">
      <h2>Moji unosi gljiva</h2>
  
      {greska && <p style={{ color: "red" }}>{greska}</p>}
  
      <div className="unosi-scroll">
        {unosi.length === 0 ? (
          <p>Nema unosa.</p>
        ) : (
          unosi.map((unos, index) => (
            <div key={unos.id_unos} className="unosi-kartica">
              {unos.slika && <img src={unos.slika} alt="gljiva" />}
              <div className="unosi-kartica-info">
                <p><strong>Unos #{index + 1}</strong></p>
                <p><strong>Gljiva (HR):</strong> {unos.hrvatski_naziv}</p>
                <p><strong>Gljiva (LAT):</strong> <em>{unos.latinski_naziv}</em></p>
                <p><strong>Lokacija:</strong> {unos.lokacija}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
