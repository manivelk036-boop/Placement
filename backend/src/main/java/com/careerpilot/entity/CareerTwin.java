package com.careerpilot.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "career_twins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerTwin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    private int currentPlacementScore;

    @Column(columnDefinition = "TEXT")
    private String predictions;
}
