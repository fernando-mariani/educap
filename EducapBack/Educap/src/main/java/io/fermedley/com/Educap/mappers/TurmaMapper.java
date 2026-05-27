package io.fermedley.com.Educap.mappers;

import io.fermedley.com.Educap.dto.TurmaDTOs.TurmaCommonResponse;
import io.fermedley.com.Educap.dto.TurmaDTOs.TurmaDTO;
import io.fermedley.com.Educap.dto.TurmaDTOs.TurmaResponseDTO;
import io.fermedley.com.Educap.entity.TurmaEntity;
import io.fermedley.com.Educap.repository.TurmaRepository;
import lombok.RequiredArgsConstructor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class TurmaMapper {

    public abstract TurmaEntity toEntity(TurmaDTO dto);

    public abstract TurmaResponseDTO toDTO(TurmaEntity turma);

    @Mapping(target = "numAlunos", expression = "java( (turma.getAlunos() != null) ? turma.getAlunos().size() : 0)")
    @Mapping(target = "numProfessores", expression = "java( (turma.getProfessores() != null) ? turma.getProfessores().size() : 0)")
    public abstract TurmaCommonResponse toCommonDTO(TurmaEntity turma);
}
