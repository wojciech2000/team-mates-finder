import React from "react";
import {BiArrowBack} from "react-icons/bi";
import {Link} from "react-router-dom";

export default function BackArrow({pathname, nick, id}) {
  return (
    <Link
      to={{pathname: nick ? `/user/${nick}` : pathname, id}}
      className="backarrow"
      data-testid="backButton"
    >
      <BiArrowBack />
    </Link>
  );
}
