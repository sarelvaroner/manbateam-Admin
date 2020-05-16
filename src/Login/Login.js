import React from "react";
import firebase, { uiConfig } from '../firebase'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';



const Login = () => {
    return (
        <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
        />

    );
};

export default Login;