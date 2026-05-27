package io.fermedley.com.Educap.security.repository;

import io.fermedley.com.Educap.security.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UsuarioRepository extends JpaRepository<UsuarioEntity, UUID> {

    UsuarioEntity findByEmail(String email);

    List<UsuarioEntity> findAllByIsVerified(boolean isVerified);
}
