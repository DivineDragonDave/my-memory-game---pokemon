import React from "react";
import aaLogo from "/images/boll.jpg";
import imageMap from "./imageMap"; // Importera bildmappen

const Card = ({ card, index, onClick }) => {
  const cardImage = imageMap[card.name];

  return (
    <div
      className={`card ${card.isFlipped ? "is-flipped" : ""}`}
      onClick={() => onClick(index)}
    >
      <div
        className="front"
        style={{ backgroundImage: `url(${aaLogo})` }}
      ></div>
      <div
        className="back"
        style={{ backgroundImage: `url(${cardImage})` }}
      ></div>
    </div>
  );
};

export default Card;
