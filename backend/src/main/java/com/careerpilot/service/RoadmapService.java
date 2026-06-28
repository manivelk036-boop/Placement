package com.careerpilot.service;

import com.careerpilot.dto.*;
import com.careerpilot.entity.*;
import com.careerpilot.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoadmapService {

    private final RoadmapRepository roadmapRepository;
    private final StudentRepository studentRepository;
    private final TopicRepository topicRepository;

    private static final java.util.Map<CareerGoal, List<RoadmapMonth>> ROADMAP_TEMPLATES = new java.util.HashMap<>();

    static {
        ROADMAP_TEMPLATES.put(CareerGoal.JAVA_DEVELOPER, List.of(
                month(1, "Java Fundamentals", "Variables", "Data Types", "Loops"),
                month(2, "Core Java", "Arrays", "OOP"),
                month(3, "Advanced Java", "Collections", "Exception Handling"),
                month(4, "Database", "JDBC", "MySQL"),
                month(5, "Framework", "Spring Boot"),
                month(6, "Projects", "Mini Project", "Capstone Project"),
                month(7, "Interview Prep", "DSA Basics", "Mock Interviews")
        ));
        ROADMAP_TEMPLATES.put(CareerGoal.FULL_STACK_DEVELOPER, List.of(
                month(1, "Frontend Basics", "HTML", "CSS", "JavaScript"),
                month(2, "React", "Components", "State Management"),
                month(3, "Backend", "Node.js", "Express"),
                month(4, "Database", "MongoDB", "SQL"),
                month(5, "Full Stack", "REST APIs", "Authentication"),
                month(6, "Projects", "Portfolio Project"),
                month(7, "Interview Prep", "System Design Basics", "Mock Interviews")
        ));
        ROADMAP_TEMPLATES.put(CareerGoal.DATA_ANALYST, List.of(
                month(1, "Statistics", "Probability", "Descriptive Stats"),
                month(2, "Python", "Pandas", "NumPy"),
                month(3, "Visualization", "Matplotlib", "Tableau"),
                month(4, "SQL", "Queries", "Joins"),
                month(5, "Analytics", "Excel", "Power BI"),
                month(6, "Projects", "Data Analysis Project"),
                month(7, "Interview Prep", "Case Studies", "Aptitude")
        ));
    }

    private static RoadmapMonth month(int num, String title, String... topics) {
        return RoadmapMonth.builder()
                .monthNumber(num)
                .title(title)
                .topics(new ArrayList<>(List.of(topics)))
                .build();
    }

    @Transactional
    public RoadmapResponse generateRoadmap(Long studentId, CareerGoal goal) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        student.setCareerGoal(goal);
        studentRepository.save(student);

        Roadmap roadmap = roadmapRepository.findByStudent(student).orElse(null);
        if (roadmap != null) {
            roadmapRepository.delete(roadmap);
        }

        List<RoadmapMonth> template = ROADMAP_TEMPLATES.getOrDefault(goal,
                ROADMAP_TEMPLATES.get(CareerGoal.JAVA_DEVELOPER));

        roadmap = Roadmap.builder()
                .student(student)
                .careerGoal(goal)
                .title(formatGoal(goal) + " Career Path")
                .progressPercent(0)
                .build();

        for (RoadmapMonth m : template) {
            RoadmapMonth month = RoadmapMonth.builder()
                    .roadmap(roadmap)
                    .monthNumber(m.getMonthNumber())
                    .title(m.getTitle())
                    .topics(new ArrayList<>(m.getTopics()))
                    .completed(false)
                    .build();
            roadmap.getMonths().add(month);
        }

        roadmap = roadmapRepository.save(roadmap);
        seedTopicsForGoal(goal);

        return toResponse(roadmap);
    }

    public RoadmapResponse getRoadmap(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        Roadmap roadmap = roadmapRepository.findByStudent(student)
                .orElseThrow(() -> new IllegalArgumentException("Roadmap not found. Select a career goal first."));

        return toResponse(roadmap);
    }

    private void seedTopicsForGoal(CareerGoal goal) {
        if (!topicRepository.findByCareerGoalOrderByMonthNumberAscOrderIndexAsc(goal).isEmpty()) {
            return;
        }

        List<RoadmapMonth> template = ROADMAP_TEMPLATES.getOrDefault(goal,
                ROADMAP_TEMPLATES.get(CareerGoal.JAVA_DEVELOPER));

        for (RoadmapMonth m : template) {
            int order = 0;
            for (String topicName : m.getTopics()) {
                topicRepository.save(Topic.builder()
                        .title(topicName)
                        .description("Learn " + topicName + " for " + formatGoal(goal))
                        .careerGoal(goal)
                        .monthNumber(m.getMonthNumber())
                        .orderIndex(order++)
                        .notes("# " + topicName + "\n\nComprehensive notes for " + topicName + ".")
                        .videoUrl("https://www.youtube.com/results?search_query=" + topicName.replace(" ", "+"))
                        .practiceQuestions("Practice questions for " + topicName)
                        .assignment("Complete assignment on " + topicName)
                        .miniProject("Build a mini project using " + topicName)
                        .build());
            }
        }
    }

    private RoadmapResponse toResponse(Roadmap roadmap) {
        return RoadmapResponse.builder()
                .id(roadmap.getId())
                .title(roadmap.getTitle())
                .careerGoal(roadmap.getCareerGoal().name())
                .progressPercent(roadmap.getProgressPercent())
                .months(roadmap.getMonths().stream()
                        .map(m -> RoadmapMonthDto.builder()
                                .monthNumber(m.getMonthNumber())
                                .title(m.getTitle())
                                .topics(m.getTopics())
                                .completed(m.isCompleted())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }

    private String formatGoal(CareerGoal goal) {
        return goal.name().replace("_", " ");
    }
}
