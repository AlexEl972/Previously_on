import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import "./Accueil.css";

function FriendSection() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [demande, setDemande] = useState([]);
  const [commentText, setCommentText] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.betaseries.com/friends/list?token=${token}`,
      headers: {
        "Content-Type": "application/json",
        "X-BetaSeries-key": "bba558a60c3e",
      },
    };
    request();
    async function makeRequest() {
      try {
        const response = await axios.request(config);
        setFriends(response.data.users);
      } catch (error) {
        console.log(error);
      }
    }
    makeRequest();
  });
  function request() {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.betaseries.com/friends/requests?received=true&token=${token}`,
      headers: {
        "Content-Type": "application/json",
        "X-BetaSeries-key": "bba558a60c3e",
      },
    };

    async function makeRequest3() {
      try {
        const response = await axios.request(config);
        setDemande(response.data.users);
      } catch (error) {
        console.log(error);
      }
    }

    makeRequest3();
  }
  function Block(id) {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://api.betaseries.com/friends/block?id=${id}&token=${token}`,
      headers: {
        "Content-Type": "application/json",
        "X-BetaSeries-key": "bba558a60c3e",
      },
    };

    async function makeRequest1() {
      try {
        const response = await axios.request(config);
        console.log("user bloqué");
      } catch (error) {
        console.log(error);
      }
    }

    makeRequest1();
  }
  function Supp(id) {
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `https://api.betaseries.com/friends/friend?id=${id}&token=${token}`,
      headers: {
        "Content-Type": "application/json",
        "X-BetaSeries-key": "bba558a60c3e",
      },
    };

    async function makeRequest2() {
      try {
        const response = await axios.request(config);
        console.log("user supprimé");
      } catch (error) {
        console.log(error);
      }
    }

    makeRequest2();
  }
  function Accept(id) {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://api.betaseries.com/friends/friend?id=${id}&token=${token}`,
      headers: {
        "Content-Type": "application/json",
        "X-BetaSeries-key": "bba558a60c3e",
      },
    };

    async function makeRequest4() {
      try {
        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
      } catch (error) {
        console.log(error);
      }
    }

    makeRequest4();
  }
  function Reject(id) {
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `https://api.betaseries.com/friends/friend?id=${id}&token=${token}`,
      headers: {
        "Content-Type": "application/json",
        "X-BetaSeries-key": "bba558a60c3e",
      },
    };

    async function makeRequest5() {
      try {
        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
      } catch (error) {
        console.log(error);
      }
    }

    makeRequest5();
  }
  function handleCommentTextChange(event) {
    setCommentText(event.target.value);
  }
  function search(login){
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.betaseries.com/members/search?login=${login}`,
      headers: { 
        'Content-Type': 'application/json', 
        'X-BetaSeries-key': 'bba558a60c3e'
      },
    };
    
    async function makeRequest6() {
      try {
        const response = await axios.request(config);
        Accept(response.data.users[0].id)
        // console.log(response.data.users[0].id);
      }
      catch (error) {
        console.log(error);
      }
    }
    makeRequest6();
  }
  return (
    <div>
      <h2>Liste d'amis</h2>
      {loading ? (
        <p>Chargement en cours...</p>
      ) : (
        <ul>
          {friends.map((friend) => (
            <li key={friend.id}>
              {friend.login}
              <div>
                <button onClick={() => Block(friend.id)}>Bloquer</button>
                <button onClick={() => Supp(friend.id)}>Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <h2>Demande d'ami</h2>
      {demande.length > 0 ? (
        <ul>
          {demande.map((request) => (
            <li key={request.id}>
              {request.login} vous a envoyé une demande d'ami
              <div>
                <button onClick={() => Accept(request.id)}>Accepter</button>
                <button onClick={() => Reject(request.id)}>Rejeter</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Pas de demandes d'ami en attente.</p>
      )}
      <h2>Ajout d'ami</h2>
      <input
              type="text"
              id="recherche"
              placeholder="recherchez un ami"
              value={commentText}
              onChange={handleCommentTextChange}
            ></input>
            <button onClick={() => search(commentText)}>
              rechercher
            </button>
    </div>
  );
}

export default FriendSection;
