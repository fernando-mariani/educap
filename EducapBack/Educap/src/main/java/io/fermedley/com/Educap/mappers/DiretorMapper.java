package io.fermedley.com.Educap.mappers;

import io.fermedley.com.Educap.dto.DiretorDTOs.DiretorDTO;
import io.fermedley.com.Educap.dto.DiretorDTOs.DiretorResponseDTO;
import io.fermedley.com.Educap.entity.DiretorEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DiretorMapper {

    DiretorEntity toEntity(DiretorDTO dto);

    DiretorResponseDTO toDTO(DiretorEntity diretorEntity);
}
