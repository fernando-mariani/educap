package io.fermedley.com.Educap.security.repository;

import io.fermedley.com.Educap.security.entity.RolesControlEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RolesControlRepository extends JpaRepository<RolesControlEntity, UUID> {

    RolesControlEntity findByRole(String role);
}
