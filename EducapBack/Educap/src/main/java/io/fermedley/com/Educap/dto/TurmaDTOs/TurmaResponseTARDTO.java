package io.fermedley.com.Educap.dto.TurmaDTOs;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.util.UUID;

public record TurmaResponseTARDTO(
        UUID id,
        String nomeTarefa,
        Double notaTarefa,
        @JsonFormat(pattern = "dd/MM")
        LocalDate dataLimite
) {
}
