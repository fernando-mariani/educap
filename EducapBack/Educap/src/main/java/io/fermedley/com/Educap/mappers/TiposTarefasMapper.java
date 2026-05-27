package io.fermedley.com.Educap.mappers;

import io.fermedley.com.Educap.dto.TiposTarefasDTOs.TiposTarefasDTO;
import io.fermedley.com.Educap.dto.TiposTarefasDTOs.TiposTarefasResponseDTO;
import io.fermedley.com.Educap.entity.TiposTarefasEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TiposTarefasMapper {

    TiposTarefasEntity toEntity(TiposTarefasDTO dto);

    TiposTarefasResponseDTO toDTO(TiposTarefasEntity tiposTarefas);
}
