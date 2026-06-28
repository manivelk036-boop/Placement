package com.careerpilot.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "communication_tests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunicationTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    private String question;
    private String answer;

    private int grammarScore;
    private int vocabularyScore;
    private int clarityScore;
    private int confidenceScore;
    private int overallScore;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Builder.Default
    private LocalDateTime completedAt = LocalDateTime.now();
}
