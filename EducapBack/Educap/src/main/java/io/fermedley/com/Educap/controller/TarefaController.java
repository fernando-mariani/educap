package io.fermedley.com.Educap.controller;

import io.fermedley.com.Educap.dto.TarefaDTOs.TarefaDTO;
import io.fermedley.com.Educap.dto.TarefaDTOs.TarefaResponseDTO;
import io.fermedley.com.Educap.entity.TarefaEntity;
import io.fermedley.com.Educap.mappers.TarefaMapper;
import io.fermedley.com.Educap.service.TarefaService;
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
@RequestMapping("tarefas")
@RequiredArgsConstructor
@Tag(name = "Tarefas")
public class TarefaController {

    private final TarefaService service;
    private final TarefaMapper mapper;

    @PostMapping
    @PreAuthorize("hasAnyRole('DIRETOR', 'PROFESSOR')")
    @Operation(
            summary = "Criar uma tarefa",
            description = "Apenas usuários com a role de DIRETOR ou PROFESSOR podem fazer isso"
    )
    public ResponseEntity<TarefaResponseDTO> salvarTarefa(@RequestBody @Valid TarefaDTO dto) {
        TarefaEntity tarefa = service.salvar(mapper.toEntity(dto));

        return ResponseEntity.ok(mapper.toDTO(tarefa));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('DIRETOR', 'PROFESSOR', 'ALUNO')")
    @Operation(
            summary = "Listar todas as tarefas",
            description = "Usuários com a role de DIRETOR, PROFESSOR ou ALUNO podem fazer isso"
    )
    public ResponseEntity<List<TarefaResponseDTO>> listarTarefas() {
        List<TarefaEntity> tarefaEntities = service.listarTarefas();
        List<TarefaResponseDTO> responseList = tarefaEntities.stream().map(mapper::toDTO).toList();

        return ResponseEntity.ok(responseList);
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyRole('DIRETOR', 'PROFESSOR')")
    @Operation(
            summary = "Atualizar uma tarefa",
            description = "Apenas usuários com a role de DIRETOR ou PROFESSOR podem fazer isso"
    )
    public ResponseEntity<TarefaResponseDTO> atualizarTarefa(@PathVariable String id, @RequestBody @Valid TarefaDTO dto) {
        Optional<TarefaEntity> optionalTarefa = service.obterPorId(UUID.fromString(id));

        if(optionalTarefa.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        TarefaEntity tarefa = optionalTarefa.get();
        TarefaEntity tarefaAtualizada = service.atualizar(tarefa, dto);

        return ResponseEntity.ok(mapper.toDTO(tarefaAtualizada));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyRole('DIRETOR', 'PROFESSOR')")
    @Operation(
            summary = "Deletar uma tarefa",
            description = "Apenas usuários com a role de DIRETOR ou PROFESSOR podem fazer isso"
    )
    public ResponseEntity<Void> deletarTarefa(@PathVariable String id) {
        Optional<TarefaEntity> optionalTarefa = service.obterPorId(UUID.fromString(id));

        if(optionalTarefa.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        service.deletar(optionalTarefa.get());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("{id}")
    @PreAuthorize("hasAnyRole('DIRETOR', 'PROFESSOR', 'ALUNO')")
    @Operation(
            summary = "Obter uma tarefa por ID",
            description = "Usuários com a role de DIRETOR, PROFESSOR ou ALUNO podem fazer isso"
    )
    public ResponseEntity<TarefaResponseDTO> obterTarefaPorId(@PathVariable String id) {
        Optional<TarefaEntity> optionalTarefa = service.obterPorId(UUID.fromString(id));

        if(optionalTarefa.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(mapper.toDTO(optionalTarefa.get()));
    }

    @GetMapping("/turma/{turmaId}")
    @PreAuthorize("hasAnyRole('DIRETOR', 'PROFESSOR', 'ALUNO')")
    @Operation(
            summary = "Listar tarefas por turma",
            description = "Usuários com a role de DIRETOR, PROFESSOR ou ALUNO podem fazer isso"
    )
    public ResponseEntity<List<TarefaResponseDTO>> obterTarefasPorTurma(@PathVariable String turmaId) {
        List<TarefaEntity> tarefas = service.listarTarefasPorTurma(UUID.fromString(turmaId));

        return ResponseEntity.ok(tarefas.stream().map(mapper::toDTO).toList());
    }

    @GetMapping("/professor/{professorId}")
    @PreAuthorize("hasAnyRole('DIRETOR', 'PROFESSOR', 'ALUNO')")
    @Operation(
            summary = "Listar tarefas por professor",
            description = "Usuários com a role de DIRETOR, PROFESSOR ou ALUNO podem fazer isso"
    )
    public ResponseEntity<List<TarefaResponseDTO>> obterTarefasPorProfessor(@PathVariable String professorId) {
        List<TarefaEntity> tarefas = service.listarTarefasPorProfessor(UUID.fromString(professorId));

        return ResponseEntity.ok(tarefas.stream().map(mapper::toDTO).toList());
    }
}
