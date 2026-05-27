package io.fermedley.com.Educap.controller;

import io.fermedley.com.Educap.dto.AulaDTOs.templates.AulaTemplateDTO;
import io.fermedley.com.Educap.dto.AulaDTOs.templates.AulaTemplateResponse;
import io.fermedley.com.Educap.entity.AulaTemplateEntity;
import io.fermedley.com.Educap.mappers.AulaTemplateMapper;
import io.fermedley.com.Educap.service.AulaTemplateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("aulas-templates")
@RequiredArgsConstructor
@Tag(name = "Templates de Aula")
public class AulaTemplateController {

    private final AulaTemplateMapper mapper;
    private final AulaTemplateService service;

    @PostMapping
    @PreAuthorize("hasRole('DIRETOR')")
    @Operation(
            summary = "Criar um template de aula",
            description = "Apenas usuários com a role de DIRETOR podem fazer isso"
    )
    public ResponseEntity<AulaTemplateResponse> criarTemplate(@RequestBody @Valid AulaTemplateDTO dto) {
        AulaTemplateEntity aulaTemplate = mapper.toEntity(dto);
        service.salvar(aulaTemplate);

        return ResponseEntity.ok(mapper.toDTO(aulaTemplate));
    }

    @GetMapping
    @PreAuthorize("hasRole('DIRETOR')")
    @Operation(
            summary = "Listar todos os templates de aula",
            description = "Apenas usuários com a role de DIRETOR podem fazer isso"
    )
    public ResponseEntity<List<AulaTemplateResponse>> listarTemplates() {
        List<AulaTemplateEntity> aulaTemplates = service.listarTemplates();
        List<AulaTemplateResponse> aulaTemplateResponses = aulaTemplates.stream().map(mapper::toDTO).toList();

        return ResponseEntity.ok(aulaTemplateResponses);
    }

    @GetMapping("/turma/{idTurma}")
    @PreAuthorize("hasAnyRole('DIRETOR', 'PROFESSOR', 'ALUNO')")
    @Operation(
            summary = "Listar templates de aula por turma",
            description = "Usuários com a role de DIRETOR, PROFESSOR ou ALUNO podem fazer isso"
    )
    public ResponseEntity<List<AulaTemplateResponse>> listarPorTurma(@PathVariable String idTurma) {
        List<AulaTemplateEntity> aulaTemplateEntities = service.listarTemplatesPorTurma(UUID.fromString(idTurma));
        List<AulaTemplateResponse> aulaTemplateResponses = aulaTemplateEntities.stream().map(mapper::toDTO).toList();

        return ResponseEntity.ok(aulaTemplateResponses);
    }

    @GetMapping("/professor/{idProfessor}")
    @PreAuthorize("hasAnyRole('DIRETOR', 'PROFESSOR')")
    @Operation(
            summary = "Obter template de aula por professor",
            description = "Usuários com a role de DIRETOR ou PROFESSOR podem fazer isso"
    )
    public ResponseEntity<AulaTemplateResponse> obterPorProfessor(@PathVariable String idProfessor) {
        AulaTemplateEntity aulaTemplateEntity = service.obterTemplatePorProfessor(UUID.fromString(idProfessor));

        return ResponseEntity.ok(mapper.toDTO(aulaTemplateEntity));
    }
}
