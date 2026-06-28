package com.careerpilot.service;

import com.careerpilot.dto.AuthResponse;
import com.careerpilot.dto.LoginRequest;
import com.careerpilot.dto.RegisterRequest;
import com.careerpilot.entity.CareerGoal;
import com.careerpilot.entity.Student;
import com.careerpilot.repository.StudentRepository;
import com.careerpilot.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private GamificationService gamificationService;

    @InjectMocks
    private AuthService authService;

    @Test
    void registerShouldPersistStudentAndReturnAuthResponse() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Alice");
        request.setEmail("alice@example.com");
        request.setPassword("secret123");
        request.setDepartment("CSE");
        request.setCollege("CareerPilot Institute");
        request.setYear(4);
        request.setCgpa(8.6);
        request.setCareerGoal(CareerGoal.JAVA_DEVELOPER);

        when(studentRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encoded-password");
        when(studentRepository.save(any(Student.class))).thenAnswer(invocation -> {
            Student saved = invocation.getArgument(0);
            saved.setId(99L);
            return saved;
        });
        doNothing().when(gamificationService).updateStreak(any(Student.class));
        when(jwtService.generateToken(any(Student.class))).thenReturn("jwt-token");

        AuthResponse response = authService.register(request);

        assertThat(response.getToken()).isEqualTo("jwt-token");
        assertThat(response.getStudent().getId()).isEqualTo(99L);
        assertThat(response.getStudent().getName()).isEqualTo("Alice");
        assertThat(response.getStudent().getEmail()).isEqualTo("alice@example.com");
        assertThat(response.getStudent().getSkills()).isEqualTo(new ArrayList<>());

        ArgumentCaptor<Student> studentCaptor = ArgumentCaptor.forClass(Student.class);
        verify(studentRepository).save(studentCaptor.capture());
        assertThat(studentCaptor.getValue().getPassword()).isEqualTo("encoded-password");
        verify(gamificationService).updateStreak(studentCaptor.getValue());
        verify(jwtService).generateToken(studentCaptor.getValue());
    }

    @Test
    void registerShouldRejectDuplicateEmail() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("alice@example.com");

        when(studentRepository.existsByEmail(request.getEmail())).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Email already registered");

        verify(studentRepository, never()).save(any());
    }

    @Test
    void loginShouldAuthenticateAndReturnAuthResponse() {
        LoginRequest request = new LoginRequest();
        request.setEmail("alice@example.com");
        request.setPassword("secret123");

        Student student = Student.builder()
                .id(12L)
                .name("Alice")
                .email(request.getEmail())
                .password("encoded-password")
                .department("CSE")
                .college("CareerPilot Institute")
                .year(4)
                .cgpa(8.6)
                .careerGoal(CareerGoal.JAVA_DEVELOPER)
                .skills(new ArrayList<>())
                .build();

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mock(org.springframework.security.core.Authentication.class));
        when(studentRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(student));
        doNothing().when(gamificationService).updateStreak(student);
        when(jwtService.generateToken(student)).thenReturn("login-token");

        AuthResponse response = authService.login(request);

        assertThat(response.getToken()).isEqualTo("login-token");
        assertThat(response.getStudent().getEmail()).isEqualTo("alice@example.com");
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(gamificationService).updateStreak(student);
        verify(jwtService).generateToken(student);
    }
}