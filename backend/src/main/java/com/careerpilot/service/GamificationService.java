package com.careerpilot.service;

//import com.careerpilot.dto.*;
import com.careerpilot.entity.Achievement;
import com.careerpilot.entity.Student;
import com.careerpilot.entity.StudentLevel;
//import com.careerpilot.entity.Topic;
import com.careerpilot.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
//import java.util.ArrayList;
//import java.util.List;

@Service
@RequiredArgsConstructor
public class GamificationService {

    public static final int XP_READ_NOTES = 5;
    public static final int XP_WATCH_VIDEO = 5;
    public static final int XP_PASS_QUIZ = 50;
    public static final int XP_ASSIGNMENT = 75;
    public static final int XP_PROJECT = 200;

    public static final int COINS_TOPIC = 20;
    public static final int COINS_QUIZ = 50;
    public static final int COINS_MOCK_INTERVIEW = 75;
    public static final int COINS_PROJECT = 200;
    public static final int COINS_7_DAY_STREAK = 100;

    private final StudentRepository studentRepository;
    private final AchievementRepository achievementRepository;

    @Transactional
    public void addXp(Student student, int xp) {
        student.setXp(student.getXp() + xp);
        student.setLevel(StudentLevel.fromXp(student.getXp()));
        studentRepository.save(student);
    }

    @Transactional
    public void addCoins(Student student, int coins) {
        student.setCoins(student.getCoins() + coins);
        studentRepository.save(student);
    }

    @Transactional
    public void updateStreak(Student student) {
        LocalDate today = LocalDate.now();
        LocalDate lastActive = student.getLastActiveDate() != null
                ? student.getLastActiveDate().toLocalDate()
                : null;

        if (lastActive == null) {
            student.setStreak(1);
        } else if (lastActive.equals(today)) {
            // same day, no change
        } else if (lastActive.equals(today.minusDays(1))) {
            student.setStreak(student.getStreak() + 1);
            if (student.getStreak() == 7) {
                addCoins(student, COINS_7_DAY_STREAK);
                awardBadge(student, "7 Day Streak", "Maintained a 7-day learning streak", "🔥");
            }
        } else {
            student.setStreak(1);
        }

        student.setLastActiveDate(today.atStartOfDay());
        studentRepository.save(student);
    }

    @Transactional
    public void awardBadge(Student student, String badgeName, String description, String icon) {
        if (achievementRepository.existsByStudentAndBadgeName(student, badgeName)) {
            return;
        }
        achievementRepository.save(Achievement.builder()
                .student(student)
                .badgeName(badgeName)
                .description(description)
                .icon(icon)
                .build());
    }

    public String getProficiencyLevel(int score) {
        if (score <= 40)
            return "Beginner";
        if (score <= 70)
            return "Intermediate";
        return "Advanced";
    }
}
