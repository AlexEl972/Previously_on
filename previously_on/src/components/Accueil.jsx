import React, {useRef, useState, useEffect } from "react";
import axios from "axios";
import './Accueil.css';


function Accueil() {
  const listItemRef = useRef(null);
  const [modalPosition, setModalPosition] = useState('below');
  const [series, setSeries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [seriesPerPage] = useState(20);
  const [hoveredSerie, setHoveredSerie] = useState(null);
  const token = localStorage.getItem("token");
  useEffect(() => {
    async function fetchSeries() {
      try {
        const response = await axios.get(
          `https://api.betaseries.com/shows/discover?token=${token}`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "X-BetaSeries-Key": process.env.REACT_APP_BETA_SERIES_KEY,
            },
          }
        );
        setSeries(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des séries :", error);
      }
    }
    fetchSeries();
  }, []);
  console.log(series.shows);
  const currentSeries = series.shows
    ? series.shows.slice(
        (currentPage - 1) * seriesPerPage,
        currentPage * seriesPerPage
      )
    : [];
  console.log(currentSeries);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  function FavSerie(serieId) {
    const token = localStorage.getItem("token");
    const body = {
      token: token,
    };
    const headers = {
      "X-BetaSeries-Key": process.env.REACT_APP_BETA_SERIES_KEY,
    };

    const button = document.getElementById(`fav-${serieId}`);
    button.classList.add('clicked');

    axios.post(`https://api.betaseries.com/shows/show?id=${serieId}`, body, { headers })
      .then(response => {
        axios.post(`https://api.betaseries.com/shows/favorite?id=${serieId}`, body, { headers })
          .then(response => {
            console.log("Série ajoutée avec succès !", response.data);
            button.addEventListener('animationend', () => {
              button.classList.remove('clicked');
              
            });
            window.location.reload();
          })
          .catch(error => {
            console.error("Erreur lors de l'ajout de la série :", error);
          });
      })
      .catch(error => {
        console.error("Erreur lors de l'ajout de la série :", error);
      });
}

function ArchiveSerie(serieId) {
  const token = localStorage.getItem("token");
  const body = {
    token: token,
  };
  const headers = {
    "X-BetaSeries-Key": process.env.REACT_APP_BETA_SERIES_KEY,
  };

  const button = document.getElementById(`archive-${serieId}`);
  button.classList.add('clicked');

  axios.post(`https://api.betaseries.com/shows/show?id=${serieId}`, body, { headers })
    .then(response => {
      axios.post(`https://api.betaseries.com/shows/archive?id=${serieId}`, body, { headers })
        .then(response => {
          console.log("Série archivée avec succès !", response.data);
          button.addEventListener('animationend', () => {
            button.classList.remove('clicked');
          });
          window.location.reload();
        })
        .catch(error => {
          console.error("Erreur lors de l'archivage de la série 1:", error);
        });
    })
    .catch(error => {
      axios.post(`https://api.betaseries.com/shows/archive?id=${serieId}`, body, { headers })
        .then(response => {
          console.log("Série archivée avec succès !", response.data);
          button.addEventListener('animationend', () => {
            button.classList.remove('clicked');
          });
          window.location.reload();
        })
        .catch(error => {
          console.error("Erreur lors de l'archivage de la série :", error);
        });
    });
}

  return (
    <div>
      <h1>Liste des séries</h1>
      <ul>
      {currentSeries.map((serie, index) => (
    <li
        key={serie.id}
        className={index >= currentSeries.length / 2 ? 'bottom-half' : ''}
        onMouseEnter={() => setHoveredSerie(serie)}
        onMouseLeave={() => setHoveredSerie(null)}
        ref={el => {
          if (el) {
              if (el.getBoundingClientRect().bottom + 300 > window.innerHeight) {
                  el.classList.add('bottom');
              } else {
                  el.classList.remove('bottom');
              }
          }
      }}
      
      
    >
      {console.log(serie)}
            {/* {serie.title}{" "}*/}<a href={`http://localhost:3000/serie/${serie.id}`}>{serie.title}</a>
            <button id={`fav-${serie.id}`} onClick={() => FavSerie(serie.id)}>+</button>
            {hoveredSerie && hoveredSerie.id === serie.id && (
              <div className="serie-details">
                {" "}
                <p>
                <img src={serie.images.poster} />
                </p>
                <p>Nb saison: {serie.seasons}</p>
                <p>Nb episode: {serie.episodes}</p>
                <p>Durée des episode: {serie.length}</p>
                <p>Note: {serie.notes.mean}</p>
                <p>Résumé: {serie.description}</p>
                <p>
                  Genres:{" "}
                  {Object.keys(hoveredSerie.genres).map((key, index) => (
                    <span key={index}>
                      {hoveredSerie.genres[key]}
                      {index < Object.keys(hoveredSerie.genres).length - 1
                        ? ", "
                        : ""}
                    </span>
                  ))}
                </p>
                <button id={`archive-${serie.id}`} onClick={() => ArchiveSerie(serie.id)}>Archiver</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentSeries.length < seriesPerPage}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}

export default Accueil;
