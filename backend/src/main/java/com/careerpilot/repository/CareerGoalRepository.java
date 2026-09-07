package com.careerpilot.repository;

import com.careerpilot.entity.CareerGoalEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CareerGoalRepository extends JpaRepository<CareerGoalEntity, Long> {
    List<CareerGoalEntity> findByIsActiveTrueOrderByIdAsc();
}
