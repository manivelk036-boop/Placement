package com.careerpilot.repository;

import com.careerpilot.entity.Quiz;
import com.careerpilot.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    Optional<Quiz> findByTopic(Topic topic);
}
