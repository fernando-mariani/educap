package io.fermedley.com.Educap.validator;

import io.fermedley.com.Educap.entity.AulaEntity;
import io.fermedley.com.Educap.exceptions.CampoInvalidoException;
import io.fermedley.com.Educap.exceptions.RegistroDuplicadoException;
import io.fermedley.com.Educap.repository.AulaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
@RequiredArgsConstructor
public class AulaValidator {

    private final AulaRepository repository;


    public void validar(AulaEntity aula) {
        if(existeAulaDuplicada(aula)) {
            throw new RegistroDuplicadoException("Uma aula já foi cadastrada nesse mesmo dia e horário");
        }

        if(horariosValidos(aula)) {
            throw new CampoInvalidoException("Horários de ínicio e fim de aula inválidos!");
        }

        if(existeAulaNoHorario(aula)) {
            throw new RegistroDuplicadoException("Já existe uma aula nesse mesmo intervalo de tempo e dia da semana");
        }
    }

    private boolean existeAulaDuplicada(AulaEntity aula) {
        return repository.findByHorarioInicioAndHorarioFimAndDiaSemanaAndTurma(aula.getHorarioInicio(), aula.getHorarioFim(), aula.getDiaSemana(), aula.getTurma())
                .map(a -> aula.getId() == null || !a.getId().equals(aula.getId())).orElse(false);
    }

    private boolean horariosValidos(AulaEntity aula) {
        return aula.getHorarioFim() < aula.getHorarioInicio();
    }

    private boolean existeAulaNoHorario(AulaEntity aula) {
        List<AulaEntity> aulasList = repository.findAllByDiaSemanaAndTurma(aula.getDiaSemana(), aula.getTurma());
        return aulasList.stream().anyMatch(a -> a.getHorarioFim() > aula.getHorarioInicio() && a.getHorarioInicio() < aula.getHorarioFim());
    }                                                       //aula que vai salvar começa antes              //aula que vai salvar começa depois
                                                                            //se as duas retornam true, tem conflito!!
}
