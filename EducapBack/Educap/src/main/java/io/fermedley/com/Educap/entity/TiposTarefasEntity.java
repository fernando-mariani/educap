package io.fermedley.com.Educap.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tipos_tarefas")
@Data
@ToString(exclude = "tarefas")
public class TiposTarefasEntity {

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "tipo", length = 70, nullable = false, unique = true)
    private String tipo;

    @Column(name = "nota_max", nullable = false)
    private Double notaMax;

    @OneToMany(mappedBy = "tipoTarefa", fetch = FetchType.LAZY)
    private List<TarefaEntity> tarefas;
}
