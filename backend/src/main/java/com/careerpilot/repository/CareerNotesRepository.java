package com.careerpilot.repository;

import com.careerpilot.entity.CareerNotes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CareerNotesRepository extends JpaRepository<CareerNotes, Long> {
    List<CareerNotes> findByLessonIdOrderByIdAsc(Long lessonId);
    Optional<CareerNotes> findByIdAndLessonId(Long id, Long lessonId);
}
