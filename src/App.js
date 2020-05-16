import React, { useState, useEffect } from "react"
import "./App.css"
import firebase from './firebase'
import Container from '@material-ui/core/Container';
import Loader from 'react-loader-spinner'

import Users from './Users/Users'
import Navbar from './Navbar/Navbar'
import Login from './Login/Login'


const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(null)


  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setIsSignedIn(user)
      checkIfAdmin(user)
    })
  }, []);


  const checkIfAdmin = async (user) => {
    if (!user) return
    setIsAdmin((await firebase.firestore().collection('users').doc(user.uid).get()).data().isAdmin)
  }


  return (
    <div className="App">
      <Navbar />
      {
        (isSignedIn === false || (isSignedIn === false && isAdmin === null)) &&
        <div className={'loadingContainer'}>
          <Loader type="ThreeDots" color="#00BFFF" height={80} width={80} />
        </div>
      }
      {isSignedIn === null && <Login />}
      {(isSignedIn && isAdmin) && <Users />}
      {
        (isSignedIn && isAdmin === false) &&
        <div className={'deniedContainer'}>
          <Container fixed>
            <span>
              access denied, You need permission to access this site
              </span>
          </Container>
        </div>
      }
    </div>
  )
}


export default App
