package io.fermedley.com.Educap.service;

import io.fermedley.com.Educap.entity.TiposTarefasEntity;
import io.fermedley.com.Educap.repository.TiposTarefasRepository;
import io.fermedley.com.Educap.validator.TiposTarefasValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TiposTarefasService {

    private final TiposTarefasRepository repository;
    private final TiposTarefasValidator validator;

    public void salvar(TiposTarefasEntity tiposTarefas) {
        validator.validar(tiposTarefas);
        repository.save(tiposTarefas);
    }

    public Optional<TiposTarefasEntity> obterPorId(UUID id) {
        return repository.findById(id);
    }

    public List<TiposTarefasEntity> listarTiposTarefas() {
        return repository.findAll();
    }

    public void atualizar(TiposTarefasEntity tiposTarefas) {
        validator.validar(tiposTarefas);
        repository.save(tiposTarefas);
    }

    public void deletar(TiposTarefasEntity tiposTarefasEntity) {
        repository.delete(tiposTarefasEntity);
    }
}
