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

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

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
