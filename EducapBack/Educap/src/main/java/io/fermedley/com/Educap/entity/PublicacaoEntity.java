package io.fermedley.com.Educap.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "publicacoes")
@Data
@EntityListeners(AuditingEntityListener.class)
public class PublicacaoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column
    private UUID id;

    @Column(length = 80, nullable = false)
    private String titulo;

    @Column(length = 300, nullable = false)
    private String descricao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_diretor")
    private DiretorEntity diretor;

    @CreatedDate
    @Column(name = "data_registro")
    private Timestamp dataRegistro;
}
