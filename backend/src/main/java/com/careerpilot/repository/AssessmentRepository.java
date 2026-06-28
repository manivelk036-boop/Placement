package com.careerpilot.repository;

import com.careerpilot.entity.Assessment;
import com.careerpilot.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByStudentOrderByCompletedAtDesc(Student student);
}
