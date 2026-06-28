package com.careerpilot.repository;

import com.careerpilot.entity.PlacementScore;
import com.careerpilot.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlacementScoreRepository extends JpaRepository<PlacementScore, Long> {
    Optional<PlacementScore> findFirstByStudentOrderByCalculatedAtDesc(Student student);
}
