package io.fermedley.com.Educap.controller;

import io.fermedley.com.Educap.dto.ProfessorDTOs.ProfessorDTO;
import io.fermedley.com.Educap.dto.ProfessorDTOs.ProfessorResponseDTO;
import io.fermedley.com.Educap.entity.AlunoEntity;
import io.fermedley.com.Educap.entity.ProfessorEntity;
import io.fermedley.com.Educap.mappers.ProfessorMapper;
import io.fermedley.com.Educap.service.ProfessorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("professores")
@RequiredArgsConstructor
public class ProfessorController {

    private final ProfessorService service;
    private final ProfessorMapper mapper;

    @PostMapping
    @PreAuthorize("hasRole('DIRETOR')")
    public ResponseEntity<Object> salvarProfessor(@RequestBody @Valid ProfessorDTO dto) {
        ProfessorEntity professor = mapper.toEntity(dto);
        service.salvar(professor);

        return ResponseEntity.ok(mapper.toDTO(professor));
    }

    @GetMapping("{id}")
    public ResponseEntity<ProfessorResponseDTO> obterPorID(@PathVariable String id) {
        return service.obterId(UUID.fromString(id)).map(professor -> {
            ProfessorResponseDTO dto = mapper.toDTO(professor);
            return ResponseEntity.ok(dto);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("{id}")
    public ResponseEntity<ProfessorResponseDTO> atualizarProfessor(@PathVariable String id, @RequestBody @Valid ProfessorDTO dto) {
        Optional<ProfessorEntity> optionalProfessor = service.obterId(UUID.fromString(id));

        if(optionalProfessor.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        ProfessorEntity professor = optionalProfessor.get();

        professor.setNome(dto.nome());
        professor.setMateria(dto.materia());
        professor.setTurmas(service.listarTurmasPorID(dto.idTurmas()));

        service.atualizar(professor);
        return ResponseEntity.ok(mapper.toDTO(professor));
    }

    @GetMapping
    public ResponseEntity<List<ProfessorResponseDTO>> listarProfessores() {
        List<ProfessorResponseDTO> professores = service.listarProfessores().stream().map(mapper::toDTO).toList();

        return ResponseEntity.ok(professores);
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('DIRETOR')")
    public ResponseEntity<Void> deletarAlunos(@PathVariable String id) {
        Optional<ProfessorEntity> professor = service.obterId(UUID.fromString(id));

        if(professor.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        service.deletar(professor.get());
        return ResponseEntity.noContent().build();
    }
}
