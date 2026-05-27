package io.fermedley.com.Educap.mappers;

import io.fermedley.com.Educap.dto.AulaDTOs.AulaDTO;
import io.fermedley.com.Educap.dto.AulaDTOs.AulaResponseDTO;
import io.fermedley.com.Educap.entity.AulaEntity;
import io.fermedley.com.Educap.repository.ProfessorRepository;
import io.fermedley.com.Educap.repository.TurmaRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", uses = {ProfessorMapper.class, TurmaMapper.class})
public abstract class AulaMapper {
    @Autowired
    TurmaRepository turmaRepository;

    @Autowired
    ProfessorRepository professorRepository;

    @Mapping(target = "professor", expression = "java( professorRepository.findById(dto.idProfessor()).orElse(null) )")
    @Mapping(target = "turma", expression = "java( turmaRepository.findById(dto.idTurma()).orElse(null) )")
    public abstract AulaEntity toEntity(AulaDTO dto);

    public abstract AulaResponseDTO toDTO(AulaEntity aula);
}
