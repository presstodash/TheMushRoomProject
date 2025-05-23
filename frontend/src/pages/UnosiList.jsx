import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './UnosiList.css';

export default function UnosiList() {
  const [unosi, setUnosi] = useState([]);
  const [filter, setFilter] = useState('');
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

  const handleDelete = async (id) => {
    if (!window.confirm("Jeste li sigurni da želite obrisati ovaj unos?")) return;

    try {
      const token = sessionStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/unosi/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Greška pri brisanju");
        return;
      }

      setUnosi((prev) => prev.filter((u) => u.id_unos !== id));
    } catch (err) {
      console.error("Greška pri brisanju:", err);
      alert("Greška pri brisanju");
    }
  };

  return (
    <div className="unosi-list">
      <h2>Moji unosi gljiva</h2>

      {greska && <p style={{ color: "red" }}>{greska}</p>}

      <input
        type="text"
        placeholder="Pretraži po gljivi ili lokaciji"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: "10px", padding: "6px", width: "100%" }}
      />

      <div className="unosi-scroll">
        {unosi.length === 0 ? (
          <p>Nema unosa.</p>
        ) : (
          <>
            {unosi.filter((unos) =>
              unos.hrvatski_naziv.toLowerCase().includes(filter.toLowerCase()) ||
              unos.latinski_naziv.toLowerCase().includes(filter.toLowerCase()) ||
              unos.lokacija.toLowerCase().includes(filter.toLowerCase())
            ).length === 0 ? (
              <p>Nema rezultata za pretragu.</p>
            ) : (
              unosi
                .filter((unos) =>
                  unos.hrvatski_naziv.toLowerCase().includes(filter.toLowerCase()) ||
                  unos.latinski_naziv.toLowerCase().includes(filter.toLowerCase()) ||
                  unos.lokacija.toLowerCase().includes(filter.toLowerCase())
                )
                .map((unos, index) => (
                  <div key={unos.id_unos} className="unosi-kartica">
                    {unos.slika && <img src={unos.slika} alt="gljiva" />}
                    <div className="unosi-kartica-info">
                      <p><strong>Unos #{index + 1}</strong></p>
                      <p><strong>Gljiva (HR):</strong> {unos.hrvatski_naziv}</p>
                      <p><strong>Gljiva (LAT):</strong> <em>{unos.latinski_naziv}</em></p>
                      <p><strong>Lokacija:</strong> {unos.lokacija}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(unos.id_unos)}
                      style={{ marginTop: "5px", backgroundColor: "#e74c3c", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px" }}
                    >
                      Obriši
                    </button>
                    <button
                      onClick={() => navigate(`/unosi/${unos.id_unos}/uredi`)}
                      style={{ marginTop: "5px", marginLeft: "10px", backgroundColor: "#3498db", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px" }}
                    >
                      Uredi
                    </button>
                  </div>
                ))
            )}
          </>
        )}
      </div>
    </div>
  );
}