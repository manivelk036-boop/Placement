package com.careerpilot.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AchievementDto {
    private String badgeName;
    private String description;
    private String icon;
    private LocalDateTime earnedAt;
}
