export interface Aluno {
        id: string;
        nome: string;
        dataNascimento: string;
        turma: {
            id: string;
            nomeTurma: string;
        };
    }