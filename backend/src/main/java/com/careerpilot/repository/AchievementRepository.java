package com.careerpilot.repository;

import com.careerpilot.entity.Achievement;
import com.careerpilot.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    List<Achievement> findByStudent(Student student);
    boolean existsByStudentAndBadgeName(Student student, String badgeName);
}
