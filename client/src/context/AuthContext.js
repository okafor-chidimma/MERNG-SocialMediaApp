import { createContext } from "react";

/*
    context provides a way to pass data around in our app. this data is an object with key:value pairs that we want to pass around in our app.

    Provider component gives us a way to provide the object we want to pass round the app to the components in the app by wrapping the root component in this Provider component

    we use useReducer when we want to manage a global state and we use useState to manage a local state
    to use useReducer, you pass in your reducer and an initial state value

    when we declare useReducer in a component, it manages state but the state can only be changed from within that component since that is where the dispatch() is defined but when we pass the dispatch to the context provider, we are able to change this same state from any component that has access to the context by calling the dispatch() that was passed via the context

    WHY DO WE NEED A REDUCER IN THIS APP
    1, we need a way to store user data such that any component that needs any user's info will have access to it through the context. we store it as a property on the state's object
    2. we need a way to change user data stored in the state obj, i.e set or reset the user's data (such as token) when they login or logout and as soon as we dispatch, the user value changes and because the state has changed, all connected components will get re-rendered so they can use the new values stored inside state object
*/
//first initialize your context. you choose to do so with a default object or not
const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout() {},
});

export default AuthContext;
