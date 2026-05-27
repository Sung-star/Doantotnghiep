package com.example.ecommerce.resources;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.ecommerce.entities.Role;
import com.example.ecommerce.entities.User;
import com.example.ecommerce.services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("User Resource (Controller) Tests")
class UserResourceTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setName("Test User");
        testUser.setEmail("test@example.com");
        testUser.setPhone("0123456789");
    }

    @Test
    @DisplayName("Should get user by ID with 200 status")
    void testGetUserById() throws Exception {
        // Arrange
        when(userService.findById(1L)).thenReturn(testUser);

        // Act & Assert
        mockMvc.perform(get("/api/users/1")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1L))
            .andExpect(jsonPath("$.name").value("Test User"))
            .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    @DisplayName("Should return 404 when user not found")
    void testGetUserNotFound() throws Exception {
        // Arrange
        when(userService.findById(999L)).thenThrow(new RuntimeException("User not found"));

        // Act & Assert
        mockMvc.perform(get("/api/users/999")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should get all users")
    void testGetAllUsers() throws Exception {
        // Arrange
        List<User> users = new ArrayList<>();
        users.add(testUser);
        when(userService.findAll()).thenReturn(users);

        // Act & Assert
        mockMvc.perform(get("/api/users")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should create user with 201 status")
    void testCreateUser() throws Exception {
        // Arrange
        User newUser = new User();
        newUser.setName("New User");
        newUser.setEmail("newuser@example.com");

        when(userService.insert(any(User.class))).thenReturn(testUser);

        // Act & Assert
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newUser)))
            .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("Should update user with 200 status")
    void testUpdateUser() throws Exception {
        // Arrange
        User updateData = new User();
        updateData.setName("Updated User");
        updateData.setPhone("9876543210");

        when(userService.update(eq(1L), any(User.class))).thenReturn(testUser);

        // Act & Assert
        mockMvc.perform(put("/api/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateData)))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should delete user with 204 status")
    void testDeleteUser() throws Exception {
        // Arrange
        doNothing().when(userService).delete(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/users/1")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("Should validate email format")
    void testCreateUserWithInvalidEmail() throws Exception {
        // Arrange
        String invalidUser = "{\"name\": \"User\", \"email\": \"invalid-email\"}";

        // Act & Assert
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidUser))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should return correct content type for user response")
    void testResponseContentType() throws Exception {
        // Arrange
        when(userService.findById(1L)).thenReturn(testUser);

        // Act & Assert
        mockMvc.perform(get("/api/users/1"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("Should have correct response structure")
    void testUserResponseStructure() throws Exception {
        // Arrange
        when(userService.findById(1L)).thenReturn(testUser);

        // Act & Assert
        mockMvc.perform(get("/api/users/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.name").exists())
            .andExpect(jsonPath("$.email").exists())
            .andExpect(jsonPath("$.phone").exists())
            .andExpect(jsonPath("$.role").exists());
    }
}
