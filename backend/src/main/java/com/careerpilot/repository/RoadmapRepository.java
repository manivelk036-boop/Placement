package com.careerpilot.repository;

import com.careerpilot.entity.Roadmap;
import com.careerpilot.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoadmapRepository extends JpaRepository<Roadmap, Long> {
    Optional<Roadmap> findByStudent(Student student);
}
