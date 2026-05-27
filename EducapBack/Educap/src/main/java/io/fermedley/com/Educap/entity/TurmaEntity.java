package io.fermedley.com.Educap.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "turmas")
@Data
public class TurmaEntity {

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "nome_turma", length = 80, nullable = false, unique = true)
    private String nomeTurma;

    @OneToMany(mappedBy = "turma", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<TarefaEntity> tarefas;

    @ManyToMany(mappedBy = "turmas", fetch = FetchType.LAZY)
    private List<ProfessorEntity> professores;

    @OneToMany(mappedBy = "turma", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<AlunoEntity> alunos;

    @OneToMany(mappedBy = "turma", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<AulaEntity> aulas;

    @ManyToMany(mappedBy = "turmas", fetch = FetchType.LAZY)
    private List<AulaTemplateEntity> aulasTemplate;
}
