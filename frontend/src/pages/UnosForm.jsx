import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function UnosForm() {
  const navigate = useNavigate();

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
    fetch("/api/gljive")
      .then((res) => res.json())
      .then((data) => setGljive(data));

    fetch("/api/lokacije")
      .then((res) => res.json())
      .then((data) => setLokacije(data));
  }, []);

  useEffect(() => {
    const izabrana = gljive.find((g) => g.id_gljiva === parseInt(gljivaId));
    setSlikaUrl(izabrana?.slika_url || "");
  }, [gljivaId, gljive]);

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

      
      const res = await fetch("/api/unosi", {
        method: "POST",
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
    <div className="unos-form">
      <h2>Unos nove gljive</h2>
      <form onSubmit={handleSubmit}>
        <label>Gljiva:</label>
        <select value={gljivaId} onChange={(e) => setGljivaId(e.target.value)} required>
          <option value="">-- Odaberi gljivu --</option>
          {gljive.map((g) => (
            <option key={g.id_gljiva} value={g.id_gljiva}>
              {g.naziv}
            </option>
          ))}
        </select>

        {slikaUrl && <img src={slikaUrl} alt="gljiva" style={{ width: "150px", marginTop: "10px" }} />}

        <label>Lokacija:</label>
        <select value={lokacijaId} onChange={(e) => setLokacijaId(e.target.value)} required>
          <option value="">-- Odaberi lokaciju --</option>
          {lokacije.map((l) => (
            <option key={l.id_lokacija} value={l.id_lokacija}>
              {l.naziv}
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

      {greska && <p style={{ color: "red" }}>{greska}</p>}
      {poruka && <p style={{ color: "green" }}>{poruka}</p>}
    </div>
  );
}