package io.fermedley.com.Educap.security.validator;

import io.fermedley.com.Educap.exceptions.RegistroDuplicadoException;
import io.fermedley.com.Educap.security.entity.RolesControlEntity;
import io.fermedley.com.Educap.security.repository.RolesControlRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RolesControlValidator {

    private final RolesControlRepository repository;

    public boolean validar(RolesControlEntity key) {
        if(existeEssaKey(key)) {
            return true;
        }
        return false;
    }

    private boolean existeEssaKey(RolesControlEntity key) {
        return repository.findAll().stream().anyMatch(a -> a.getRole().equals(key.getRole()));
    }
}
