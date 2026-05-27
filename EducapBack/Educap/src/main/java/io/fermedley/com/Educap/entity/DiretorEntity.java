package io.fermedley.com.Educap.entity;

import io.fermedley.com.Educap.security.entity.UsuarioEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Table(name = "diretor")
@ToString(exclude = "usuario")
public class DiretorEntity {

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column
    private String nome;

    @OneToOne
    @JoinColumn(name = "id_usuario")
    private UsuarioEntity usuario;

    @OneToMany(mappedBy = "diretor", fetch = FetchType.LAZY)
    private List<PublicacaoEntity> publicacoes;

}
