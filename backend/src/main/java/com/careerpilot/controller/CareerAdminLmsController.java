package com.careerpilot.controller;

import com.careerpilot.dto.ApiResponse;
import com.careerpilot.dto.NoteRequest;
import com.careerpilot.dto.VideoRequest;
import com.careerpilot.entity.CareerNotes;
import com.careerpilot.entity.CareerVideo;
import com.careerpilot.service.CareerLmsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/lms")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class CareerAdminLmsController {

    private final CareerLmsService careerLmsService;

    // ==========================================
    // NOTES CRUD
    // ==========================================

    @PostMapping("/career-goals/{careerId}/modules/{moduleId}/lessons/{lessonId}/notes")
    public ResponseEntity<ApiResponse<CareerNotes>> createNote(
            @PathVariable Long careerId,
            @PathVariable Long moduleId,
            @PathVariable Long lessonId,
            @Valid @RequestBody NoteRequest request) {
        CareerNotes created = careerLmsService.createNote(careerId, moduleId, lessonId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(created));
    }

    @PutMapping("/career-goals/{careerId}/modules/{moduleId}/lessons/{lessonId}/notes/{noteId}")
    public ResponseEntity<ApiResponse<CareerNotes>> updateNote(
            @PathVariable Long careerId,
            @PathVariable Long moduleId,
            @PathVariable Long lessonId,
            @PathVariable Long noteId,
            @Valid @RequestBody NoteRequest request) {
        CareerNotes updated = careerLmsService.updateNote(careerId, moduleId, lessonId, noteId, request);
        return ResponseEntity.ok(ApiResponse.ok(updated));
    }

    @DeleteMapping("/career-goals/{careerId}/modules/{moduleId}/lessons/{lessonId}/notes/{noteId}")
    public ResponseEntity<ApiResponse<String>> deleteNote(
            @PathVariable Long careerId,
            @PathVariable Long moduleId,
            @PathVariable Long lessonId,
            @PathVariable Long noteId) {
        careerLmsService.deleteNote(careerId, moduleId, lessonId, noteId);
        return ResponseEntity.ok(ApiResponse.ok("Note deleted successfully"));
    }

    // ==========================================
    // VIDEOS CRUD
    // ==========================================

    @PostMapping("/career-goals/{careerId}/modules/{moduleId}/lessons/{lessonId}/videos")
    public ResponseEntity<ApiResponse<CareerVideo>> createVideo(
            @PathVariable Long careerId,
            @PathVariable Long moduleId,
            @PathVariable Long lessonId,
            @Valid @RequestBody VideoRequest request) {
        CareerVideo created = careerLmsService.createVideo(careerId, moduleId, lessonId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(created));
    }

    @PutMapping("/career-goals/{careerId}/modules/{moduleId}/lessons/{lessonId}/videos/{videoId}")
    public ResponseEntity<ApiResponse<CareerVideo>> updateVideo(
            @PathVariable Long careerId,
            @PathVariable Long moduleId,
            @PathVariable Long lessonId,
            @PathVariable Long videoId,
            @Valid @RequestBody VideoRequest request) {
        CareerVideo updated = careerLmsService.updateVideo(careerId, moduleId, lessonId, videoId, request);
        return ResponseEntity.ok(ApiResponse.ok(updated));
    }

    @DeleteMapping("/career-goals/{careerId}/modules/{moduleId}/lessons/{lessonId}/videos/{videoId}")
    public ResponseEntity<ApiResponse<String>> deleteVideo(
            @PathVariable Long careerId,
            @PathVariable Long moduleId,
            @PathVariable Long lessonId,
            @PathVariable Long videoId) {
        careerLmsService.deleteVideo(careerId, moduleId, lessonId, videoId);
        return ResponseEntity.ok(ApiResponse.ok("Video deleted successfully"));
    }
}
