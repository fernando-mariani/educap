package io.fermedley.com.Educap.controller;

import io.fermedley.com.Educap.dto.TurmaDTOs.TurmaCommonResponse;
import io.fermedley.com.Educap.dto.TurmaDTOs.TurmaDTO;
import io.fermedley.com.Educap.dto.TurmaDTOs.TurmaResponseDTO;
import io.fermedley.com.Educap.entity.TurmaEntity;
import io.fermedley.com.Educap.mappers.TurmaMapper;
import io.fermedley.com.Educap.service.TurmaService;
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
@RequestMapping("turmas")
@RequiredArgsConstructor
@Tag(name = "Turmas")
public class TurmaController {

    private final TurmaService service;
    private final TurmaMapper mapper;

    @PostMapping
    @PreAuthorize("hasRole('DIRETOR')")
    @Operation(
            summary = "Criar uma turma",
            description = "Apenas usuários com a role de DIRETOR podem fazer isso"
    )
    public ResponseEntity<Object> salvarTurma(@RequestBody @Valid TurmaDTO dto) {
        TurmaEntity turma = mapper.toEntity(dto);
        service.salvar(turma);

        return ResponseEntity.ok(turma);
    }

    @GetMapping("{id}")
    @Operation(
            summary = "Obter detalhes de uma turma por ID",
            description = "Retorna os detalhes de uma turma a partir do seu ID"
    )
    public ResponseEntity<TurmaResponseDTO> obterDetalhesTurma(@PathVariable String id) {
        return service.obterId(UUID.fromString(id))
                .map(turma -> {
                    TurmaResponseDTO responseDTO = mapper.toDTO(turma);
                    return ResponseEntity.ok(responseDTO);
                }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    @Operation(
            summary = "Obter detalhes de uma turma por ID",
            description = "Retorna os detalhes de uma turma a partir do seu ID"
    )
    public ResponseEntity<List<TurmaCommonResponse>> listarTurmas() {
        List<TurmaEntity> turmaEntities = service.listarTurmas();
        List<TurmaCommonResponse> turmasResponse = turmaEntities.stream().map(mapper::toCommonDTO).toList();

        return ResponseEntity.ok(turmasResponse);
    }

    @PutMapping("{id}")
    @PreAuthorize("hasRole('DIRETOR')")
    @Operation(
            summary = "Atualizar uma turma",
            description = "Apenas usuários com a role de DIRETOR podem fazer isso"
    )
    public ResponseEntity<TurmaResponseDTO> atualizarTurma(@PathVariable String id, @RequestBody @Valid TurmaDTO dto) {
        Optional<TurmaEntity> optionalTurma = service.obterId(UUID.fromString(id));

        if(optionalTurma.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        TurmaEntity turma = optionalTurma.get();
        turma.setNomeTurma(dto.nomeTurma());

        service.atualizar(turma);
        return ResponseEntity.ok(mapper.toDTO(turma));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('DIRETOR')")
    @Operation(
            summary = "Deletar uma turma",
            description = "Apenas usuários com a role de DIRETOR podem fazer isso"
    )
    public ResponseEntity<Void> deletarTurma(@PathVariable String id) {
        Optional<TurmaEntity> turma = service.obterId(UUID.fromString(id));

        if(turma.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        service.deletar(turma.get());
        return ResponseEntity.noContent().build();
    }
}
