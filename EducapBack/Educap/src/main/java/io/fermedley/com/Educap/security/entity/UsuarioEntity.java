package io.fermedley.com.Educap.security.entity;

import io.fermedley.com.Educap.entity.AlunoEntity;
import io.fermedley.com.Educap.entity.DiretorEntity;
import io.fermedley.com.Educap.entity.ProfessorEntity;
import io.hypersistence.utils.hibernate.type.array.ListArrayType;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Type;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "usuarios")
@Data
public class UsuarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, length = 300)
    private String senha;

    @Column
    private String role;

    @Column
    private boolean isVerified;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL)
    private AlunoEntity aluno;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL)
    private ProfessorEntity professor;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL)
    private DiretorEntity diretor;
}
