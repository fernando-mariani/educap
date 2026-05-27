package io.fermedley.com.Educap.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "aula_template")
@Data
public class AulaTemplateEntity {

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column
    private String cor;

    @Column
    private Integer duracao;

    @OneToOne
    @JoinColumn(name = "id_professor")
    private ProfessorEntity professor;

    @ManyToMany
    @JoinTable(name = "aula_template-turma", joinColumns = @JoinColumn(name = "id_aula_template"), inverseJoinColumns = @JoinColumn(name = "id_turma"))
    private List<TurmaEntity> turmas;
}
