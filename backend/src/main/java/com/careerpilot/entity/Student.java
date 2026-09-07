package com.careerpilot.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String department;
    private String college;
    @Column(name = "academic_year")
    private Integer year;
    private Double cgpa;

    @Column(name = "role")
    @Builder.Default
    private String role = "ROLE_USER";

    @Transient
    private List<String> skills;

    @Enumerated(EnumType.STRING)
    private CareerGoal careerGoal;

    @Builder.Default
    private int xp = 0;

    @Builder.Default
    private int coins = 0;

    @Builder.Default
    private int streak = 0;

    @Transient
    private LocalDateTime lastActiveDate;

    @Transient
    @Builder.Default
    private StudentLevel level = StudentLevel.CAREER_EXPLORER;

    @Builder.Default
    private int placementScore = 0;

    @Transient
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String userRole = (role != null && !role.isBlank()) ? role : "ROLE_USER";
        return List.of(new SimpleGrantedAuthority(userRole));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
