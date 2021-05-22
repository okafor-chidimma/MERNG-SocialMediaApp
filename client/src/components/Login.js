import React, { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { Button, Form } from "semantic-ui-react";
import useForm from "../hooks/useForm";
import AuthContext from "../context/AuthContext";
import { LOGIN_USER_MUTATION } from "../utils/graphqlQueries";

const Login = (props) => {
  const { login } = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const { onChange, onSubmit, values } = useForm(loginCallBack, {
    username: "",
    password: "",
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER_MUTATION, {
    variables: values,
    update(_, { data: { login: userData } }) {
      console.log(userData);
      login(userData);
      
      props.history.push("/");
    },
    onError(error) {
      console.log(
        error.graphQLErrors[0].extensions.exception.errors,
        "I am returned error"
      );
      setErrors(error.graphQLErrors[0].extensions.exception.errors);
      //call the setError state method
    },
  });
  function loginCallBack() {
    loginUser();
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1 style={{ textAlign: "center" }}>Login</h1>
        <Form.Input
          label="Enter Username"
          type="text"
          placeholder="Enter Username"
          name="username"
          value={values.username}
          onChange={onChange}
          error={errors.username ? true : false}
        />
        <Form.Input
          label="Enter password"
          type="password"
          placeholder="Enter password"
          name="password"
          value={values.password}
          onChange={onChange}
          error={errors.password ? true : false}
        />
        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


export default Login;
