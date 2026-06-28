package com.careerpilot.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "topic_progress")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopicProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id")
    private Topic topic;

    @Builder.Default
    private boolean notesRead = false;

    @Builder.Default
    private boolean videoWatched = false;

    @Builder.Default
    private boolean assignmentDone = false;

    @Builder.Default
    private boolean projectDone = false;

    @Builder.Default
    private boolean quizPassed = false;

    @Builder.Default
    private boolean completed = false;
}
