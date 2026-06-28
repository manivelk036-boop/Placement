package com.careerpilot.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RoadmapMonthDto {
    private int monthNumber;
    private String title;
    private List<String> topics;
    private boolean completed;
}
