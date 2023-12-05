import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <Link to="/">
        <h1>Previously_on</h1>
      </Link>
      <nav>
        <Link to="/login">Se connecter</Link>
        <div></div>
        <Link to="/friend">Section ami</Link>
      </nav>
    </header>
  );
}

export default Header;
