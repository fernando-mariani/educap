package io.fermedley.com.Educap.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Data
@Table(name = "tarefas")
@ToString(exclude = "professor")
@EntityListeners(AuditingEntityListener.class)
public class TarefaEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "nome_tarefa", length = 80, nullable = false)
    private String nomeTarefa;

    @Column(name = "descricao_tarefa")
    private String descricaoTarefa;

    @Column(name = "nota_tarefa", nullable = false)
    private Double notaTarefa;

    @Column(name = "data_limite", nullable = false)
    private LocalDate dataLimite;

    @CreatedDate
    @Column(name = "data_registro")
    private Timestamp dataRegistro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_professor")
    private ProfessorEntity professor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_turma")
    private TurmaEntity turma;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tarefa")
    private TiposTarefasEntity tipoTarefa;
}
