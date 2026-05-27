package io.fermedley.com.Educap.service;

import io.fermedley.com.Educap.dto.TurmaDTOs.TurmaResponseDTO;
import io.fermedley.com.Educap.entity.ProfessorEntity;
import io.fermedley.com.Educap.entity.TurmaEntity;
import io.fermedley.com.Educap.repository.ProfessorRepository;
import io.fermedley.com.Educap.repository.TurmaRepository;
import io.fermedley.com.Educap.validator.TurmaValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TurmaService {

    private final TurmaRepository repository;
    private final ProfessorRepository professorRepository;
    private final TurmaValidator validator;

    public void salvar(TurmaEntity turma) {
        validator.validar(turma);
        repository.save(turma);
    }

    public Optional<TurmaEntity> obterId(UUID id) {
        return repository.findById(id);
    }

    public List<TurmaEntity> listarTurmas() {
        return repository.findAll();
    }

    public void atualizar(TurmaEntity turma) {
        validator.validar(turma);
        repository.save(turma);
    }

    public void deletar(TurmaEntity turma) {
        validator.validarExclusao(turma);
        repository.delete(turma);
    }
}
