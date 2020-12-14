import React, {memo, useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";

export default memo(function InfoModel({info}) {
  const [messages, setMessage] = useState([]);

  useEffect(() => {
    setMessage(Object.values(info));

    const hide = setTimeout(() => {
      setMessage([]);
    }, 5000);

    return () => {
      clearTimeout(hide);
    };
  }, [info]);

  return (
    <AnimatePresence>
      {messages.length > 0 && (
        <motion.aside
          className="info"
          initial={{y: 100, opacity: 0.5}}
          animate={{y: 0, opacity: 1}}
          exit={{y: 100, opacity: 0}}
        >
          <ul>
            {messages.map((message, id) => (
              <li key={id}>{message}</li>
            ))}
          </ul>
        </motion.aside>
      )}
    </AnimatePresence>
  );
});
