package io.fermedley.com.Educap.security.validator;

import io.fermedley.com.Educap.dto.AlunoDTOs.AlunoDTO;
import io.fermedley.com.Educap.exceptions.CadastroUserException;
import io.fermedley.com.Educap.mappers.AlunoMapper;
import io.fermedley.com.Educap.mappers.ProfessorMapper;
import io.fermedley.com.Educap.security.entity.RolesControlEntity;
import io.fermedley.com.Educap.security.repository.RolesControlRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class SecurityValidator {

    private final RolesControlRepository keyRepository;

    public String validar(String key) {
        String response = keyValidator(key);
        System.out.println(response);
        if(response.equals("ALUNO")) {
            return response;
        }
        if(response.equals("PROFESSOR")) {
            return response;
        }
        if(response.equals("DIRETOR")) {
            return response;
        }
        throw new CadastroUserException("Erro ao cadastrar usuário, verifique se os dados estao corretos e consulte a escola");
    }

    private String keyValidator(String key) {

        try {
            Optional<RolesControlEntity> role = keyRepository.findById(UUID.fromString(key));

            if (role.isEmpty()) {
                return null;
            }

            return role.get().getRole();
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
