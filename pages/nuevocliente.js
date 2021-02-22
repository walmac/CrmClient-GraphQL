import React, { useState } from "react";
import Layout from "../components/Layout";
import { gql, useMutation } from "@apollo/client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";

const NUEVO_CLIENTE = gql`
    mutation nuevoCliente($input: ClienteInput) {
        nuevoCliente(input: $input) {
            id
            nombre
            apellido
            empresa
            email
            telefono
            vendedor
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

const NuevoCliente = () => {
    //routing
    const router = useRouter();
    const [mensaje, guardarMensaje] = useState(null);

    //mutation para crear nuevos clientes
    const [nuevoCliente] = useMutation(NUEVO_CLIENTE, {
        update(cache, { data: { nuevoCliente } }) {
            //obtener el objeto en cache que se quiere actualizar
            const { obtenerClientesVendedor } = cache.readQuery({
                query: OBTENER_CLIENTES_USUARIO,
            });
            //reescribimos el cache (elcache no se debe modificar sino reescribir)
            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data: {
                    obtenerClientesVendedor: [
                        ...obtenerClientesVendedor,
                        nuevoCliente,
                    ],
                },
            });
        },
    });

    const formik = useFormik({
        initialValues: {
            nombre: "",
            empresa: "",
            empresa: "",
            email: "",
            telefono: "",
        },
        validationSchema: Yup.object({
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
        }),
        onSubmit: async (valores) => {
            const { nombre, apellido, empresa, email, telefono } = valores;
            try {
                const { data } = await nuevoCliente({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            empresa,
                            email,
                            telefono,
                        },
                    },
                });
                //console.log(data);
                router.push("/"); //redirecciona a clientes
            } catch (error) {
                console.log(error);
                guardarMensaje(error.message.replace("Error: ", ""));
                setTimeout(() => {
                    guardarMensaje(null);
                }, 2000);
            }
        },
    });
    const mostrarMensaje = () => {
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        );
    };
    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light flex justify-center">Nuevo cliente</h1>
            {mensaje && mostrarMensaje()}
            
            <div className="flex justify-center mt-5">
                
                <div className="w-full max-w-lg center">
                    <form
                        className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                        onSubmit={formik.handleSubmit}
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
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.nombre}
                            />
                        </div>
                        {formik.touched.nombre && formik.errors.nombre ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.nombre}</p>
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
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.apellido}
                            />
                        </div>
                        {formik.touched.apellido && formik.errors.apellido ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.apellido}</p>
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
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.empresa}
                            />
                        </div>
                        {formik.touched.empresa && formik.errors.empresa ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.empresa}</p>
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
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                            />
                        </div>
                        {formik.touched.email && formik.errors.email ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.email}</p>
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
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.telefono}
                            />
                        </div>

                        <input
                            className="bg-gray-800 w-full mt-5 p-2 text-white text-center uppercase font-bold hover:bg-gray-900 cursor-pointer"
                            type="submit"
                            value="Registrar  cliente"
                        />
                        {/* <button
                        className="bg-gray-800 w-full mt-5 p-2 text-white text-center uppercase font-bold hover:bg-gray-900 cursor-pointer" type="submit"
                        
                    >Registrar  cliente</button> */}
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default NuevoCliente;
