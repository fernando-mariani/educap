package io.fermedley.com.Educap.entity;

import io.fermedley.com.Educap.security.entity.UsuarioEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "alunos")
@Data
@ToString(exclude = "usuario")
public class AlunoEntity {

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "nome", length = 80, nullable = false)
    private String nome;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_turma")
    private TurmaEntity turma;

    @OneToOne
    @JoinColumn(name = "id_usuario")
    private UsuarioEntity usuario;
}
