package com.careerpilot.service;

import com.careerpilot.dto.AuthResponse;
import com.careerpilot.dto.LoginRequest;
import com.careerpilot.dto.RegisterRequest;
import com.careerpilot.dto.StudentResponse;
import com.careerpilot.entity.Student;
import com.careerpilot.repository.StudentRepository;
import com.careerpilot.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final GamificationService gamificationService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        Student student = Student.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .department(request.getDepartment())
                .college(request.getCollege())
                .year(request.getYear())
                .cgpa(request.getCgpa())
                .careerGoal(request.getCareerGoal())
                .skills(new java.util.ArrayList<>())
                .build();

        student = studentRepository.save(student);
        gamificationService.updateStreak(student);

        String token = jwtService.generateToken(student);
        return AuthResponse.builder()
                .token(token)
                .student(StudentResponse.from(student))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        Student student = studentRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        gamificationService.updateStreak(student);

        String token = jwtService.generateToken(student);
        return AuthResponse.builder()
                .token(token)
                .student(StudentResponse.from(student))
                .build();
    }
}
