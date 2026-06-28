package com.careerpilot.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "topics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    private CareerGoal careerGoal;

    private int monthNumber;
    private int orderIndex;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private String videoUrl;

    @Column(columnDefinition = "TEXT")
    private String practiceQuestions;

    @Column(columnDefinition = "TEXT")
    private String assignment;

    @Column(columnDefinition = "TEXT")
    private String miniProject;
}
