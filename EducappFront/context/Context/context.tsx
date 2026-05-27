import { AlunoDTO, ProfessorDTO, Turma, UserDTO } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useEffect, useState } from "react";
    
    type ErroHandler = {
        title: string;
        message: string;
        erro: boolean;
    }

    type SucessoHandler = {
        title: string;
        message: string;
        sucesso: boolean;
    }


interface AppContextInterface {
    loading: boolean;
    isAluno?: boolean;
    isProfessor?: boolean;
    isDiretor?: boolean;
    isSigned?: boolean;
    verificarChave: (chave: string) => Promise<"ALUNO" | "PROFESSOR" | undefined>;
    getTurmas: () => Promise<Turma[]>;
    gerarError: (title: string, message: string) => void;
    gerarSucess: (title: string, message: string) => void;
    login: () => void;
    logout: () => void;
    cadastrarProfessor: (user: UserDTO ,professor: ProfessorDTO) => void;
    cadastrarAluno: (user: UserDTO ,aluno: AlunoDTO) => void;
    JwtToken?: string;
    apiUrl: string;
    setLoading: (value: boolean) => void;
    MensagemErroDefault: string;
    idUsuario?: string;
    MensagemErroDefaultTimeout: string;
    errorHandler: ErroHandler | null;
    sucessoHandler: SucessoHandler | null;
    setSucessoHandler: (value: SucessoHandler) => void;
    setErrorHandler: (value: ErroHandler) => void;
}

const AuthConfig = {
    issuer: "http://10.0.2.2:8080",
    serviceConfiguration: {
        authorizationEndpoint: "http://10.0.2.2:8080/oauth2/authorize",
        tokenEndpoint: "http://10.0.2.2:8080/oauth2/token"
    },
    clientId: "client",
    redirectUrl: "com.educap://oauthredirect",
    usePKCE: true,
    skipCodeExchange: false,
    dangerouslyAllowInsecureHttpRequests: true,
}

WebBrowser.maybeCompleteAuthSession();

export const Context = createContext<AppContextInterface | undefined>(undefined);

const MensagemErroDefaultCadastro = "Algo deu errado! Confira os dados e tente novamente.";



export default function ContextProvider({ children }: any) {
    const router = useRouter();
    const apiUrl = 'http://10.0.2.2:8080';

    const MensagemErroDefault = "Algo deu errado! Contate o suporte ou tente novamente mais tarde.";
    const MensagemErroDefaultTimeout = "Tempo limite de carregamento excedido! Tente novamente.";

    const [loading, setLoading] = useState(false);
    const [errorHandler, setErrorHandler] = useState<ErroHandler | null>(null);
    const[sucessoHandler, setSucessoHandler] = useState<SucessoHandler | null>(null);

    const[isAluno, setIsAluno] = useState<boolean>();
    const[isProfessor, setIsProfessor] = useState<boolean>();
    const[isDiretor, setIsDiretor] = useState<boolean>();
    const[isSigned, setIsSigned] = useState<boolean>(false);

    const[JwtToken, setJwtToken] = useState<string>();
    const[idUsuario, setIdUsuario] = useState<string>();

    const discovery = {
    authorizationEndpoint: "http://10.0.2.2:8080/oauth2/authorize",
    tokenEndpoint: "http://10.0.2.2:8080/oauth2/token",
    };

    const redirectUri = AuthSession.makeRedirectUri({
    scheme: "com.educap",
    });

    const login = async () => {
        setLoading(true);
        try{

            const request = new AuthSession.AuthRequest({
                clientId: AuthConfig.clientId,
                redirectUri: AuthConfig.redirectUrl,
                responseType: "code",
                usePKCE: true,
                extraParams: {
                    prompt: "login"
                },
            });

            await request.makeAuthUrlAsync(discovery);

            const result = await request.promptAsync(discovery);

              if (result.type === "success") {
                    const codeVerifier = request.codeVerifier;

                    const token = await exchangeCodeForToken(result.params.code, codeVerifier);

                    console.log(token);

                    const info = jwtDecode(token.access_token);

                    const role = Array.isArray(info.role)
                        ? info.role[0]
                        : info.role;

                    console.log("ROLE FINAL:", role);
                    verificarPerfil(role, info, token.access_token);

                    await AsyncStorage.setItem("token", token.access_token);
                    router.replace("/");
            }

            if(result.type === "cancel"){
                gerarError("Erro", "Login cancelado pelo usuário.");
            }

            if(result.type === "error"){
                gerarError("Erro", "Erro ao efetuar login.");
            }

        }catch (error) {
            gerarError("Erro", MensagemErroDefault);
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    const exchangeCodeForToken = async (code: string, codeVerifier: any) => {
        const body = new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: "com.educap://oauthredirect",
            code_verifier: codeVerifier
            });

        const response = await fetch("http://10.0.2.2:8080/oauth2/token", {
            method: "POST",
            headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic Y2xpZW50OnNlY3JldA=="
            },
            body: body.toString()
  });

  const data = await response.json();
  return data;
    };  

    const logout = async() => {
        setLoading(true);
        try{
            await AsyncStorage.removeItem('token');

            await WebBrowser.dismissBrowser();

            await fetch('http://10.0.2.2:8080/logout', {
                method: 'POST',
                credentials: 'include'
            })

            setJwtToken(undefined);
            setIsSigned(false);
            setIsAluno(false);
            setIsProfessor(false);
            setIsDiretor(false);
        }catch (error) {
            gerarError("Erro", MensagemErroDefault);
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    function verificarPerfil (role: string, tokenDecoded: any, accessToken: string) {
        switch (role) {
            case 'ALUNO':
                setJwtToken(accessToken);
                setIdUsuario(tokenDecoded.aluno);
                setIsAluno(true);
                setIsProfessor(false);
                setIsDiretor(false);
                break;
            case 'PROFESSOR':
                setJwtToken(accessToken);
                setIdUsuario(tokenDecoded.professor);
                setIsAluno(false);
                setIsProfessor(true);
                setIsDiretor(false);
                break;
            case 'DIRETOR':
                setJwtToken(accessToken);
                setIdUsuario(tokenDecoded.diretor);
                setIsAluno(false);
                setIsProfessor(false);
                setIsDiretor(true);
                break;
            default:
                setIsSigned(false);
                setIsAluno(false);
                setIsProfessor(false);
                setIsDiretor(false);
                setIdUsuario(undefined);
                break;
        }
    }

    const cadastrarAluno = async (user: UserDTO ,aluno: AlunoDTO) => {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        try{
            const response = await fetch('http://10.0.2.2:8080/usuarios/aluno', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usuario: user,
                    aluno: aluno
                }),
                signal: controller.signal
            })

            clearTimeout(timeout);

            if(!response.ok) {
                var erro = await response.json();
                gerarError("Erro", erro.mensagem);
                return;}
            
            gerarSucess("Sucesso", "Aluno cadastrado com sucesso");
        }catch (error: any) {
            if(error.name === 'AbortError') {
                gerarError("Erro", MensagemErroDefaultTimeout);
                return;
            }

            gerarError("Erro", MensagemErroDefaultCadastro);
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const cadastrarProfessor = async (user: UserDTO ,professor: ProfessorDTO) => {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        try{
            const response = await fetch('http://10.0.2.2:8080/usuarios/professor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usuario: user,
                    professor: professor
                }),
                signal: controller.signal
            })

            clearTimeout(timeout);

            if(!response.ok) {
                var erro = await response.json();
                gerarError("Erro", erro.mensagem);
                return;}
            
            gerarSucess("Sucesso", "Professor cadastrado com sucesso");
        }catch (error: any) {
            if(error.name === 'AbortError') {
                gerarError("Erro", MensagemErroDefaultTimeout);
                return;
            }

            gerarError("Erro", MensagemErroDefaultCadastro);
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async function getTurmas() {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);

        try {
            const response = await fetch('http://10.0.2.2:8080/turmas', { signal: controller.signal });
            clearTimeout(timeout);

            if(!response.ok) {
                throw new Error('Erro ao buscar turmas');
            }
            const data = await response.json();
            return data;
            
        }catch (error: any) {
            if(error.name === 'AbortError') {
                gerarError("Erro", MensagemErroDefaultTimeout);
                return;
            }
            gerarError("Erro", MensagemErroDefault);
            console.log(error);   
        } finally {
            setLoading(false);
        }
    }

    async function verificarChave(chave: string) {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);

        try {
            const response = await fetch(`http://10.0.2.2:8080/role-key/${chave}`, { signal: controller.signal });

            clearTimeout(timeout);

            if(!response.ok) {
                var erro = await response.json();
                gerarError("Erro", erro.mensagem);
                return;
            }

            const data = await response.text();
            console.log(data);
            if(data === 'ALUNO') {
                return "ALUNO";
            } else if(data === 'PROFESSOR') {
                return "PROFESSOR";
            }
        } catch (error: any) {
            if(error.name === 'AbortError') {
                gerarError("Erro", MensagemErroDefaultTimeout);
                return;
            }
            gerarError("Erro", MensagemErroDefault);
            console.log(error);
        } finally {
            setLoading(false);
        }
        
    }

    useEffect(() => {
        console.log("JWT Token:" + JwtToken);

        if(JwtToken) {
            setIsSigned(true);
        }
    }, [JwtToken])

    useEffect(() => {
        console.log("CONTEXT CRIADO")

        const loadUser = async () => {
            setLoading(true);
            try {
                const token = await AsyncStorage.getItem('token');

                if(!token) {
                    logout();
                    return;
                }
                if(!isTokenValid(token)) {
                    logout();
                    return;
                }
                const info = jwtDecode(token);
                const role = Array.isArray(info.role)
                    ? info.role[0]
                    : info.role;
                verificarPerfil(role, info, token);
            } catch (error) {
                console.log("Deu o erro: " + error);
            } finally {
                setLoading(false);
            }
        }

        const isTokenValid = (token: string) => {
            try {
                const decodedToken = jwtDecode(token);

                if(!decodedToken.exp) {
                    return false;
                }
                const currentTime = Date.now() / 1000;
                return decodedToken.exp > currentTime;
            } catch (error) {
                return false;
            }
        }
        loadUser();
    }, [])

    const gerarError = (title: string, message: string) => {
        setErrorHandler({
            title: title,
            message: message,
            erro: true
        });
    }

    const gerarSucess = (title: string, message: string) => {
        setSucessoHandler({
            title: title,
            message: message,
            sucesso: true
        });
    }

    return (
        <Context.Provider value={{loading,
        isAluno,
        isProfessor,
        isDiretor,
        cadastrarAluno,
        isSigned,
        verificarChave,
        getTurmas,
        gerarError,
        gerarSucess,
        login,
        logout,
        cadastrarProfessor,
        JwtToken,
        apiUrl,
        setLoading,
        MensagemErroDefault,
        idUsuario,
        MensagemErroDefaultTimeout,
        setSucessoHandler,
        setErrorHandler,
        errorHandler,
        sucessoHandler
        }}>
            {children}
        </Context.Provider>
    )
}