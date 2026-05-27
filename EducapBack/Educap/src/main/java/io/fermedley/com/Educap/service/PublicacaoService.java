package io.fermedley.com.Educap.service;

import io.fermedley.com.Educap.dto.PublicacaoDTOs.PublicacaoDTO;
import io.fermedley.com.Educap.entity.PublicacaoEntity;
import io.fermedley.com.Educap.mappers.PublicacaoMapper;
import io.fermedley.com.Educap.repository.PublicacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PublicacaoService {

    private final PublicacaoRepository repository;
    private final PublicacaoMapper mapper;

    public void salvar(PublicacaoEntity publicacao) {
        repository.save(publicacao);
    }

    public PublicacaoEntity obterPorId(UUID id) {
        return repository.findById(id).orElse(null);
    }

    public List<PublicacaoEntity> listar() {
        return repository.findAll();
    }

    public void deletar(PublicacaoEntity publicacao) {
        repository.delete(publicacao);
    }

    public PublicacaoEntity atualizar(PublicacaoEntity publicacao, PublicacaoDTO dto) {
        PublicacaoEntity publicacaoAtualizada = mapper.toEntity(dto);

        publicacao.setTitulo(publicacaoAtualizada.getTitulo());
        publicacao.setDescricao(publicacaoAtualizada.getDescricao());
        publicacao.setDiretor(publicacaoAtualizada.getDiretor());

        return repository.save(publicacao);
    }
}
