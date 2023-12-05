import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function SerieDetail() {
  const [episodes, setEpisodes] = useState([]);
  const [image, setImage] = useState("");
  const [client_id] = useState("bba558a60c3e");
  const [hoveredEpisode, setHoveredEpisode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [selectedEpisodeId, setSelectedEpisodeId] = useState(null);

  const { id } = useParams();
  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get(`https://api.betaseries.com/shows/episodes?id=${id}`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-BetaSeries-Key": process.env.REACT_APP_BETA_SERIES_KEY,
          "X-BetaSeries-Token": token,
        },
      })
      .then((response) => {
        console.log("Détails de la série :", response.data);
        setEpisodes(response.data);
        const seen = this.state.data.user.seen;
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des détails de la série :",
          error
        );
      });
  }, [id]);
  function Watched(id) {
    let data = JSON.stringify({
      token: token,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://api.betaseries.com/episodes/watched?id=${id}&bulk=true`,
      headers: {
        "X-BetaSeries-Key": process.env.REACT_APP_BETA_SERIES_KEY,
        "Content-Type": "application/json",
      },
      data: data,
    };

    async function makeRequest() {
      try {
        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
    makeRequest();
  }
  function makeComment(id, text) {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://api.betaseries.com/comments/comment?type=episode&id=${id}&text=${text}&token=${token}`,
      headers: {
        "X-BetaSeries-Key": process.env.REACT_APP_BETA_SERIES_KEY,
        "Content-Type": "application/json",
      },
    };

    async function makeRequest1() {
      try {
        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
      } catch (error) {
        console.log(error);
      }
    }

    makeRequest1();
  }
  function handleCommentTextChange(event) {
    setCommentText(event.target.value);
  }
  function UnSeen(id) {
    let data = JSON.stringify({
      token: token,
    });
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `https://api.betaseries.com/episodes/watched?id=${id}`,
      headers: {
        "X-BetaSeries-Key": process.env.REACT_APP_BETA_SERIES_KEY,
        "Content-Type": "application/json",
      },
      data: data,
    };

    async function makeRequest2() {
      try {
        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }

    makeRequest2();
  }
  return (
    <div>
      {episodes.episodes ? (
        <ul>
          {episodes.episodes.map((episode) => (
            <li
              key={episode.id}
              onMouseEnter={() => setHoveredEpisode(episode)}
              onMouseLeave={() => setHoveredEpisode(null)}
              ref={(el) => {}}
            >
              <span
                onClick={() => Watched(episode.id)}
                className={episode.user.seen ? "vu" : "pasvu"}
              >
                {episode.title}
              </span>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setSelectedEpisodeId(episode.id);
                }}
              >
                Commenter
              </button>
              {episode.user.seen ? (
                <button onClick={() => UnSeen(episode.id)}>Je n'ai pas vu cet épisode</button>
              ) : null}
              {hoveredEpisode && hoveredEpisode.id === episode.id && (
                <div className="serie-details">
                  <p>Titre: {episode.title}</p>
                  <img
                    src={`https://api.betaseries.com/pictures/shows?id=${id}&client_id=${client_id}`}
                  />
                  <p>Date: {episode.date}</p>
                  <p>Note: {episode.note.moyenne}</p>
                  <p>Résumé: {episode.description}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedEpisodeId(null);
              }}
            >
              &times;
            </span>
            <h2>Commentaire</h2>
            <textarea
              id="commentaire"
              placeholder="Saisissez votre commentaire"
              value={commentText}
              onChange={handleCommentTextChange}
            ></textarea>
            <button onClick={() => makeComment(selectedEpisodeId, commentText)}>
              Commenter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SerieDetail;
