package io.fermedley.com.Educap.repository;

import io.fermedley.com.Educap.entity.AulaEntity;
import io.fermedley.com.Educap.entity.ProfessorEntity;
import io.fermedley.com.Educap.entity.TurmaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AulaRepository extends JpaRepository<AulaEntity, UUID> {

    Optional<AulaEntity> findByHorarioInicioAndHorarioFimAndDiaSemanaAndTurma(Integer horarioInicio, Integer horarioFim , Integer diaSemana, TurmaEntity turma);

    List<AulaEntity> findAllByDiaSemanaAndTurma(Integer diaSemana, TurmaEntity turma);

    List<AulaEntity> findAllByTurma(TurmaEntity turma);

    List<AulaEntity> findAllByProfessor(ProfessorEntity professor);
}
