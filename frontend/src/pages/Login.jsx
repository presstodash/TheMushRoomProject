import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [greska, setGreska] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setGreska('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lozinka }),
      });

      const data = await res.json();

      if (!res.ok) {
        setGreska(data.error || 'Greška pri prijavi');
        return;
      }

      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('ime_korisnik', data.ime);

      navigate('/unosi');
      window.location.reload();
    } catch (err) {
      setGreska('Greška pri spajanju na server');
    }
  };

  return (
    <div className="login-container">
      <h2>Prijava</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Prijavi se</button>
      </form>
      {greska && <p style={{ color: 'red' }}>{greska}</p>}
    </div>
  );
}