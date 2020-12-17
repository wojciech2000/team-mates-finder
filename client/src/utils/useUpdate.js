import {useState} from "react";

export default function Useupdate(callback, initialState = {}) {
  const [values, setValues] = useState(initialState);

  const onChangeInput = e => {
    setValues({...values, [e.target.name]: e.target.value});
  };

  const onSubmitForm = e => {
    e.preventDefault();
    callback();
  };

  return {
    onChangeInput,
    onSubmitForm,
    values,
  };
}
