package com.careerpilot.dto;

import com.careerpilot.entity.CareerGoal;
import com.careerpilot.entity.Student;
import com.careerpilot.entity.StudentLevel;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class StudentResponse {
    private Long id;
    private String name;
    private String email;
    private String department;
    private String college;
    private Integer year;
    private Double cgpa;
    private List<String> skills;
    private CareerGoal careerGoal;
    private int xp;
    private int coins;
    private int streak;
    private StudentLevel level;
    private int placementScore;
    private String role;

    public static StudentResponse from(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .name(student.getName())
                .email(student.getEmail())
                .department(student.getDepartment())
                .college(student.getCollege())
                .year(student.getYear())
                .cgpa(student.getCgpa())
                .skills(student.getSkills())
                .careerGoal(student.getCareerGoal())
                .xp(student.getXp())
                .coins(student.getCoins())
                .streak(student.getStreak())
                .level(student.getLevel())
                .placementScore(student.getPlacementScore())
                .role(student.getRole())
                .build();
    }
}
