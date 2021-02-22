import Head from "next/head";
import Layout from "../components/Layout";
import Cliente from '../components/Cliente';
import React, { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Link from 'next/link';


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

export default function Home() {
    let noToken = null;
    useEffect(() => {
       // console.log("corrio el useefect");
        if (!token) {
            return router.push("/login");
        }
    }, [noToken]);
    //routing
    const router = useRouter();
    //consulta de apollo
    let arreglo = [];
    const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);

    const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
    //console.log(token);
    if (token) {
       // console.log('encontro el token');
    } else {
        //cambio la variable de valor para que funcione el useefect
        noToken = 1;
       // console.log(noToken);
    }

    //console.log(data, loading, error);

    // if (loading) return "Cargando...";

    // //si no carga loading
    // if(!data) {
    // 	return router.push('/login');
    // }
    // console.log(data);
    if (token) {
        // console.log("data");
        // console.log(data);

        if (data) {
            arreglo = Object.entries(data.obtenerClientesVendedor);
            
        }
    }

    return (
        <>
            <div>
                <Layout>
                    <h1 className="text-2xl text-gray-800 font-light">
                        Clientes
                    </h1>
                    <Link href="/nuevocliente">
                        <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">
                            Nuevo Cliente
                        </a>
                    </Link>
                    <div className="overflow-x-scroll">
                        <table className="table-auto shadow-md mt-10 w-full w-lg">
                            <thead className="bg-gray-800">
                                <tr className="text-white">
                                    <th className="w-1/5 py-2 ">Nombre</th>
                                    <th className="w-1/5 py-2 ">Empresa</th>
                                    <th className="w-1/5 py-2 ">Email</th>
                                    <th className="w-1/5 py-2 ">Eliminar</th>
                                    <th className="w-1/5 py-2 ">Editar</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {arreglo.length > 0
                                    ? data.obtenerClientesVendedor.map( cliente => (
                                        <Cliente 
                                        key={cliente.id}
                                        cliente={cliente}
                                        />
                                    ))
                                    : null}
                            </tbody>
                        </table>
                    </div>
                </Layout>
            </div>
        </>
    );
}
