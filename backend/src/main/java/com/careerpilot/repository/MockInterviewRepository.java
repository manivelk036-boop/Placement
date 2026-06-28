package com.careerpilot.repository;

import com.careerpilot.entity.MockInterview;
import com.careerpilot.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MockInterviewRepository extends JpaRepository<MockInterview, Long> {
    List<MockInterview> findByStudentOrderByCompletedAtDesc(Student student);
}
