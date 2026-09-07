package com.careerpilot.controller;

import com.careerpilot.dto.ApiResponse;
import com.careerpilot.entity.*;
import com.careerpilot.service.CareerLmsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/career-goals")
@RequiredArgsConstructor
public class CareerLmsController {

    private final CareerLmsService careerLmsService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CareerGoalEntity>>> getAllCareerGoals() {
        return ResponseEntity.ok(ApiResponse.ok(careerLmsService.getAllCareerGoals()));
    }

    @GetMapping("/{careerId}")
    public ResponseEntity<ApiResponse<CareerGoalEntity>> getCareerGoal(@PathVariable Long careerId) {
        return ResponseEntity.ok(ApiResponse.ok(careerLmsService.getCareerGoal(careerId)));
    }

    @GetMapping("/{careerId}/modules")
    public ResponseEntity<ApiResponse<List<CareerModule>>> getModules(@PathVariable Long careerId) {
        return ResponseEntity.ok(ApiResponse.ok(careerLmsService.getModulesForCareerGoal(careerId)));
    }

    @GetMapping("/{careerId}/modules/{moduleId}/lessons")
    public ResponseEntity<ApiResponse<List<CareerLesson>>> getLessons(
            @PathVariable Long careerId,
            @PathVariable Long moduleId) {
        return ResponseEntity.ok(ApiResponse.ok(careerLmsService.getLessonsForModule(careerId, moduleId)));
    }

    @GetMapping("/{careerId}/modules/{moduleId}/lessons/{lessonId}")
    public ResponseEntity<ApiResponse<CareerLesson>> getLesson(
            @PathVariable Long careerId,
            @PathVariable Long moduleId,
            @PathVariable Long lessonId) {
        return ResponseEntity.ok(ApiResponse.ok(careerLmsService.getLesson(careerId, moduleId, lessonId)));
    }

    @GetMapping("/{careerId}/modules/{moduleId}/lessons/{lessonId}/notes")
    public ResponseEntity<ApiResponse<List<CareerNotes>>> getNotes(
            @PathVariable Long careerId,
            @PathVariable Long moduleId,
            @PathVariable Long lessonId) {
        return ResponseEntity.ok(ApiResponse.ok(careerLmsService.getNotesForLesson(careerId, moduleId, lessonId)));
    }

    @GetMapping("/{careerId}/modules/{moduleId}/lessons/{lessonId}/videos")
    public ResponseEntity<ApiResponse<List<CareerVideo>>> getVideos(
            @PathVariable Long careerId,
            @PathVariable Long moduleId,
            @PathVariable Long lessonId) {
        return ResponseEntity.ok(ApiResponse.ok(careerLmsService.getVideosForLesson(careerId, moduleId, lessonId)));
    }

    @GetMapping("/{careerId}/modules/{moduleId}/lessons/{lessonId}/quizzes")
    public ResponseEntity<ApiResponse<List<CareerQuiz>>> getQuizzes(
            @PathVariable Long careerId,
            @PathVariable Long moduleId,
            @PathVariable Long lessonId) {
        return ResponseEntity.ok(ApiResponse.ok(careerLmsService.getQuizzesForLesson(careerId, moduleId, lessonId)));
    }
}
