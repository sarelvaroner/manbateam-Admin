import React, { useState, useEffect } from "react"
import "./App.css"
import firebase from './firebase'
import Loader from 'react-loader-spinner'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';


import Users from './Users/Users'
import Navbar from './Navbar/Navbar'
import Login from './Login/Login'


const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(null)
  const [dialog, setDialog] = useState(false)


  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setIsSignedIn(user)
      if(user) setDialog(true)
      checkIfAdmin(user)
    })
  }, []);


  useEffect(() => {
    if (isAdmin === false) {
      setDialog(true)
    }
  }, [isAdmin]);


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
        <Dialog
          aria-labelledby="customized-dialog-title"
          open={dialog}
        >
          <DialogTitle id="customized-dialog-title" >
            שגיאת הרשאה
        </DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              אין לך הרשאה לגשת לתוכן זה אנא פנה למנהל מערכת לפתיחת הרשאות
          </Typography>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={() => {
              firebase.auth().signOut()
              setDialog(false)
            }}>
              היכנס מחדש
          </Button>
          </DialogActions>
        </Dialog>
      }
    </div>
  )
}


export default App
