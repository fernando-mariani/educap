package io.fermedley.com.Educap.repository;

import io.fermedley.com.Educap.entity.DiretorEntity;
import io.fermedley.com.Educap.entity.PublicacaoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PublicacaoRepository extends JpaRepository<PublicacaoEntity, UUID> {

    List<PublicacaoEntity> findAllByDiretor(DiretorEntity diretor);
}
