import React, {useState} from "react";
import {BsEnvelope, BsEnvelopeOpen} from "react-icons/bs";
import {useMutation, useQuery} from "@apollo/client";

import {GET_USER, SET_READ_TO_TRUE} from "../../queries";

export default function Messages({id}) {
  const [open, setOpen] = useState(false);
  const [setReadOnce, setSetReadOnce] = useState(false);

  const {data} = useQuery(GET_USER, {variables: {id}});
  const [setReadToTrue] = useMutation(SET_READ_TO_TRUE);

  const resetReadToZero = () => {
    const amount = document.querySelector(".messages__amount");
    amount && amount.textContent !== 0 && (amount.style.display = "none");
    setReadToTrue();
  };

  const toggleMessages = () => {
    if (!setReadOnce) {
      resetReadToZero();
      setSetReadOnce(true);
    }
    setOpen(prevState => !prevState);
  };

  return (
    <div className="messages">
      <div className="messages__icon" onClick={toggleMessages}>
        {open ? <BsEnvelopeOpen /> : <BsEnvelope />}
        {data &&
          data.getUser.messages.filter(({read}) => !read && true).length >
            0 && (
            <div className="messages__amount">
              {data.getUser.messages.filter(({read}) => !read && true).length}
            </div>
          )}
      </div>

      {data && open && (
        <div className="messages__content">
          {data.getUser.messages.length === 0 ? (
            <div className="messages__message-wrapper">No messages...</div>
          ) : (
            data.getUser.messages.map(({message, read, messageType}, key) => (
              <div
                className={
                  read
                    ? "messages__message-wrapper--read"
                    : "messages__message-wrapper"
                }
                key={key}
              >
                {message}
                {messageType === "invite" && (
                  <div className="messages__buttons">
                    <button className="messages__accept">Accept</button>
                    <button className="messages__reject">Reject</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
