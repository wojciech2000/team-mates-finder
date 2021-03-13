import {useMutation} from "@apollo/client";
import {useContext} from "react";
import {AuthContext} from "../context/authContext";
import {InfoContext} from "../context/infoContext";
import {GET_USERS, GET_USER_PROFILE} from "../queries";

export default function useUserMutation(
  queryName,
  variables,
  message,
  id,
  editInputName,
  editInput,
  setEditInput,
) {
  const {setMessages, setIsMessageError} = useContext(InfoContext);
  const {updateNick} = useContext(AuthContext);

  const [updateFunction] = useMutation(queryName, {
    variables,
    update: (proxy, result) => {
      setMessages({message});
      setIsMessageError(false);
      setEditInput({...editInput, [editInputName]: false});
      editInputName === "nick" && updateNick(result.data.updateNick.nick);
    },
    refetchQueries: [{query: GET_USER_PROFILE, variables: {id}}, {query: GET_USERS}],
    awaitRefetchQueries: true,
    onError: error => {
      setIsMessageError(true);
      setMessages(error.graphQLErrors[0].extensions.exception.errors);
    },
  });

  return updateFunction;
}
