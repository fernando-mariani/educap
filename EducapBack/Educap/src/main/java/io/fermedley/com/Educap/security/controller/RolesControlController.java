package io.fermedley.com.Educap.security.controller;

import io.fermedley.com.Educap.exceptions.CadastroUserException;
import io.fermedley.com.Educap.security.entity.RolesControlEntity;
import io.fermedley.com.Educap.security.service.RolesControlService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/role-key")
@RequiredArgsConstructor
@Tag(name = "Chaves de Acesso")
public class RolesControlController {

    private final RolesControlService service;

    @PostMapping
    @PreAuthorize("hasAnyRole('DIRETOR', 'ADMIN')")
    @Operation(
            summary = "Gerar uma nova chave de role",
            description = "Apenas usuários com a role de ADMIN ou de DIRETOR podem fazer isso. Gera uma chave que será usada no cadastro de usuários"
    )
    public ResponseEntity<RolesControlEntity> gerarNovaKey(@RequestBody RolesControlEntity rolesControl) {
        RolesControlEntity novaKey = new RolesControlEntity();
        novaKey.setRole(rolesControl.getRole().toUpperCase());

        service.GerarKey(novaKey);

        return ResponseEntity.ok(novaKey);
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    @Operation(
            summary = "Verificar uma chave de role",
            description = "Todos podem fazer isso. Verifica se uma chave é válida e retorna a role associada a ela"
    )
    public ResponseEntity<Object> verificarKey(@PathVariable String id) {
        RolesControlEntity rolesControl = service.obterPorId(UUID.fromString(id));

        if(rolesControl == null) {
            throw new CadastroUserException("A chave da escola está inválida!");
        }

        return ResponseEntity.ok(rolesControl.getRole());
    }

    @GetMapping
    @PreAuthorize("hasRole('DIRETOR')")
    @Operation(
            summary = "Listar todas as chaves de role",
            description = "Apenas usuários com a role de DIRETOR podem fazer isso"
    )
    public ResponseEntity<List<RolesControlEntity>> listarKeys() {
        List<RolesControlEntity> rolesControlEntities = service.listarKeys();

        return ResponseEntity.ok(rolesControlEntities);
    }
}
