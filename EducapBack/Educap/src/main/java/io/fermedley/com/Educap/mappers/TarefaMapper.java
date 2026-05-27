package io.fermedley.com.Educap.mappers;

import io.fermedley.com.Educap.dto.TarefaDTOs.TarefaDTO;
import io.fermedley.com.Educap.dto.TarefaDTOs.TarefaResponseDTO;
import io.fermedley.com.Educap.entity.TarefaEntity;
import io.fermedley.com.Educap.repository.ProfessorRepository;
import io.fermedley.com.Educap.repository.TiposTarefasRepository;
import io.fermedley.com.Educap.repository.TurmaRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", uses = {ProfessorMapper.class, TurmaMapper.class, TiposTarefasMapper.class})
public abstract class TarefaMapper {

    @Autowired
    TurmaRepository turmaRepository;

    @Autowired
    ProfessorRepository professorRepository;

    @Autowired
    TiposTarefasRepository tiposTarefasRepository;

    @Mapping(target = "professor", expression = "java( professorRepository.findById(dto.idProfessor()).orElse(null) )")
    @Mapping(target = "turma", expression = "java( turmaRepository.findById(dto.idTurma()).orElse(null) )")
    @Mapping(target = "tipoTarefa", expression = "java( tiposTarefasRepository.findById(dto.idTipoTarefa()).orElse(null) )")
    public abstract TarefaEntity toEntity(TarefaDTO dto);

    public abstract TarefaResponseDTO toDTO(TarefaEntity tarefa);
}
