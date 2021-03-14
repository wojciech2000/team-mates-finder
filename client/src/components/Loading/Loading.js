import React from "react";
import loadingGif from "../../pictures/loading.gif";

export default function Loading(props) {
  return (
    <div className="loading-wrapper">
      <img src={loadingGif} alt="loading" />
    </div>
  );
}
