package com.careerpilot.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "placement_scores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlacementScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    private int overallScore;
    private int technicalSkills;
    private int communication;
    private int problemSolving;
    private int interviewReadiness;

    @Builder.Default
    private LocalDateTime calculatedAt = LocalDateTime.now();
}
