package com.careerpilot.repository;

import com.careerpilot.entity.CareerModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CareerModuleRepository extends JpaRepository<CareerModule, Long> {
    List<CareerModule> findByCareerGoalIdOrderByModuleOrderAsc(Long careerGoalId);
    Optional<CareerModule> findByIdAndCareerGoalId(Long id, Long careerGoalId);
}
