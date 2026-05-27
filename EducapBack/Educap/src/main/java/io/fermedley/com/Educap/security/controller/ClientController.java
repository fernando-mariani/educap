package io.fermedley.com.Educap.security.controller;

import io.fermedley.com.Educap.security.dto.ClientDTO;
import io.fermedley.com.Educap.security.dto.ClientMapper;
import io.fermedley.com.Educap.security.entity.Client;
import io.fermedley.com.Educap.security.service.ClientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
@Tag(name = "Client")
public class ClientController {

    private final ClientService service;
    private final ClientMapper mapper;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
            summary = "Cria um novo client"
    )
    public void salvar(@RequestBody @Valid ClientDTO dto) {
        Client client = mapper.toEntity(dto);
        service.salvar(client);
    }
}
