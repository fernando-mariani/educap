package io.fermedley.com.Educap.dto.DiretorDTOs;

import jakarta.validation.constraints.NotBlank;

public record DiretorDTO(
        @NotBlank(message = "Campo obrigatório")
        String nome
) {
}
