package com.careerpilot.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class PlacementScoreResponse {
    private int overallScore;
    private int technicalSkills;
    private int communication;
    private int problemSolving;
    private int interviewReadiness;
    private List<String> weakAreas;
    private Map<String, Integer> careerTwinPredictions;
}
