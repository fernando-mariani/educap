import { AulaDTO, Aulas, AulaTemplate, AulaTemplateDTO, Diretor, keys, NotVerifiedUsers, Professor, Publicacao, PublicacaoDTO, TurmaDetails } from "@/types";
import { createContext, useEffect, useState } from "react";
import { useAppContext } from "./appContext";

interface DiretorContextInterface {
    diretor: Diretor;
    getAulas: (turmaId: string) => Promise<Aulas[]>;
    getAulasTemplates: (turmaId: string) => Promise<AulaTemplate[]>;
    criarTemplate: (aulaTemplate: AulaTemplateDTO) => void;
    criarAula: (aula: AulaDTO) => void;
    deletarAula: (id: string) => void;
    getTurmaDetails: (turmaId: string) => Promise<TurmaDetails>;
    getProfessores: () => Promise<Professor[]>;
    getKeys: () => Promise<keys[]>;
    gerarKey: (role: string) => Promise<keys>;
    getNotVerifiedUsers: () => Promise<NotVerifiedUsers[]>;
    excluirUser: (id: string) => void;
    verifyUser: (id: string) => void;
    getPublicacoes: () => Promise<Publicacao[]>;
    novaPublicacao: (publicacao: PublicacaoDTO) => void;
    editarPublicacao: (publicacao: PublicacaoDTO, id: string) => void;
    deletarPublicacao: (id: string) => void;
}

export const DiretorContext = createContext<DiretorContextInterface>({} as DiretorContextInterface);

export default function DiretorProvider({ children }: any) {

    const { apiUrl, JwtToken, idUsuario, gerarError, gerarSucess, setLoading, MensagemErroDefault, MensagemErroDefaultTimeout, logout } = useAppContext();
    const [diretor, setDiretor] = useState<Diretor>({} as Diretor);

    async function getDiretorData() {
        setLoading(true);
        try{
            const response = await fetch(`${apiUrl}/diretor/${idUsuario}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JwtToken}`
                }
            });

            if(response.status === 401) {
                logout();
                return;
            }

            if(!response.ok) {
                gerarError("Erro", MensagemErroDefault)
            }
            const data = await response.json();

            const DiretorDTO: Diretor = {
                id: data.id,
                nome: data.nome
            }

            setDiretor(DiretorDTO);
        } catch (error) {
            gerarError("Erro", MensagemErroDefault)
            console.log("Deu o erro: " + error);
        } finally {
            setLoading(false);
        }
    }

    async function getAulas(turmaId: string) {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);
        try{
            const response = await fetch(`${apiUrl}/aulas/turma/${turmaId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JwtToken}`
                },
                signal: controller.signal
            });
            clearTimeout(timeout);
            if(!response.ok) {
                throw new Error('Erro ao buscar aulas');
            }
            return await response.json();
        } catch (error: any) {
            if(error.name === 'AbortError') {
                gerarError("Erro", MensagemErroDefaultTimeout)
                return;
            }
            gerarError("Erro", MensagemErroDefault)
            console.log("Deu o erro: " + error);
        } finally {
            setLoading(false);
        }
    }

    async function getAulasTemplates(turmaId: string) {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);
        try {
            const response = await fetch(`${apiUrl}/aulas-templates/turma/${turmaId}`, {
                headers: {
                    'Authorization': `Bearer ${JwtToken}`,
                },
                signal: controller.signal
            });
            clearTimeout(timeout);

            if(!response.ok) {
                throw new Error('Erro ao buscar template das aulas');
            }
            const text = await response.text();
            return text ? JSON.parse(text) : [];
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

    async function criarTemplate(aulaTemplate: AulaTemplateDTO) {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);
        try {

            const response = await fetch(`${apiUrl}/aulas-templates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JwtToken}`
                
                }, 
                body: JSON.stringify(aulaTemplate),
                signal: controller.signal
            });
            clearTimeout(timeout);
            
            if(!response.ok) {
                throw new Error('Erro ao criar template de aula');
            }

            gerarSucess("Sucesso", "Template de aula cadastrado com sucesso");
        } catch (error: any) {
            if(error.name === 'AbortError') {
                gerarError("Erro", MensagemErroDefaultTimeout);
                return;
            }
            gerarError("Erro", MensagemErroDefault);
            console.log(error);
        } finally{
            setLoading(false);
        }
    }

    async function criarAula(aula: AulaDTO) {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);
        try {

            const response = await fetch(`${apiUrl}/aulas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JwtToken}`
                
                }, 
                body: JSON.stringify(aula),
                signal: controller.signal
            });
            clearTimeout(timeout);
            
            if(!response.ok) {
                throw new Error('Erro ao criar aula');
            }
            gerarSucess("Sucesso", "Aula cadastrada com sucesso");
        } catch (error: any) {
            if(error.name === 'AbortError') {
                gerarError("Erro", MensagemErroDefaultTimeout);
                return;
            }
            gerarError("Erro", MensagemErroDefault);
            console.log(error);
        } finally{
            setLoading(false);
        }
    }

    async function deletarAula(id: string) {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);
        try {
            const response = await fetch(`${apiUrl}/aulas/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JwtToken}`
                },
                signal: controller.signal
            });
            clearTimeout(timeout);

            if(!response.ok) {
                throw new Error('Erro ao deletar aula');
            }
            gerarSucess("Sucesso", "Aula deletada com sucesso"); 
        } catch (error: any) {
            if(error.name === 'AbortError') {
                gerarError("Erro", MensagemErroDefaultTimeout)
                return;
            }
            gerarError("Erro", MensagemErroDefault)
            console.log("Deu o erro: " + error);
        } finally {
            setLoading(false);
        }
    }

    async function getTurmaDetails(turmaId: string) {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);
        try{
            const response = await fetch(`${apiUrl}/turmas/${turmaId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JwtToken}`
                },
                signal: controller.signal
            });
            clearTimeout(timeout);
            if(!response.ok) {
                throw new Error('Erro ao buscar turma');
            }
            return await response.json();
        } catch (error: any) {
            if(error.name === 'AbortError') {
                gerarError("Erro", MensagemErroDefaultTimeout)
                return;
            }
            gerarError("Erro", MensagemErroDefault)
            console.log("Deu o erro: " + error);
        } finally {
            setLoading(false);
        }
    }

    async function getProfessores() {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);
        try{
            const response = await fetch(`${apiUrl}/professores`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JwtToken}`
                },
                signal: controller.signal
            });
            clearTimeout(timeout);
            if(!response.ok) {
                throw new Error('Erro ao buscar professores');
            }
            return await response.json();
        } catch (error: any) {
            if(error.name === 'AbortError') {
                gerarError("Erro", MensagemErroDefaultTimeout)
                return;
            }
            gerarError("Erro", MensagemErroDefault)
            console.log("Deu o erro: " + error);
        } finally {
            setLoading(false);
        }
    }

    async function getKeys() {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);
        try{
            const response = await fetch(`${apiUrl}/role-key`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JwtToken}`
                },
                signal: controller.signal
            });
            clearTimeout(timeout);
            if(!response.ok) {
                throw new Error('Erro ao buscar chaves');
            }
            return await response.json();
        } catch (error: any) {
            if(error.name === 'AbortError') {
                gerarError("Erro", MensagemErroDefaultTimeout)
                return;
            }
            gerarError("Erro", MensagemErroDefault)
            console.log("Deu o erro: " + error);
        } finally {
            setLoading(false);
        }
    }

    async function getNotVerifiedUsers() {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);
        try{
            const response = await fetch(`${apiUrl}/usuarios/not-verified`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JwtToken}`
                },
                signal: controller.signal
            });
            clearTimeout(timeout);
            if(!response.ok) {
                throw new Error('Erro ao buscar usuários não verificados');
            }
            return await response.json();
        } catch (error: any) {
            if(error.name === 'AbortError') {
                gerarError("Erro", MensagemErroDefaultTimeout)
                return;
            }
            gerarError("Erro", MensagemErroDefault)
            console.log("Deu o erro: " + error);
        } finally {
            setLoading(false);
        }
    }

    async function gerarKey(role: string) {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);
        try{
            const response = await fetch(`${apiUrl}/role-key`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JwtToken}`
                },
                signal: controller.signal,
                body: JSON.stringify({role: role})
            });
            clearTimeout(timeout);
            if(!response.ok) {
                throw new Error('Erro ao gerar chave');
            }
            return await response.json();
        } catch (error: any) {
            if(error.name === 'AbortError') {
                gerarError("Erro", MensagemErroDefaultTimeout)
                return;
            }
            gerarError("Erro", MensagemErroDefault)
            console.log("Deu o erro: " + error);
        } finally {
            setLoading(false);
        }
    }

    async function excluirUser(id: string) {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);
        try{
            const response = await fetch(`${apiUrl}/usuarios/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JwtToken}`
                },
                signal: controller.signal
            });
            clearTimeout(timeout);
            if(!response.ok) {
                throw new Error('Erro ao excluir usuário');
            }
            gerarSucess("Sucesso", "Verificação do usuário negada com sucesso");
        } catch (error: any) {
            if(error.name === 'AbortError') {
                gerarError("Erro", MensagemErroDefaultTimeout)
                return;
            }
            gerarError("Erro", MensagemErroDefault)
            console.log("Deu o erro: " + error);        
        } finally {
            setLoading(false);
        }
    }

    async function verifyUser(id: string) {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);
        try{
            const response = await fetch(`${apiUrl}/usuarios/verify/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JwtToken}`
                },
                signal: controller.signal
            });
            clearTimeout(timeout);
            if(!response.ok) {
                throw new Error('Erro ao verificar usuário');
            }
            gerarSucess("Sucesso", "Verificação do usuário feita com sucesso");
        } catch (error: any) {
            if(error.name === 'AbortError') {
                gerarError("Erro", MensagemErroDefaultTimeout)
                return;
            }
            gerarError("Erro", MensagemErroDefault)
            console.log("Deu o erro: " + error);        
        } finally {
            setLoading(false);
        }
    }

    async function novaPublicacao(pubicacao: PublicacaoDTO) {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);
        pubicacao.idDiretor = diretor.id;
        try{
            const response = await fetch(`${apiUrl}/publicacoes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JwtToken}`
                },
                signal: controller.signal,
                body: JSON.stringify(pubicacao)
            });
            clearTimeout(timeout);
            if(!response.ok) {
                throw new Error('Erro ao criar publicação');
            }
            gerarSucess("Sucesso", "Publicação criada com sucesso");
        } catch (error: any) {
            if(error.name === 'AbortError') {
                gerarError("Erro", MensagemErroDefaultTimeout)
                return;
            }
            gerarError("Erro", MensagemErroDefault)
            console.log("Deu o erro: " + error);
        } finally {
            setLoading(false);
        }
    }

    async function editarPublicacao(pubicacao: PublicacaoDTO, id: string) {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);
        try{
            const response = await fetch(`${apiUrl}/publicacoes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JwtToken}`
                },
                signal: controller.signal,
                body: JSON.stringify(pubicacao)
            });
            clearTimeout(timeout);
            if(!response.ok) {
                throw new Error('Erro ao editar publicação');
            }
            gerarSucess("Sucesso", "Publicação editada com sucesso");
        } catch (error: any) {
            if(error.name === 'AbortError') {
                gerarError("Erro", MensagemErroDefaultTimeout)
                return;
            }
            gerarError("Erro", MensagemErroDefault)
            console.log("Deu o erro: " + error);
        } finally {
            setLoading(false);
        }
    }

    async function deletarPublicacao(id: string) {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);
        try{
            const response = await fetch(`${apiUrl}/publicacoes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JwtToken}`
                },
                signal: controller.signal
            });
            clearTimeout(timeout);
            if(!response.ok) {
                throw new Error('Erro ao deletar publicação');
            }
            gerarSucess("Sucesso", "Publicação deletada com sucesso");
        } catch (error: any) {
            if(error.name === 'AbortError') {                
                gerarError("Erro", MensagemErroDefaultTimeout)
                return;
            }
            gerarError("Erro", MensagemErroDefault)
            console.log("Deu o erro: " + error);
        } finally {
            setLoading(false);
        }
    }

    async function getPublicacoes() {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);
        try{
            const response = await fetch(`${apiUrl}/publicacoes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JwtToken}`
                },
                signal: controller.signal
            });
            clearTimeout(timeout);
            if(!response.ok) {
                throw new Error('Erro ao buscar publicações');
            }

            return await response.json();
        } catch (error: any) {
            if(error.name === 'AbortError') {
                gerarError("Erro", MensagemErroDefaultTimeout)
                return;
            }
            gerarError("Erro", MensagemErroDefault)
            console.log("Deu o erro: " + error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log("CONTEXT DO DIRETOR CRIADO")
        getDiretorData();
    }, []);

    useEffect(() => {
        console.log(diretor);
    }, [diretor]);

    return (
        <DiretorContext.Provider value={{
            diretor,
            getAulas,
            getAulasTemplates,
            criarTemplate,
            criarAula,
            deletarAula,
            getTurmaDetails,
            getProfessores,
            getKeys,
            gerarKey,
            getNotVerifiedUsers,
            excluirUser,
            verifyUser,
            getPublicacoes,
            novaPublicacao,
            editarPublicacao,
            deletarPublicacao
        }}>
            {children}
        </DiretorContext.Provider>
    );
}