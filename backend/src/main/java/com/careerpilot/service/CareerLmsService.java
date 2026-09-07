package com.careerpilot.service;

import com.careerpilot.dto.NoteRequest;
import com.careerpilot.dto.VideoRequest;
import com.careerpilot.entity.*;
import com.careerpilot.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CareerLmsService {

    private final CareerGoalRepository careerGoalRepository;
    private final CareerModuleRepository careerModuleRepository;
    private final CareerLessonRepository careerLessonRepository;
    private final CareerQuizRepository careerQuizRepository;
    private final CareerNotesRepository careerNotesRepository;
    private final CareerVideoRepository careerVideoRepository;

    // ==========================================
    // HIERARCHY VALIDATION
    // ==========================================

    public CareerGoalEntity validateCareerGoal(Long careerGoalId) {
        return careerGoalRepository.findById(careerGoalId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Career Goal not found with ID: " + careerGoalId));
    }

    public CareerModule validateModuleBelongsToCareerGoal(Long careerGoalId, Long moduleId) {
        validateCareerGoal(careerGoalId);
        CareerModule module = careerModuleRepository.findById(moduleId)
                .orElseThrow(() -> new IllegalArgumentException("Module not found with ID: " + moduleId));

        if (!module.getCareerGoalId().equals(careerGoalId)) {
            throw new IllegalArgumentException("Module " + moduleId + " does not belong to Career Goal " + careerGoalId);
        }
        return module;
    }

    public CareerLesson validateLessonBelongsToHierarchy(Long careerGoalId, Long moduleId, Long lessonId) {
        validateModuleBelongsToCareerGoal(careerGoalId, moduleId);
        CareerLesson lesson = careerLessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found with ID: " + lessonId));

        if (!lesson.getModuleId().equals(moduleId)) {
            throw new IllegalArgumentException("Lesson " + lessonId + " does not belong to Module " + moduleId);
        }
        return lesson;
    }

    // ==========================================
    // READ OPERATIONS
    // ==========================================

    public List<CareerGoalEntity> getAllCareerGoals() {
        return careerGoalRepository.findByIsActiveTrueOrderByIdAsc();
    }

    public CareerGoalEntity getCareerGoal(Long careerGoalId) {
        return validateCareerGoal(careerGoalId);
    }

    public List<CareerModule> getModulesForCareerGoal(Long careerGoalId) {
        validateCareerGoal(careerGoalId);
        return careerModuleRepository.findByCareerGoalIdOrderByModuleOrderAsc(careerGoalId);
    }

    public List<CareerLesson> getLessonsForModule(Long careerGoalId, Long moduleId) {
        validateModuleBelongsToCareerGoal(careerGoalId, moduleId);
        return careerLessonRepository.findByModuleIdOrderByLessonOrderAsc(moduleId);
    }

    public CareerLesson getLesson(Long careerGoalId, Long moduleId, Long lessonId) {
        return validateLessonBelongsToHierarchy(careerGoalId, moduleId, lessonId);
    }

    public List<CareerNotes> getNotesForLesson(Long careerGoalId, Long moduleId, Long lessonId) {
        validateLessonBelongsToHierarchy(careerGoalId, moduleId, lessonId);
        return careerNotesRepository.findByLessonIdOrderByIdAsc(lessonId);
    }

    public List<CareerVideo> getVideosForLesson(Long careerGoalId, Long moduleId, Long lessonId) {
        validateLessonBelongsToHierarchy(careerGoalId, moduleId, lessonId);
        return careerVideoRepository.findByLessonIdOrderByOrderNoAsc(lessonId);
    }

    public List<CareerQuiz> getQuizzesForLesson(Long careerGoalId, Long moduleId, Long lessonId) {
        validateLessonBelongsToHierarchy(careerGoalId, moduleId, lessonId);
        return careerQuizRepository.findByLessonIdOrderByIdAsc(lessonId);
    }

    // ==========================================
    // ADMIN WRITE OPERATIONS — NOTES
    // ==========================================

    @Transactional
    public CareerNotes createNote(Long careerId, Long moduleId, Long lessonId, NoteRequest request) {
        validateLessonBelongsToHierarchy(careerId, moduleId, lessonId);

        CareerNotes note = CareerNotes.builder()
                .lessonId(lessonId)
                .title(request.getTitle().trim())
                .content(request.getContent().trim())
                .build();

        return careerNotesRepository.save(note);
    }

    @Transactional
    public CareerNotes updateNote(Long careerId, Long moduleId, Long lessonId, Long noteId, NoteRequest request) {
        validateLessonBelongsToHierarchy(careerId, moduleId, lessonId);

        CareerNotes note = careerNotesRepository.findById(noteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found with ID: " + noteId));

        if (!note.getLessonId().equals(lessonId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Note " + noteId + " does not belong to Lesson " + lessonId);
        }

        note.setTitle(request.getTitle().trim());
        note.setContent(request.getContent().trim());

        return careerNotesRepository.save(note);
    }

    @Transactional
    public void deleteNote(Long careerId, Long moduleId, Long lessonId, Long noteId) {
        validateLessonBelongsToHierarchy(careerId, moduleId, lessonId);

        CareerNotes note = careerNotesRepository.findById(noteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found with ID: " + noteId));

        if (!note.getLessonId().equals(lessonId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Note " + noteId + " does not belong to Lesson " + lessonId);
        }

        careerNotesRepository.delete(note);
    }

    // ==========================================
    // ADMIN WRITE OPERATIONS — VIDEOS
    // ==========================================

    @Transactional
    public CareerVideo createVideo(Long careerId, Long moduleId, Long lessonId, VideoRequest request) {
        validateLessonBelongsToHierarchy(careerId, moduleId, lessonId);

        CareerVideo video = CareerVideo.builder()
                .lessonId(lessonId)
                .title(request.getTitle().trim())
                .youtubeUrl(request.getYoutubeUrl().trim())
                .durationMinutes(request.getDurationMinutes() != null ? request.getDurationMinutes() : 0)
                .orderNo(request.getOrderNo() != null ? request.getOrderNo() : 1)
                .build();

        return careerVideoRepository.save(video);
    }

    @Transactional
    public CareerVideo updateVideo(Long careerId, Long moduleId, Long lessonId, Long videoId, VideoRequest request) {
        validateLessonBelongsToHierarchy(careerId, moduleId, lessonId);

        CareerVideo video = careerVideoRepository.findById(videoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Video not found with ID: " + videoId));

        if (!video.getLessonId().equals(lessonId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Video " + videoId + " does not belong to Lesson " + lessonId);
        }

        video.setTitle(request.getTitle().trim());
        video.setYoutubeUrl(request.getYoutubeUrl().trim());
        if (request.getDurationMinutes() != null) {
            video.setDurationMinutes(request.getDurationMinutes());
        }
        if (request.getOrderNo() != null) {
            video.setOrderNo(request.getOrderNo());
        }

        return careerVideoRepository.save(video);
    }

    @Transactional
    public void deleteVideo(Long careerId, Long moduleId, Long lessonId, Long videoId) {
        validateLessonBelongsToHierarchy(careerId, moduleId, lessonId);

        CareerVideo video = careerVideoRepository.findById(videoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Video not found with ID: " + videoId));

        if (!video.getLessonId().equals(lessonId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Video " + videoId + " does not belong to Lesson " + lessonId);
        }

        careerVideoRepository.delete(video);
    }
}
