package com.careerpilot.controller;

import com.careerpilot.dto.*;
import com.careerpilot.entity.CareerGoal;
import com.careerpilot.entity.Student;
import com.careerpilot.service.CompanyMatchService;
import com.careerpilot.service.PlacementScoreService;
import com.careerpilot.service.RoadmapService;
import com.careerpilot.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final RoadmapService roadmapService;
    private final PlacementScoreService placementScoreService;
    private final CompanyMatchService companyMatchService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<StudentResponse>> getProfile(@AuthenticationPrincipal Student student) {
        return ResponseEntity.ok(ApiResponse.ok(StudentResponse.from(student)));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<StudentResponse>> updateProfile(
            @AuthenticationPrincipal Student student,
            @Valid @RequestBody ProfileUpdateRequest request) {
        StudentResponse updated = studentService.updateProfile(student.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(updated));
    }

    @GetMapping("/me/dashboard")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard(@AuthenticationPrincipal Student student) {
        DashboardResponse dashboard = studentService.getDashboard(student.getId());
        return ResponseEntity.ok(ApiResponse.ok(dashboard));
    }

    @RequestMapping(value = "/me/career-goal", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<ApiResponse<RoadmapResponse>> setCareerGoal(
            @AuthenticationPrincipal Student student,
            @RequestParam(required = false) String goal) {
        if (goal != null && !goal.isBlank()) {
            CareerGoal careerGoal = CareerGoal.valueOf(goal.toUpperCase());
            RoadmapResponse roadmap = roadmapService.generateRoadmap(student.getId(), careerGoal);
            return ResponseEntity.ok(ApiResponse.ok("Career goal set and roadmap generated", roadmap));
        } else if (student.getCareerGoal() != null) {
            RoadmapResponse roadmap = roadmapService.getRoadmap(student.getId());
            return ResponseEntity.ok(ApiResponse.ok(roadmap));
        } else {
            return ResponseEntity.ok(ApiResponse.ok("No career goal set", null));
        }
    }

    @GetMapping("/me/roadmap")
    public ResponseEntity<ApiResponse<RoadmapResponse>> getRoadmap(@AuthenticationPrincipal Student student) {
        RoadmapResponse roadmap = roadmapService.getRoadmap(student.getId());
        return ResponseEntity.ok(ApiResponse.ok(roadmap));
    }

    @GetMapping("/me/placement-score")
    public ResponseEntity<ApiResponse<PlacementScoreResponse>> getPlacementScore(@AuthenticationPrincipal Student student) {
        PlacementScoreResponse score = placementScoreService.getPlacementScore(student.getId());
        return ResponseEntity.ok(ApiResponse.ok(score));
    }

    @GetMapping("/me/company-matches")
    public ResponseEntity<ApiResponse<List<CompanyMatchDto>>> getCompanyMatches(@AuthenticationPrincipal Student student) {
        List<CompanyMatchDto> matches = companyMatchService.getMatches(student.getId());
        return ResponseEntity.ok(ApiResponse.ok(matches));
    }
}
