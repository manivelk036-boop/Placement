package com.careerpilot.service;

import com.careerpilot.dto.*;
import com.careerpilot.entity.*;
import com.careerpilot.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final RoadmapRepository roadmapRepository;
    private final TopicRepository topicRepository;
    private final TopicProgressRepository topicProgressRepository;
    private final AchievementRepository achievementRepository;
    private final PlacementScoreService placementScoreService;

    public Student getStudent(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));
    }

    public Student getStudentByEmail(String email) {
        return studentRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));
    }

    @Transactional
    public StudentResponse updateProfile(Long studentId, ProfileUpdateRequest request) {
        Student student = getStudent(studentId);
        if (request.getName() != null) student.setName(request.getName());
        if (request.getDepartment() != null) student.setDepartment(request.getDepartment());
        if (request.getCollege() != null) student.setCollege(request.getCollege());
        if (request.getYear() != null) student.setYear(request.getYear());
        if (request.getCgpa() != null) student.setCgpa(request.getCgpa());
        if (request.getSkills() != null) student.setSkills(request.getSkills());
        if (request.getCareerGoal() != null) student.setCareerGoal(request.getCareerGoal());

        student = studentRepository.save(student);
        placementScoreService.recalculate(student);
        return StudentResponse.from(student);
    }

    public DashboardResponse getDashboard(Long studentId) {
        Student student = getStudent(studentId);
        long topicsCompleted = 0;
        try {
            topicsCompleted = topicProgressRepository.countByStudentAndCompletedTrue(student);
        } catch (Exception e) {
            // Default to 0
        }

        long totalTopics = 0;
        if (student.getCareerGoal() != null) {
            try {
                totalTopics = topicRepository.findByCareerGoalOrderByMonthNumberAscOrderIndexAsc(student.getCareerGoal()).size();
            } catch (Exception e) {
                // Default to 0
            }
        }

        int roadmapProgress = 0;
        try {
            roadmapProgress = roadmapRepository.findByStudent(student)
                    .map(Roadmap::getProgressPercent)
                    .orElse(0);
        } catch (Exception e) {
            // Default to 0
        }

        List<String> upcomingTasks = new ArrayList<>();
        if (student.getCareerGoal() == null) {
            upcomingTasks.add("Select your career goal");
        } else {
            upcomingTasks.add("Complete next topic in your roadmap");
            upcomingTasks.add("Take aptitude assessment");
            upcomingTasks.add("Practice mock interview");
        }

        List<AchievementDto> achievements = new ArrayList<>();
        try {
            achievements = achievementRepository.findByStudent(student).stream()
                    .map(a -> AchievementDto.builder()
                            .badgeName(a.getBadgeName())
                            .description(a.getDescription())
                            .icon(a.getIcon())
                            .earnedAt(a.getEarnedAt())
                            .build())
                    .collect(Collectors.toList());
        } catch (Exception e) {
            // Default to empty list
        }

        return DashboardResponse.builder()
                .student(StudentResponse.from(student))
                .roadmapProgress(roadmapProgress)
                .topicsCompleted(topicsCompleted)
                .totalTopics(totalTopics)
                .upcomingTasks(upcomingTasks)
                .recentAchievements(achievements)
                .build();
    }

    public List<Topic> getTopicsForStudent(Long studentId) {
        Student student = getStudent(studentId);
        if (student.getCareerGoal() == null) {
            return List.of();
        }
        return topicRepository.findByCareerGoalOrderByMonthNumberAscOrderIndexAsc(student.getCareerGoal());
    }
}
