package com.careerpilot.service;

import com.careerpilot.dto.LeaderboardEntry;
import com.careerpilot.entity.Student;
import com.careerpilot.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final StudentRepository studentRepository;

    public List<LeaderboardEntry> getLeaderboard(String metric) {
        Comparator<Student> comparator = switch (metric != null ? metric.toLowerCase() : "xp") {
            case "coins" -> Comparator.comparingInt(Student::getCoins).reversed();
            case "streak" -> Comparator.comparingInt(Student::getStreak).reversed();
            case "placement" -> Comparator.comparingInt(Student::getPlacementScore).reversed();
            default -> Comparator.comparingInt(Student::getXp).reversed();
        };

        AtomicInteger rank = new AtomicInteger(1);
        return studentRepository.findAll().stream()
                .sorted(comparator)
                .limit(50)
                .map(s -> LeaderboardEntry.builder()
                        .studentId(s.getId())
                        .name(s.getName())
                        .college(s.getCollege())
                        .xp(s.getXp())
                        .coins(s.getCoins())
                        .streak(s.getStreak())
                        .placementScore(s.getPlacementScore())
                        .rank(rank.getAndIncrement())
                        .build())
                .collect(Collectors.toList());
    }
}
