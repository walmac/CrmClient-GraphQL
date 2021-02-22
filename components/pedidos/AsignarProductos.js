import React, { useEffect, useState, useContext} from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import PedidoContext from '../../context/pedidos/PedidoContext';

const OBTENER_PRODUCTOS = gql`
    query obtenerProductos {
        obtenerProductos{
        id
        nombre
        precio
        existencia
        }
    }

`;


const AsignarProductos = () => {
    //context de pedidos
    const pedidoContext = useContext(PedidoContext);
    const {agregarProducto} = pedidoContext;

    //consulta a la base de datos
    const {data, loading, error } = useQuery(OBTENER_PRODUCTOS);
     // state local del componente
     const [ productos, setProductos] = useState([]);

    useEffect(() => {
        //TODO: funcion para pasar a pedido state
        agregarProducto(productos);

    }, [productos])
    if(loading) return null;

    const {obtenerProductos} =data;

    const seleccionarProducto = producto => {
        setProductos(producto);
    }
    return ( 
        <>
            <p className="mt-2 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold ">2.- Selecciona o busca los productos</p>
            <Select 
                    className=" mt-3"
                    options={ obtenerProductos}
                    onChange={ opcion => seleccionarProducto(opcion) }
                    isMulti={true}
                    getOptionValue={ (opciones) => opciones.id}
                    getOptionLabel={ (opciones) => `${opciones.nombre} - ${opciones.existencia} Disponibles`}
                    placeholder="Seleccione producto"
                    noOptionsMessage={ () => "No hay resultados"}
                />
        </>
     );
}
 
export default AsignarProductos;