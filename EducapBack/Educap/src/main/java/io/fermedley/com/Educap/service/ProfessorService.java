package io.fermedley.com.Educap.service;

import io.fermedley.com.Educap.entity.ProfessorEntity;
import io.fermedley.com.Educap.entity.TurmaEntity;
import io.fermedley.com.Educap.repository.ProfessorRepository;
import io.fermedley.com.Educap.repository.TurmaRepository;
import io.fermedley.com.Educap.validator.ProfessorValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfessorService {

    private final ProfessorRepository repository;
    private final TurmaRepository turmaRepository;
    private final ProfessorValidator validator;

    public void salvar(ProfessorEntity professor) {
        validator.validar(professor);

        String materia = professor.getMateria().toUpperCase();
        professor.setMateria(materia);

        repository.save(professor);
    }

    public Optional<ProfessorEntity> obterId(UUID id) {
        return repository.findById(id);
    }

    public List<TurmaEntity> listarTurmasPorID(Iterable<UUID> ids) {
        return turmaRepository.findAllById(ids);
    }

    public void atualizar(ProfessorEntity professor) {
        validator.validar(professor);

        String materia = professor.getMateria().toUpperCase();
        professor.setMateria(materia);

        repository.save(professor);
    }

    public List<ProfessorEntity> listarProfessores() {
        return repository.findAll();
    }

    public void deletar(ProfessorEntity professorEntity) {
        repository.delete(professorEntity);
    }
}
