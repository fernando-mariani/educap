package io.fermedley.com.Educap.controller;

import io.fermedley.com.Educap.dto.AlunoDTOs.AlunoDTO;
import io.fermedley.com.Educap.dto.AlunoDTOs.AlunoResponseDTO;
import io.fermedley.com.Educap.entity.AlunoEntity;
import io.fermedley.com.Educap.mappers.AlunoMapper;
import io.fermedley.com.Educap.service.AlunoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("alunos")
@RequiredArgsConstructor
@Tag(name = "Alunos")
public class AlunoController {

    private final AlunoService service;
    private final AlunoMapper mapper;

    @PostMapping
    @PreAuthorize("hasAnyRole('DIRETOR', 'ADMIN')")
    @Operation(
            summary = "Criar um aluno",
            description = "Apenas usuários com a role de ADMIN ou de DIRETOR podem fazer isso. Ela nao é diretamente usada por usar-se o cascade.all na criacao de usuários alunos"
    )
    public ResponseEntity<AlunoResponseDTO> salvarAluno(@RequestBody @Valid AlunoDTO dto) {
        AlunoEntity aluno = service.salvar(mapper.toEntity(dto));
        return ResponseEntity.ok(mapper.toDTO(aluno));
    }

    @GetMapping("{id}")
    @Operation(
            summary = "Obter um aluno por ID",
            description = "Retorna os dados de um aluno a partir do seu ID"
    )
    public ResponseEntity<AlunoResponseDTO> obterPorId(@PathVariable String id) {
        Optional<AlunoEntity> optionalAluno = service.obterPorId(UUID.fromString(id));

        if(optionalAluno.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        AlunoEntity aluno = optionalAluno.get();

        return ResponseEntity.ok(mapper.toDTO(aluno));
    }

    @PutMapping("{id}")
    @PreAuthorize("java(hasRole('DIRETOR'))")
    @Operation(
            summary = "Atualizar um aluno",
            description = "Apenas usuários com a role de DIRETOR podem fazer isso"
    )
    public ResponseEntity<AlunoResponseDTO> atualizarAluno(@PathVariable String id, @RequestBody @Valid AlunoDTO dto) {
        Optional<AlunoEntity> optionalAluno = service.obterPorId(UUID.fromString(id));

        if(optionalAluno.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        AlunoEntity aluno = optionalAluno.get();
        aluno.setNome(dto.nome());
        aluno.setDataNascimento(dto.dataNascimento());
        aluno.setTurma(service.obterTurmaPorID(dto.idTurma()).orElse(null));

        service.atualizar(aluno);
        return ResponseEntity.ok(mapper.toDTO(aluno));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('DIRETOR')")
    @Operation(
            summary = "Deletar um aluno",
            description = "Apenas usuários com a role de DIRETOR podem fazer isso"
    )
    public ResponseEntity<Void> deletarAlunos(@PathVariable String id) {
        Optional<AlunoEntity> aluno = service.obterPorId(UUID.fromString(id));

        if(aluno.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        service.deletar(aluno.get());
        return ResponseEntity.noContent().build();
    }
}
