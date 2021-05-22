import { useState } from "react";

const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState);
  const onChange = (e) => {
    //console.log(e, "onchange");
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    console.log("submitted form");
    callback();
  };
  return {
    onChange,
    onSubmit,
    values,
  };
};
export default useForm;
