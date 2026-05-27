package io.fermedley.com.Educap.dto.TurmaDTOs;

public record TurmaResponseAULDTO(
        TurmaResponsePROFDTO professor,
        Number horarioInicio,
        Number horarioFim,
        Number diaSemana
) {
}
