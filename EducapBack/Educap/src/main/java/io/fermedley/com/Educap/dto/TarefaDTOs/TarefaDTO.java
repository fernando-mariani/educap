package io.fermedley.com.Educap.dto.TarefaDTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record TarefaDTO(
        @NotBlank(message = "Campo Obrigatório!")
        String nomeTarefa,
        @NotBlank(message = "Campo Obrigatório!")
        String descricaoTarefa,
        @NotNull(message = "Campo Obrigatório!")
        Double notaTarefa,
        @NotNull(message = "Campo Obrigatório!")
        LocalDate dataLimite,
        @NotNull(message = "Campo Obrigatório!")
        UUID idProfessor,
        @NotNull(message = "Campo Obrigatório!")
        UUID idTurma,
        @NotNull(message = "Campo Obrigatório!")
        UUID idTipoTarefa
) {


}
