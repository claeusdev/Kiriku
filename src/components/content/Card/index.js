import React from "react";
import "./Card.css";

export default ({ HeaderContent, BodyContent }) => {
  return (
    <div className="LunaCard">
      {HeaderContent && (
        <div className="LunaCard-Header">
          <HeaderContent />
        </div>
      )}
      {BodyContent && (
        <div className="LunaCard-Body">
          <BodyContent />
        </div>
      )}
    </div>
  );
};
