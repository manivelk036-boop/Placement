package com.careerpilot.repository;

import com.careerpilot.entity.CareerVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CareerVideoRepository extends JpaRepository<CareerVideo, Long> {
    List<CareerVideo> findByLessonIdOrderByOrderNoAsc(Long lessonId);
    Optional<CareerVideo> findByIdAndLessonId(Long id, Long lessonId);
}
