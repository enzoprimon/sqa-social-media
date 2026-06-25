package com.demoapp.demo;

import com.demoapp.demo.dto.UserDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Testes de integração para AuthController.
 *
 * Execução: ./mvnw test (na pasta /api)
 * Banco: H2 em memória (configurado em src/test/resources/application.properties)
 *
 * Distribuição dos testes:
 *   - Teste 1 (SUCESSO)  : Cadastro com dados válidos deve retornar 200 e o e-mail do usuário.
 *   - Teste 2 (SUCESSO)  : Login com senha errada deve retornar 401.
 *   - Teste 3 (BUG ❌)   : Cadastro com e-mail "@" deveria retornar 422, mas retorna 200.
 *                          Bug em UserService.isEmailValid() — verifica apenas email.contains("@"),
 *                          o que aceita strings como "@", "a@", "@b", etc.
 */
@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // -------------------------------------------------------------------------
    // TESTE 1 — SUCESSO
    // Cadastro com credenciais válidas deve criar o usuário e retornar 200 OK.
    // -------------------------------------------------------------------------
    @Test
    void testSignup_ComDadosValidos_DeveRetornar200() throws Exception {
        UserDTO dto = new UserDTO();
        dto.setEmail("user@example.com");
        dto.setPassword("ValidPass1@");

        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("user@example.com"))
                .andExpect(jsonPath("$.id").exists());
    }

    // -------------------------------------------------------------------------
    // TESTE 2 — SUCESSO
    // Login com senha incorreta deve retornar 401 Unauthorized.
    // -------------------------------------------------------------------------
    @Test
    void testSignin_ComSenhaErrada_DeveRetornar401() throws Exception {
        // Cria o usuário primeiro
        UserDTO signupDto = new UserDTO();
        signupDto.setEmail("user2@example.com");
        signupDto.setPassword("ValidPass1@");

        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupDto)));

        // Tenta fazer login com senha errada
        UserDTO signinDto = new UserDTO();
        signinDto.setEmail("user2@example.com");
        signinDto.setPassword("WrongPass1@");

        mockMvc.perform(post("/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signinDto)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Credenciais inválidas"));
    }

    // -------------------------------------------------------------------------
    // TESTE 3 — BUG (este teste DEVE FALHAR, provando a existência do bug)
    //
    // BUG IDENTIFICADO: UserService.isEmailValid() usa apenas email.contains("@"),
    // o que é insuficiente para validar um endereço de e-mail real.
    // A string "@" (somente arroba) passa nessa verificação, sendo aceita como
    // e-mail válido e retornando 200 OK em vez de 422 Unprocessable Entity.
    //
    // Reprodução: POST /auth/signup com body { "email": "@", "password": "ValidPass1@" }
    // Esperado: 422 (e-mail inválido)
    // Obtido:   200 (usuário criado com e-mail inválido)
    // -------------------------------------------------------------------------
    @Test
    void testSignup_ComEmailSomenteArroba_DeveRetornar422() throws Exception {
        UserDTO dto = new UserDTO();
        dto.setEmail("@");           // e-mail claramente inválido
        dto.setPassword("ValidPass1@");

        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                // Este assert FALHARÁ: a API retorna 200 em vez de 422,
                // comprovando o bug em UserService.isEmailValid().
                .andExpect(status().isUnprocessableEntity());
    }
}
