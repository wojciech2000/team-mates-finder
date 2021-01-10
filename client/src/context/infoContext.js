import {createContext, useState} from "react";

export const InfoContext = createContext();

export const InfoProvider = ({children}) => {
  const [messages, setMessages] = useState({});
  const [isMessageError, setIsMessageError] = useState(false);

  return (
    <InfoContext.Provider
      value={{messages, setMessages, isMessageError, setIsMessageError}}
    >
      {children}
    </InfoContext.Provider>
  );
};
