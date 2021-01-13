import React, {useContext, useState} from "react";
import {useMutation} from "@apollo/client";

import {
  CREATE_TEAM,
  GET_USER_PROFILE,
  GET_TEAMS,
  GET_USERS,
} from "../../queries";
import {AuthContext} from "../../context/auth";
import {InfoContext} from "../../context/infoContext";
import BackArrow from "../BackArrow/BackArrow";

export default function EditTeam(props) {
  const {nick, id} = useContext(AuthContext);
  const {setMessages, setIsMessageError} = useContext(InfoContext);

  const [values, setValues] = useState({
    name: "",
    maxMembersAmount: 2,
    positions: [
      {
        nick: nick,
        position: "Top",
      },
      {
        nick: null,
        position: "Top",
      },
    ],
  });

  const [createTeam] = useMutation(CREATE_TEAM, {
    variables: values,
    update: () => {
      setMessages({message: "Created team"});
      setIsMessageError(false);
      props.history.push("/teams");
    },
    refetchQueries: [
      {query: GET_USER_PROFILE, variables: {id}},
      {query: GET_USERS},
      {query: GET_TEAMS},
    ],
    onError: error => {
      setIsMessageError(true);
      setMessages(error.graphQLErrors[0].extensions.exception.errors);
    },
  });

  const onSubmit = e => {
    e.preventDefault();
    createTeam();
  };

  const onChangeValues = e => {
    setValues({...values, [e.target.name]: e.target.value});
  };

  const onChangeMembers = e => {
    let update = [];

    update[0] = {
      nick: nick,
      position: values.positions[0].position,
    };

    for (let i = 1; i < e.target.value; i++) {
      update[i] = {
        nick: null,
        position: values.positions[i] ? values.positions[i].position : "Top",
      };
    }

    setValues({
      ...values,
      [e.target.name]: parseInt(e.target.value),
      positions: update,
    });
  };

  const onChangePositions = (e, id) => {
    const update = values.positions.map((value, IdArray) =>
      IdArray === id
        ? {nick: value.nick ? value.nick : null, position: e.target.value}
        : value,
    );

    setValues({...values, positions: update});
  };

  return (
    <div className="wrapper">
      <form className="create-team" onSubmit={e => onSubmit(e)}>
        <div className="create-team__input-wrapper">
          <label className="create-team__description" htmlFor="name">
            Team's name:{" "}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={values.name}
            onChange={e => onChangeValues(e)}
            className="create-team__input"
          />
        </div>

        <div className="create-team__input-wrapper">
          <label
            className="create-team__description"
            htmlFor="maxMembersAmount"
          >
            Member's amount:{" "}
          </label>
          <select
            className="create-team__input"
            id="maxMembersAmount"
            name="maxMembersAmount"
            value={values.maxMembersAmount}
            onChange={e => onChangeMembers(e)}
          >
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>

        <div className="create-team__input-wrapper">
          <label className="create-team__description" htmlFor="myPosition">
            Your position:{" "}
          </label>
          <select
            className="create-team__input"
            id="myPosition"
            value={values.positions[0].position}
            onChange={e => onChangePositions(e, 0)}
          >
            <option value="Top">Top</option>
            <option value="Jungle">Jungle</option>
            <option value="Mid">Mid</option>
            <option value="ADC">ADC</option>
            <option value="Supp">Supp</option>
          </select>
        </div>

        <div className="create-team__available-positions">
          {(() => {
            //put value in members state to array and map through to create inputs

            let membersIterator = [];
            for (let i = 1; i < values.maxMembersAmount; i++) {
              membersIterator[i] = i + 1;
            }

            return membersIterator.map((member, id) => (
              <div
                className="create-team__input-wrapper create-team__input-wrapper--positions"
                key={id}
              >
                <label className="create-team__description" htmlFor={id}>
                  Position {member}:{" "}
                </label>
                <select
                  className="create-team__input"
                  id={id}
                  value={values.positions[id].position}
                  onChange={e => onChangePositions(e, id)}
                >
                  <option value="Top">Top</option>
                  <option value="Jungle">Jungle</option>
                  <option value="Mid">Mid</option>
                  <option value="ADC">ADC</option>
                  <option value="Supp">Supp</option>
                </select>
              </div>
            ));
          })()}
        </div>
        <input type="submit" value="Create" className="create-team__create" />
      </form>
      <BackArrow pathname="/user" nick={nick} id={id} />
    </div>
  );
}
