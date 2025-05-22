import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div id="middlewrapper" className="home-container">
      <div className="content">
        <h2 className="page-title">Početna</h2>
        <p className="welcome-text">
          Dobrodošli u MushRoom aplikaciju! Pratite i upravljajte svojim unosima gljiva.
        </p>
        <Link className="link-button" to="/unosi">Moji unosi</Link>
      </div>
    </div>
  );
}