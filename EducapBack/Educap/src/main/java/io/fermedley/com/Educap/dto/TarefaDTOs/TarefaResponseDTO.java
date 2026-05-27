package io.fermedley.com.Educap.dto.TarefaDTOs;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.UUID;

public record TarefaResponseDTO(
        UUID id,
        String nomeTarefa,
        String descricaoTarefa,
        Double notaTarefa,
        @JsonFormat(pattern = "dd/MM")
        LocalDate dataLimite,
        TarefaResponseTIPDTO tipoTarefa,
        TarefaResponsePRODTO professor,
        TarefaResponseTURDTO turma,
        Timestamp dataRegistro
) {
}
