package com.careerpilot.repository;

import com.careerpilot.entity.CareerLesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CareerLessonRepository extends JpaRepository<CareerLesson, Long> {
    List<CareerLesson> findByModuleIdOrderByLessonOrderAsc(Long moduleId);
    Optional<CareerLesson> findByIdAndModuleId(Long id, Long moduleId);
}
