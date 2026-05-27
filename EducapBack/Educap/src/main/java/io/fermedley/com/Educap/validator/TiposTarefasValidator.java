package io.fermedley.com.Educap.validator;

import io.fermedley.com.Educap.entity.TiposTarefasEntity;
import io.fermedley.com.Educap.exceptions.RegistroDuplicadoException;
import io.fermedley.com.Educap.repository.TiposTarefasRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TiposTarefasValidator {

    private final TiposTarefasRepository repository;

    public void validar(TiposTarefasEntity tiposTarefas) {
        if(existTipoTarefa(tiposTarefas)) {
            throw new RegistroDuplicadoException("Já existe esse tipo de tarefa registrado!");
        }
    }

    private boolean existTipoTarefa(TiposTarefasEntity tiposTarefas) {
        return repository.findByTipoIgnoreCase(tiposTarefas.getTipo()).map(tipo -> (tiposTarefas.getId() == null || !tipo.getId().equals(tiposTarefas.getId()))).orElse(false);
    }
}
