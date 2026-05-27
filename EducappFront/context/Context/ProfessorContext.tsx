import { Aulas, AulaTemplate, Professor, Publicacao, Tarefa, TarefaDTO, TiposTarefas, Turma, TurmaDetails } from "@/types";
import { createContext, useEffect, useState } from "react";
import { useAppContext } from "./appContext";


interface ProfessorContextInterface {
    professor: Professor;
    getAulas: () => Promise<Aulas[]>;
    getAulasTemplates: () => Promise<AulaTemplate | null>;
    getTiposTarefas: () => Promise<TiposTarefas[]>;
    getTurmas: () => Promise<Turma[]>;
    getTurmasDetails: (turmaId: string) => Promise<TurmaDetails>;
    getTarefas: () => Promise<Tarefa[]>;
    getTarefaPorId: (id: string) => Promise<Tarefa>;
    criarTarefa: (tarefa: TarefaDTO) => Promise<void>;
    deletarTarefa: (id: string) => Promise<void>;
    editarTarefa: (tarefa: TarefaDTO, id: string) => Promise<void>;
    getPublicacoes: () => Promise<Publicacao[]>;
}

export const ProfessorContext = createContext<ProfessorContextInterface>({} as ProfessorContextInterface);

export default function ProfessorProvider({ children }: any) {

    const { apiUrl, JwtToken, idUsuario, gerarError, gerarSucess, setLoading, MensagemErroDefault, MensagemErroDefaultTimeout, logout } = useAppContext();

    const [professor, setProfessor] = useState<Professor>({} as Professor);

    async function getProfessorData() {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);
        try{
            const response = await fetch(`${apiUrl}/professores/${idUsuario}`, {
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
                throw new Error('Erro ao buscar professor');
            }
            const data = await response.json();

            const ProfessorDTO: Professor = {
                id: data.id,
                nome: data.nome,
                materia: data.materia,
                turmas: data.turmas.map((turma: any) => ({
                    id: turma.id,
                    nomeTurma: turma.nomeTurma
                }))
            }
            setProfessor(ProfessorDTO);
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
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);
        try{
            const response = await fetch(`${apiUrl}/aulas/professor/${professor.id}`, {
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

    async function getAulasTemplates() {
        setLoading(true); 
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);
        try{
            const response = await fetch(`${apiUrl}/aulas-templates/professor/${professor.id}`, {
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
            return text ? JSON.parse(text) : null;
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

    async function getTurmas() {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);
        try{
            const response = await fetch(`${apiUrl}/turmas`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JwtToken}`
                },
                signal: controller.signal
            });
            clearTimeout(timeout);
            if(!response.ok) {
                throw new Error('Erro ao buscar turmas');
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

    async function getTurmasDetails(turmaId: string) {
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
                throw new Error('Erro ao buscar turmas');
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
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);
        try{
            const response = await fetch(`${apiUrl}/tarefas/professor/${professor.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JwtToken}`
                },
                signal: controller.signal
            });
            clearTimeout(timeout);
            if(!response.ok) {
                gerarError("Erro", MensagemErroDefault)
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

    async function getTarefaPorId(id: string) {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);
        try{
            const response = await fetch(`${apiUrl}/tarefas/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JwtToken}`
                },
                signal: controller.signal
            });
            clearTimeout(timeout);
            if(!response.ok) {
                throw new Error('Erro ao buscar tarefa');
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

    async function criarTarefa(tarefa: TarefaDTO) {
        setLoading(true);
        tarefa.idProfessor = professor.id;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);
        try{

            const response = await fetch(`${apiUrl}/tarefas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JwtToken}`
                },
                body: JSON.stringify(tarefa),
                signal: controller.signal
            });
            clearTimeout(timeout);
            if(!response.ok) {
                throw new Error('Erro ao criar tarefa');
            }
            gerarSucess("Sucesso", "Tarefa criada com sucesso!");
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

    async function deletarTarefa(id: string) {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);
        try{
            const response = await fetch(`${apiUrl}/tarefas/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JwtToken}`
                },
                signal: controller.signal
            });
            clearTimeout(timeout);
            if(!response.ok) {
                throw new Error('Erro ao deletar tarefa');
            }
            gerarSucess("Sucesso", "Tarefa deletada com sucesso!");
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

    async function editarTarefa(tarefa: TarefaDTO, id: string) {
        setLoading(true);
        tarefa.idProfessor = professor.id;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);
        try{
            const response = await fetch(`${apiUrl}/tarefas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JwtToken}`
                },
                body: JSON.stringify(tarefa),
                signal: controller.signal
            });
            clearTimeout(timeout);
            if(!response.ok) {
                throw new Error('Erro ao editar tarefa');
            }
            gerarSucess("Sucesso", "Tarefa editada com sucesso!");
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
        getProfessorData();
    }, []);

    return (
        <ProfessorContext.Provider value={{
            professor,
            getAulas,
            getAulasTemplates,
            getTiposTarefas,
            getTurmas,
            getTurmasDetails,
            getTarefas,
            getTarefaPorId,
            criarTarefa,
            deletarTarefa,
            editarTarefa,
            getPublicacoes
        }}>
            {children}
        </ProfessorContext.Provider>
    )
}