package io.fermedley.com.Educap.mappers;

import io.fermedley.com.Educap.dto.PublicacaoDTOs.PublicacaoDTO;
import io.fermedley.com.Educap.dto.PublicacaoDTOs.PublicacaoResponse;
import io.fermedley.com.Educap.entity.PublicacaoEntity;
import io.fermedley.com.Educap.repository.DiretorRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class PublicacaoMapper {

    @Autowired
    DiretorRepository diretorRepository;

    @Mapping(target = "diretor", expression = "java( diretorRepository.findById(dto.idDiretor()).orElse(null) )")
    public abstract PublicacaoEntity toEntity(PublicacaoDTO dto);

    public abstract PublicacaoResponse toDTO(PublicacaoEntity publicacao);
}
