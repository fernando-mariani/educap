package io.fermedley.com.Educap.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Data
@Table(name = "aulas")
public class AulaEntity {

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "materia", nullable = false, length = 80)
    private String nome;

    @Column(name = "horario_inicio", nullable = false , scale = 5)
    private Integer horarioInicio;

    @Column(name = "horario_fim", nullable = false, scale = 5)
    private Integer horarioFim;

    @Column(name = "dia_semana", nullable = false, scale = 5)
    private Integer diaSemana;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_professor")
    private ProfessorEntity professor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_turma")
    private TurmaEntity turma;
}
