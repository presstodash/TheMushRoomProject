
CREATE TABLE Korisnik (
    id_korisnik SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    lozinka VARCHAR(128) NOT NULL,
    sol VARCHAR(32) NOT NULL,
    ime VARCHAR(100) NOT NULL,
    datum_registracije DATE NOT NULL,
    uloga VARCHAR(64) NOT NULL
);

CREATE TABLE IskusniKorisnik (
    id_korisnik INT PRIMARY KEY,
    determinator BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (id_korisnik) REFERENCES Korisnik(id_korisnik)
);

CREATE TABLE VerifikacijaIskustva (
    id_verifikacije SERIAL PRIMARY KEY,
    tip_dokaza VARCHAR(255) NOT NULL,
    putanja_dokumenta VARCHAR(2048) NOT NULL,
    status VARCHAR(64) NOT NULL,
    datum_podnosenja DATE NOT NULL,
    id_korisnik INT NOT NULL,
    FOREIGN KEY (id_korisnik) REFERENCES IskusniKorisnik(id_korisnik)
);

CREATE TABLE Gljiva (
    id_gljiva SERIAL PRIMARY KEY,
    latinski_naziv VARCHAR(255) NOT NULL,
    hrvatski_naziv VARCHAR(255) NOT NULL,
    jestiva BOOLEAN NOT NULL,
    opis TEXT NOT NULL,
    slika VARCHAR(2048) NOT NULL
);

CREATE TABLE Sezona (
    id_sezona SERIAL PRIMARY KEY,
    naziv_sezone VARCHAR(128) NOT NULL,
    mjesec_od INT NOT NULL,
    mjesec_do INT NOT NULL
);

CREATE TABLE Gljiva_Sezona (
    id_gljiva INT NOT NULL,
    id_sezona INT NOT NULL,
    PRIMARY KEY (id_gljiva, id_sezona),
    FOREIGN KEY (id_gljiva) REFERENCES Gljiva(id_gljiva),
    FOREIGN KEY (id_sezona) REFERENCES Sezona(id_sezona)
);

CREATE TABLE Lokacija (
    id_lokacija SERIAL PRIMARY KEY,
    naziv_lokacije VARCHAR(255) NOT NULL,
    geo_sirina DECIMAL(9,6) NOT NULL,
    geo_duljina DECIMAL(9,6) NOT NULL,
    regija VARCHAR(128) NOT NULL
);

CREATE TABLE Unos (
    id_unos SERIAL PRIMARY KEY,
    id_gljiva INT NOT NULL,
    id_lokacija INT NOT NULL,
    id_korisnik INT NOT NULL,
    datum_unosa DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (id_gljiva) REFERENCES Gljiva(id_gljiva),
    FOREIGN KEY (id_lokacija) REFERENCES Lokacija(id_lokacija),
    FOREIGN KEY (id_korisnik) REFERENCES Korisnik(id_korisnik)
);

CREATE TABLE Savjet (
    id_savjet SERIAL PRIMARY KEY,
    naslov VARCHAR(255) NOT NULL,
    sadrzaj TEXT NOT NULL,
    datum DATE NOT NULL,
    id_korisnik INT NOT NULL,
    FOREIGN KEY (id_korisnik) REFERENCES Korisnik(id_korisnik)
);

CREATE TABLE KategorijaSavjeta (
    id_kategorija SERIAL PRIMARY KEY,
    naziv_kategorije VARCHAR(128) NOT NULL
);

CREATE TABLE Savjet_KategorijaSavjeta (
    id_kategorija INT NOT NULL,
    id_savjet INT NOT NULL,
    PRIMARY KEY (id_kategorija, id_savjet),
    FOREIGN KEY (id_kategorija) REFERENCES KategorijaSavjeta(id_kategorija),
    FOREIGN KEY (id_savjet) REFERENCES Savjet(id_savjet)
);

CREATE TABLE Komentar (
    id_komentar SERIAL PRIMARY KEY,
    tekst_komentara TEXT NOT NULL,
    datum_objave DATE NOT NULL,
    id_nadkomentara INT,
    id_korisnik INT NOT NULL,
    id_savjet INT NOT NULL,
    FOREIGN KEY (id_nadkomentara) REFERENCES Komentar(id_komentar),
    FOREIGN KEY (id_korisnik) REFERENCES Korisnik(id_korisnik),
    FOREIGN KEY (id_savjet) REFERENCES Savjet(id_savjet)
);
