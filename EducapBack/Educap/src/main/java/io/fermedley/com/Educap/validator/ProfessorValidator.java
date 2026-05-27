package io.fermedley.com.Educap.validator;

import io.fermedley.com.Educap.entity.ProfessorEntity;
import io.fermedley.com.Educap.exceptions.RegistroDuplicadoException;
import io.fermedley.com.Educap.repository.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ProfessorValidator {

    private final ProfessorRepository repository;

    public void validar(ProfessorEntity professor) {
        if(existProfessorWithTheSameSubject(professor)) {
            throw new RegistroDuplicadoException("Já existe um professor com essa matéria e turma!");
        }
    }

    private boolean existProfessorWithTheSameSubject(ProfessorEntity professor) {
        return repository.findAllByMateriaIgnoreCase(professor.getMateria()).stream()
                .anyMatch(p ->
                        (professor.getId() == null || !p.getId().equals(professor.getId())) &&
                        p.getTurmas().stream().anyMatch(turma -> professor.getTurmas().contains(turma)));
    }

}
