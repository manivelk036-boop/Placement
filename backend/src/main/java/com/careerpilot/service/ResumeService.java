package com.careerpilot.service;

import com.careerpilot.entity.Resume;
import com.careerpilot.entity.Student;
import com.careerpilot.repository.ResumeRepository;
import com.careerpilot.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final StudentRepository studentRepository;

    @Transactional
    public Resume analyzeResume(Long studentId, MultipartFile file) {
        Student student = studentRepository.findById(studentId).orElseThrow();

        String fileName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf";
        List<String> skills = student.getSkills() != null ? student.getSkills() : List.of();

        int atsScore = 60 + Math.min(30, skills.size() * 5);
        int resumeScore = atsScore + (student.getCgpa() != null && student.getCgpa() >= 7 ? 10 : 0);
        resumeScore = Math.min(100, resumeScore);

        String keywords = String.join(", ", skills.isEmpty()
                ? List.of("Java", "SQL", "Problem Solving", "Teamwork")
                : skills);

        String feedback = resumeScore >= 75
                ? "Strong resume. Add quantifiable project outcomes."
                : "Improve formatting, add more keywords, and highlight projects with metrics.";

        Resume resume = Resume.builder()
                .student(student)
                .fileName(fileName)
                .fileUrl("/uploads/" + studentId + "/" + fileName)
                .atsScore(atsScore)
                .resumeScore(resumeScore)
                .keywords(keywords)
                .feedback(feedback)
                .build();

        return resumeRepository.save(resume);
    }

    public Resume getLatestResume(Long studentId) {
        Student student = studentRepository.findById(studentId).orElseThrow();
        return resumeRepository.findFirstByStudentOrderByUploadedAtDesc(student)
                .orElse(null);
    }
}
