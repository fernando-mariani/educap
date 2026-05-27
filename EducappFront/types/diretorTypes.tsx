export interface Diretor {
    id: string;
    nome: string;
}

export interface AulaTemplate {
    id: string;
    cor: string;
    duracao: number;
    professor: {
        id: string;
        nome: string;
        materia: string;
    };
    turmas: {
        id: string;
        nomeTurma: string;
    }[];
}

export interface NotVerifiedUsers {
    id: string;
    email: string;
    aluno?: {
        id: string;
        nome: string;
        turma: {
            id: string;
            nomeTurma: string;
        }
    }
    professor?: {
        id: string;
        nome: string;
        materia: string;
        turmas: {
            id: string;
            nomeTurma: string;
        }[]
    }
    diretor?: {
        id: string;
        nome: string;
    }
}

export interface PublicacaoDTO {
    titulo: string;
    descricao: string;
    idDiretor: string;
}

export interface keys {
    id: string;
    role: string;
}

export interface AulaDTO {
    nome: string;
    horarioInicio: number;
    horarioFim: number;
    diaSemana: number;
    idProfessor: string;
    idTurma: string;
}

export interface AulaTemplateDTO {
    cor: string;
    duracao: number;
    idProfessor: string;
    idTurmas: string[];
}

export interface TurmaDetails {
    id: string;
    nomeTurma: string;
    professores: {
        id: string;
        nome: string;
        materia: string;
    }[],
    alunos: {
        id: string;
        nome: string;
    }[],
    tarefas: {
        id: string;
        nomeTarefa: string;
        notaTarefa: number;
        dataLimite: string;
    }[],
    aulas: {
        professor: {
            id: string;
            nome: string;
            materia: string;
        }
        horarioInicio: number;
        horarioFim: number;
        diaSemana: number;
    }[]
}