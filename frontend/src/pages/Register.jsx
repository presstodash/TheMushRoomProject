import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [ime, setIme] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [ponoviLozinku, setPonoviLozinku] = useState('');
  const [greska, setGreska] = useState('');
  const [poruka, setPoruka] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setGreska('');
    setPoruka('');

    if (lozinka !== ponoviLozinku) {
      setGreska('Lozinke se ne podudaraju');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, ime, lozinka }),
      });

      const data = await res.json();

      if (!res.ok) {
        setGreska(data.error || 'Greška pri registraciji');
        return;
      }

      setPoruka('Registracija uspješna! Možete se prijaviti.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setGreska('Greška pri spajanju na server');
    }
  };

  return (
    <div className="login-container">
      <h2>Registracija</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Ime"
          value={ime}
          onChange={(e) => setIme(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Lozinka"
          value={lozinka}
          onChange={(e) => setLozinka(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Ponovi lozinku"
          value={ponoviLozinku}
          onChange={(e) => setPonoviLozinku(e.target.value)}
          required
        />
        <button type="submit">Registriraj se</button>
      </form>
      {greska && <p style={{ color: 'red' }}>{greska}</p>}
      {poruka && <p style={{ color: 'green' }}>{poruka}</p>}
    </div>
  );
}