package io.fermedley.com.Educap.entity;

import io.fermedley.com.Educap.security.entity.UsuarioEntity;
import io.hypersistence.utils.hibernate.type.array.ListArrayType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import org.hibernate.annotations.Type;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "professores")
@Data
@ToString(exclude = {"tarefas"})
public class ProfessorEntity {

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "nome", length = 80, nullable = false)
    private String nome;

    @Column
    private String materia;

    @OneToOne
    @JoinColumn(name = "id_usuario")
    private UsuarioEntity usuario;

    @OneToMany(mappedBy = "professor", fetch = FetchType.LAZY)
    private List<TarefaEntity> tarefas;

    @OneToMany(mappedBy = "professor", fetch = FetchType.LAZY)
    private List<AulaEntity> aulas;

    @ManyToMany
    @JoinTable(name = "professor_turma", joinColumns = @JoinColumn(name = "id_professor"), inverseJoinColumns = @JoinColumn(name = "id_turma"))
    private List<TurmaEntity> turmas;

    @OneToOne
    private AulaTemplateEntity aulaTemplate;
}
