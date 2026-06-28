package com.careerpilot.controller;

import com.careerpilot.dto.ApiResponse;
import com.careerpilot.entity.InterviewType;
import com.careerpilot.entity.MockInterview;
import com.careerpilot.entity.Student;
import com.careerpilot.service.MockInterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/mock-interview")
@RequiredArgsConstructor
public class MockInterviewController {

    private final MockInterviewService mockInterviewService;

    @GetMapping("/generate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> generateInterview(
            @AuthenticationPrincipal Student student,
            @RequestParam(required = false, defaultValue = "MIXED") String type) {
        InterviewType interviewType = InterviewType.valueOf(type.toUpperCase());
        Map<String, Object> interview = mockInterviewService.generateInterview(student.getId(), interviewType);
        return ResponseEntity.ok(ApiResponse.ok(interview));
    }

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<MockInterview>> submitInterview(
            @AuthenticationPrincipal Student student,
            @RequestParam(required = false, defaultValue = "MIXED") String type,
            @RequestBody String answers) {
        InterviewType interviewType = InterviewType.valueOf(type.toUpperCase());
        MockInterview result = mockInterviewService.submitInterview(student.getId(), interviewType, answers);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }
}
