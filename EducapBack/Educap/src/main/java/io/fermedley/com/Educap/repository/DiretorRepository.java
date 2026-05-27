package io.fermedley.com.Educap.repository;

import io.fermedley.com.Educap.entity.DiretorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DiretorRepository extends JpaRepository<DiretorEntity, UUID> {


}
