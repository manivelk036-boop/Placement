package com.careerpilot.service;

import com.careerpilot.entity.Achievement;
import com.careerpilot.entity.Student;
import com.careerpilot.entity.StudentLevel;
import com.careerpilot.repository.AchievementRepository;
import com.careerpilot.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GamificationServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private AchievementRepository achievementRepository;

    @InjectMocks
    private GamificationService gamificationService;

    @BeforeEach
    void setUp() {
        // Tests that need persistence behaviour stub it explicitly to avoid unused stubs.
    }

    @Test
    void addXpShouldIncreaseLevelAndPersistStudent() {
        Student student = Student.builder()
                .xp(490)
                .build();

        when(studentRepository.save(any(Student.class))).thenAnswer(invocation -> invocation.getArgument(0));

        gamificationService.addXp(student, 20);

        assertThat(student.getXp()).isEqualTo(510);
        assertThat(student.getLevel()).isEqualTo(StudentLevel.LEARNER);
        verify(studentRepository).save(student);
    }

    @Test
    void updateStreakShouldStartAtOneForNewStudent() {
        Student student = Student.builder().build();

        when(studentRepository.save(any(Student.class))).thenAnswer(invocation -> invocation.getArgument(0));

        gamificationService.updateStreak(student);

        assertThat(student.getStreak()).isEqualTo(1);
        assertThat(student.getLastActiveDate().toLocalDate()).isEqualTo(LocalDate.now());
        verify(studentRepository).save(student);
        verify(achievementRepository, never()).save(any());
    }

    @Test
    void seventhDayStreakShouldAwardBadgeAndCoins() {
        Student student = Student.builder()
                .coins(25)
                .streak(6)
                .lastActiveDate(LocalDate.now().minusDays(1).atStartOfDay())
                .build();

        when(studentRepository.save(any(Student.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(achievementRepository.existsByStudentAndBadgeName(student, "7 Day Streak")).thenReturn(false);

        gamificationService.updateStreak(student);

        assertThat(student.getStreak()).isEqualTo(7);
        assertThat(student.getCoins()).isEqualTo(125);

        ArgumentCaptor<Achievement> achievementCaptor = ArgumentCaptor.forClass(Achievement.class);
        verify(achievementRepository).save(achievementCaptor.capture());
        assertThat(achievementCaptor.getValue().getBadgeName()).isEqualTo("7 Day Streak");
        assertThat(achievementCaptor.getValue().getIcon()).isEqualTo("🔥");
    }

    @Test
    void proficiencyLevelShouldMatchExpectedRanges() {
        assertThat(gamificationService.getProficiencyLevel(40)).isEqualTo("Beginner");
        assertThat(gamificationService.getProficiencyLevel(70)).isEqualTo("Intermediate");
        assertThat(gamificationService.getProficiencyLevel(71)).isEqualTo("Advanced");
    }
}