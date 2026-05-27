package io.fermedley.com.Educap.repository;

import io.fermedley.com.Educap.entity.TiposTarefasEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TiposTarefasRepository extends JpaRepository<TiposTarefasEntity, UUID> {

    Optional<TiposTarefasEntity> findByTipoIgnoreCase(String tipo);
}
