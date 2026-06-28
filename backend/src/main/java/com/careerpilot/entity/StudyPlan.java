package com.careerpilot.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "study_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    @Enumerated(EnumType.STRING)
    private PlanType planType;

    @Column(columnDefinition = "TEXT")
    private String planContent;

    private int availableHoursPerDay;
}
