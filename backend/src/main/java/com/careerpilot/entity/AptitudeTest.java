package com.careerpilot.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "aptitude_tests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AptitudeTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    private int quantitativeScore;
    private int logicalScore;
    private int verbalScore;
    private int overallScore;

    @Column(columnDefinition = "TEXT")
    private String weakAreas;

    @Column(columnDefinition = "TEXT")
    private String suggestions;

    @Builder.Default
    private LocalDateTime completedAt = LocalDateTime.now();
}
