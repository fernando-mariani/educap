package io.fermedley.com.Educap.service;

import io.fermedley.com.Educap.entity.DiretorEntity;
import io.fermedley.com.Educap.repository.DiretorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DiretorService {

    private final DiretorRepository repository;

    public DiretorEntity obterPorId(UUID id) {
        return repository.findById(id).orElse(null);
    }
}
