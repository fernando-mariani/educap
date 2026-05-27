package io.fermedley.com.Educap.RepositoryTest;

import io.fermedley.com.Educap.entity.TarefaEntity;
import io.fermedley.com.Educap.repository.TarefaRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@SpringBootTest
public class TarefaRepositoryTest {

    @Autowired
    private TarefaRepository repository;

}
