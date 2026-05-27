package io.fermedley.com.Educap.service;

import io.fermedley.com.Educap.dto.AulaDTOs.AulaDTO;
import io.fermedley.com.Educap.entity.AulaEntity;
import io.fermedley.com.Educap.entity.ProfessorEntity;
import io.fermedley.com.Educap.entity.TarefaEntity;
import io.fermedley.com.Educap.entity.TurmaEntity;
import io.fermedley.com.Educap.exceptions.NaoEncontradoException;
import io.fermedley.com.Educap.mappers.AulaMapper;
import io.fermedley.com.Educap.repository.AulaRepository;
import io.fermedley.com.Educap.repository.ProfessorRepository;
import io.fermedley.com.Educap.repository.TurmaRepository;
import io.fermedley.com.Educap.validator.AulaValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AulaService {

    private final AulaRepository repository;
    private final AulaMapper mapper;
    private final AulaValidator validator;
    private final TurmaRepository turmaRepository;
    private final ProfessorRepository professorRepository;

    public AulaEntity salvar(AulaEntity aula) {
        validator.validar(aula);
        return repository.save(aula);
    }

    public Optional<AulaEntity> obterPorId(UUID id) {
        return repository.findById(id);
    }

    public List<AulaEntity> listarAulas() {
        return repository.findAll();
    }

    public AulaEntity atualizar(AulaEntity aula, AulaDTO dto) {
        AulaEntity aulaMapper = mapper.toEntity(dto);
        aula.setNome(aulaMapper.getNome());
        aula.setHorarioInicio(aulaMapper.getHorarioInicio());
        aula.setHorarioFim(aulaMapper.getHorarioFim());
        aula.setDiaSemana(aulaMapper.getDiaSemana());
        aula.setProfessor(aulaMapper.getProfessor());
        aula.setTurma(aulaMapper.getTurma());

        validator.validar(aula);
        return repository.save(aula);
    }

    public void deletar(AulaEntity aula) {
        repository.delete(aula);
    }

    public List<AulaEntity> listarAulasPorTurma(UUID turmaId) {
        Optional<TurmaEntity> turma = turmaRepository.findById(turmaId);

        if(turma.isEmpty()) {
            throw new NaoEncontradoException("Turma nao encontrada!");
        }

        return repository.findAllByTurma(turma.get());
    }

    public List<AulaEntity> listarTarefasPorProfessor(UUID professorId) {
        Optional<ProfessorEntity> professor = professorRepository.findById(professorId);

        if(professor.isEmpty()) {
            throw new NaoEncontradoException("Professor(a) nao encontrado(a)!");
        }

        return repository.findAllByProfessor(professor.get());
    }
}
