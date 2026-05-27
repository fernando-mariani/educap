package io.fermedley.com.Educap.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Educap",
                version = "v1",
                contact = @Contact(
                        name = "Fernando Mariani",
                        email = "fernando13112007@gmail.com"
                )
        )
)
public class OpenApiConfiguration {
}
