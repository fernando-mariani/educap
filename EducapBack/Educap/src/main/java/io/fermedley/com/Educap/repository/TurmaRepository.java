package io.fermedley.com.Educap.repository;

import io.fermedley.com.Educap.entity.ProfessorEntity;
import io.fermedley.com.Educap.entity.TurmaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TurmaRepository extends JpaRepository<TurmaEntity, UUID> {

    List<TurmaEntity> findByProfessores(ProfessorEntity professor);

    Optional<TurmaEntity> findByNomeTurmaIgnoreCase(String nomeTurma);
}
