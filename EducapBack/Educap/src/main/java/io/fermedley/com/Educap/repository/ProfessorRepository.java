package io.fermedley.com.Educap.repository;

import io.fermedley.com.Educap.entity.ProfessorEntity;
import io.fermedley.com.Educap.entity.TurmaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProfessorRepository extends JpaRepository<ProfessorEntity, UUID> {

    List<ProfessorEntity> findByTurmas(TurmaEntity turma);

    Optional<ProfessorEntity> findByTurmasAndMateria(TurmaEntity turma, String materia);

    List<ProfessorEntity> findAllByMateriaIgnoreCase(String materia);
}
