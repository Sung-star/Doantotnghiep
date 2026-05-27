package com.example.ecommerce.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.ecommerce.entities.Role;
import com.example.ecommerce.entities.User;
import com.example.ecommerce.repositories.UserRepository;
import com.example.ecommerce.services.exceptions.DatabaseException;
import com.example.ecommerce.services.exceptions.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
@DisplayName("User Service Tests")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setName("Test User");
        testUser.setEmail("test@example.com");
        testUser.setPhone("0123456789");
        testUser.setRole(Role.CLIENT);
    }

    @Test
    @DisplayName("Should find user by ID successfully")
    void testFindByIdSuccess() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act
        User result = userService.findById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test User", result.getName());
        assertEquals("test@example.com", result.getEmail());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when user not found")
    void testFindByIdNotFound() {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            userService.findById(999L);
        });
    }

    @Test
    @DisplayName("Should find all users")
    void testFindAll() {
        // Arrange
        List<User> users = new ArrayList<>();
        users.add(testUser);
        when(userRepository.findAll()).thenReturn(users);

        // Act
        List<User> result = userService.findAll();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test User", result.get(0).getName());
    }

    @Test
    @DisplayName("Should insert user successfully")
    void testInsertUserSuccess() {
        // Arrange
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        User result = userService.insert(testUser);

        // Assert
        assertNotNull(result);
        assertEquals("Test User", result.getName());
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    @DisplayName("Should update user successfully")
    void testUpdateUserSuccess() {
        // Arrange
        User updateData = new User();
        updateData.setName("Updated Name");
        updateData.setPhone("9876543210");

        when(userRepository.getReferenceById(1L)).thenReturn(testUser);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        User result = userService.update(1L, updateData);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Name", result.getName());
        assertEquals("9876543210", result.getPhone());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when updating non-existent user")
    void testUpdateUserNotFound() {
        // Arrange
        User updateData = new User();
        updateData.setName("Updated Name");

        when(userRepository.getReferenceById(999L)).thenThrow(
            new jakarta.persistence.EntityNotFoundException());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            userService.update(999L, updateData);
        });
    }

    @Test
    @DisplayName("Should delete user successfully")
    void testDeleteUserSuccess() {
        // Arrange
        when(userRepository.existsById(1L)).thenReturn(true);
        doNothing().when(userRepository).deleteById(1L);

        // Act
        userService.delete(1L);

        // Assert
        verify(userRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when deleting non-existent user")
    void testDeleteUserNotFound() {
        // Arrange
        when(userRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            userService.delete(999L);
        });
    }

    @Test
    @DisplayName("Should throw DatabaseException when deleting user with foreign key constraint")
    void testDeleteUserWithConstraint() {
        // Arrange
        when(userRepository.existsById(1L)).thenReturn(true);
        doThrow(new DataIntegrityViolationException("Foreign key constraint"))
            .when(userRepository).deleteById(1L);

        // Act & Assert
        assertThrows(DatabaseException.class, () -> {
            userService.delete(1L);
        });
    }

    @Test
    @DisplayName("Should preserve password when updating user")
    void testUpdateUserPreservesPassword() {
        // Arrange
        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setPassword("hashedPassword123");
        existingUser.setName("Original Name");

        User updateData = new User();
        updateData.setName("New Name");
        updateData.setPassword(null);

        when(userRepository.getReferenceById(1L)).thenReturn(existingUser);
        when(userRepository.save(any(User.class))).thenReturn(existingUser);

        // Act
        userService.update(1L, updateData);

        // Assert
        assertEquals("hashedPassword123", existingUser.getPassword());
        verify(userRepository, times(1)).save(any());
    }
}
