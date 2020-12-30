import React, {useState} from "react";
import {BsEnvelope, BsEnvelopeOpen} from "react-icons/bs";

export default function Messages() {
  const [open, setOpen] = useState(false);

  const toggleMessages = () => {
    setOpen(prevState => !prevState);
  };

  return (
    <div className="messages">
      <div className="messages__icon" onClick={toggleMessages}>
        {open ? <BsEnvelopeOpen /> : <BsEnvelope />}
        <div className="messages__amount">5</div>
      </div>

      {open && (
        <div className="messages__content">
          <div className="messages__message-wrapper">
            You was invied to the team "team xxx" on position Jungle
            <div className="messages__buttons">
              <button className="messages__accept">Accept</button>
              <button className="messages__reject">Reject</button>
            </div>
          </div>
          <div className="messages__message-wrapper">
            Your application to team "name team XD" was rejected
          </div>
        </div>
      )}
    </div>
  );
}
