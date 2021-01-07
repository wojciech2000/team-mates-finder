import React, {useState, Fragment, useContext} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {FaUserAltSlash} from "react-icons/fa";
import {FiUserPlus} from "react-icons/fi";
import {BsFillTrashFill} from "react-icons/bs";

import {
  GET_TEAM_PROFILE,
  UPDATE_TEAM_NAME,
  UPDATE_POSITIONS_TEAM,
  DELETE_TEAM,
  GET_USER_PROFILE,
  GET_TEAMS,
  GET_USERS,
  LEAVE_TEAM,
} from "../../queries";
import {AuthContext} from "../../context/auth";
import {BiLogIn} from "react-icons/bi";

export default function EditTeam(props) {
  const {nick} = useContext(AuthContext);
  const id = props.location.id;
  const userId = props.location.userId;

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
    const filterPositions = data.getTeam.positions.map(position => ({
      ...position,
      __proto__: null,
    }));

    setEditValue({
      name: data.getTeam.name,
      positions: filterPositions,
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

  const addMember = () => {
    if (editValue.positions.length >= 5) {
      console.log("max member is 5");
    } else {
      setEditValue({
        ...editValue,
        positions: [
          ...editValue.positions,
          {position: "Top", nick: null, invited: null},
        ],
      });
    }
  };

  const deleteMember = (e, id) => {
    if (id === 0) {
      console.log("You can't delete founder");
    } else {
      const update = editValue.positions.filter(
        (position, idArray) => idArray !== id && position,
      );

      setEditValue({
        ...editValue,
        positions: update,
      });
    }
  };

  const onChangePositions = (e, id) => {
    if (id || id === 0) {
      const update = editValue.positions.map((position, idArray) =>
        idArray === id ? {...position, position: e.target.value} : position,
      );

      setEditValue({
        ...editValue,
        positions: update,
      });
    }
  };

  const [updatePositions] = useMutation(UPDATE_POSITIONS_TEAM, {
    variables: {positions: editValue.positions},
    update: (proxy, result) => {
      console.log(result);
    },
    refetchQueries: [{query: GET_TEAM_PROFILE, variables: {id}}],
    onError: error => {
      console.log(error);
    },
  });

  const savePositons = e => {
    console.log(editValue.positions);
    cancelEditValue(e);
    updatePositions();
  };

  const [deleteTeam] = useMutation(DELETE_TEAM, {
    variables: {id},
    update: (proxy, result) => {
      props.history.push({
        pathname: `/user/${result.data.deleteTeam.nick}`,
        id: userId,
      });
      console.log(result);
    },
    refetchQueries: [
      {query: GET_USER_PROFILE, variables: {id: userId}},
      {query: GET_TEAMS},
      {query: GET_USERS},
    ],
    onError: error => {
      console.log(error);
    },
  });

  const deleteTeamOnClick = () => {
    deleteTeam();
  };

  const [leaveTeam] = useMutation(LEAVE_TEAM, {
    variables: {id},
    update: (proxy, result) => {
      props.history.push({
        pathname: `/user/${result.data.leaveTeam.nick}`,
        id: userId,
      });
      console.log(result);
    },
    refetchQueries: [
      {query: GET_USER_PROFILE, variables: {id: userId}},
      {query: GET_TEAMS},
      {query: GET_USERS},
    ],
    onError: error => {
      console.log(error);
    },
  });

  const leaveTeamOnClick = () => {
    leaveTeam();
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
                        className="edit-team__input edit-team__input--edit-name-team"
                      />
                    ) : (
                      data.getTeam.name
                    )}
                  </span>
                </div>
                {nick === data.getTeam.founder && (
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
                )}
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
                {nick === data.getTeam.founder && (
                  <div className="edit-team__edit-wrapper">
                    {editInput.positions ? (
                      <Fragment>
                        <button
                          className="profile__cancel"
                          id="positions"
                          onClick={e => cancelEditValue(e)}
                        >
                          cancel
                        </button>
                        <button
                          className="profile__save"
                          id="positions"
                          onClick={e => savePositons(e)}
                        >
                          save
                        </button>
                      </Fragment>
                    ) : (
                      <button
                        className="edit-team__edit"
                        id="positions"
                        onClick={e => startEditValue(e)}
                      >
                        edit
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="edit-team__data-wrapper--members">
                {editInput.positions ? (
                  <Fragment>
                    <FiUserPlus
                      className="member__position-add"
                      onClick={addMember}
                    />
                    {editValue.positions.map((position, id) => (
                      <div className="member--edit" key={id}>
                        <span className="member__position--edit">
                          <FaUserAltSlash
                            className="member__position-delete"
                            onClick={e => deleteMember(e, id)}
                          />
                          <span className="member__nick">
                            <select
                              className="create-team__input"
                              style={{marginRight: "10px"}}
                              value={editValue.positions[id].position}
                              onChange={e => onChangePositions(e, id)}
                            >
                              <option value="Top">Top</option>
                              <option value="Jungle">Jungle</option>
                              <option value="Mid">Mid</option>
                              <option value="ADC">ADC</option>
                              <option value="Supp">Supp</option>
                            </select>
                          </span>
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
                  </Fragment>
                ) : (
                  data.getTeam.positions.map((position, id) => (
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
                  ))
                )}
              </div>
              {nick === data.getTeam.founder ? (
                <BsFillTrashFill
                  className="edit-team__delete-team"
                  onClick={deleteTeamOnClick}
                />
              ) : (
                <BiLogIn
                  className="edit-team__delete-team"
                  onClick={leaveTeamOnClick}
                />
              )}
            </div>
          )}
    </div>
  );
}
