import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Formik } from "formik";
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const OBTENER_CLIENTE = gql`
    query obtenerCliente($id: ID!) {
        obtenerCliente(id: $id) {
            nombre
            apellido
            email
            empresa
            telefono
        }
    }
`;

const ACTUALIZAR_CLIENTE = gql`
    mutation actualizarCliente($id: ID!, $input: ClienteInput){
        actualizarCliente(id:$id, input:$input){
            nombre
            apellido
            empresa
            email
            telefono
        }
    }
`;
const OBTENER_CLIENTES_USUARIO = gql`
    query obtenerClientesVendedor {
        obtenerClientesVendedor {
            id
            nombre
            apellido
            empresa
            email
        }
    }
`;


const EditarCliente = () => {
    //obtener el ID actual
    const router = useRouter();
    const {
        query: { id },
    } = router;
    // console.log(id);

    //consiltar para obtener el cliente
    const { data, loading, error } = useQuery(OBTENER_CLIENTE, {
        variables: {
            id,
        },
    });
    //actualizar el cliente
    //const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE);
    const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE, {
        update(cache, { data: { actualizarCliente } }) {
          // Actulizar Clientes
          const { obtenerClientesVendedor } = cache.readQuery({
            query: OBTENER_CLIENTES_USUARIO
          });
     
          const clientesActualizados = obtenerClientesVendedor.map(cliente =>
            cliente.id === id ? actualizarCliente : cliente
          );
     
          cache.writeQuery({
            query: OBTENER_CLIENTES_USUARIO,
            data: {
              obtenerClientesVendedor: clientesActualizados
            }
          });
     
          // Actulizar Cliente Actual
          cache.writeQuery({
            query: OBTENER_CLIENTE,
            variables: { id },
            data: {
              obtenerCliente: actualizarCliente
            }
          });
        }
      });

    //Schema de validacion
    const schemaValidacion = Yup.object({
        nombre: Yup.string().required(
            "El nombre del cliente es obligatorio"
        ),
        apellido: Yup.string().required(
            "El apellido del cliente es obligatorio"
        ),
        empresa: Yup.string().required(
            "El nombre de la empresa del cliente es obligatorio"
        ),
        email: Yup.string()
            .email("Email no valido")
            .required("El email del cliente es obligatorio"),
    });

    if (loading) return "Cargando...";
    //console.log(data, loading, error);

    const { obtenerCliente } = data;

    //Modifica el cliente en la base de datos
    const actualizarInfoCliente = async valores => {
        const {nombre, apellido, empresa, telefono, email} = valores;
        try {
            const { data } = await actualizarCliente({
                variables:{
                    id,
                    input:{
                        nombre, 
                        apellido, 
                        empresa, 
                        telefono, 
                        email
                    }
                }
            });
            console.log(data);

            //TODO: sweetalert
            Swal.fire("Actualizado", 'El cliente fue actualizado exitosamente', "success");

            //TODO: redireccionar
            router.push('/');
        } catch (error) {
            console.log(error);
        }
    }




    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light flex justify-center">
                Editar cliente
            </h1>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg center">
                    <Formik
                        validationSchema={schemaValidacion}
                        enableReinitialize
                        initialValues={obtenerCliente}
                        onSubmit={ (valores, funciones) => {
                                actualizarInfoCliente(valores);

                        }}
                    
                    >
                        {(props) => {
                            //console.log(props);
                            return (
                                <form
                                    className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                                     onSubmit={props.handleSubmit}
                                >
                                    <div className="mb-4">
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                            htmlFor="nombre"
                                        >
                                            Nombre
                                        </label>
                                        <input
                                            className="shadow appereance-none border rounded w-full py-2 px-3 text-gray-7200 leading-tight focus:outline-none focus:shadow-outline"
                                            id="nombre"
                                            type="text"
                                            placeholder="Nombre Cliente"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                             value={props.values.nombre}
                                        />
                                    </div>
                                    {props.touched.nombre && props.errors.nombre ? (
                                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.nombre}</p>
                                            </div>
                                        ) : null}
                                    <div className="mb-4">
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                            htmlFor="apellido"
                                        >
                                            Apellido
                                        </label>
                                        <input
                                            className="shadow appereance-none border rounded w-full py-2 px-3 text-gray-7200 leading-tight focus:outline-none focus:shadow-outline"
                                            id="apellido"
                                            type="text"
                                            placeholder="Apellido Cliente"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.apellido}
                                        />
                                    </div>
                                    {props.touched.apellido && props.errors.apellido ? (
                                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.apellido}</p>
                                            </div>
                                        ) : null}
                                    <div className="mb-4">
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                            htmlFor="empresa"
                                        >
                                            Empresa
                                        </label>
                                        <input
                                            className="shadow appereance-none border rounded w-full py-2 px-3 text-gray-7200 leading-tight focus:outline-none focus:shadow-outline"
                                            id="empresa"
                                            type="text"
                                            placeholder="Empresa Cliente"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.empresa}
                                        />
                                    </div>
                                    {props.touched.empresa && props.errors.empresa ? (
                                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.empresa}</p>
                                            </div>
                                        ) : null}
                                    <div className="mb-4">
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                            htmlFor="email"
                                        >
                                            Email
                                        </label>
                                        <input
                                            className="shadow appereance-none border rounded w-full py-2 px-3 text-gray-7200 leading-tight focus:outline-none focus:shadow-outline"
                                            id="email"
                                            type="email"
                                            placeholder="Email Usuario"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.email}
                                        />
                                    </div>
                                    {props.touched.email && props.errors.email ? (
                                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.email}</p>
                                            </div>
                                        ) : null}
                                    <div className="mb-4">
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                            htmlFor="telefono"
                                        >
                                            Telefono
                                        </label>
                                        <input
                                            className="shadow appereance-none border rounded w-full py-2 px-3 text-gray-7200 leading-tight focus:outline-none focus:shadow-outline"
                                            id="telefono"
                                            type="tel"
                                            placeholder="Telefono Cliente"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.telefono}
                                        />
                                    </div>

                                    <input
                                        className="bg-gray-800 w-full mt-5 p-2 text-white text-center uppercase font-bold hover:bg-gray-900 cursor-pointer"
                                        type="submit"
                                        value="Editar  cliente"
                                    />
                                </form>
                            );
                        }}
                    </Formik>
                </div>
            </div>
        </Layout>
    );
};

export default EditarCliente;
