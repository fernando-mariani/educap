package io.fermedley.com.Educap.mappers;

import io.fermedley.com.Educap.dto.AlunoDTOs.AlunoDTO;
import io.fermedley.com.Educap.dto.AlunoDTOs.AlunoResponseDTO;
import io.fermedley.com.Educap.entity.AlunoEntity;
import io.fermedley.com.Educap.repository.AlunoRepository;
import io.fermedley.com.Educap.repository.TurmaRepository;
import io.fermedley.com.Educap.security.repository.UsuarioRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", uses = TurmaMapper.class)
public abstract class AlunoMapper {
    @Autowired
    TurmaRepository turmaRepository;
    @Autowired
    AlunoRepository repository;
    @Autowired
    UsuarioRepository usuarioRepository;

    @Mapping(target = "turma", expression = "java( turmaRepository.findById(dto.idTurma()).orElse(null) )")
    public abstract AlunoEntity toEntity(AlunoDTO dto);

    public abstract AlunoResponseDTO toDTO(AlunoEntity aluno);
}
