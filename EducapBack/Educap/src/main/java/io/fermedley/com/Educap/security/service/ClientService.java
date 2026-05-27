package io.fermedley.com.Educap.security.service;

import io.fermedley.com.Educap.security.entity.Client;
import io.fermedley.com.Educap.security.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository repository;
    private final PasswordEncoder encoder;

    public void salvar(Client client) {
        var secret = encoder.encode(client.getClientSecret());
        client.setClientSecret(secret);

        repository.save(client);
    }

    public Client obterPorClientId(String clientId) {
        return repository.findByClientId(clientId);
    }
}
