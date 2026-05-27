package io.fermedley.com.Educap.controller;

import io.fermedley.com.Educap.dto.PublicacaoDTOs.PublicacaoDTO;
import io.fermedley.com.Educap.dto.PublicacaoDTOs.PublicacaoResponse;
import io.fermedley.com.Educap.entity.PublicacaoEntity;
import io.fermedley.com.Educap.exceptions.NaoEncontradoException;
import io.fermedley.com.Educap.mappers.PublicacaoMapper;
import io.fermedley.com.Educap.service.PublicacaoService;
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
@RequestMapping("/publicacoes")
@RequiredArgsConstructor
@Tag(name = "Publicações")
public class PublicacaoController {

    private final PublicacaoService service;
    private final PublicacaoMapper mapper;

    @PostMapping
    @PreAuthorize("hasRole('DIRETOR')")
    @Operation(
            summary = "Criar uma publicação",
            description = "Apenas usuários com a role de DIRETOR podem fazer isso"
    )
    public ResponseEntity<PublicacaoResponse> salvarPublicacao(@RequestBody @Valid PublicacaoDTO dto) {
        PublicacaoEntity publicacao = mapper.toEntity(dto);
        if(publicacao.getDiretor() == null) {
            throw new NaoEncontradoException("Diretor nao encontrado");
        }

        service.salvar(publicacao);
        return ResponseEntity.ok(mapper.toDTO(publicacao));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('DIRETOR', 'PROFESSOR', 'ALUNO')")
    @Operation(
            summary = "Listar todas as publicações",
            description = "Usuários com a role de DIRETOR, PROFESSOR ou ALUNO podem fazer isso"
    )
    public ResponseEntity<List<PublicacaoResponse>> listarPublicacoes() {
        List<PublicacaoEntity> publicacaoEntities = service.listar();
        List<PublicacaoResponse> publicacaoResponses = publicacaoEntities.stream().map(mapper::toDTO).toList();

        return ResponseEntity.ok(publicacaoResponses);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DIRETOR')")
    @Operation(
            summary = "Deletar uma publicação",
            description = "Apenas usuários com a role de DIRETOR podem fazer isso"
    )
    public ResponseEntity<Void> deletarPublicacao(@PathVariable String id) {
        PublicacaoEntity publicacao = service.obterPorId(UUID.fromString(id));
        if(publicacao == null) {
            throw new NaoEncontradoException("Publicacao nao encontrada");
        }

        service.deletar(publicacao);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DIRETOR')")
    @Operation(
            summary = "Atualizar uma publicação",
            description = "Apenas usuários com a role de DIRETOR podem fazer isso"
    )
    public ResponseEntity<PublicacaoResponse> atualizarPublicacao(@RequestBody @Valid PublicacaoDTO dto, @PathVariable String id) {
        PublicacaoEntity publicacao = service.obterPorId(UUID.fromString(id));
        if(publicacao == null) {
            throw new NaoEncontradoException("Publicacao nao encontrada");
        }

        PublicacaoEntity publicacaoAtualizada = service.atualizar(publicacao, dto);
        return ResponseEntity.ok(mapper.toDTO(publicacaoAtualizada));
    }
}
