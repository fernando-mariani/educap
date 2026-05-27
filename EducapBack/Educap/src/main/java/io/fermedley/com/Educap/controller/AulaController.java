package io.fermedley.com.Educap.controller;

import io.fermedley.com.Educap.dto.AulaDTOs.AulaDTO;
import io.fermedley.com.Educap.dto.AulaDTOs.AulaResponseDTO;
import io.fermedley.com.Educap.dto.TarefaDTOs.TarefaResponseDTO;
import io.fermedley.com.Educap.entity.AulaEntity;
import io.fermedley.com.Educap.entity.TarefaEntity;
import io.fermedley.com.Educap.mappers.AulaMapper;
import io.fermedley.com.Educap.service.AulaService;
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

@RestController
@RequestMapping("aulas")
@RequiredArgsConstructor
@Tag(name = "Aulas")
public class AulaController {

    private final AulaService service;
    private final AulaMapper mapper;

    @PostMapping
    @PreAuthorize("hasRole('DIRETOR')")
    @Operation(
            summary = "Criar uma aula",
            description = "Apenas usuários com a role de DIRETOR podem fazer isso"
    )
    public ResponseEntity<AulaResponseDTO> salvarAula(@RequestBody @Valid AulaDTO dto) {
        AulaEntity aula = service.salvar(mapper.toEntity(dto));

        return ResponseEntity.ok(mapper.toDTO(aula));
    }

    @GetMapping("{id}")
    @PreAuthorize("hasAnyRole('DIRETOR', 'PROFESSOR', 'ALUNO')")
    @Operation(
            summary = "Obter uma aula por ID",
            description = "Usuários com a role de DIRETOR, PROFESSOR ou ALUNO podem fazer isso"
    )
    public ResponseEntity<AulaResponseDTO> obterAulaPorId(@PathVariable String id) {
        Optional<AulaEntity> optionalAula = service.obterPorId(UUID.fromString(id));

        if(optionalAula.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(mapper.toDTO(optionalAula.get()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('DIRETOR', 'PROFESSOR', 'ALUNO')")
    @Operation(
            summary = "Listar todas as aulas",
            description = "Usuários com a role de DIRETOR, PROFESSOR ou ALUNO podem fazer isso"
    )
    public ResponseEntity<List<AulaResponseDTO>> listarAulas() {
        List<AulaEntity> entities = service.listarAulas();
        List<AulaResponseDTO> aulas = entities.stream().map(mapper::toDTO).toList();

        return ResponseEntity.ok(aulas);
    }

    @PutMapping("{id}")
    @PreAuthorize("hasRole('DIRETOR')")
    @Operation(
            summary = "Atualizar uma aula",
            description = "Apenas usuários com a role de DIRETOR podem fazer isso"
    )
    public ResponseEntity<AulaResponseDTO> atualizarAula(@PathVariable String id, @RequestBody @Valid AulaDTO dto) {
        Optional<AulaEntity> optionalAula = service.obterPorId(UUID.fromString(id));

        if(optionalAula.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        AulaEntity aula = service.atualizar(optionalAula.get(), dto);
        return ResponseEntity.ok(mapper.toDTO(aula));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('DIRETOR')")
    @Operation(
            summary = "Deletar uma aula",
            description = "Apenas usuários com a role de DIRETOR podem fazer isso"
    )
    public ResponseEntity<Object> deletarAula(@PathVariable String id) {
        Optional<AulaEntity> optionalAula = service.obterPorId(UUID.fromString(id));

        if(optionalAula.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        service.deletar(optionalAula.get());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/turma/{turmaId}")
    @PreAuthorize("hasAnyRole('DIRETOR', 'PROFESSOR', 'ALUNO')")
    @Operation(
            summary = "Listar aulas por turma",
            description = "Usuários com a role de DIRETOR, PROFESSOR ou ALUNO podem fazer isso"
    )
    public ResponseEntity<List<AulaResponseDTO>> obterAulasPorTurma(@PathVariable String turmaId) {
        List<AulaEntity> aulas = service.listarAulasPorTurma(UUID.fromString(turmaId));

        return ResponseEntity.ok(aulas.stream().map(mapper::toDTO).toList());
    }

    @GetMapping("/professor/{professorId}")
    @PreAuthorize("hasAnyRole('DIRETOR', 'PROFESSOR', 'ALUNO')")
    @Operation(
            summary = "Listar aulas por professor",
            description = "Usuários com a role de DIRETOR, PROFESSOR ou ALUNO podem fazer isso"
    )
    public ResponseEntity<List<AulaResponseDTO>> obterAulasPorProfessor(@PathVariable String professorId) {
        List<AulaEntity> aulas = service.listarTarefasPorProfessor(UUID.fromString(professorId));

        return ResponseEntity.ok(aulas.stream().map(mapper::toDTO).toList());
    }
}
