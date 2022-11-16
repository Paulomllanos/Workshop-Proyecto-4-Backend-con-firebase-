import { appFirebase } from "../../firebase";
import {getAuth, signOut} from 'firebase/auth';
import { useEffect, useState } from "react";

import {getFirestore, collection, addDoc, getDocs} from 'firebase/firestore';

import './inicio.css'

const auth = getAuth(appFirebase)
const db = getFirestore(appFirebase)

const Inicio = ({correoUsuario}) => {

    const valorInicial = {
        nombre: '',
        pedido: '',
        direccion: ''
    }
    //variable estados
    const [user, setUser] = useState(valorInicial)
    const [list, setList] = useState([])//traer objetos de firebase
    const [menu, setMenu] = useState([]) // trae el menu de firebase


    //captura inputs (Funcion) 
    const catchInputs = (e) => {
        const {name, value} = e.target;
        setUser({
            ...user, 
            [name]: value
        })
    } 

    const guardarDatos = async(e) => {
        e.preventDefault();
        // console.log(user)
        try {
            await addDoc(collection(db, 'clientes'), {
                ...user
            })
        } catch (error) {
            console.log(error)
        }
        
        setUser({...valorInicial})
    }

    //funcion de renderizado de lista de clientes
    useEffect(() => {
        const getList = async() => {
            try {
                const querySnapshot = await getDocs(collection(db, 'clientes'));
                const docs = [];
                querySnapshot.forEach((doc) => {
                    docs.push({...doc.data(), id: doc.id})
                })
                
                setList(docs)
                
            } catch (error) {
                console.log(error)
            }
        }

        getList()

    }, [list]) // dependencia = variable de estado

    useEffect(() => {
        const getMenu = async() => {
            try {
                const colRef = collection(db, 'Menu');
                const snapshots = await getDocs(colRef)
               
                
                const docs = snapshots.docs.map((doc) => {
                    const data = doc.data();
                    data.id = doc.id
                    return data;
                })

                setMenu(docs)

                console.log(docs)

            } catch (error) {
                console.log(error)
            }
        }
        getMenu()
    }, [])


    return(
        <div className="container">
            <p>Bienvenido, <strong>{correoUsuario}</strong> Iniciaste sesion</p>
            <button className="btn btn-primary" onClick={() => signOut(auth)}>Cerrar Sesion</button>

            <hr />
             
            <div className="row">
                {/* Formulario2 */}
                <div className="col-md-4">
                    <h2 className="text-center">Ingresar Usuario</h2>
                    <form onSubmit={guardarDatos}>
                        <div className="card card-body">
                            <div className="form-group">
                                <input type='text' name="nombre" className="form-control mb-3" placeholder="Tu nombre acá" onChange={catchInputs} value={user.nombre} required/>
                                <input type='text' name="pedido" className="form-control mb-3" placeholder="Que deseas Llevar?" onChange={catchInputs} value={user.pedido} required/> 
                                <input type='text' name="direccion" className="form-control mb-3" placeholder="Tu dirección" onChange={catchInputs} value={user.direccion} required/>
                            </div>
                            <button className="btn btn-primary">
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
                {/* Lista de pedidos */}
                <div className="col-md-8">
                    <h2 className="text-center">Lista de Usuarios</h2>
                    <div className="container card">
                        <div className="card-body">
                            {
                                list.map(lista => (
                                    <div key={lista.id}>
                                        <p>Nombre: {lista.nombre}</p>
                                        <p>Pedido: {lista.pedido}</p>
                                        <p>Dirección: {lista.direccion}</p>

                                        <button className="btn btn-danger">
                                            Eliminar
                                        </button>

                                        <button className="btn btn-success m-1">
                                            Actualizar
                                        </button>
                                        <hr />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                {/* menu */}
              
                    <h1 className="text-center mt-5 fw-bold">Menu</h1>
                    <div className="container2">
                    {menu.map(carta => (
                            <div key={carta.id} className="drop" style={{color: '#ff0f5b'}}>
                                <div className="content">
                                    <img src={carta.image} alt="..."/>
                                    <h2 className="">{carta.name}</h2>
                                    <p className="">{carta.description}</p>
                                    <button className="">Precio: ${carta.price}</button>
                                </div>
                            </div>
                    ))}
                    </div>
                   
                </div>
            </div>
       
    )
}

export default Inicio;