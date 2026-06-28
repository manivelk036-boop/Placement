package com.careerpilot.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RoadmapResponse {
    private Long id;
    private String title;
    private String careerGoal;
    private int progressPercent;
    private List<RoadmapMonthDto> months;
}
