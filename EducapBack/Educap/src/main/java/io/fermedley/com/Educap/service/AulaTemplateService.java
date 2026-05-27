package io.fermedley.com.Educap.service;

import io.fermedley.com.Educap.entity.AulaTemplateEntity;
import io.fermedley.com.Educap.entity.ProfessorEntity;
import io.fermedley.com.Educap.entity.TurmaEntity;
import io.fermedley.com.Educap.exceptions.NaoEncontradoException;
import io.fermedley.com.Educap.repository.AulaTemplateRepository;
import io.fermedley.com.Educap.repository.ProfessorRepository;
import io.fermedley.com.Educap.repository.TurmaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AulaTemplateService {

    private final AulaTemplateRepository repository;
    private final TurmaRepository turmaRepository;
    private final ProfessorRepository professorRepository;

    public void salvar(AulaTemplateEntity aulaTemplate) {
        repository.save(aulaTemplate);
    }

    public List<AulaTemplateEntity> listarTemplates() {
        return repository.findAll();
    }

    public List<AulaTemplateEntity> listarTemplatesPorTurma(UUID idTurma) {
        Optional<TurmaEntity> turma = turmaRepository.findById(idTurma);

        if(turma.isEmpty()) {
            throw new NaoEncontradoException("Turma nao encontrada");
        }

        return repository.findAllByTurmas(turma.get());
    }

    public AulaTemplateEntity obterTemplatePorProfessor(UUID idProfessor) {
        Optional<ProfessorEntity> professor = professorRepository.findById(idProfessor);

        if(professor.isEmpty()) {
            throw new NaoEncontradoException("Professor nao encontrado");
        }

        return repository.findByProfessor(professor.get());
    }
}
