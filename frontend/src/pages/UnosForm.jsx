import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import './UnosForm.css';

export default function UnosForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  const [gljive, setGljive] = useState([]);
  const [lokacije, setLokacije] = useState([]);

  const [gljivaId, setGljivaId] = useState("");
  const [lokacijaId, setLokacijaId] = useState("");
  const [novaLokacija, setNovaLokacija] = useState("");
  const [slikaUrl, setSlikaUrl] = useState("");
  const [poruka, setPoruka] = useState("");
  const [greska, setGreska] = useState("");

  const token = sessionStorage.getItem("token");
  const korisnikId = JSON.parse(atob(token.split(".")[1]))?.id;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/gljive`)
      .then((res) => res.json())
      .then((data) => setGljive(data));
  
    fetch(`${import.meta.env.VITE_API_URL}/lokacije`)
      .then((res) => res.json())
      .then((data) => setLokacije(data));
  }, []);

  useEffect(() => {
    if (id && gljive.length > 0 && lokacije.length > 0) {
      fetch(`${import.meta.env.VITE_API_URL}/unosi/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.id_gljiva && data?.id_lokacija) {
            setGljivaId(data.id_gljiva.toString());
            setLokacijaId(data.id_lokacija.toString());
          } else {
            throw new Error("Neispravan odgovor servera");
          }
        })
        .catch((err) => {
          console.error("Greška pri dohvaćanju unosa:", err);
          setGreska("Neuspješno dohvaćanje unosa za uređivanje.");
        });
    }
  }, [id, gljive, lokacije]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPoruka("");
    setGreska("");

    let finalLokacijaId = lokacijaId;

    try {
      
      if (lokacijaId === "nova") {
        const resLok = await fetch("/api/lokacije", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ naziv: novaLokacija }),
        });

        const lokData = await resLok.json();
        if (!resLok.ok) throw new Error(lokData.error || "Greška pri dodavanju lokacije");

        finalLokacijaId = lokData.id_lokacija;
      }

      
      const endpoint = id
        ? `${import.meta.env.VITE_API_URL}/unosi/${id}`
        : `${import.meta.env.VITE_API_URL}/unosi`;

      const method = id ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_gljiva: gljivaId,
          id_lokacija: finalLokacijaId,
          id_korisnik: korisnikId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Neuspješan unos");
      }

      setPoruka("Unos uspješno spremljen!");
    } catch (err) {
      setGreska(err.message);
    }
  };

  return (
    <div className="unos-container">
      <h2>{id ? "Ažuriranje unosa" : "Stvaranje novog unosa"}</h2>
      <form onSubmit={handleSubmit}>
        <label>Gljiva:</label>
        <select value={gljivaId} onChange={(e) => setGljivaId(e.target.value)} required>
          <option value="">-- Odaberi gljivu --</option>
          {gljive.map((g) => (
            <option key={g.id_gljiva} value={g.id_gljiva}>
              {g.hrvatski_naziv} ({g.latinski_naziv})
            </option>
          ))}
        </select>
  
        {slikaUrl && (
          <img src={slikaUrl} alt="Odabrana gljiva" className="unos-slika" />
        )}
  
        <label>Lokacija:</label>
        <select value={lokacijaId} onChange={(e) => setLokacijaId(e.target.value)} required>
          <option value="">-- Odaberi lokaciju --</option>
          {lokacije.map((l) => (
            <option key={l.id_lokacija} value={l.id_lokacija}>
              {l.naziv_lokacije}
            </option>
          ))}
          <option value="nova">+ Dodaj novu lokaciju</option>
        </select>
  
        {lokacijaId === "nova" && (
          <input
            type="text"
            placeholder="Naziv nove lokacije"
            value={novaLokacija}
            onChange={(e) => setNovaLokacija(e.target.value)}
            required
          />
        )}
  
        <button type="submit">Spremi unos</button>
      </form>
  
      {greska && <p className="unos-poruka error">{greska}</p>}
      {poruka && <p className="unos-poruka success">{poruka}</p>}
    </div>
  );
}