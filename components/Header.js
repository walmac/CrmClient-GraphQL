import React from 'react';
import {gql, useQuery} from '@apollo/client';
import { useRouter } from 'next/router';

const OBTENER_USUARIO = gql`
query obtenerUsuario{
    obtenerUsuario{
      id
      nombre
      apellido
    }
  }
`;


const Header = () => {
    let nombre, apellido ="";
    //routing
    const router = useRouter();

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;


    //query de apollo
    const { data, loading, error} = useQuery(OBTENER_USUARIO);
    //console.log(data,loading, error);
    

    //proteger que no accedamos a data antes de que tenga resultados
    if(loading) return null;
    // console.log(data);
    // console.log(error);
    // console.log(loading);

    //si no hay informacion
    if(!data){
        return router.push('/login');
    }

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        router.push('/login');
        
    }
    
    if(token){
          //nombre = data.obtenerUsuario.nombre || null;
          //   apellido = data.obtenerUsuario.apellido || null;
          if(data.obtenerUsuario === null){
              nombre = null;
              apellido=  null;
          }else{
            nombre = data.obtenerUsuario.nombre;
            apellido = data.obtenerUsuario.apellido
          }
        
    }
    
    return (
        <div className=" sm:flex sm:justify-between mb-6">
          {token ?  ( <>
                    <p className="mr-2 mb-5 lg:mb-0">Hola {nombre} {apellido}</p>
                    <button className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md"          type="button"
                        onClick={() => cerrarSesion()}
                    
                    >
                        Cerrar Sesión
                    </button>
                </>
             ): null
            }


        </div>
      );
}
 
export default Header;