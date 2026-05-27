import { Aluno, Aulas, AulaTemplate, Publicacao, Tarefa, TiposTarefas, TurmaDetails } from "@/types";
import { createContext, useEffect, useState } from "react";
import { useAppContext } from "./appContext";

interface AlunoContextInterface {
    aluno: Aluno;
    getAulas: () => Promise<Aulas[]>;
    getTarefas: () => Promise<Tarefa[]>;
    getTiposTarefas: () => Promise<TiposTarefas[]>;
    getAulasTemplates: () => Promise<AulaTemplate[]>;
    getTurmaDetails: () => Promise<TurmaDetails>;
    getPublicacoes: () => Promise<Publicacao[]>;
};

export const AlunoContext = createContext<AlunoContextInterface>({} as AlunoContextInterface);

export default function AlunoProvider({ children }: any) {

    const { apiUrl, JwtToken, idUsuario, gerarError, gerarSucess, setLoading, MensagemErroDefault, MensagemErroDefaultTimeout, logout } = useAppContext();
    const [aluno, setAluno] = useState<Aluno>({} as Aluno);

    async function getAlunoData() {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        try{
            const response = await fetch(`${apiUrl}/alunos/${idUsuario}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JwtToken}`
                },
                signal: controller.signal
            });
            clearTimeout(timeout);

            if(response.status === 401) {
                logout();
                return;
            }

            if(!response.ok) {
                throw new Error('Erro ao buscar aluno');
            }
            const data = await response.json();
            console.log(data);
            const AlunoDTO: Aluno = {
                id: data.id,
                nome: data.nome,
                dataNascimento: data.dataNascimento,
                turma: {
                    id: data.turma.id,
                    nomeTurma: data.turma.nomeTurma
                }
            }

            setAluno(AlunoDTO);
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

    async function getAulas() {
        if (!aluno?.turma?.id) return [];
        
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        try {
            const response = await fetch(`${apiUrl}/aulas/turma/${aluno.turma.id}`, {
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

    async function getTarefas() {
        if (!aluno?.turma?.id) return [];

        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        try {
            const response = await fetch(`${apiUrl}/tarefas/turma/${aluno.turma.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JwtToken}`
                },
                signal: controller.signal
            });
            clearTimeout(timeout);
            if(!response.ok) {
                throw new Error('Erro ao buscar tarefas');
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

    async function getTiposTarefas() {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);
        try{
            const response = await fetch(`${apiUrl}/tipos-tarefas`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JwtToken}`
                },
                signal: controller.signal
            });
            clearTimeout(timeout);
            if(!response.ok) {
                throw new Error('Erro ao buscar tipos de tarefas');
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

    async function getAulasTemplates() {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);
        try{
            const response = await fetch(`${apiUrl}/aulas-templates/turma/${aluno.turma.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JwtToken}`
                },
                signal: controller.signal
            });
            clearTimeout(timeout);
            if(!response.ok) {
                throw new Error('Erro ao buscar template das aulas');
            }
            const text = await response.text();
            return text ? JSON.parse(text) : [];
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

    async function getTurmaDetails() {
        if (!aluno?.turma?.id) return;
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        try {
            const response = await fetch(`${apiUrl}/turmas/${aluno.turma.id}`, {
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
        getAlunoData();
    }, []);

    return <AlunoContext.Provider value={{
        aluno,
        getAulas,
        getTarefas,
        getTiposTarefas,
        getAulasTemplates,
        getTurmaDetails,
        getPublicacoes
    }}>{children}</AlunoContext.Provider>;
}