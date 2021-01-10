import React, {useEffect, useContext} from "react";
import {AnimatePresence, motion} from "framer-motion";

import {InfoContext} from "../../context/infoContext";

export default function InfoModel() {
  const {messages, setMessages, isMessageError} = useContext(InfoContext);

  useEffect(() => {
    Object.values(messages).length > 0 && setMessages(messages);

    const hide = setTimeout(() => {
      Object.values(messages).length > 0 && setMessages({});
    }, 2500);

    return () => {
      clearTimeout(hide);
    };
  }, [messages]);

  return (
    <AnimatePresence>
      {Object.values(messages).length > 0 && (
        <motion.aside
          className={isMessageError ? "info--red" : "info--green"}
          initial={{y: 100}}
          animate={{y: 0}}
          exit={{opacity: 0}}
        >
          {Object.values(messages).map((message, id) => (
            <span key={id}>{message}</span>
          ))}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
