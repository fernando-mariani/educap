package io.fermedley.com.Educap.validator;

import io.fermedley.com.Educap.entity.AlunoEntity;
import io.fermedley.com.Educap.exceptions.RegistroDuplicadoException;
import io.fermedley.com.Educap.repository.AlunoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AlunoValidator {

    private final AlunoRepository repository;

    public void validar(AlunoEntity aluno) {
        if(existByNomeAndTurmaAndIdade(aluno)) {
            throw new RegistroDuplicadoException("Já existe um aluno com essa matrícula!");
        }
    }

    private boolean existByNomeAndTurmaAndIdade(AlunoEntity aluno) {
        return false;
    }
}
