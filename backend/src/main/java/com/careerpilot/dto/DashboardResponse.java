package com.careerpilot.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DashboardResponse {
    private StudentResponse student;
    private int roadmapProgress;
    private long topicsCompleted;
    private long totalTopics;
    private List<String> upcomingTasks;
    private List<AchievementDto> recentAchievements;
}
