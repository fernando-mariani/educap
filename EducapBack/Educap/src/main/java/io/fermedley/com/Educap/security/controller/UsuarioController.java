package io.fermedley.com.Educap.security.controller;

import io.fermedley.com.Educap.dto.AlunoDTOs.AlunoDTO;
import io.fermedley.com.Educap.dto.AlunoDTOs.AlunoResponseDTO;
import io.fermedley.com.Educap.dto.DiretorDTOs.DiretorResponseDTO;
import io.fermedley.com.Educap.dto.ProfessorDTOs.ProfessorDTO;
import io.fermedley.com.Educap.dto.ProfessorDTOs.ProfessorResponseDTO;
import io.fermedley.com.Educap.entity.AlunoEntity;
import io.fermedley.com.Educap.entity.DiretorEntity;
import io.fermedley.com.Educap.entity.ProfessorEntity;
import io.fermedley.com.Educap.exceptions.NaoEncontradoException;
import io.fermedley.com.Educap.mappers.AlunoMapper;
import io.fermedley.com.Educap.mappers.DiretorMapper;
import io.fermedley.com.Educap.mappers.ProfessorMapper;
import io.fermedley.com.Educap.security.dto.*;
import io.fermedley.com.Educap.security.dto.UsuarioResponse.UserResponse;
import io.fermedley.com.Educap.security.entity.UsuarioEntity;
import io.fermedley.com.Educap.security.service.UsuarioService;
import io.fermedley.com.Educap.security.validator.SecurityValidator;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("usuarios")
@RequiredArgsConstructor
@Tag(name = "Usuários")
public class UsuarioController {

    private final UsuarioService service;
    private final UsuarioMapper mapper;
    private final AlunoMapper alunoMapper;
    private final ProfessorMapper professorMapper;
    private final DiretorMapper diretorMapper;
    private final SecurityValidator validator;

    @PostMapping("/aluno")
    @PreAuthorize("permitAll()")
    @Operation(
            summary = "Criar um usuário aluno", description = "Todos podem fazer desde que tenham a chave de aluno que o diretor libera"
    )
    public ResponseEntity<Object> salvarAluno(@RequestBody CadastroAlunoDTO cadastroAlunoDTO) {
        String key = cadastroAlunoDTO.usuario().key();
        String role = validator.validar(key);
        UsuarioEntity usuario = mapper.toEntity(cadastroAlunoDTO.usuario());
        usuario.setRole(role);
        AlunoEntity aluno = alunoMapper.toEntity(cadastroAlunoDTO.aluno());

        AlunoEntity response = service.salvarAluno(usuario, aluno);

        AlunoResponseDTO perfil = alunoMapper.toDTO(response);

        return ResponseEntity.ok(perfil);
    }

    @PostMapping("/professor")
    @PreAuthorize("permitAll()")
    @Operation(
            summary = "Criar um usuário professor", description = "Todos podem fazer desde que tenham a chave de professor que o diretor libera"
    )
    public ResponseEntity<Object> salvarProfessor(@RequestBody CadastroProfessorDTO cadastroProfessorDTO) {
        String key = cadastroProfessorDTO.usuario().key();
        String role = validator.validar(key);

        UsuarioEntity usuario = mapper.toEntity(cadastroProfessorDTO.usuario());
        usuario.setRole(role);
        ProfessorEntity professor = professorMapper.toEntity(cadastroProfessorDTO.professor());

        ProfessorEntity response = service.salvarProfessor(usuario, professor);

        ProfessorResponseDTO perfil = professorMapper.toDTO(response);

        return ResponseEntity.ok(perfil);
    }

    @PostMapping("/diretor")
    @PreAuthorize("hasAnyRole('DIRETOR', 'ADMIN')")
    @Operation(
            summary = "Criar um usuário diretor", description = "Apenas um usuário com a role de ADMIN ou de DIRETOR podem fazer isso"
    )
    public ResponseEntity<Object> salvarDiretor(@RequestBody CadastroDiretorDTO cadastroDiretorDTO) {
        String key = cadastroDiretorDTO.usuario().key();
        String role = validator.validar(key);

        UsuarioEntity usuario = mapper.toEntity(cadastroDiretorDTO.usuario());
        usuario.setRole(role);
        DiretorEntity diretor = diretorMapper.toEntity(cadastroDiretorDTO.diretor());

        DiretorEntity response = service.salvarDiretor(usuario, diretor);
        DiretorResponseDTO perfil = diretorMapper.toDTO(response);

        return ResponseEntity.ok(perfil);
    }

    @PutMapping("/verify/{id}")
    @PreAuthorize("hasAnyRole('DIRETOR', 'ADMIN')")
    @Operation(
            summary = "Verifica um usuário",
            description = "Apenas um usuário com a role de ADMIN ou de DIRETOR podem fazer isso. Verificar uma conta dá acesso ao sistema para ela"
    )
    public ResponseEntity<Void> verificarUsuario(@PathVariable String id) {
        UsuarioEntity usuario = service.obterPorId(UUID.fromString(id));
        if(usuario == null) {
            throw new NaoEncontradoException("Usuario nao encontrado");
        }
        usuario.setVerified(true);

        service.atualizarUsuario(usuario);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('DIRETOR', 'ADMIN')")
    @Operation(
            summary = "Deleta um usuário",
            description = "Apenas usuários com a role de ADMIN e de DIRETOR pode fazer isso. Atualmente sendo chamada após um usuário ter sua verificaçao negada"
    )
    public ResponseEntity<Void> deletarUsuario(@PathVariable String id) {
        UsuarioEntity usuario = service.obterPorId(UUID.fromString(id));
        if(usuario == null) {
            throw new NaoEncontradoException("Usuario nao encontrado");
        }

        service.deletarUsuario(usuario);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/not-verified")
    @PreAuthorize("hasAnyRole('DIRETOR', 'ADMIN')")
    @Operation(
            summary = "Procura usuários nao verificados",
            description = "Apenas usuários com a role de ADMIN e de DIRETOR pode fazer isso"
    )
    public ResponseEntity<List<UserResponse>> listarUsersNaoVerificados() {
        List<UsuarioEntity> usuarioEntities = service.listarNaoVerificados();
        List<UserResponse> userResponses = usuarioEntities.stream().map(mapper::toDTO).toList();

        return ResponseEntity.ok(userResponses);
    }
}
