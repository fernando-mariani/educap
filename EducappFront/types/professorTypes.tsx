export interface Professor {
    id: string;
    nome: string;
    materia: string;
    turmas: {
        id: string;
        nomeTurma: string;
    }[];
}

export interface TarefaDTO {
    nomeTarefa: string;
    descricaoTarefa: string;
    notaTarefa: number;
    dataLimite: string;
    idProfessor: string;
    idTurma: string;
    idTipoTarefa: string;
}