package io.fermedley.com.Educap.service;

import io.fermedley.com.Educap.dto.TarefaDTOs.TarefaDTO;
import io.fermedley.com.Educap.entity.ProfessorEntity;
import io.fermedley.com.Educap.entity.TarefaEntity;
import io.fermedley.com.Educap.entity.TurmaEntity;
import io.fermedley.com.Educap.exceptions.NaoEncontradoException;
import io.fermedley.com.Educap.mappers.TarefaMapper;
import io.fermedley.com.Educap.repository.ProfessorRepository;
import io.fermedley.com.Educap.repository.TarefaRepository;
import io.fermedley.com.Educap.repository.TurmaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TarefaService {

    private final TarefaRepository repository;
    private final TarefaMapper mapper;
    private final TurmaRepository turmaRepository;
    private final ProfessorRepository professorRepository;

    public TarefaEntity salvar(TarefaEntity tarefa) {
        return repository.save(tarefa);
    }

    public List<TarefaEntity> listarTarefas() {
        return repository.findAll();
    }

    public Optional<TarefaEntity> obterPorId(UUID id) {
        return repository.findById(id);
    }

    public TarefaEntity atualizar(TarefaEntity tarefa, TarefaDTO dto) {
        TarefaEntity mapperEntity = mapper.toEntity(dto);
        tarefa.setNomeTarefa(mapperEntity.getNomeTarefa());
        tarefa.setNotaTarefa(mapperEntity.getNotaTarefa());
        tarefa.setDescricaoTarefa(mapperEntity.getDescricaoTarefa());
        tarefa.setDataLimite(mapperEntity.getDataLimite());
        tarefa.setTurma(mapperEntity.getTurma());
        tarefa.setTipoTarefa(mapperEntity.getTipoTarefa());

        return repository.save(tarefa);
    }

    public void deletar(TarefaEntity tarefa) {
        repository.delete(tarefa);
    }

    public List<TarefaEntity> listarTarefasPorTurma(UUID turmaId) {
        Optional<TurmaEntity> turma = turmaRepository.findById(turmaId);

        if(turma.isEmpty()) {
            throw new NaoEncontradoException("Turma nao encontrada!");
        }

        return repository.findAllByTurma(turma.get());
    }

    public List<TarefaEntity> listarTarefasPorProfessor(UUID professorId) {
        Optional<ProfessorEntity> professor = professorRepository.findById(professorId);

        if(professor.isEmpty()) {
            throw new NaoEncontradoException("Professor(a) nao encontrado(a)!");
        }

        return repository.findAllByProfessor(professor.get());
    }
}
