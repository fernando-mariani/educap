package io.fermedley.com.Educap.security.service;

import io.fermedley.com.Educap.security.entity.RolesControlEntity;
import io.fermedley.com.Educap.security.repository.RolesControlRepository;
import io.fermedley.com.Educap.security.validator.RolesControlValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RolesControlService {
    private final RolesControlRepository repository;
    private final RolesControlValidator validator;

    public void GerarKey(RolesControlEntity rolesControl) {
        boolean validar = validator.validar(rolesControl);

        if(validar) {
            RolesControlEntity oldKey = repository.findByRole(rolesControl.getRole());
            repository.delete(oldKey);
        }

        repository.save(rolesControl);
    }

    public RolesControlEntity obterPorId(UUID id) {
        return repository.findById(id).orElse(null);
    }

    public List<RolesControlEntity> listarKeys() {
        return repository.findAll();
    }
}
