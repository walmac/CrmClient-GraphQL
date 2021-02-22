import React, { useReducer } from 'react';
import PedidoContext from './PedidoContext';
import PedidoReducer from './PedidoReducer';

import {
        SELECCIONAR_CLIENTE,
        SELECCIONAR_PRODUCTO,
        CANTIDAD_PRODUCTO,
        ACTUALIZAR_TOTAL
 } from '../../types';

 const PedidoState = ({children}) => {

    // state de pedidos
    const initialState = {
        cliente: {},
        productos: [],
        total: 0
    }
    

    const [state, dispatch ] = useReducer(PedidoReducer, initialState);

    //modifica el cliente
    const agregarCliente = cliente => {
        // console.log(cliente);
        dispatch({
            type: SELECCIONAR_CLIENTE,
            payload: cliente
        })
    }

    //Modifica los productos
    const agregarProducto = productosSeleccionados => {

        let nuevoState;
        if(state.productos.length > 0){
            //tomar del segundo arreglo una copia para asignar al primero
            nuevoState = productosSeleccionados.map( producto => {
                const nuevoObjeto = state.productos.find( productoState => productoState.id === producto.id)
                return {
                    ...producto,
                    ...nuevoObjeto
                }
            })

        }else{
            nuevoState= productosSeleccionados;
        }
        dispatch({
            type: SELECCIONAR_PRODUCTO,
            payload: nuevoState
        })
    }

    //modifica las cantidades
    const cantidadProducto = nuevoProducto => {
        dispatch({
            type: CANTIDAD_PRODUCTO,
            payload: nuevoProducto
        })
    }

    const actualizarTotal = () => {
        dispatch({
            type: ACTUALIZAR_TOTAL
        })
    }

     return ( 
        <PedidoContext.Provider
            value={{
                cliente: state.cliente,
                productos: state.productos,
                total: state.total,
                agregarCliente,
                agregarProducto,
                cantidadProducto,
                actualizarTotal

            }}
        >
            {children}

        </PedidoContext.Provider>
      );
 }
  
 export default PedidoState;