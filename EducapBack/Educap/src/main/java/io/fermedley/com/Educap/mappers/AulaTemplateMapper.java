package io.fermedley.com.Educap.mappers;

import io.fermedley.com.Educap.dto.AulaDTOs.templates.AulaTemplateDTO;
import io.fermedley.com.Educap.dto.AulaDTOs.templates.AulaTemplateResponse;
import io.fermedley.com.Educap.entity.AulaTemplateEntity;
import io.fermedley.com.Educap.repository.ProfessorRepository;
import io.fermedley.com.Educap.repository.TurmaRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", uses = {ProfessorMapper.class, TurmaMapper.class })
public abstract class AulaTemplateMapper {

    @Autowired
    TurmaRepository turmaRepository;

    @Autowired
    ProfessorRepository professorRepository;

    @Mapping(target = "professor", expression = "java( professorRepository.findById(dto.idProfessor()).orElse(null) )")
    @Mapping(target = "turmas", expression = "java( turmaRepository.findAllById(dto.idTurmas()) )")
    public abstract AulaTemplateEntity toEntity(AulaTemplateDTO dto);

    public abstract AulaTemplateResponse toDTO(AulaTemplateEntity aulaTemplateEntity);
}
