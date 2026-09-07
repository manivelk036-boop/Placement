package com.careerpilot.repository;

import com.careerpilot.entity.CareerQuiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CareerQuizRepository extends JpaRepository<CareerQuiz, Long> {
    List<CareerQuiz> findByLessonIdOrderByIdAsc(Long lessonId);
}
