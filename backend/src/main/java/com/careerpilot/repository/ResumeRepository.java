package com.careerpilot.repository;

import com.careerpilot.entity.Resume;
import com.careerpilot.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResumeRepository extends JpaRepository<Resume, Long> {
    Optional<Resume> findFirstByStudentOrderByUploadedAtDesc(Student student);
}
