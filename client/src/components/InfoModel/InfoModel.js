import React, {memo, useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";

export default memo(function InfoModel({error = [], info = ""}) {
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Object.values(error).length > 0 && setErrors(Object.values(error));

    const hide = setTimeout(() => {
      setErrors([]);
    }, 5000);

    return () => {
      clearTimeout(hide);
    };
  }, [error]);

  useEffect(() => {
    setMessage(info);

    const hide = setTimeout(() => {
      setMessage("");
    }, 2500);

    return () => {
      clearTimeout(hide);
    };
  }, [info]);

  return (
    <AnimatePresence>
      {errors.length > 0 && (
        <motion.aside
          className="info"
          initial={{y: 100}}
          animate={{y: 0}}
          exit={{opacity: 0}}
        >
          {errors.map((error, id) => (
            <span key={id}>{error}</span>
          ))}
        </motion.aside>
      )}
      {message.length > 0 && (
        <motion.aside
          className="info--green"
          initial={{y: 100}}
          animate={{y: 0}}
          exit={{opacity: 0}}
        >
          <span>{message}</span>
        </motion.aside>
      )}
    </AnimatePresence>
  );
});
