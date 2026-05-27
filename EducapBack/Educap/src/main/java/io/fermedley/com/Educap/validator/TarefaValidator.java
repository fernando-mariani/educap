package io.fermedley.com.Educap.validator;

import io.fermedley.com.Educap.entity.TarefaEntity;
import io.fermedley.com.Educap.exceptions.RegistroDuplicadoException;
import io.fermedley.com.Educap.repository.TarefaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class TarefaValidator {

    private final TarefaRepository repository;

    public void validar(TarefaEntity tarefa) {
        if(existeTarefaIgual(tarefa)) {
            throw new RegistroDuplicadoException("Já existe uma tarefa igual a essa registrada!");
        }
    }

    private boolean existeTarefaIgual(TarefaEntity tarefa) {
        return repository.findByNomeTarefaAndNotaTarefaAndDataLimiteAndProfessorAndTurmaAndTipoTarefa(
                tarefa.getNomeTarefa(),
                tarefa.getNotaTarefa(),
                tarefa.getDataLimite(),
                tarefa.getProfessor(),
                tarefa.getTurma(),
                tarefa.getTipoTarefa()
        )
                .map(task -> (tarefa.getId() == null || !task.getId().equals(tarefa.getId())))
                .orElse(false);
    }

}
