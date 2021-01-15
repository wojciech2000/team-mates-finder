import {useMutation} from "@apollo/client";
import {useContext} from "react";
import {AuthContext} from "../context/auth";
import {InfoContext} from "../context/infoContext";
import {GET_USERS, GET_USER_PROFILE, UPDATE_NICK} from "../queries";

export default function useQueries(queryName, variables, message, id) {
  const {setMessages, setIsMessageError} = useContext(InfoContext);
  const {updateNick: updateNickContext} = useContext(AuthContext);

  const [updateFunction] = useMutation(queryName, {
    variables,
    update: (proxy, result) => {
      setMessages({message});
      setIsMessageError(false);
      queryName === UPDATE_NICK &&
        updateNickContext(result.data.updateNick.nick);
    },
    refetchQueries: [
      {query: GET_USER_PROFILE, variables: {id}},
      {query: GET_USERS},
    ],
    awaitRefetchQueries: true,
    onError: error => {
      setIsMessageError(true);
      setMessages(error.graphQLErrors[0].extensions.exception.errors);
    },
  });

  return updateFunction;
}
