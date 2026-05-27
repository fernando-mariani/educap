package io.fermedley.com.Educap.controller;

import io.fermedley.com.Educap.dto.TiposTarefasDTOs.TiposTarefasDTO;
import io.fermedley.com.Educap.dto.TiposTarefasDTOs.TiposTarefasResponseDTO;
import io.fermedley.com.Educap.entity.TiposTarefasEntity;
import io.fermedley.com.Educap.mappers.TiposTarefasMapper;
import io.fermedley.com.Educap.service.TiposTarefasService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("tipos-tarefas")
@RequiredArgsConstructor
@Tag(name = "Tipos de Tarefas")
public class TiposTarefasController {

    private final TiposTarefasService service;
    private final TiposTarefasMapper mapper;

    @PostMapping
    @PreAuthorize("hasRole('DIRETOR')")
    @Operation(
            summary = "Criar um tipo de tarefa",
            description = "Apenas usuários com a role de DIRETOR podem fazer isso"
    )
    public ResponseEntity<TiposTarefasResponseDTO> salvarTipoTarefa(@RequestBody @Valid TiposTarefasDTO dto) {
        TiposTarefasEntity tiposTarefas = mapper.toEntity(dto);

        service.salvar(tiposTarefas);
        return ResponseEntity.ok(mapper.toDTO(tiposTarefas));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('DIRETOR', 'PROFESSOR', 'ALUNO')")
    @Operation(
            summary = "Listar todos os tipos de tarefas",
            description = "Usuários com a role de DIRETOR, PROFESSOR ou ALUNO podem fazer isso"
    )
    public  ResponseEntity<List<TiposTarefasResponseDTO>> listarTiposTarefas() {
        List<TiposTarefasEntity> tiposTarefasEntities = service.listarTiposTarefas();
        List<TiposTarefasResponseDTO> responseDTOS = tiposTarefasEntities.stream().map(mapper::toDTO).toList();

        return ResponseEntity.ok(responseDTOS);
    }

    @GetMapping("{id}")
    @PreAuthorize("hasAnyRole('DIRETOR', 'PROFESSOR', 'ALUNO')")
    @Operation(
            summary = "Obter um tipo de tarefa por ID",
            description = "Usuários com a role de DIRETOR, PROFESSOR ou ALUNO podem fazer isso"
    )
    public ResponseEntity<TiposTarefasResponseDTO> obterPorId(@PathVariable String id) {
        Optional<TiposTarefasEntity> optionalTiposTarefas = service.obterPorId(UUID.fromString(id));

        if (optionalTiposTarefas.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(mapper.toDTO(optionalTiposTarefas.get()));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasRole('DIRETOR')")
    @Operation(
            summary = "Atualizar um tipo de tarefa",
            description = "Apenas usuários com a role de DIRETOR podem fazer isso"
    )
    public ResponseEntity<TiposTarefasResponseDTO> atualizarTipoTarefa(@RequestBody @Valid TiposTarefasDTO dto, @PathVariable String id) {
        Optional<TiposTarefasEntity> optionalTiposTarefas = service.obterPorId(UUID.fromString(id));

        if (optionalTiposTarefas.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        TiposTarefasEntity tiposTarefas = optionalTiposTarefas.get();
        tiposTarefas.setTipo(dto.tipo());
        tiposTarefas.setNotaMax(dto.notaMax());

        service.atualizar(tiposTarefas);
        return ResponseEntity.ok(mapper.toDTO(tiposTarefas));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('DIRETOR')")
    @Operation(
            summary = "Deletar um tipo de tarefa",
            description = "Apenas usuários com a role de DIRETOR podem fazer isso"
    )
    public ResponseEntity<Void> deletarTipoTarefa(@PathVariable String id) {
        Optional<TiposTarefasEntity> tiposTarefas = service.obterPorId(UUID.fromString(id));

        if (tiposTarefas.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        service.deletar(tiposTarefas.get());
        return ResponseEntity.noContent().build();
    }
}
