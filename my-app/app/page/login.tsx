"use client"

import React, { useState } from 'react'
import { login } from '../services/login';



const Login = () => {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const handleLogin = async (event: any) => {
        event.preventDefault();
        try {

            const response = await login(email, senha);

            if (!response) {
                alert("Email ou senha inválidos.")
            }
            alert("Login efetuado com sucesso.")
            console.log(response);
        } catch (error) {
            console.error("Erro ao fazer login: ", error)
        }
    }

    return (
        <>
            <div>
                <form onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email">E-mail</label>
                        <input type="text" name='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor="senha">Senha</label>
                        <input type="password" name='senha' id='senha' value={senha} onChange={(e) => setSenha(e.target.value)} required />
                    </div>
                    <button type='submit'>Entrar</button>
                </form>
            </div>
        </>
    )
}

export default Login