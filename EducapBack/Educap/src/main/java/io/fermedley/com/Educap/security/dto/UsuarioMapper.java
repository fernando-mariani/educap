package io.fermedley.com.Educap.security.dto;

import io.fermedley.com.Educap.security.dto.UsuarioResponse.UserResponse;
import io.fermedley.com.Educap.security.entity.UsuarioEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    UsuarioEntity toEntity(UsuarioDTO dto);

    UserResponse toDTO(UsuarioEntity user);
}
