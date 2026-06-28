package com.careerpilot.repository;

import com.careerpilot.entity.AptitudeTest;
import com.careerpilot.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AptitudeTestRepository extends JpaRepository<AptitudeTest, Long> {
    Optional<AptitudeTest> findFirstByStudentOrderByCompletedAtDesc(Student student);
}
