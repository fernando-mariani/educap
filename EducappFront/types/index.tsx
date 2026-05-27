export * from "./alunoTypes";
export * from "./diretorTypes";
export * from "./loginTypes";
export * from "./professorTypes";

export interface Aulas {
        id: string;
        materia: string;
        professor: {
            id: string;
            nome: string;
            materia: string;
        };
        turma: {
            id: string;
            nomeTurma: string;
        };
        horarioInicio: number;
        horarioFim: number;
        diaSemana: number;
}

export interface Tarefa {
        id: string;
        nomeTarefa: string;
        descricaoTarefa: string;
        notaTarefa: number;
        dataLimite: string;
        tipoTarefa: {
            id: string;
            tipo: string;
            notaMax: number;
        };
        professor: {
            id: string;
            nome: string;
            materia: string;
        };
        turma: {
            id: string;
            nomeTurma: string;
        };
        dataRegistro: number;
}

export interface Turma {
        id: string;
        nomeTurma: string;
        numAlunos?: number;
        numProfessores?: number;
}

export interface TiposTarefas {
    id: string;
    tipo: string;
    notaMax: number;
}

export interface Publicacao {
    id: string;
    titulo: string;
    descricao: string;
    diretor: {
        id: string;
        nome: string;
    }
    dataRegistro: number;
}

export interface SelectItem {
    id: string;
    nome: string;
}