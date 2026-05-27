package io.fermedley.com.Educap.repository;

import io.fermedley.com.Educap.entity.AlunoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AlunoRepository extends JpaRepository<AlunoEntity, UUID> {

}
