package com.careerpilot.controller;

import com.careerpilot.dto.ApiResponse;
import com.careerpilot.dto.LeaderboardEntry;
import com.careerpilot.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping("/leaderboard")
    public ResponseEntity<ApiResponse<List<LeaderboardEntry>>> getLeaderboard(
            @RequestParam(required = false, defaultValue = "xp") String metric) {
        List<LeaderboardEntry> entries = leaderboardService.getLeaderboard(metric);
        return ResponseEntity.ok(ApiResponse.ok(entries));
    }
}
