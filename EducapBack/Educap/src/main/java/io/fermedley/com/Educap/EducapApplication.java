package io.fermedley.com.Educap;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class EducapApplication {
    public static void main(String[] args) {
        SpringApplication.run(EducapApplication.class, args);
    }
}