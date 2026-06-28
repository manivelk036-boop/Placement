package com.careerpilot.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "roadmap_months")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoadmapMonth {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roadmap_id")
    private Roadmap roadmap;

    private int monthNumber;
    private String title;

    @ElementCollection
    @CollectionTable(name = "roadmap_month_topics", joinColumns = @JoinColumn(name = "month_id"))
    @Column(name = "topic_name")
    @Builder.Default
    private List<String> topics = new ArrayList<>();

    @Builder.Default
    private boolean completed = false;
}
