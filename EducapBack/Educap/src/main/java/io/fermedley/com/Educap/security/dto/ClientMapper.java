package io.fermedley.com.Educap.security.dto;

import io.fermedley.com.Educap.security.entity.Client;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ClientMapper {

    Client toEntity(ClientDTO dto);
}
