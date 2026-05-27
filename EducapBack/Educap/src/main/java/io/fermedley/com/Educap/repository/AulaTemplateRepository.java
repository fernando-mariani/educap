package io.fermedley.com.Educap.repository;

import io.fermedley.com.Educap.entity.AulaTemplateEntity;
import io.fermedley.com.Educap.entity.ProfessorEntity;
import io.fermedley.com.Educap.entity.TurmaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AulaTemplateRepository extends JpaRepository<AulaTemplateEntity, UUID> {

    List<AulaTemplateEntity> findAllByTurmas(TurmaEntity turma);

    AulaTemplateEntity findByProfessor(ProfessorEntity professor);

}
