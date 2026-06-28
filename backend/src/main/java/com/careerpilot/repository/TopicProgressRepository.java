package com.careerpilot.repository;

import com.careerpilot.entity.TopicProgress;
import com.careerpilot.entity.Student;
import com.careerpilot.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TopicProgressRepository extends JpaRepository<TopicProgress, Long> {
    Optional<TopicProgress> findByStudentAndTopic(Student student, Topic topic);
    List<TopicProgress> findByStudent(Student student);
    long countByStudentAndCompletedTrue(Student student);
}
