import { Outlet, Link } from 'react-router-dom';
import Header from './Header';
import '../main.css';

export default function Layout() {
  return (
    <div>
      <Header title="The MushRoom" subtitle="There is so mush room for all your mushroom needs!" />
      <nav style={{ padding: '1rem', background: '#eee' }}>
        <Link to="/">Početna</Link> |{" "}
        <Link to="/login">Prijava</Link> |{" "}
        <Link to="/register">Registracija</Link> |{" "}
        <Link to="/unosi">Moji unosi</Link> |{" "}
        <Link to="/unos">Novi unos</Link>
      </nav>
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
}