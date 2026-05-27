package io.fermedley.com.Educap.repository;

import io.fermedley.com.Educap.entity.ProfessorEntity;
import io.fermedley.com.Educap.entity.TarefaEntity;
import io.fermedley.com.Educap.entity.TiposTarefasEntity;
import io.fermedley.com.Educap.entity.TurmaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TarefaRepository extends JpaRepository<TarefaEntity, UUID> {

    Optional<TarefaEntity> findByNomeTarefaAndNotaTarefaAndDataLimiteAndProfessorAndTurmaAndTipoTarefa(
            String nomeTarefa,
            Double notaTarefa,
            LocalDate dataLimite,
            ProfessorEntity professor,
            TurmaEntity turma,
            TiposTarefasEntity tipoTarefa
    );

    List<TarefaEntity> findAllByTurma(TurmaEntity turma);

    List<TarefaEntity> findAllByProfessor(ProfessorEntity professor);
}
