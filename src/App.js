import { useState } from 'react';

import Login from './Components/Login/login';
import Inicio from './Components/Inicio/inicio';

import { appFirebase } from './firebase';

import {getAuth, onAuthStateChanged} from 'firebase/auth';

import './App.css';

const auth = getAuth(appFirebase)

function App() {
  
  const [usuario, setUsuario] = useState(null);

  onAuthStateChanged(auth, (user) => {
    if(user){
      setUsuario(user);
    } else {
      setUsuario(null)
    }
  })

  return (
    <div>
      {usuario ? <Inicio correoUsuario={usuario.email}/> : <Login /> }
    </div>
  );
}

export default App;
