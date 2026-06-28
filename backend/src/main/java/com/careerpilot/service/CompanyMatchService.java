package com.careerpilot.service;

import com.careerpilot.dto.CompanyMatchDto;
import com.careerpilot.entity.Company;
import com.careerpilot.entity.Student;
import com.careerpilot.repository.CompanyRepository;
import com.careerpilot.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyMatchService {

    private final CompanyRepository companyRepository;
    private final StudentRepository studentRepository;

    public List<CompanyMatchDto> getMatches(Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        List<String> studentSkills = student.getSkills() != null
                ? student.getSkills().stream().map(String::toLowerCase).collect(Collectors.toList())
                : new ArrayList<>();

        return companyRepository.findAll().stream()
                .map(company -> toMatch(company, student, studentSkills))
                .sorted(Comparator.comparing(CompanyMatchDto::getMatchPercent).reversed())
                .collect(Collectors.toList());
    }

    private CompanyMatchDto toMatch(Company company, Student student, List<String> studentSkills) {

        List<String> required = company.getRequiredSkills();
        List<String> missing = new ArrayList<>();

        int matched = 0;

        if (required != null && !required.isEmpty()) {
            for (String skill : required) {
                if (studentSkills.contains(skill.toLowerCase())) {
                    matched++;
                } else {
                    missing.add(skill);
                }
            }
        }

        int matchPercent = (required == null || required.isEmpty())
                ? 70
                : (int) ((matched * 100.0) / required.size());

        if (student.getCgpa() != null && company.getMinCgpa() != null) {
            if (student.getCgpa() >= company.getMinCgpa()) {
                matchPercent = Math.min(100, matchPercent + 10);
            } else {
                matchPercent = Math.max(0, matchPercent - 15);
            }
        }

        return CompanyMatchDto.builder()
                .id(company.getId())
                .name(company.getName())
                .industry(company.getIndustry())
                .matchPercent(matchPercent)
                .missingSkills(missing)
                .build();
    }
}