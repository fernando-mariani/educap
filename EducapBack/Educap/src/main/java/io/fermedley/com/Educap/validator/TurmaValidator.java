package io.fermedley.com.Educap.validator;

import io.fermedley.com.Educap.entity.TurmaEntity;
import io.fermedley.com.Educap.exceptions.OperacaoNaoPermitidaException;
import io.fermedley.com.Educap.exceptions.RegistroDuplicadoException;
import io.fermedley.com.Educap.repository.TurmaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
@RequiredArgsConstructor
public class TurmaValidator {

    private final TurmaRepository repository;

    public void validar(TurmaEntity turma) {
        if(existNomeTurma(turma)) {
            throw new RegistroDuplicadoException("Já existe essa turma!");
        }
    }

    public void validarExclusao(TurmaEntity turma) {
        if(turmaTemAlunos(turma)) {
            throw new OperacaoNaoPermitidaException("A turma nao pode ser excluída, pois ela tem alunos registrados!");
        }

        if(turmaTemProfessores(turma)) {
            throw new OperacaoNaoPermitidaException("A turma nao pode ser excluída, pois ela tem professores registrados!");
        }
    }

    private boolean existNomeTurma(TurmaEntity turma) {
        return repository.findByNomeTurmaIgnoreCase(turma.getNomeTurma())
                .map(t -> (turma.getId() == null || t.getId().equals(turma.getId()))).orElse(false);
    }

    private boolean turmaTemAlunos(TurmaEntity turma) {
        return !turma.getAlunos().isEmpty();
    }

    private boolean turmaTemProfessores(TurmaEntity turma) {
        return !turma.getProfessores().isEmpty();
    }
}
