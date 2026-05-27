package io.fermedley.com.Educap.mappers;

import io.fermedley.com.Educap.dto.ProfessorDTOs.ProfessorDTO;
import io.fermedley.com.Educap.dto.ProfessorDTOs.ProfessorResponseDTO;
import io.fermedley.com.Educap.entity.ProfessorEntity;
import io.fermedley.com.Educap.repository.ProfessorRepository;
import io.fermedley.com.Educap.repository.TurmaRepository;
import io.fermedley.com.Educap.security.repository.UsuarioRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", uses = TurmaMapper.class)
public abstract class ProfessorMapper {

    @Autowired
    TurmaRepository turmaRepository;
    @Autowired
    ProfessorRepository repository;
    @Autowired
    UsuarioRepository usuarioRepository;

    @Mapping(target = "turmas", expression = "java( turmaRepository.findAllById(dto.idTurmas()) )")
    public abstract ProfessorEntity toEntity(ProfessorDTO dto);

    public abstract ProfessorResponseDTO toDTO(ProfessorEntity professor);
}
