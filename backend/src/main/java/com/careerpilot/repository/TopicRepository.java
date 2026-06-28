package com.careerpilot.repository;

import com.careerpilot.entity.CareerGoal;
import com.careerpilot.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findByCareerGoalOrderByMonthNumberAscOrderIndexAsc(CareerGoal careerGoal);
}
