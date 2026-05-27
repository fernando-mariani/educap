package io.fermedley.com.Educap.controller;

import io.fermedley.com.Educap.dto.DiretorDTOs.DiretorResponseDTO;
import io.fermedley.com.Educap.entity.DiretorEntity;
import io.fermedley.com.Educap.exceptions.NaoEncontradoException;
import io.fermedley.com.Educap.mappers.DiretorMapper;
import io.fermedley.com.Educap.service.DiretorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("diretor")
@RequiredArgsConstructor
@Tag(name = "Diretores")
public class DiretorController {

    private final DiretorMapper mapper;
    private final DiretorService service;

    @GetMapping("/{id}")
    @Operation(
            summary = "Obter diretor por ID",
            description = "Retorna dados de um diretor pelo seu ID"
    )
    public ResponseEntity<DiretorResponseDTO> obterPorId(@PathVariable String id) {
        DiretorEntity diretor = service.obterPorId(UUID.fromString(id));
        if(diretor == null) {
            throw new NaoEncontradoException("Diretor nao encontrado");
        }

        return ResponseEntity.ok(mapper.toDTO(diretor));
    }

}
