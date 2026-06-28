package com.careerpilot.service;

import com.careerpilot.dto.PlacementScoreResponse;
import com.careerpilot.entity.CareerGoal;
import com.careerpilot.entity.MockInterview;
import com.careerpilot.entity.PlacementScore;
import com.careerpilot.entity.Student;
import com.careerpilot.entity.TopicProgress;
import com.careerpilot.repository.MockInterviewRepository;
import com.careerpilot.repository.PlacementScoreRepository;
import com.careerpilot.repository.StudentRepository;
import com.careerpilot.repository.TopicProgressRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PlacementScoreServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private PlacementScoreRepository placementScoreRepository;

    @Mock
    private TopicProgressRepository topicProgressRepository;

    @Mock
    private MockInterviewRepository mockInterviewRepository;

    @InjectMocks
    private PlacementScoreService placementScoreService;

    @Test
    void recalculateShouldComputeScoreAndWeakAreas() {
        Student student = Student.builder()
                .id(1L)
                .careerGoal(CareerGoal.JAVA_DEVELOPER)
                .cgpa(3.5)
                .skills(List.of("Java", "SQL"))
                .build();

        when(studentRepository.save(student)).thenReturn(student);
        when(placementScoreRepository.save(any(PlacementScore.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(topicProgressRepository.countByStudentAndCompletedTrue(student)).thenReturn(2L);
        when(topicProgressRepository.findByStudent(student)).thenReturn(List.of(new TopicProgress(), new TopicProgress(), new TopicProgress(), new TopicProgress()));
        when(mockInterviewRepository.findByStudentOrderByCompletedAtDesc(student))
                .thenReturn(List.of(MockInterview.builder().score(80).build()));

        PlacementScoreResponse response = placementScoreService.recalculate(student);

        assertThat(response.getOverallScore()).isEqualTo(62);
        assertThat(response.getTechnicalSkills()).isEqualTo(45);
        assertThat(response.getCommunication()).isEqualTo(50);
        assertThat(response.getProblemSolving()).isEqualTo(50);
        assertThat(response.getInterviewReadiness()).isEqualTo(80);
        assertThat(response.getWeakAreas()).containsExactly("Technical Skills", "Communication", "Problem Solving");
        assertThat(response.getCareerTwinPredictions()).containsEntry("Current Score", 62);
        assertThat(response.getCareerTwinPredictions()).containsEntry("If Spring Boot Completed", 74);
        assertThat(response.getCareerTwinPredictions()).containsEntry("If Internship Added", 81);
        assertThat(response.getCareerTwinPredictions()).containsEntry("If All Topics Completed", 87);
        assertThat(student.getPlacementScore()).isEqualTo(62);
    }

    @Test
    void getPlacementScoreShouldReturnExistingScore() {
        Student student = Student.builder()
                .id(2L)
                .careerGoal(CareerGoal.AI_ENGINEER)
                .build();

        PlacementScore score = PlacementScore.builder()
                .student(student)
                .overallScore(70)
                .technicalSkills(55)
                .communication(60)
                .problemSolving(70)
                .interviewReadiness(80)
                .build();

        when(studentRepository.findById(2L)).thenReturn(Optional.of(student));
        when(placementScoreRepository.findFirstByStudentOrderByCalculatedAtDesc(student)).thenReturn(Optional.of(score));

        PlacementScoreResponse response = placementScoreService.getPlacementScore(2L);

        assertThat(response.getOverallScore()).isEqualTo(70);
        assertThat(response.getWeakAreas()).containsExactly("Technical Skills");
    }

    @Test
    void getPlacementScoreShouldFailForMissingStudent() {
        when(studentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> placementScoreService.getPlacementScore(99L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Student not found");
    }
}