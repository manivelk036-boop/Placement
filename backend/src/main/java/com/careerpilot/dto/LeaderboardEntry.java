package com.careerpilot.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LeaderboardEntry {
    private Long studentId;
    private String name;
    private String college;
    private int xp;
    private int coins;
    private int streak;
    private int placementScore;
    private int rank;
}
