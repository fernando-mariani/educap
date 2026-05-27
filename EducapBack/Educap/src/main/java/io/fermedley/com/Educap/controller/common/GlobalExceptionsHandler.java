package io.fermedley.com.Educap.controller.common;

import io.fermedley.com.Educap.dto.ErroCampo;
import io.fermedley.com.Educap.dto.ErroResponse;
import io.fermedley.com.Educap.exceptions.*;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.security.auth.login.LoginException;
import java.nio.file.AccessDeniedException;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionsHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public ErroResponse handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        List<FieldError> fieldErrors = e.getFieldErrors();
        List<ErroCampo> listaErros = fieldErrors.stream().map(fe -> new ErroCampo(fe.getField(), fe.getDefaultMessage())).toList();

        return new ErroResponse(HttpStatus.UNPROCESSABLE_ENTITY.value(), "Validation erro", listaErros);
    }

    @ExceptionHandler(RegistroDuplicadoException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErroResponse handleRegistroDuplicadoException(RegistroDuplicadoException e) {
        return ErroResponse.conflito(e.getMessage());
    }

    @ExceptionHandler(CampoInvalidoException.class)
    @ResponseStatus(HttpStatus.EXPECTATION_FAILED)
    public ErroResponse handleCampoInvalidoException(CampoInvalidoException e) {
        return new ErroResponse(HttpStatus.EXPECTATION_FAILED.value(), e.getMessage(), List.of());
    }

    @ExceptionHandler(OperacaoNaoPermitidaException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErroResponse handleOperacaoNaoPermitidaException(OperacaoNaoPermitidaException e) {
        return new ErroResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage(), List.of());
    }

    @ExceptionHandler(CadastroUserException.class)
    @ResponseStatus(HttpStatus.EXPECTATION_FAILED)
    public ErroResponse handleCadastroUserException(CadastroUserException e) {
        return new ErroResponse(HttpStatus.EXPECTATION_FAILED.value(), e.getMessage(), List.of());
    }

    @ExceptionHandler(UsuarioValidoException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErroResponse handleUsuarioValidoException(UsuarioValidoException e) {
        return new ErroResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage(), List.of());
    }

    @ExceptionHandler(NotVerifiedUserException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErroResponse handleNotVerifiedUserException(NotVerifiedUserException e) {
        return new ErroResponse(HttpStatus.FORBIDDEN.value(), e.getMessage(), List.of());
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErroResponse handleAccessDeniedException(AccessDeniedException e) {
        return new ErroResponse(HttpStatus.FORBIDDEN.value(), "Você não tem permissão para acessar este recurso", List.of());
    }

    @ExceptionHandler(NaoEncontradoException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErroResponse handleNaoEncontradoException(NaoEncontradoException e) {
        return new ErroResponse(HttpStatus.NOT_FOUND.value(), e.getMessage(), List.of());
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErroResponse handleErrosNaoTratados(RuntimeException e) {
        return new ErroResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Ocorreu um erro inesperado, reporte o erro para o encarregado da aplicaçao", List.of());
    }
}
