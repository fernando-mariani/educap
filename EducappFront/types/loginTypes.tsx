export interface UserDTO {
    key: string;
    email: string;
    senha: string;
}

export interface AlunoDTO {
    nome: string;
    dataNascimento: string;
    idTurma: string;
}

export interface ProfessorDTO {
    nome: string;
    materia: string;
    idTurmas: string[];
}