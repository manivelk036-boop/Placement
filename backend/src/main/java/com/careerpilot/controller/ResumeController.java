package com.careerpilot.controller;

import com.careerpilot.dto.ApiResponse;
import com.careerpilot.entity.Resume;
import com.careerpilot.entity.Student;
import com.careerpilot.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<Resume>> analyzeResume(
            @AuthenticationPrincipal Student student,
            @RequestParam("file") MultipartFile file) {
        Resume resume = resumeService.analyzeResume(student.getId(), file);
        return ResponseEntity.ok(ApiResponse.ok(resume));
    }

    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<Resume>> getLatestResume(@AuthenticationPrincipal Student student) {
        Resume resume = resumeService.getLatestResume(student.getId());
        return ResponseEntity.ok(ApiResponse.ok(resume));
    }
}
