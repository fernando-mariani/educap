package io.fermedley.com.Educap.security.service;

import io.fermedley.com.Educap.dto.AlunoDTOs.AlunoDTO;
import io.fermedley.com.Educap.dto.ProfessorDTOs.ProfessorDTO;
import io.fermedley.com.Educap.entity.AlunoEntity;
import io.fermedley.com.Educap.entity.DiretorEntity;
import io.fermedley.com.Educap.entity.ProfessorEntity;
import io.fermedley.com.Educap.exceptions.CadastroUserException;
import io.fermedley.com.Educap.security.entity.UsuarioEntity;
import io.fermedley.com.Educap.security.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder encoder;

    public AlunoEntity salvarAluno(UsuarioEntity usuario, AlunoEntity aluno) {
        var senha = encoder.encode(usuario.getSenha());
        usuario.setSenha(senha);
        usuario.setVerified(false);

        if (usuario.getRole().equals("ALUNO")) {
            usuario.setAluno(aluno);
            aluno.setUsuario(usuario);

            repository.save(usuario);
            return aluno;
        }
        throw new CadastroUserException("Erro ao cadastrar usuário, verifique se os dados estao corretos e consulte a escola");
    }

    public ProfessorEntity salvarProfessor(UsuarioEntity usuario, ProfessorEntity professor) {
        var senha = usuario.getSenha();
        usuario.setSenha(encoder.encode(senha));
        usuario.setVerified(false);

        if (usuario.getRole().equals("PROFESSOR")) {
            professor.setUsuario(usuario);
            usuario.setProfessor(professor);

            repository.save(usuario);
            return professor;
        }

        throw new CadastroUserException("Erro ao cadastrar usuário, verifique se os dados estao corretos e consulte a escola");
    }



    public UsuarioEntity obterPorEmail(String email) {
        return repository.findByEmail(email);
    }

    public UsuarioEntity obterPorId(UUID id) {
        return repository.findById(id).orElse(null);
    }

    public UsuarioEntity atualizarUsuario(UsuarioEntity usuario) {
        return repository.save(usuario);
    }

    public List<UsuarioEntity> listarNaoVerificados() {

        return repository.findAllByIsVerified(false);
    }

    public DiretorEntity salvarDiretor(UsuarioEntity usuario, DiretorEntity diretor) {
        var senha = usuario.getSenha();
        usuario.setSenha(encoder.encode(senha));
        usuario.setVerified(false);

        if (usuario.getRole().equals("DIRETOR")) {
            diretor.setUsuario(usuario);
            usuario.setDiretor(diretor);

            repository.save(usuario);
            return diretor;
        }

        throw new CadastroUserException("Erro ao cadastrar usuário, verifique se os dados estao corretos e consulte a escola");
    }

    public void deletarUsuario(UsuarioEntity usuario) {
        repository.delete(usuario);
    }
}