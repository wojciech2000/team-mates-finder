import React, {Fragment, useState} from "react";
import {useQuery} from "@apollo/client";

import {GET_USER_PROFILE} from "../../queries";

export default function UserProfile(props) {
  const id = props.match.params.id;

  const {loading, data, error} = useQuery(GET_USER_PROFILE, {variables: {id}});

  const [editInput, setEditInput] = useState({
    nick: false,
    server: false,
    positions: false,
    champions: false,
    team: false,
  });

  const [editValue, setEditValue] = useState({
    // nick: data.getUser.nick,
    // server: data.getUser.server.serverName,
    // primary: data.getUser.position.primary,
    // secondary: data.getUser.position.secondary,
    // champions: data.getUser.mainChampions,
    // team: data.getUser.team ? data.getUser.team.name : "",
  });

  const restEditValue = () => {
    setEditValue({
      nick: data.getUser.nick,
      server: data.getUser.server.serverName,
      primary: data.getUser.position.primary,
      secondary: data.getUser.position.secondary,
      champions: data.getUser.mainChampions,
      team: data.getUser.team ? data.getUser.team.name : "",
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

  const cancelEditValue = e => {
    //user didn't do any changes reset state
    restEditValue();
    setEditInput({...editInput, [e.target.id]: false});
  };

  const onChangeInput = (e, id) => {
    //update array champions
    if (id || id === 0) {
      const update = editValue.champions.map((value, idArray) =>
        idArray === id ? e.target.value : value,
      );

      setEditValue({
        ...editValue,
        champions: update,
      });
    } else {
      //update single text
      setEditValue({...editValue, [e.target.name]: e.target.value});
    }
  };

  const addNewChampion = () => {
    if (editValue.champions.length >= 4) {
      console.log("You can have max 4 main champions");
    } else {
      setEditValue({
        ...editValue,
        champions: [...editValue.champions, "New main..."],
      });
    }
  };

  const deleteChampion = id => {
    setEditValue({
      ...editValue,
      champions: editValue.champions.filter((champ, arrayId) => arrayId !== id),
    });
  };

  return (
    <Fragment>
      {loading
        ? "Loading..."
        : error
        ? "Error..."
        : data && (
            <div className="wrapper">
              <div className="profile">
                <div className="profile__data-wrapper">
                  <div className="profile__data">
                    <span className="profile__description">Nick: </span>
                    {editInput.nick ? (
                      <input
                        type="text"
                        name="nick"
                        value={editValue.nick}
                        className="profile__input"
                        onChange={e => onChangeInput(e)}
                      />
                    ) : (
                      <span className="profile__content">
                        {data.getUser.nick}
                      </span>
                    )}
                  </div>
                  <div className="profile__edit-wrapper">
                    {editInput.nick ? (
                      <Fragment>
                        <button
                          className="profile__cancel"
                          id="nick"
                          onClick={e => cancelEditValue(e)}
                        >
                          cancel
                        </button>
                        <button className="profile__save">save</button>
                      </Fragment>
                    ) : (
                      <button
                        className="profile__edit"
                        id="nick"
                        onClick={e => startEditValue(e)}
                      >
                        edit
                      </button>
                    )}
                  </div>
                </div>

                <div className="profile__data-wrapper">
                  <div className="profile__data">
                    <span className="profile__description">Server: </span>
                    {editInput.server ? (
                      <select
                        className="profile__input"
                        name="server"
                        value={editValue.server}
                        onChange={e => onChangeInput(e)}
                      >
                        <option value="BR">Brazil</option>
                        <option value="EUNE">Europe Nordic East</option>
                        <option value="EUW">Europe West </option>
                        <option value="LAN">Latin America North</option>
                        <option value="LAS">Latin America South</option>
                        <option value="NA">North America</option>
                        <option value="OCE">Oceania</option>
                        <option value="RU">Russia</option>
                        <option value="TR">Tureky</option>
                        <option value="JP">Japan </option>
                        <option value="KR">Korea</option>
                      </select>
                    ) : (
                      <span className="profile__content">
                        {data.getUser.server.serverName}
                      </span>
                    )}
                  </div>
                  <div className="profile__edit-wrapper">
                    {editInput.server ? (
                      <Fragment>
                        <button
                          className="profile__cancel"
                          id="server"
                          onClick={e => cancelEditValue(e)}
                        >
                          cancel
                        </button>
                        <button className="profile__save">save</button>
                      </Fragment>
                    ) : (
                      <button
                        className="profile__edit"
                        id="server"
                        onClick={e => startEditValue(e)}
                      >
                        edit
                      </button>
                    )}
                  </div>
                </div>

                <div className="profile__data-wrapper">
                  <div className="profile__data">
                    <span className="profile__description">Positions: </span>

                    {editInput.positions ? (
                      <div className="profile__inputs-positions">
                        <select
                          className="profile__input profile__input--position"
                          name="primary"
                          value={editValue.primary}
                          onChange={e => onChangeInput(e)}
                        >
                          <option value="Top">Top</option>
                          <option value="Jungle">Jungle</option>
                          <option value="Mid">Mid</option>
                          <option value="ADC">ADC</option>
                          <option value="Supp">Supp</option>
                        </select>
                        <select
                          className="profile__input profile__input--position"
                          placeholder="Positions..."
                          name="secondary"
                          value={editValue.secondary}
                          onChange={e => onChangeInput(e)}
                        >
                          <option value="Top">Top</option>
                          <option value="Jungle">Jungle</option>
                          <option value="Mid">Mid</option>
                          <option value="ADC">ADC</option>
                          <option value="Supp">Supp</option>
                        </select>
                      </div>
                    ) : (
                      <span className="profile__content">
                        {data.getUser.position.primary +
                          " | " +
                          data.getUser.position.secondary}
                      </span>
                    )}
                  </div>
                  <div className="profile__edit-wrapper">
                    {editInput.positions ? (
                      <Fragment>
                        <button
                          className="profile__cancel"
                          id="positions"
                          onClick={e => cancelEditValue(e)}
                        >
                          cancel
                        </button>
                        <button className="profile__save">save</button>
                      </Fragment>
                    ) : (
                      <button
                        className="profile__edit"
                        id="positions"
                        onClick={e => startEditValue(e)}
                      >
                        edit
                      </button>
                    )}
                  </div>
                </div>

                <div className="profile__data-wrapper">
                  <div className="profile__data">
                    <span className="profile__description">Mains: </span>
                    <span className="profile__content profile__content--champs">
                      {editInput.champions ? (
                        <div className="profile__inputs-champs-wrapper">
                          <div className="profile__inputs-champs">
                            {editValue.champions.map((champ, id) => (
                              <div
                                className="profile__inputs-champs-edit-delete-wrapper"
                                key={id}
                              >
                                <input
                                  type="text"
                                  name="champions"
                                  value={editValue.champions[id]}
                                  onChange={e => onChangeInput(e, id)}
                                  className="profile__input"
                                />
                                <button
                                  className="profile__button-delete-champ"
                                  onClick={() => deleteChampion(id)}
                                >
                                  -
                                </button>
                              </div>
                            ))}
                          </div>
                          <button
                            className="profile__button-add-champ"
                            onClick={addNewChampion}
                          >
                            +
                          </button>
                        </div>
                      ) : data.getUser.mainChampions.length === 0 ? (
                        "(empty)"
                      ) : (
                        data.getUser.mainChampions.map((champ, id) =>
                          id === 0 ? champ + " " : " | " + champ,
                        )
                      )}
                    </span>
                  </div>
                  <div className="profile__edit-wrapper">
                    {editInput.champions ? (
                      <Fragment>
                        <button
                          className="profile__cancel"
                          id="champions"
                          onClick={e => cancelEditValue(e)}
                        >
                          cancel
                        </button>
                        <button className="profile__save">save</button>
                      </Fragment>
                    ) : (
                      <button
                        className="profile__edit"
                        id="champions"
                        onClick={e => startEditValue(e)}
                      >
                        edit
                      </button>
                    )}
                  </div>
                </div>

                <div className="profile__data-wrapper">
                  <div className="profile__data">
                    <span className="profile__description">Team: </span>
                    <span className="profile__content">
                      {!data.getUser.team ? "(none)" : data.getUser.team.name}
                    </span>
                  </div>
                  <button className="profile__edit">edit</button>
                </div>
              </div>
            </div>
          )}
    </Fragment>
  );
}