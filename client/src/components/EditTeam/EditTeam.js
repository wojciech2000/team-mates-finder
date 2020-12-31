import React, {useState, Fragment} from "react";
import {useMutation, useQuery} from "@apollo/client";

import {GET_TEAM_PROFILE, UPDATE_TEAM_NAME} from "../../queries";

export default function EditTeam(props) {
  const id = props.match.params.id;

  const [editInput, setEditInput] = useState({
    name: false,
    positions: false,
  });

  const [editValue, setEditValue] = useState({
    name: "",
    positions: [],
  });

  const {loading, data, error} = useQuery(GET_TEAM_PROFILE, {
    variables: {id},
  });

  const restEditValue = () => {
    setEditValue({
      name: data.getTeam.name,
    });
  };

  const startEditValue = e => {
    //if user had opened some diffrent input and provide changes
    restEditValue();

    //close all edits
    Object.keys(editInput).forEach(key => (editInput[key] = false));

    //set edit
    setEditInput({...editInput, [e.target.id]: true});
  };

  const onChangeInput = e => {
    //update single text
    setEditValue({...editValue, [e.target.name]: e.target.value});
  };

  const cancelEditValue = e => {
    //user didn't do any changes reset state
    restEditValue();
    setEditInput({...editInput, [e.target.id]: false});
  };

  const [updateName] = useMutation(UPDATE_TEAM_NAME, {
    variables: {name: editValue.name},
    update: (proxy, result) => {
      console.log(result);
    },
    refetchQueries: [{query: GET_TEAM_PROFILE, variables: {id}}],
    onError: error => {
      console.log(error);
    },
  });

  const saveName = e => {
    setEditInput({...editInput, [e.target.id]: false});
    updateName();
  };

  return (
    <div className="wrapper">
      {loading
        ? "Loading..."
        : error
        ? "Error..."
        : data && (
            <div className="edit-team">
              <div className="edit-team__data-wrapper">
                <div className="edit-team__data">
                  <span className="edit-team__description">Team's name: </span>
                  <span className="edit-team__content">
                    {editInput.name ? (
                      <input
                        type="text"
                        name="name"
                        value={editValue.name}
                        onChange={e => onChangeInput(e)}
                        className="edit-team__input"
                      />
                    ) : (
                      data.getTeam.name
                    )}
                  </span>
                </div>
                <div className="edit-team__edit-wrapper">
                  {editInput.name ? (
                    <Fragment>
                      <button
                        className="profile__cancel"
                        id="name"
                        onClick={e => cancelEditValue(e)}
                      >
                        cancel
                      </button>
                      <button
                        className="profile__save"
                        id="name"
                        onClick={e => saveName(e)}
                      >
                        save
                      </button>
                    </Fragment>
                  ) : (
                    <button
                      className="edit-team__edit"
                      id="name"
                      onClick={e => startEditValue(e)}
                    >
                      edit
                    </button>
                  )}
                </div>
              </div>

              <div className="edit-team__data-wrapper">
                <div className="edit-team__data">
                  <span className="edit-team__description">Founder:</span>
                  <span className="edit-team__content">
                    {data.getTeam.founder}
                  </span>
                </div>
              </div>

              <div className="edit-team__data-wrapper">
                <div className="edit-team__data">
                  <span className="edit-team__description">
                    Member's amount:
                  </span>
                  <span className="edit-team__content">
                    {data.getTeam.maxMembersAmount}
                  </span>
                </div>
                <div className="edit-team__edit-wrapper">
                  <button className="edit-team__edit" id="nick">
                    edit
                  </button>
                </div>
              </div>
              <div className="edit-team__data-wrapper--members">
                {data.getTeam.positions.map((position, id) => (
                  <div className="member" key={id}>
                    <span className="member__position">
                      {position.position + ": "}
                    </span>
                    <span className="member__nick">
                      {position.nick ? (
                        position.nick
                      ) : position.invited ? (
                        <span className="member__nick--invited">
                          invited - {position.invited}
                        </span>
                      ) : (
                        <span className="member__nick--none">none</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
    </div>
  );
}
