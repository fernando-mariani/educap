package io.fermedley.com.Educap.service;

import io.fermedley.com.Educap.entity.AlunoEntity;
import io.fermedley.com.Educap.entity.TurmaEntity;
import io.fermedley.com.Educap.repository.AlunoRepository;
import io.fermedley.com.Educap.repository.TurmaRepository;
import io.fermedley.com.Educap.validator.AlunoValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AlunoService {

    private final AlunoRepository repository;
    private final TurmaRepository turmaRepository;
    private final AlunoValidator validator;

    public AlunoEntity salvar(AlunoEntity aluno) {
        validator.validar(aluno);
        return repository.save(aluno);
    }

    public Optional<AlunoEntity> obterPorId(UUID id) {
        return repository.findById(id);
    }

    public Optional<TurmaEntity> obterTurmaPorID(UUID id) {
        return turmaRepository.findById(id);
    }

    public void atualizar(AlunoEntity aluno) {
        validator.validar(aluno);
        repository.save(aluno);
    }

    public void deletar(AlunoEntity aluno) {
        repository.delete(aluno);
    }
}
