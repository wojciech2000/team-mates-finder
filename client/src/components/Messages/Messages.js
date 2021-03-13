import React, {useContext, useState} from "react";
import {BsEnvelope, BsEnvelopeOpen} from "react-icons/bs";
import {useMutation, useQuery} from "@apollo/client";
import {AuthContext} from "../../context/auth";

import {
  GET_USER,
  SET_READ_TO_TRUE,
  ACCEPT_INVITATION,
  GET_TEAMS,
  GET_USERS,
  REJECT_INVITATION,
  ACCEPT_APPLICATION,
  REJECT_APPLICATION,
} from "../../queries";
import {InfoContext} from "../../context/infoContext";

export default function Messages({id}) {
  const {nick} = useContext(AuthContext);
  const {setMessages, setIsMessageError} = useContext(InfoContext);

  const [open, setOpen] = useState(false);
  const [setReadOnce, setSetReadOnce] = useState(false);

  const {data} = useQuery(GET_USER, {variables: {id}});
  const [setReadToTrue] = useMutation(SET_READ_TO_TRUE);

  const resetReadToZero = () => {
    const amount = document.querySelector(".messages__amount");
    amount && amount.value !== 0 && (amount.style.display = "none");
    setReadToTrue();
  };

  const toggleMessages = () => {
    if (!setReadOnce) {
      resetReadToZero();
      setSetReadOnce(true);
    }

    setOpen(prevState => !prevState);
  };

  //ACCEPTING

  const [acceptInvitation] = useMutation(ACCEPT_INVITATION, {
    update: (proxy, result) => {
      setMessages({message: "Accepted invitation"});
      setIsMessageError(false);
    },
    refetchQueries: [{query: GET_USER, variables: {id}}, {query: GET_TEAMS}, {query: GET_USERS}],
    onError: error => {
      console.log(error);
      setIsMessageError(true);
      setMessages(error.graphQLErrors[0].extensions.exception.errors);
    },
  });

  const [acceptApplication] = useMutation(ACCEPT_APPLICATION, {
    update: () => {
      setMessages({message: "Accepted application"});
      setIsMessageError(false);
    },
    refetchQueries: [{query: GET_USER, variables: {id}}, {query: GET_TEAMS}, {query: GET_USERS}],
    onError: error => {
      console.log(error);
      setIsMessageError(true);
      setMessages(error.graphQLErrors[0].extensions.exception.errors);
    },
  });

  const acceptOnClick = e => {
    if (data.getUser.team?.founder === nick) {
      acceptApplication({
        variables: {
          messageId: e.target.dataset.id,
          addresseeId: e.target.dataset.addresseeid,
          position: e.target.dataset.position && e.target.dataset.position,
        },
      });
    } else {
      acceptInvitation({
        variables: {
          messageId: e.target.dataset.id,
          addresseeId: e.target.dataset.addresseeid,
          position: e.target.dataset.position && e.target.dataset.position,
        },
      });
    }
  };

  //REJECTING

  const [rejectInvitation] = useMutation(REJECT_INVITATION, {
    update: () => {
      setMessages({message: "Rejected invitation"});
      setIsMessageError(false);
    },
    refetchQueries: [{query: GET_USER, variables: {id}}, {query: GET_USERS}, {query: GET_TEAMS}],
    onError: error => {
      console.log(error);
      setIsMessageError(true);
      setMessages(error.graphQLErrors[0].extensions.exception.errors);
    },
  });

  const [rejectApplication] = useMutation(REJECT_APPLICATION, {
    update: () => {
      setMessages({message: "Rejected application"});
      setIsMessageError(false);
    },
    refetchQueries: [{query: GET_USER, variables: {id}}, {query: GET_USERS}, {query: GET_TEAMS}],
    onError: error => {
      console.log(error);
      setIsMessageError(true);
      setMessages(error.graphQLErrors[0].extensions.exception.errors);
    },
  });

  const rejectOnClick = e => {
    if (data.getUser.team.founder === nick) {
      rejectApplication({
        variables: {
          messageId: e.target.dataset.id,
          addresseeId: e.target.dataset.addresseeid,
          position: e.target.dataset.position && e.target.dataset.position,
        },
      });
    } else {
      rejectInvitation({
        variables: {
          messageId: e.target.dataset.id,
          addresseeId: e.target.dataset.addresseeid,
        },
      });
    }
  };

  return (
    <div className="messages">
      <button className="messages__icon" onClick={toggleMessages}>
        {open ? <BsEnvelopeOpen /> : <BsEnvelope />}
        {data && data.getUser.messages.filter(({read}) => !read && true).length > 0 && (
          <div className="messages__amount">
            {data.getUser.messages.filter(({read}) => !read && true).length}
          </div>
        )}
      </button>

      {data && open && (
        <div className="messages__content">
          {data.getUser.messages.length === 0 ? (
            <div className="messages__message-wrapper">No messages...</div>
          ) : (
            data.getUser.messages.map(
              ({id, message, read, messageType, addresseeId, position}, key) => (
                <div
                  className={read ? "messages__message-wrapper--read" : "messages__message-wrapper"}
                  key={key}
                >
                  {message}
                  {messageType === "invite" && (
                    <div className="messages__buttons">
                      <button
                        className="messages__accept"
                        onClick={acceptOnClick}
                        data-id={id}
                        data-addresseeid={addresseeId}
                        data-position={position && position}
                      >
                        Accept
                      </button>
                      <button
                        className="messages__reject"
                        onClick={rejectOnClick}
                        data-id={id}
                        data-addresseeid={addresseeId}
                        data-position={position && position}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ),
            )
          )}
        </div>
      )}
    </div>
  );
}
