package io.fermedley.com.Educap.security.repository;

import io.fermedley.com.Educap.security.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ClientRepository extends JpaRepository<Client, UUID> {

    Client findByClientId(String clientId);
}
